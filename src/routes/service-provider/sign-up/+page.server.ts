import { db } from '$lib/server/db/index.js'
import { addressService } from '$lib/server/services/addressService'
import { serviceProviderService } from '$lib/server/services/serviceProviderService.js'
import { serviceService } from '$lib/server/services/services'
import { error, redirect } from '@sveltejs/kit'

export const load = async ({ locals }) => {
	if (locals.user == null) {
		return error(401, 'Unauthorized to sign up as a service provider')
	}

	const services = await serviceService.getAllServices()
	const addresses = await addressService.findAddressesByUserId(locals.user?.id)
	return {
		services,
		addresses,
	}
}

export const actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData()
		const addressId = formData.get('addressId')?.toString()
		const serviceIds = formData.getAll('services').map((id) => id.toString())

		if (locals.user == null) {
			return error(401, 'Unauthorized to sign up as a service provider')
		}

		if (addressId == null) {
			return error(400, 'Address is required')
		}

		const userId = locals.user.id

		await db.transaction(async (trx) => {
			const newServiceProvider = await serviceProviderService.createServiceProvider(
				{
					ownedById: userId,
					addressId: '123',
				},
				trx,
			)

			await addressService.createAddressFromAnotherAddress(
				addressId,
				{
					belongTo: newServiceProvider.id,
					belongToType: 'service_provider',
				},
				trx,
			)

			await serviceProviderService.updateAddressId(newServiceProvider.id, addressId, trx)
		})

		return redirect(302, '/service-provider')
	},
}
