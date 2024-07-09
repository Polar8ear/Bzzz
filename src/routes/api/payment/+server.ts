import { paymentLogger } from '$lib/log.js'
import { paymentService } from '$lib/server/services/paymentService.js'
import { error } from '@sveltejs/kit'

export const POST = async ({ request }) => {
	const sig = request.headers.get('stripe-signature')

	if (sig === null) {
		console.error('Stripe signature is missing')
		return error(400, 'Stripe signature is missing')
	}

	try {
		await paymentService.handleStripeEvent(sig, await request.text())
	} catch (err) {
		paymentLogger.critical('Failed to handle stripe event', err)
		return error(500, 'Internal server error')
	}

	return new Response()
}
