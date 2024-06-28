import { verifyEmailToken } from '$lib/server/services/token.js'
import { error, redirect } from '@sveltejs/kit'

export const load = async ({ url, locals }) => {
	const token = url.searchParams.get('token')

	if (locals.user == null) {
		return error(401, {
			message: 'Please log in to access this page',
		})
	}

	if (token == null) {
		return {
			message: 'The token provided is invalid.',
		}
	}

	await verifyEmailToken(locals.user.id, token)

	return redirect(303, '/')
}
