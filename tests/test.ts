import { expect, test } from '@playwright/test'

test('home page is running', async ({ page }) => {
	const res = await page.goto('/')
	expect(res?.status()).toBe(200)
})
test('home page links are running', async ({ page }) => {
	await page.goto('/')

	const links = await page
		.$$eval('a', (anchors) => anchors.map((anchor) => anchor.href))
		.then((hrefs) =>
			hrefs.filter(
				(href) =>
					(!href.includes('#') && href.startsWith('http://')) ||
					href.startsWith('https://') ||
					href.startsWith('/'),
			),
		)
	for (const link of links) {
		const response = await page.goto(link)
		expect(response?.status(), `Failed to get 200 status at ${link}`).toBe(200)
	}
})
