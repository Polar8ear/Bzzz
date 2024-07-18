import { serviceProviderService } from '$lib/server/services/serviceProviderService.js'

export const load = async ({ locals }) => {
	if (locals.user != null) {
		const serviceProvider = await serviceProviderService.findServiceProviderByOwnerId(
			locals.user.id,
		)
		return {
			serviceProvider,
		}
	}

	return {}
}
