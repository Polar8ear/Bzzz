import { OAuth2RequestError } from 'arctic'
import { AuthProvider, github, lucia } from '$lib/server/auth'

import type { RequestEvent } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { oAuthAccounts, users } from '$lib/server/db/schema'
import { and, eq } from 'drizzle-orm'
import { authLogger } from '$lib/log'
import { z } from 'zod'

const gitHubUserSchema = z.object({
	id: z.number(),
	login: z.string(),
	avatar_url: z.string(),
	email: z.string().email().nullable(),
})

const gitHubEmailsSchema = z.array(
	z.object({
		email: z.string().email(),
		primary: z.boolean(),
		verified: z.boolean(),
	}),
)

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
		const githubUserJson = await githubUserResponse.json()
		const githubUser = gitHubUserSchema.parse(githubUserJson)

		const existingUser = await db.query.oAuthAccounts.findFirst({
			columns: {
				userId: true,
			},
			where: and(
				eq(oAuthAccounts.providerId, AuthProvider.GitHub),
				eq(oAuthAccounts.providerUserId, githubUser.id.toString()),
			),
		})

		let userId = existingUser?.userId

		if (userId == null) {
			let email = githubUser.email

			if (email == null) {
				authLogger.debug('GitHub user does not have an email. trying to access from another url')
				const githubEmailResponse = await fetch('https://api.github.com/user/emails', {
					headers: {
						Authorization: `Bearer ${tokens.accessToken}`,
					},
				})

				const emails = gitHubEmailsSchema.parse(await githubEmailResponse.json())
				email = emails.filter((e) => e.verified).find((e) => e.primary)?.email ?? null
			}

			userId = await db.transaction(async (tx) => {
				const insertedUser = await tx
					.insert(users)
					.values({
						email,
						emailVerifiedAt: email != null ? new Date() : null,
					})
					.returning()

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
		}

		const session = await lucia.createSession(userId, {})
		const sessionCookie = lucia.createSessionCookie(session.id)
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes,
		})

		return new Response(null, {
			status: 302,
			headers: {
				Location: '/',
			},
		})
	} catch (e) {
		if (e instanceof OAuth2RequestError) {
			authLogger.debug('OAuth2RequestError', e)
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
