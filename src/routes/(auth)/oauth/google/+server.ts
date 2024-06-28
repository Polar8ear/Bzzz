import { OAuth2RequestError } from 'arctic'
import { generateIdFromEntropySize } from 'lucia'
import { AuthProvider, google, lucia } from '$lib/server/auth'

import type { RequestEvent } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { oAuthAccounts, users } from '$lib/server/db/schema'
import { and, eq } from 'drizzle-orm'
import { parseJWT } from 'oslo/jwt'
import { authLogger } from '$lib/log'

export async function GET(event: RequestEvent): Promise<Response> {
	const code = event.url.searchParams.get('code')
	const state = event.url.searchParams.get('state')
	const storedState = event.cookies.get('google_oauth_state') ?? null
	const storedCodeVerifier = event.cookies.get('google_code_verifier') ?? null

	if (code == null || storedState == null || storedCodeVerifier == null || state !== storedState) {
		authLogger.debug('Invalid state')
		return new Response(null, {
			status: 400,
		})
	}

	try {
		const tokens = await google.validateAuthorizationCode(code, storedCodeVerifier)
		const jwt = parseJWT(tokens.idToken)
		if (jwt === null) {
			authLogger.error('Invalid JWT from google login')
			return new Response(null, {
				status: 500,
			})
		}
		const googleUser = jwt.payload as GoogleUser

		authLogger.debug('Google user', googleUser)

		const existingUser = await db.query.oAuthAccounts.findFirst({
			columns: {
				userId: true,
			},
			where: and(
				eq(oAuthAccounts.providerId, AuthProvider.Google),
				eq(oAuthAccounts.providerUserId, googleUser.sub),
			),
		})

		if (existingUser) {
			const session = await lucia.createSession(existingUser.userId, {})
			const sessionCookie = lucia.createSessionCookie(session.id)
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes,
			})
		} else {
			const userId = generateIdFromEntropySize(10) // 16 characters long

			// Replace this with your own DB client.
			await db.transaction(async (tx) => {
				await tx.insert(users).values({
					id: userId,
				})
				await tx.insert(oAuthAccounts).values({
					userId,
					providerId: AuthProvider.Google,
					providerUserId: googleUser.sub.toString(),
				})
			})

			const session = await lucia.createSession(userId, {})
			const sessionCookie = lucia.createSessionCookie(session.id)
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes,
			})
		}
		return new Response(null, {
			status: 302,
			headers: {
				Location: '/',
			},
		})
	} catch (e) {
		// the specific error message depends on the provider
		if (e instanceof OAuth2RequestError) {
			authLogger.debug('OAuth2RequestError', e)
			// invalid code
			return new Response(null, {
				status: 400,
			})
		}
		authLogger.debug('unknown error', e)
		return new Response(null, {
			status: 500,
		})
	}
}

interface GoogleUser {
	sub: string
	email: string
	email_verified: boolean
	login: string
}
