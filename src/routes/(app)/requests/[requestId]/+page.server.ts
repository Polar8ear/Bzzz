import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { requestService } from '$lib/server/services/requestService'

export const load = (async ({ params }) => {
	const request = await requestService.findRequestById(params.requestId)

	if (!request) {
		return error(404, 'Request not found')
	}

	return {
		request,
	}
}) satisfies PageServerLoad

export const actions = {
	default: async ({ request, params }) => {
		const formData = await request.formData()
		const serviceRequest = await requestService.findRequestById(params.requestId)

		if (!serviceRequest) {
			return error(404, 'Request not found')
		}

		await requestService.addReview(params.requestId, {
			rating: Number(formData.get('rating')),
			comment: formData.get('review')?.toString() ?? null,
			serviceId: serviceRequest.serviceId,
			requestId: params.requestId,
		})
		return {
			status: 200,
		}
	},
}
