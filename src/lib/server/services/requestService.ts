import { requests } from '$lib/server/db/schema'
import { eq } from 'drizzle-orm'
import { db } from '../db'

const createRequest = async (request: typeof requests.$inferInsert) => {
	return await db.insert(requests).values(request).returning()
}

const markRequestAsPaid = async (requestId: string) => {
	await db.update(requests).set({ paidAt: new Date() }).where(eq(requests.id, requestId))
}

export const requestService = {
	createRequest,
	markRequestAsPaid,
}
