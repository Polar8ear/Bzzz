import { findServiceById } from '$lib/server/services/services'
import type { PageServerLoad } from './$types'

export const load = (async ({ params }) => {
	const service = await findServiceById(params.serviceId)
	return {
		service,
	}
}) satisfies PageServerLoad
