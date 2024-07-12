import { superValidate } from 'sveltekit-superforms'
import { insertOrUpdateServiceSchema } from '../serviceSchema'
import { zod } from 'sveltekit-superforms/adapters'
import { serviceService } from '$lib/server/services/services'

export const load = async (event) => {
	const { serviceId } = event.params
	const service = await serviceService.findServiceById(serviceId)
	const form = await superValidate(service, zod(insertOrUpdateServiceSchema))
	return { form }
}

export const actions = {
	default: async (event) => {
		const form = await superValidate(event.request, zod(insertOrUpdateServiceSchema))
		await serviceService.updateService(event.params.serviceId, form.data)
		return { form }
	},
}
