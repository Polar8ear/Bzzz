import { authLogger } from '$lib/log.js'
import { addBlankAuthCookieToRequest, lucia } from '$lib/server/auth.js'
import { redirect, type Actions, type RequestEvent } from '@sveltejs/kit'

const signOut = async (event: RequestEvent) => {
	if (event.locals.session != null) {
		authLogger.debug('auth: Invalidating session')
		await lucia.invalidateSession(event.locals.session.id)
	}

	authLogger.debug('auth: Creating blank cookie')
	addBlankAuthCookieToRequest(event)
}

export const load = async (event) => {
	await signOut(event)

	return redirect(303, '/')
}

export const actions = {
	default: async (event) => {
		await signOut(event)

		return redirect(303, '/')
	},
} satisfies Actions
