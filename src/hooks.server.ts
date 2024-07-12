import { Logger, errorLogger } from '$lib/log'
import {
	addAuthCookieToRequestBySession,
	addBlankAuthCookieToRequest,
	lucia,
} from '$lib/server/auth'
import { error, type Handle, type HandleServerError } from '@sveltejs/kit'
import { dev } from '$app/environment'

const authHookLogger = new Logger('auth-hook')

const isProtectedPath = (path: string) => {
	if (path.startsWith('/admin')) {
		return true
	}
}

export const handle: Handle = async ({ event, resolve }) => {
	authHookLogger.debug('handling request')
	const sessionId = event.cookies.get(lucia.sessionCookieName)
	if (!sessionId) {
		authHookLogger.debug('no session id, setting to null')
		event.locals.user = null
		event.locals.session = null
		if (isProtectedPath(event.url.pathname)) {
			throw error(401, 'Unauthorized')
		}

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

	if (isProtectedPath(event.url.pathname)) {
		if (!user || !user.isAdmin) {
			throw error(401, 'Unauthorized')
		}
	}

	event.locals.user = user
	event.locals.session = session
	return resolve(event)
}

export const handleError: HandleServerError = async ({ error, message, status }) => {
	const errorId = crypto.randomUUID()

	errorLogger.error({ 'Error ID': errorId, error, status, message })
	const originalErrorStack = dev && error instanceof Error ? error.stack : undefined

	return {
		message: dev ? message : 'Whoops! Something went wrong.',
		errorId,
		originalErrorStack,
	}
}
