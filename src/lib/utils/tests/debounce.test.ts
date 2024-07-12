import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { debounce } from '../debounce'

describe('debounce', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	test('should debounce function calls', async () => {
		const fakeFunction = vi.fn()
		const debounceTime = 100

		const debounced = debounce(fakeFunction, debounceTime)

		debounced()
		debounced()
		debounced()
		vi.advanceTimersByTime(debounceTime)

		expect(fakeFunction).toHaveBeenCalledOnce()
	})

	test('should call after the debounce time', async () => {
		const fakeFunction = vi.fn()
		const debounceTime = 100

		const debounced = debounce(fakeFunction, debounceTime)

		debounced()
		debounced()

		vi.advanceTimersByTime(debounceTime)

		debounced()
		debounced()
		debounced()
		vi.advanceTimersByTime(debounceTime)
		expect(fakeFunction).toHaveBeenCalledTimes(2)
	})
})
