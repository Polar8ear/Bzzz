import { Lucia, TimeSpan } from 'lucia'
import { dev } from '$app/environment'
import { adapter } from './db'
import { GitHub } from 'arctic'
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from '$env/static/private'

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			// set to `true` when using HTTPS
			secure: !dev,
		},
	},
	sessionExpiresIn: new TimeSpan(1, 'w'),
})

export const github = new GitHub(GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET)

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia
	}
}
