import { db } from '../db'
import { files } from '../db/schema'

type FileLocation = (typeof files.location.enumValues)[number]

export default {
	createFile: async (key: string, location: FileLocation, uploadedById: string) => {
		return await db
			.insert(files)
			.values({
				key,
				location,
				uploadedById,
			})
			.returning()
	},
}
