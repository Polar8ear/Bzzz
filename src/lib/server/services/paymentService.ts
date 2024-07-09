import { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_ENDPOINT_SECRET } from '$env/static/private'
import { PUBLIC_BASE_URL } from '$env/static/public'
import { paymentLogger } from '$lib/log'
import Stripe from 'stripe'
import { z } from 'zod'
import { requestService } from './requestService'

const stripe = new Stripe(STRIPE_SECRET_KEY, {
	apiVersion: '2024-06-20',
	typescript: true,
	telemetry: false,
	appInfo: {
		name: 'Bzzz',
	},
})

type Item = {
	amountInMyr: number
	name: string
	quantity: number
}

const metadataSchema = z.object({
	requestId: z.string(),
})
type Metadata = typeof metadataSchema._output

const getPaymentLink = async (items: Item[], requestId: string) => {
	console.log('Creating payment session for', items, requestId)
	const session = await stripe.checkout.sessions.create({
		payment_method_types: ['card', 'fpx', 'grabpay'],
		line_items: items.map((i) => ({
			price_data: {
				currency: 'myr',
				product_data: {
					name: i.name,
				},
				unit_amount: i.amountInMyr,
			},
			quantity: i.quantity,
		})),
		currency: 'myr',
		metadata: {
			requestId,
		} satisfies Metadata,
		mode: 'payment',
		success_url: `${PUBLIC_BASE_URL}/payment/success`,
		cancel_url: `${PUBLIC_BASE_URL}/payment/cancel`,
	})

	return session.url
}

const handleStripeEvent = async (sig: string, payload: string | Buffer) => {
	const event = stripe.webhooks.constructEvent(payload, sig, STRIPE_WEBHOOK_ENDPOINT_SECRET)

	switch (event.type) {
		case 'checkout.session.completed': {
			const session = event.data.object
			const { success, data: metadata } = metadataSchema.safeParse(session.metadata)

			paymentLogger.info('Session completed', {
				stripeId: session.id,
				request: metadata?.requestId,
			})

			if (!success) {
				throw Error('Invalid metadata from stripe', {
					cause: session.metadata,
				})
			}

			await requestService.markRequestAsPaid(metadata?.requestId)
			break
		}

		// Ignored events
		case 'payment_intent.succeeded':
		case 'charge.succeeded':
		case 'payment_intent.created':
		case 'charge.updated':
		case 'invoice.created':
		case 'invoice.updated':
		case 'invoiceitem.created':
			break

		default:
			throw new Error(`Unhandled event type ${event.type}`, {
				cause: event,
			})
	}
}

export const paymentService = {
	getPaymentLink,
	handleStripeEvent,
}
