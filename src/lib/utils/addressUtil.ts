type Addresss = {
	line1: string
	line2?: string | null
	line3?: string | null
	postcode: string
	city: string
	state: string
	country: string
}

const convertAddress = (address: Addresss | null): string => {
	if (address == null) {
		return 'N/A'
	}

	const line2 = address.line2 ? `${address.line2}, ` : ''
	const line3 = address.line3 ? `${address.line3}, ` : ''

	return `${address.line1}, ${line2}${line3}${address.postcode} ${address.city}, ${address.state} ${address.country}`
}

export { convertAddress }
