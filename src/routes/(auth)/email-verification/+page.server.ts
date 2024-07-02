import {
	NUMBER_OF_CHARACTERS_IN_TOKEN,
	getEmailToken,
	verifyEmailToken,
} from '$lib/server/services/emailToken'
import { error, redirect } from '@sveltejs/kit'

export const load = async ({ url, locals }) => {
	const token = url.searchParams.get('token')
	const { user } = locals

	if (user == null) {
		return error(401, {
			message: 'Please log in to access this page',
		})
	}

	if (token == null) {
		return {
			hasInvalidToken: false,
		}
	}

	if (token === '' || token.length !== NUMBER_OF_CHARACTERS_IN_TOKEN) {
		return {
			hasInvalidToken: true,
		}
	}

	const retrievedToken = await getEmailToken(user.id, token)

	if (retrievedToken == null) {
		return {
			hasInvalidToken: true,
		}
	}

	await verifyEmailToken(retrievedToken)

	return redirect(303, '/')
}
