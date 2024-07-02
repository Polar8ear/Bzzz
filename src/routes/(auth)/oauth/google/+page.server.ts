import { AuthProvider, addAuthCookieToRequest, google } from '$lib/server/auth'
import { error, redirect } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { oAuthAccounts, users } from '$lib/server/db/schema'
import { and, eq } from 'drizzle-orm'
import { parseJWT } from 'oslo/jwt'
import { authLogger } from '$lib/log'
import { z } from 'zod'
import { isUserEmailUnique } from '$lib/server/services/user.js'

const googleUserSchema = z.object({
	sub: z.string(),
	email: z.string(),
	email_verified: z.boolean(),
})

export async function load(event) {
	const code = event.url.searchParams.get('code')
	const state = event.url.searchParams.get('state')
	const storedState = event.cookies.get('google_oauth_state') ?? null
	const storedCodeVerifier = event.cookies.get('google_code_verifier') ?? null

	if (code == null || storedState == null || storedCodeVerifier == null || state !== storedState) {
		authLogger.debug('Invalid state')
		return error(400, 'Invalid state from Google login. Please try again.')
	}

	const tokens = await google.validateAuthorizationCode(code, storedCodeVerifier).catch(() => {
		return error(500, 'Failed to validate Google authorization code')
	})

	const jwt = parseJWT(tokens.idToken)
	if (jwt === null) {
		authLogger.critical('Invalid JWT from google login')
		return error(500, 'Invalid JWT from Google login')
	}

	authLogger.debug('Google JWT', jwt.payload)

	const { success, data: googleUser } = googleUserSchema.safeParse(jwt.payload)

	if (!success) {
		return error(500, 'Failed to parse Google user')
	}

	let oAuthGoogleAccount = await db.query.oAuthAccounts.findFirst({
		columns: {
			userId: true,
		},
		where: and(
			eq(oAuthAccounts.providerId, AuthProvider.Google),
			eq(oAuthAccounts.providerUserId, googleUser.sub),
		),
	})

	if (oAuthGoogleAccount == null) {
		if (!(await isUserEmailUnique(googleUser.email))) {
			authLogger.debug('here')
			return error(
				400,
				'Email is already in use. Please login with your original method. Either with email and password or through other SSOs',
			)
		}

		oAuthGoogleAccount = await db.transaction(async (tx) => {
			const [newUser] = await tx
				.insert(users)
				.values({
					email: googleUser.email,
					emailVerifiedAt: googleUser.email_verified ? new Date() : null,
				})
				.returning()
				.catch((e) => {
					authLogger.error('Failed to insert user', e)
					error(500, 'Failed to register user with Google SSO')
				})

			const [newOAuthAccount] = await tx
				.insert(oAuthAccounts)
				.values({
					userId: newUser.id,
					providerId: AuthProvider.Google,
					providerUserId: googleUser.sub.toString(),
				})
				.returning()

			return newOAuthAccount
		})
	}

	addAuthCookieToRequest(event, oAuthGoogleAccount.userId)

	return redirect(302, '/')
}
