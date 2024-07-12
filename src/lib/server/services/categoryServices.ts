import { eq } from 'drizzle-orm'
import { db } from '../db'
import { categories } from '../db/schema'

export const findCategoryById = async (categoryId: string) => {
	return await db.query.categories.findFirst({
		where: eq(categories.id, categoryId),
	})
}

const getAllCategories = async () => {
	return await db.query.categories.findMany()
}

const updateCategory = async (
	categoryId: string,
	data: Omit<typeof categories.$inferInsert, 'id'>,
) => {
	return await db.update(categories).set(data).where(eq(categories.id, categoryId))
}

const createCategory = async (data: Omit<typeof categories.$inferInsert, 'id'>) => {
	return await db.insert(categories).values(data)
}

export const categoryService = {
	findCategoryById,
	getAllCategories,
	updateCategory,
	createCategory,
}
