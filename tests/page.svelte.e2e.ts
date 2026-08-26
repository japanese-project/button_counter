import { expect, test } from '@playwright/test'

test.describe('Counter Page', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/')
	})

	test('has correct page title and meta description', async ({ page }) => {
		await expect(page).toHaveTitle('Button Counter')

		const meta_description = page.locator('meta[name="description"]')
		await expect(meta_description).toHaveAttribute(
			'content',
			'A button counter built with SvelteKit, TypeScript, and Tailwind CSS',
		)
	})

	test('displays the initial count', async ({ page }) => {
		const main = page.locator('main')
		await expect(main).toContainText('0')
	})

	test('increments count on button click', async ({ page }) => {
		await page.route('**/counter*', async (route) => {
			await route.fulfill({ json: { count: 0 } })
		})

		await page.goto('/')

		const main = page.locator('main')
		await expect(main).toContainText('0')

		await page.getByRole('button').click()
		await expect(main).toContainText('1')
	})

	test('submits form to ?/increment action', async ({ page }) => {
		const request_promise = page.waitForRequest(
			(request) => request.url().includes('?/increment') && request.method() === 'POST',
		)

		await page.getByRole('button').click()

		const request = await request_promise
		expect(request).toBeTruthy()
	})
})
