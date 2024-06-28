import { lucia } from '$lib/server/auth'
import { redirect, type Actions } from '@sveltejs/kit'
import { verify } from '$lib/server/db/password'
import { db } from '$lib/server/db'
import { fail, message, superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { errorLogger } from '$lib/log'
import { credentialSchema } from '../credentialSchema'

export const load = async () => {
	const form = await superValidate(zod(credentialSchema))

	return { form }
}

export const actions = {
	default: async (event) => {
		const form = await superValidate(event.request, zod(credentialSchema))

		if (!form.valid) {
			return fail(404, { form })
		}

		const { email, password } = form.data

		const user = await db.query.users.findFirst({
			where: (fields, { eq }) => eq(fields.email, email),
		})

		if (user == null) {
			return message(form, 'Invalid credentials', {
				status: 404,
			})
		}

		if (user.password != null && !verify(user.password, password)) {
			return message(form, 'Invalid credentials', {
				status: 404,
			})
		}

		const oauthAccount = db.query.oAuthAccounts.findFirst({
			where: (fields, { eq }) => eq(fields.userId, user.id),
		})

		if (user.password == null && oauthAccount == null) {
			errorLogger.critical('Invalid User State', {
				userId: user.id,
			})
			return message(form, 'Internsal Server Error', {
				status: 500,
			})
		}

		const session = await lucia.createSession(user.id, {})
		const sessionCookie = lucia.createSessionCookie(session.id)
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes,
		})

		redirect(302, '/')
	},
} satisfies Actions
