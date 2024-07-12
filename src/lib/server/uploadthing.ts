import { UTApi, createUploadthing } from 'uploadthing/server'
import type { FileRouter } from 'uploadthing/server'
import { AUTH_COOKIE_NAME, lucia } from './auth'
import { parseCookies } from 'oslo/cookie'
import fileService from '$lib/server/services/files'
import { UPLOADTHING_SECRET } from '$env/static/private'

const f = createUploadthing()
const utapi = new UTApi({
	apiKey: UPLOADTHING_SECRET,
})

const extractAuthSession = (cookie: string) => {
	return parseCookies(cookie).get(AUTH_COOKIE_NAME) ?? null
}

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
	imageUploader: f({ image: { maxFileSize: '4MB', acl: 'public-read' } })
		.middleware(async ({ req }) => {
			const cookieString = req.headers.get('cookie')

			if (cookieString == null) throw new Error('No cookie')

			const authSessionId = extractAuthSession(cookieString)
			if (authSessionId == null) throw new Error('No auth session')

			const { user } = await lucia.validateSession(authSessionId)
			if (user == null) throw new Error('No user')

			return {
				userId: user.id,
			}
		})
		.onUploadComplete(async ({ metadata, file }) => {
			try {
				const [dbFile] = await fileService.createFile(file.key, 'uploadthing', metadata.userId)
				console.log('file url', file.url)

				return {
					fileId: dbFile.id,
				}
			} catch (error) {
				utapi.deleteFiles([file.key])
			}
		}),
	serviceImageUploader: f({ image: { maxFileSize: '4MB', acl: 'public-read', maxFileCount: 10 } })
		.middleware(async ({ req }) => {
			const cookieString = req.headers.get('cookie')

			if (cookieString == null) throw new Error('No cookie')

			const authSessionId = extractAuthSession(cookieString)
			if (authSessionId == null) throw new Error('No auth session')

			const { user } = await lucia.validateSession(authSessionId)
			if (user == null) throw new Error('No user')

			return {
				userId: user.id,
			}
		})
		.onUploadComplete(async ({ metadata, file }) => {
			try {
				const [dbFile] = await fileService.createFile(file.key, 'uploadthing', metadata.userId)
				console.log('file url', file.url)

				return {
					fileId: dbFile.id,
				}
			} catch (error) {
				utapi.deleteFiles([file.key])
			}
		}),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
