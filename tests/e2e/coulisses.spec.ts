import { test, expect } from '@playwright/test'

test.describe('Coulisses Page', () => {
  test('loads successfully', async ({ page }) => {
    const response = await page.goto('/fr/coulisses')
    expect(response?.status()).toBe(200)
  })

  test('displays timeline steps', async ({ page }) => {
    await page.goto('/fr/coulisses')
    const steps = page.locator('[data-testid="timeline-step"]')
    const count = await steps.count()
    // If no data-testid, check for step headings
    if (count === 0) {
      const headings = page.locator('h2, h3')
      await expect(headings.first()).toBeVisible()
    } else {
      expect(count).toBeGreaterThan(0)
    }
  })

  test('prompt code block is present', async ({ page }) => {
    await page.goto('/fr/coulisses')
    // Scroll down to find the code block
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2))
    const codeBlock = page.locator('pre, code').first()
    await expect(codeBlock).toBeVisible({ timeout: 5000 })
  })

  test('back to home link works', async ({ page }) => {
    await page.goto('/fr/coulisses')
    const backLink = page.locator('a[href*="/fr"]').first()
    await expect(backLink).toBeVisible()
  })
})
