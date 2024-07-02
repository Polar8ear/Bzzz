import { Logger, errorLogger } from '$lib/log'
import {
	addAuthCookieToRequestBySession,
	addBlankAuthCookieToRequest,
	lucia,
} from '$lib/server/auth'
import type { Handle, HandleServerError } from '@sveltejs/kit'
import { dev } from '$app/environment'

const authHookLogger = new Logger('auth-hook')

export const handle: Handle = async ({ event, resolve }) => {
	authHookLogger.debug('handling request')
	const sessionId = event.cookies.get(lucia.sessionCookieName)
	if (!sessionId) {
		authHookLogger.debug('no session id, setting to null')
		event.locals.user = null
		event.locals.session = null
		return resolve(event)
	}

	const { session, user } = await lucia.validateSession(sessionId)
	if (session && session.fresh) {
		authHookLogger.debug('session is fresh and refreshing session', user)
		addAuthCookieToRequestBySession(event, session)
	}
	if (!session) {
		authHookLogger.debug('no session')
		addBlankAuthCookieToRequest(event)
	}
	authHookLogger.debug('setting user and session')
	event.locals.user = user
	event.locals.session = session
	return resolve(event)
}

export const handleError: HandleServerError = async ({ error, message, status }) => {
	const errorId = crypto.randomUUID()

	errorLogger.debug({ 'Error ID': errorId, error, status, message })

	return {
		message: 'Whoops! Something went wrong.',
		errorId,
		error: dev ? error : undefined,
	}
}
