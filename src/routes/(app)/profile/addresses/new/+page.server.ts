import { addressService } from '$lib/server/services/addressService.js'
import { fail, message, superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { z } from 'zod'
import { redirect } from '@sveltejs/kit'

const addressSchema = z.object({
	line1: z.string(),
	line2: z.string().optional(),
	line3: z.string().optional(),
	city: z.string(),
	state: z.string(),
	postcode: z.string(),
	country: z.string(),

	x: z.number(),
	y: z.number(),
})

export const load = async () => {
	const form = await superValidate(zod(addressSchema))

	return { form }
}

export const actions = {
	default: async (event) => {
		const form = await superValidate(event.request, zod(addressSchema))

		if (event.locals.user == null) {
			return message(form, 'Unauthorized to access address page', {
				status: 401,
			})
		}

		if (!form.valid) {
			return fail(400, { form })
		}

		const { line1, line2, line3, city, state, postcode, country, x, y } = form.data

		await addressService.createAddress({
			line1,
			line2,
			line3,
			city,
			state,
			country,
			postcode,
			coordinate: {
				x,
				y,
			},
			belongTo: event.locals.user.id,
			belongToType: 'user',
		})

		return redirect(300, '/profile/addresses')
	},
}
