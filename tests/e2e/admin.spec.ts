import { test, expect } from '@playwright/test'

const AGENT_EMAIL = 'sarah.miller@mountainretreatrealty.com'
const AGENT_PASSWORD = 'agent123'

test.describe('Admin / Agent CRM', () => {
  test('unauthenticated user is redirected from /admin', async ({ page }) => {
    await page.goto('/admin')
    await page.waitForURL(/\/auth\/login/)
    await expect(page).toHaveURL(/\/auth\/login/)
  })

  test('agent can log in', async ({ page }) => {
    await page.goto('/auth/login')
    await page.getByLabel(/email/i).fill(AGENT_EMAIL)
    await page.getByLabel(/password/i).fill(AGENT_PASSWORD)
    await page.getByRole('button', { name: /sign in|log in/i }).click()
    await page.waitForURL(/\/admin/)
    await expect(page).toHaveURL(/\/admin/)
  })

  test('admin dashboard shows stats', async ({ page }) => {
    await page.goto('/auth/login')
    await page.getByLabel(/email/i).fill(AGENT_EMAIL)
    await page.getByLabel(/password/i).fill(AGENT_PASSWORD)
    await page.getByRole('button', { name: /sign in|log in/i }).click()
    await page.waitForURL(/\/admin/)

    await expect(page.getByText(/Active Listings/i)).toBeVisible()
    await expect(page.getByText(/New Inquiries/i)).toBeVisible()
  })

  test('agent can create a new listing', async ({ page }) => {
    await page.goto('/auth/login')
    await page.getByLabel(/email/i).fill(AGENT_EMAIL)
    await page.getByLabel(/password/i).fill(AGENT_PASSWORD)
    await page.getByRole('button', { name: /sign in|log in/i }).click()
    await page.waitForURL(/\/admin/)

    await page.goto('/admin/listings/new')
    await expect(page.getByRole('heading', { name: /Add New Listing/i })).toBeVisible()

    await page.getByLabel(/Street address/i).fill('123 Test Mountain Rd')
    await page.getByLabel(/City/i).fill('Breckenridge')
    await page.getByLabel(/State/i).fill('CO')
    await page.getByLabel(/ZIP/i).fill('80424')
    await page.getByLabel(/Latitude/i).fill('39.4817')
    await page.getByLabel(/Longitude/i).fill('-106.0384')
    await page.getByLabel(/List price/i).fill('75000000') // $750k in cents
    await page.getByLabel(/Bedrooms/i).fill('3')
    await page.getByLabel(/Bathrooms/i).fill('2')

    await page.getByRole('button', { name: /Create listing/i }).click()

    // Should redirect to the edit page after creation
    await page.waitForURL(/\/admin\/listings\/.+\/edit/)
    await expect(page).toHaveURL(/\/admin\/listings\/.+\/edit/)
  })

  test('agent can view inquiries', async ({ page }) => {
    await page.goto('/auth/login')
    await page.getByLabel(/email/i).fill(AGENT_EMAIL)
    await page.getByLabel(/password/i).fill(AGENT_PASSWORD)
    await page.getByRole('button', { name: /sign in|log in/i }).click()
    await page.waitForURL(/\/admin/)

    await page.goto('/admin/inquiries')
    await expect(page.getByRole('heading', { name: /Inquiries/i })).toBeVisible()
    // Status filter tabs
    await expect(page.getByRole('button', { name: /ALL/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /NEW/i })).toBeVisible()
  })
})
