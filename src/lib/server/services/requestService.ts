import { requests, reviews } from '$lib/server/db/schema'
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

const findRequestById = async (requestId: string, trx: DBorTransaction = db) => {
	return await trx.query.requests.findFirst({
		where: eq(requests.id, requestId),
		with: {
			service: true,
			address: true,
			requestImages: true,
			serviceProvider: true,
			reviews: true,
		},
	})
}

const addReview = async (requestId: string, review: typeof reviews.$inferInsert) => {
	return await db
		.insert(reviews)
		.values({
			...review,
			requestId,
		})
		.returning()
}

export const requestService = {
	createRequest,
	markRequestAsPaid,
	findRequestsByUserId,
	findRequestsByServices,
	markRequestAsTaken,
	findRequestById,
	addReview,
}
