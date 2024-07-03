import { log } from '$lib/log'
import { sql } from 'drizzle-orm'
import { db } from '../db'
import { servicesSearchQuery as servicesSearchIndex } from '../db/schema'

/**
 * @link https://orm.drizzle.team/learn/guides/postgresql-full-text-search
 */
export const searchServices = async (queryString: string, page: number = 1, limit: number = 10) => {
	return await db.query.services.findMany({
		where: sql`
			${servicesSearchIndex}
			@@ websearch_to_tsquery('english', ${queryString})
		`,
		limit,
		offset: (page - 1) * limit,
	})
}
