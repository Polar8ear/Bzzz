import { describe, test, expect } from 'vitest'
import { convertAddress } from '../addressUtil'

describe('convertAddress', () => {
	test('should convert address correctly', () => {
		const address = {
			line1: '123 Main St',
			line2: 'Apt 4',
			line3: 'Building B',
			postcode: '12345',
			city: 'City',
			state: 'State',
			country: 'Country',
		}

		const convertedAddress = convertAddress(address)

		expect(convertedAddress).toBe('123 Main St, Apt 4, Building B, 12345 City, State Country')
	})

	test('should handle missing address fields [line2, line3]', () => {
		const address = {
			line1: '456 Elm St',
			postcode: '54321',
			city: 'City',
			state: 'State',
			country: 'Country',
		}

		const convertedAddress = convertAddress(address)

		expect(convertedAddress).toBe('456 Elm St, 54321 City, State Country')
	})

	test('should handle missing address fields [line2]', () => {
		const address = {
			line1: '456 Elm St',
			line3: 'Building B',
			postcode: '54321',
			city: 'City',
			state: 'State',
			country: 'Country',
		}

		const convertedAddress = convertAddress(address)

		expect(convertedAddress).toBe('456 Elm St, Building B, 54321 City, State Country')
	})

	test('should handle missing address fields [line3]', () => {
		const address = {
			line1: '456 Elm St',
			line2: 'Apt 4',
			postcode: '54321',
			city: 'City',
			state: 'State',
			country: 'Country',
		}

		const convertedAddress = convertAddress(address)

		expect(convertedAddress).toBe('456 Elm St, Apt 4, 54321 City, State Country')
	})
})
