import { findServiceById } from '$lib/server/services/services'
import { error, redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { addressService } from '$lib/server/services/addressService'
import { z } from 'zod'
import { fail, message, setError, superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { requestService } from '$lib/server/services/requestService'
import { Logger } from '$lib/log'
import { paymentService } from '$lib/server/services/paymentService'

const logger = new Logger('services/book')

const serviceRequestSchema = z
	.object({
		unitCount: z.number().int().positive().default(1),
		imageFileIds: z.array(z.string()),
		imageKeys: z.array(z.string()),
		details: z.string().optional(),
		addressId: z.string(),
		startAt: z.coerce.date(),
		endAt: z.coerce.date(),
	})
	.refine((data) => data.endAt > data.startAt, {
		message: 'Start date must be before end date',
		path: ['endAt'],
	})
	.refine(
		(data) => {
			console.log(data.startAt, new Date(), data.startAt < new Date())
			return data.startAt >= new Date()
		},
		{
			message: 'Start date must be in the future',
			path: ['startAt'],
		},
	)

export const load = (async ({ params, locals }) => {
	const form = await superValidate(zod(serviceRequestSchema))

	if (!locals.user) {
		return error(401, 'Unauthorized')
	}

	const [service, addresses] = await Promise.all([
		findServiceById(params.serviceId),
		addressService.findAddressesByUserId(locals.user.id),
	])

	if (!service) {
		return error(404, 'Service not found')
	}

	form.data.addressId = addresses[0]?.id

	return {
		form,
		service,
		addresses,
	}
}) satisfies PageServerLoad

export const actions = {
	default: async ({ request, params, locals }) => {
		const form = await superValidate(request, zod(serviceRequestSchema))
		if (!locals.user) {
			return message(form, 'Unauthorized to create service request', {
				status: 401,
			})
		}

		console.log('form', form.data)

		const [service, address] = await Promise.all([
			findServiceById(params.serviceId),
			addressService.findAddressById(form.data.addressId),
		])

		if (service == null) {
			message(form, 'Service not found', { status: 404 })
		}

		if (address == null || address.belongTo !== locals.user.id) {
			setError(form, 'addressId', 'Address not found')
		}

		if (!form.valid || service == null || address == null) {
			logger.debug('Form is invalid', form.data, service, address)
			return fail(404, { form })
		}

		logger.info('Creating service request', { form: form.data, user: locals.user.id })

		const total = service.price * form.data.unitCount
		const platformCharge = total * 0.1

		const [serviceRequest] = await requestService.createRequest({
			...form.data,
			startedAt: new Date(form.data.startAt),
			endedAt: new Date(form.data.endAt),
			price: total + platformCharge,
			requestedById: locals.user.id,
			serviceId: service.id,
			addressId: address.id,
		})

		const paymentRedirectUrl = await paymentService.getPaymentLink(
			[
				{
					amountInMyr: service.price,
					name: service.name,
					quantity: serviceRequest.unitCount,
				},
				{
					amountInMyr: platformCharge,
					name: 'Bzzz Service Charge',
					quantity: 1,
				},
			],
			serviceRequest.id,
		)

		if (paymentRedirectUrl == null) {
			return message(form, 'Failed to create payment link', { status: 500 })
		}

		return redirect(303, paymentRedirectUrl)
	},
}
