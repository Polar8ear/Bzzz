import { requestService } from '$lib/server/services/requestService.js'

export const load = async ({ locals }) => {
	if (locals.user == null) {
		return {}
	}

	const requests = await requestService.findRequestsByUserId(locals.user.id)

	return {
		requests,
	}
}
