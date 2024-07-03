import { searchServices } from '$lib/server/services/services.js'
import { superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { z } from 'zod'

const searchSchema = z.object({
	q: z.string(),
	page: z.number().optional().default(1),
	limit: z.number().optional().default(10),
})

export const load = async (event) => {
	const form = await superValidate(event.url.searchParams, zod(searchSchema))

	if (!form.valid) {
		return { form }
	}

	const { q: queryString, page, limit } = form.data
	console.log('queryString', queryString)
	const services = await searchServices(queryString, page, limit)

	return { form, services }
}
