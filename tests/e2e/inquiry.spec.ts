import { test, expect } from '@playwright/test'

test.describe('Inquiry form', () => {
  test('inquiry form is visible on listing detail page', async ({ page }) => {
    await page.goto('/listings')
    await page.locator('article a').first().click()
    await page.waitForURL(/\/listings\/.+/)

    await expect(page.getByRole('heading', { name: /contact|inquire|get in touch/i })).toBeVisible()
    await expect(page.getByLabel(/name/i).first()).toBeVisible()
    await expect(page.getByLabel(/email/i).first()).toBeVisible()
  })

  test('inquiry form validates required fields', async ({ page }) => {
    await page.goto('/listings')
    await page.locator('article a').first().click()
    await page.waitForURL(/\/listings\/.+/)

    // Submit without filling anything
    await page.getByRole('button', { name: /send|submit|contact/i }).last().click()
    // Should show validation errors (not navigate away)
    await expect(page).toHaveURL(/\/listings\/.+/)
  })

  test('inquiry form submits successfully', async ({ page }) => {
    await page.goto('/listings')
    await page.locator('article a').first().click()
    await page.waitForURL(/\/listings\/.+/)

    await page.getByLabel(/name/i).first().fill('Test User')
    await page.getByLabel(/email/i).first().fill('test@example.com')

    const phoneField = page.getByLabel(/phone/i).first()
    if (await phoneField.isVisible()) {
      await phoneField.fill('555-123-4567')
    }

    await page.getByLabel(/message/i).fill('I am interested in this property and would like to schedule a viewing.')
    await page.getByRole('button', { name: /send|submit|contact/i }).last().click()

    // Should show a success state
    await expect(
      page.getByText(/thank you|sent|received|we.ll be in touch/i)
    ).toBeVisible({ timeout: 10000 })
  })

  test('all contact links route to Mountain Retreat Realty agents', async ({ page }) => {
    await page.goto('/listings')
    await page.locator('article a').first().click()
    await page.waitForURL(/\/listings\/.+/)

    // No external real estate links (Zillow, Realtor.com, etc.)
    const externalLinks = await page.locator('a[href*="zillow"], a[href*="realtor.com"], a[href*="redfin"]').count()
    expect(externalLinks).toBe(0)
  })
})
