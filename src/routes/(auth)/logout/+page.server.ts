import { authLogger } from '$lib/log.js'
import { lucia } from '$lib/server/auth.js'
import { redirect, type Actions } from '@sveltejs/kit'

export const actions = {
	default: async ({ locals, cookies }) => {
		if (locals.session) {
			authLogger.debug('auth: Invalidating session')
			lucia.invalidateSession(locals.session.id)

			authLogger.debug('auth: Creating blank cookie')
			const sessionCookie = lucia.createBlankSessionCookie()
			cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes,
			})
		}
		redirect(303, '/')
	},
} satisfies Actions
