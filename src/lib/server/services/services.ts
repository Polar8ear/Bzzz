import { eq } from 'drizzle-orm'
import { db } from '../db'
import { services, servicesSearchQuery as servicesSearchIndex } from '../db/schema'

/**
 * @link https://orm.drizzle.team/learn/guides/postgresql-full-text-search
 */
export const searchServices = async (queryString: string, page: number = 1, limit: number = 10) => {
	return await db.query.services.findMany({
		where: servicesSearchIndex(queryString),
		with: {
			image: true,
		},
		limit,
		offset: (page - 1) * limit,
	})
}

export const recommendServices = async (limit: number = 10) => {
	return await db.query.services.findMany({
		limit,
		with: {
			image: true,
		},
	})
}

const findServiceWithReviewsById = async (serviceId: string) => {
	return await db.query.services.findFirst({
		where: eq(services.id, serviceId),
		with: {
			image: true,
			reviews: {
				with: {
					reviewImages: true,
				},
			},
		},
	})
}

export const findServiceById = async (serviceId: string) => {
	return await db.query.services.findFirst({
		where: eq(services.id, serviceId),
		with: {
			image: true,
		},
	})
}

const getAllServices = async () => {
	return await db.query.services.findMany()
}

const updateService = async (serviceId: string, data: Omit<typeof services.$inferInsert, 'id'>) => {
	return await db.update(services).set(data).where(eq(services.id, serviceId))
}

const createService = async (data: Omit<typeof services.$inferInsert, 'id'>) => {
	return await db.insert(services).values(data)
}

export const serviceService = {
	searchServices,
	recommendServices,
	findServiceById,
	findServiceWithReviewsById,
	getAllServices,
	updateService,
	createService,
}
