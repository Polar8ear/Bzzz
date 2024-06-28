import { dev } from '$app/environment'
import { github, google, lucia } from '$lib/server/auth'
import { redirect, type Actions } from '@sveltejs/kit'
import { generateCodeVerifier, generateState } from 'arctic'
import { z } from 'zod'
import { hash } from '$lib/server/db/password'
import { db } from '$lib/server/db'
import { emailVerificationTokens, users } from '$lib/server/db/schema'
import { fail, message, superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { sendVerificationEmail } from '$lib/server/services/email'
import { TimeSpan, createDate } from 'oslo'
import { createVerificationToken } from '$lib/server/services/token'
import { errorLogger } from '$lib/log'
import { credentialSchema } from '../credentialSchema'

export const load = async () => {
	const form = await superValidate(zod(credentialSchema))

	return { form }
}

export const actions = {
	google: async (event) => {
		const state = generateState()
		const codeVerifier = generateCodeVerifier()
		const url = await google.createAuthorizationURL(state, codeVerifier, {
			scopes: ['email'],
		})

		event.cookies.set('google_oauth_state', state, {
			path: '/',
			secure: !dev,
			httpOnly: true,
			maxAge: 60 * 10,
			sameSite: 'lax',
		})

		event.cookies.set('google_code_verifier', codeVerifier, {
			path: '/',
			secure: !dev,
			httpOnly: true,
			maxAge: 60 * 10,
			sameSite: 'lax',
		})

		redirect(302, url.toString())
	},
	github: async (event) => {
		const state = generateState()
		const url = await github.createAuthorizationURL(state, {
			scopes: ['user:email'],
		})

		event.cookies.set('github_oauth_state', state, {
			path: '/',
			secure: !dev,
			httpOnly: true,
			maxAge: 60 * 10,
			sameSite: 'lax',
		})

		redirect(302, url.toString())
	},
	email: async (event) => {
		const form = await superValidate(event.request, zod(credentialSchema))

		if (!form.valid) {
			return fail(404, { form })
		}

		const { email, password } = form.data

		try {
			const [newUser] = await db
				.insert(users)
				.values({
					email,
					password: await hash(password),
				})
				.returning()
			const session = await lucia.createSession(newUser.id, {})
			const sessionCookie = lucia.createSessionCookie(session.id)
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes,
			})

			try {
				const token = createVerificationToken()

				await db.insert(emailVerificationTokens).values({
					id: token,
					userId: newUser.id,
					expiresAt: createDate(new TimeSpan(1, 'h')),
				})
				console.log(newUser.email)
				const emailAction = await sendVerificationEmail(token, email)

				if (emailAction) {
					errorLogger.error('email action', emailAction.error)
				}
			} catch (error) {
				errorLogger.error(error)
			}
		} catch (error) {
			errorLogger.error(error)
			return message(form, 'Failed to register user.')
		}

		redirect(302, '/')
	},
} satisfies Actions
