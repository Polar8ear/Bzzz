import { db } from '@/lib/server/db'

export async function load({ locals }) {
	return {
		user: locals.user,
		users: await db.query.users.findMany().execute(),
	}
}
