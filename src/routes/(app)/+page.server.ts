import { recommendServices, searchServices } from '$lib/server/services/services.js'
import { superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { z } from 'zod'

const searchSchema = z.object({
	q: z.string().min(1),
	page: z.number().optional().default(1),
	limit: z.number().optional().default(10),
})

export const load = async (event) => {
	const form = await superValidate(event.url.searchParams, zod(searchSchema))

	if (!form.valid) {
		const recommendedServices = await recommendServices()
		return { form, services: recommendedServices }
	}

	const { q: queryString, page, limit } = form.data
	const services = await searchServices(queryString, page, limit)

	return { form, services }
}
