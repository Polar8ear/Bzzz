import { AuthProvider, addAuthCookieToRequest, github, lucia } from '$lib/server/auth'

import { error, redirect, type RequestEvent } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { oAuthAccounts, users } from '$lib/server/db/schema'
import { and, eq } from 'drizzle-orm'
import { authLogger } from '$lib/log'
import { z } from 'zod'
import { isUserEmailUnique } from '$lib/server/services/user'

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

export async function load(event: RequestEvent) {
	const code = event.url.searchParams.get('code')
	const state = event.url.searchParams.get('state')
	const storedState = event.cookies.get('github_oauth_state') ?? null

	if (!code || !state || !storedState || state !== storedState) {
		authLogger.debug('Invalid state')
		return error(400, 'Invalid state from GitHub login. Please try again.')
	}

	const tokens = await github.validateAuthorizationCode(code).catch(() => {
		return error(500, 'Failed to validate GitHub authorization code')
	})

	const githubUserResponse = await fetch('https://api.github.com/user', {
		headers: {
			Authorization: `Bearer ${tokens.accessToken}`,
		},
	})

	const { success, data: githubUser } = gitHubUserSchema.safeParse(await githubUserResponse.json())

	if (!success) {
		return error(500, 'Failed to parse GitHub user')
	}

	let oAuthGitHubAccount = await db.query.oAuthAccounts.findFirst({
		columns: {
			userId: true,
		},
		where: and(
			eq(oAuthAccounts.providerId, AuthProvider.Google),
			eq(oAuthAccounts.providerUserId, githubUser.id.toString()),
		),
	})

	if (oAuthGitHubAccount == null) {
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

		if (email != null && !(await isUserEmailUnique(email))) {
			authLogger.debug('here')
			return error(
				400,
				'Email is already in use. Please login with your original method. Either with email and password or through other SSOs',
			)
		}

		oAuthGitHubAccount = await db.transaction(async (tx) => {
			const [newUser] = await tx
				.insert(users)
				.values({
					email: email,
					emailVerifiedAt: email != null ? new Date() : null,
				})
				.returning()
				.catch((e) => {
					authLogger.error('Failed to insert user', e)
					return error(500, 'Failed to register user with GitHub SSO')
				})

			const [newOAuthAccount] = await tx
				.insert(oAuthAccounts)
				.values({
					userId: newUser.id,
					providerId: AuthProvider.Google,
					providerUserId: githubUser.id.toString(),
				})
				.returning()

			return newOAuthAccount
		})
	}

	await addAuthCookieToRequest(event, oAuthGitHubAccount.userId)

	return redirect(302, '/')
}
