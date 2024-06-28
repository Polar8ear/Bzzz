import { Lucia, TimeSpan } from 'lucia'
import { dev } from '$app/environment'
import { adapter } from './db'
import { GitHub, Google } from 'arctic'
import {
	GITHUB_CLIENT_ID,
	GITHUB_CLIENT_SECRET,
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
} from '$env/static/private'
import { PUBLIC_BASE_URL } from '$env/static/public'
import type { DatabaseUserAttributes } from './db/schema'

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			// set to `true` when using HTTPS
			secure: !dev,
		},
	},
	getUserAttributes(attributes) {
		return {
			email: attributes.email,
		}
	},
	sessionExpiresIn: new TimeSpan(1, 'w'),
})

export const github = new GitHub(GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET)
export const google = new Google(
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	`${PUBLIC_BASE_URL}/oauth/google`,
)

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia
		DatabaseUserAttributes: DatabaseUserAttributes
	}
}

export enum AuthProvider {
	Google = 'google',
	GitHub = 'github',
}
