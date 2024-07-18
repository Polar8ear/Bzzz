import { requestService } from '$lib/server/services/requestService'
import { serviceProviderService } from '$lib/server/services/serviceProviderService'
import { serviceService } from '$lib/server/services/services'
import { error } from '@sveltejs/kit'

export const load = async ({ locals }) => {
	if (locals.user == null) {
		return error(401, 'Unauthorized to view service provider dashboard')
	}

	const serviceProvider = await serviceProviderService.findServiceProviderByOwnerId(locals.user.id)

	if (serviceProvider == null) {
		return error(401, 'Unauthorized to view service provider dashboard')
	}

	const serviceIds = await serviceProviderService.getAllServicesIdsByServiceProviderId(
		serviceProvider.id,
	)

	const requests = await requestService.findRequestsByServices(serviceIds)

	return { requests }
}

export const actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData()
		const requestId = formData.get('requestId')?.toString()

		if (locals.user == null) {
			return error(401, 'Unauthorized to mark request as paid')
		}

		if (requestId == null) {
			return error(400, 'Request ID is required')
		}

		const serviceProvider = await serviceProviderService.findServiceProviderByOwnerId(
			locals.user.id,
		)

		if (serviceProvider == null) {
			return error(401, 'Unauthorized to mark request as taken')
		}

		await requestService.markRequestAsTaken(requestId, serviceProvider.id)

		return { status: 200 }
	},
}
