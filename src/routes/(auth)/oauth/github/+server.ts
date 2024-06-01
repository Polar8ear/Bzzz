import { OAuth2RequestError } from 'arctic'
import { generateIdFromEntropySize } from 'lucia'
import { AuthProvider, github, lucia } from '$lib/server/auth'

import type { RequestEvent } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { oAuthAccounts, users } from '$db/schema'
import { and, eq } from 'drizzle-orm'
import { authLogger } from '$lib/log'

export async function GET(event: RequestEvent): Promise<Response> {
	const code = event.url.searchParams.get('code')
	const state = event.url.searchParams.get('state')
	const storedState = event.cookies.get('github_oauth_state') ?? null

	if (!code || !state || !storedState || state !== storedState) {
		authLogger.debug('Invalid state')
		return new Response(null, {
			status: 400,
		})
	}

	try {
		const tokens = await github.validateAuthorizationCode(code)
		const githubUserResponse = await fetch('https://api.github.com/user', {
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`,
			},
		})
		const githubUser: GitHubUser = await githubUserResponse.json()

		// Replace this with your own DB client.
		const existingUser = await db.query.oAuthAccounts.findFirst({
			columns: {
				userId: true,
			},
			where: and(
				eq(oAuthAccounts.providerId, AuthProvider.GitHub),
				eq(oAuthAccounts.providerUserId, githubUser.id.toString()),
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
			// Replace this with your own DB client.
			const userId = await db.transaction(async (tx) => {
				const insertedUser = await tx.insert(users).values({}).returning()

				if (insertedUser.length < 1) {
					throw new Error('Failed to insert user')
				}

				const userId = insertedUser[0]?.id

				await tx.insert(oAuthAccounts).values({
					providerId: AuthProvider.GitHub,
					providerUserId: githubUser.id.toString(),
					userId,
				})

				return userId
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

interface GitHubUser {
	id: number
	login: string
}
