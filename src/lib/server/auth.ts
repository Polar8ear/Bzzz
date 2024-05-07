import { Lucia, TimeSpan } from 'lucia'
import { dev } from '$app/environment'
import { adapter } from '@/db/schema'

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			// set to `true` when using HTTPS
			secure: !dev,
		},
	},
	sessionExpiresIn: new TimeSpan(1, 'w'),
})

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia
	}
}
