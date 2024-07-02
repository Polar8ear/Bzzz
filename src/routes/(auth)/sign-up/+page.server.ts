import { dev } from '$app/environment'
import { addAuthCookieToRequest, github, google } from '$lib/server/auth'
import { redirect, type Actions } from '@sveltejs/kit'
import { generateCodeVerifier, generateState } from 'arctic'
import { hash } from '$lib/server/db/password'
import { db } from '$lib/server/db'
import { emailVerificationTokens, users } from '$lib/server/db/schema'
import { fail, setError, superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { sendVerificationEmail } from '$lib/server/services/email'
import { TimeSpan, createDate } from 'oslo'
import { createVerificationToken } from '$lib/server/services/emailToken'
import { errorLogger } from '$lib/log'
import { credentialSchema } from '../credentialSchema'
import { isUserEmailUnique } from '$lib/server/services/user'

export const load = async ({ locals }) => {
	const form = await superValidate(zod(credentialSchema))

	return { form, isLoggedIn: locals.user != null }
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
		const { email, password } = form.data

		if (!(await isUserEmailUnique(email))) {
			return setError(form, 'email', 'Email is already in use')
		}

		if (!form.valid) {
			return fail(404, { form })
		}

		const [newUser] = await db
			.insert(users)
			.values({
				email,
				password: await hash(password),
			})
			.returning()

		await addAuthCookieToRequest(event, newUser.id)

		const token = createVerificationToken()

		await db.insert(emailVerificationTokens).values({
			id: token,
			userId: newUser.id,
			expiresAt: createDate(new TimeSpan(1, 'h')),
		})

		const emailResponse = await sendVerificationEmail(token, email)

		if (emailResponse.error) {
			errorLogger.error('email action', emailResponse.error)
			return redirect(302, '/')
		}

		return redirect(302, '/email-verification')
	},
} satisfies Actions
