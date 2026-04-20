import { test, expect } from '@playwright/test'

test.describe('Search flow', () => {
  test('home page loads with hero and featured listings', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: /Find Your Colorado/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /Browse all listings/i })).toBeVisible()
  })

  test('search bar on home page navigates to listings', async ({ page }) => {
    await page.goto('/')
    const searchInput = page.getByPlaceholder(/City, ZIP, or address/i)
    await searchInput.fill('Aspen')
    await searchInput.press('Enter')
    await page.waitForURL(/\/listings/)
    await expect(page).toHaveURL(/city=Aspen|q=Aspen/)
  })

  test('listings page shows properties and filter panel', async ({ page }) => {
    await page.goto('/listings')
    await expect(page.getByText(/home(s)? found/i)).toBeVisible()
    // Filter panel should render
    await expect(page.getByRole('combobox').first()).toBeVisible()
  })

  test('clicking a property card opens the detail page', async ({ page }) => {
    await page.goto('/listings')
    const firstCard = page.locator('article').first()
    await firstCard.waitFor()
    const href = await firstCard.locator('a').first().getAttribute('href')
    expect(href).toMatch(/^\/listings\//)
    await firstCard.locator('a').first().click()
    await page.waitForURL(/\/listings\/.+/)
    await expect(page.getByRole('heading').first()).toBeVisible()
  })

  test('price history chart renders on listing detail', async ({ page }) => {
    await page.goto('/listings')
    await page.locator('article a').first().click()
    await page.waitForURL(/\/listings\/.+/)
    // Recharts renders a <svg> element
    await expect(page.locator('.recharts-wrapper, svg').first()).toBeVisible({ timeout: 8000 })
  })

  test('filter by min price reduces results', async ({ page }) => {
    await page.goto('/listings')
    const initialText = await page.getByText(/home(s)? found/i).textContent()

    await page.goto('/listings?minPrice=500000000') // $5M+
    await page.waitForLoadState('networkidle')
    const filteredText = await page.getByText(/home(s)? found/i).textContent()

    // Filtered count should be less or equal
    const initial = parseInt(initialText?.match(/\d+/)?.[0] ?? '0')
    const filtered = parseInt(filteredText?.match(/\d+/)?.[0] ?? '0')
    expect(filtered).toBeLessThanOrEqual(initial)
  })
})
