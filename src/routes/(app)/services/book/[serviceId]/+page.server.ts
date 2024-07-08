import { findServiceById } from '$lib/server/services/services'
import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load = (async ({ params }) => {
	const service = await findServiceById(params.serviceId)

	if (!service) {
		return error(404, 'Service not found')
	}

	return {
		service,
	}
}) satisfies PageServerLoad
