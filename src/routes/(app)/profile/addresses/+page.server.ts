import { addressService } from '$lib/server/services/addressService.js'
import { error } from '@sveltejs/kit'

export const load = async ({ locals }) => {
	if (locals.user == null) {
		return error(401, 'Unauthorized to access address page')
	}

	return {
		addresses: await addressService.findAddressesByUserId(locals.user.id),
	}
}
