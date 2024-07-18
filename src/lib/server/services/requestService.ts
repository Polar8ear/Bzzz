import { requests } from '$lib/server/db/schema'
import { eq, or } from 'drizzle-orm'
import { db, type DBorTransaction } from '../db'

const createRequest = async (request: typeof requests.$inferInsert) => {
	return await db.insert(requests).values(request).returning()
}

const markRequestAsPaid = async (requestId: string) => {
	await db.update(requests).set({ paidAt: new Date() }).where(eq(requests.id, requestId))
}

const findRequestsByUserId = async (userId: string) => {
	return await db.query.requests.findMany({
		where: eq(requests.requestedById, userId),
		with: {
			service: true,
		},
	})
}

const findRequestsByServices = async (serviceIds: string[]) => {
	return await db.query.requests.findMany({
		where: or(...serviceIds.map((id) => eq(requests.serviceId, id))),
		with: {
			service: true,
		},
	})
}

const markRequestAsTaken = async (
	requestId: string,
	serviceProviderId: string,
	trx: DBorTransaction = db,
) => {
	return await trx
		.update(requests)
		.set({ serviceProviderId, completedAt: new Date() })
		.where(eq(requests.id, requestId))
}

export const requestService = {
	createRequest,
	markRequestAsPaid,
	findRequestsByUserId,
	findRequestsByServices,
	markRequestAsTaken,
}
