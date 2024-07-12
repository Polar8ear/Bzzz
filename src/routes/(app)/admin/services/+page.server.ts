import { serviceService } from '$lib/server/services/services.js'
import { superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { insertOrUpdateServiceSchema } from './serviceSchema.js'
import { categoryService } from '$lib/server/services/categoryServices.js'

export const load = async () => {
	const [form, services, categories] = await Promise.all([
		superValidate(zod(insertOrUpdateServiceSchema)),
		serviceService.getAllServices(),
		categoryService.getAllCategories(),
	])

	return {
		form,
		services,
		categories,
	}
}

export const actions = {
	default: async (event) => {
		const form = await superValidate(event.request, zod(insertOrUpdateServiceSchema))

		await serviceService.createService(form.data)

		return {
			form,
		}
	},
}
