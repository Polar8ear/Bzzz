// routes/login/github/callback/+server.ts
import { OAuth2RequestError } from 'arctic'
import { generateIdFromEntropySize } from 'lucia'
import { github, lucia } from '$lib/server/auth'

import type { RequestEvent } from '@sveltejs/kit'
import { db } from '@/lib/server/db'
import { oAuthAccounts, users } from '@/db/schema'
import { and, eq } from 'drizzle-orm'
import { log } from '@/lib/log'

export async function GET(event: RequestEvent): Promise<Response> {
	const code = event.url.searchParams.get('code')
	const state = event.url.searchParams.get('state')
	const storedState = event.cookies.get('github_oauth_state') ?? null

	if (!code || !state || !storedState || state !== storedState) {
		log.debug('Invalid state')
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
				eq(oAuthAccounts.providerId, 'github'),
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
			const userId = generateIdFromEntropySize(10) // 16 characters long

			// Replace this with your own DB client.
			await db.transaction(async (tx) => {
				await tx.insert(users).values({
					id: userId,
				})
				await tx.insert(oAuthAccounts).values({
					userId,
					providerId: 'github',
					providerUserId: githubUser.id.toString(),
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
			log.debug('OAuth2RequestError', e)
			// invalid code
			return new Response(null, {
				status: 400,
			})
		}
		log.debug('unknown error', e)
		return new Response(null, {
			status: 500,
		})
	}
}

interface GitHubUser {
	id: number
	login: string
}
