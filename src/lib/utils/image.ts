import type { files } from '$lib/server/db/schema'

export const getImageUrl = (image: typeof files.$inferSelect) => {
	if (image.location === 'uploadthing') {
		return `https://utfs.io/f/${image.key}`
	}

	return image.key
}
