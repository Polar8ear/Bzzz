import type { addresses } from '$lib/server/db/schema'

const convertAddress = (address: typeof addresses.$inferSelect): string => {
	const line2 = address.line2 ? `${address.line2}, ` : ''
	const line3 = address.line3 ? `${address.line3}, ` : ''

	return `${address.line1}, ${line2}${line3}${address.postcode} ${address.city}, ${address.state} ${address.country}`
}

export { convertAddress }
