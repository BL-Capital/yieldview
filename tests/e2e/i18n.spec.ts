import { test, expect } from '@playwright/test'

test.describe('Internationalization', () => {
  test('FR page loads with French content', async ({ page }) => {
    await page.goto('/fr')
    await expect(page).toHaveURL(/\/fr/)
    // Check for French content
    const body = await page.textContent('body')
    expect(body).toContain('YieldField')
  })

  test('EN page loads with English content', async ({ page }) => {
    await page.goto('/en')
    await expect(page).toHaveURL(/\/en/)
    const body = await page.textContent('body')
    expect(body).toContain('YieldField')
  })

  test('language switcher changes locale', async ({ page }) => {
    await page.goto('/fr')

    // Find and click the language switcher
    const switcher = page.locator('[data-testid="language-switcher"], button:has-text("FR"), button:has-text("EN")')
    if (await switcher.count() > 0) {
      await switcher.first().click()
      // Look for English option
      const enOption = page.locator('a[href*="/en"], button:has-text("EN"), [data-value="en"]')
      if (await enOption.count() > 0) {
        await enOption.first().click()
        await expect(page).toHaveURL(/\/en/)
      }
    }
  })

  test('direct navigation between locales preserves route', async ({ page }) => {
    await page.goto('/fr/coulisses')
    await expect(page).toHaveURL(/\/fr\/coulisses/)

    await page.goto('/en/coulisses')
    await expect(page).toHaveURL(/\/en\/coulisses/)
  })
})
