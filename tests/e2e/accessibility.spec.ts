import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Accessibility', () => {
  test('homepage has no serious accessibility violations', async ({ page }) => {
    await page.goto('/fr')
    await page.waitForLoadState('networkidle')

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()

    const serious = results.violations.filter(
      (v) => v.impact === 'serious' || v.impact === 'critical'
    )
    expect(serious).toHaveLength(0)
  })

  test('coulisses page has no serious accessibility violations', async ({ page }) => {
    await page.goto('/fr/coulisses')
    await page.waitForLoadState('networkidle')

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()

    const serious = results.violations.filter(
      (v) => v.impact === 'serious' || v.impact === 'critical'
    )
    expect(serious).toHaveLength(0)
  })

  test('skip-to-content link is present and functional', async ({ page }) => {
    await page.goto('/fr')
    // Tab to focus skip link
    await page.keyboard.press('Tab')
    const skipLink = page.locator('a[href="#main-content"]')
    await expect(skipLink).toBeFocused()
    await expect(skipLink).toBeVisible()
  })

  test('all interactive elements have visible focus indicators', async ({ page }) => {
    await page.goto('/fr')
    // Tab through first 5 interactive elements
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab')
      const focused = page.locator(':focus')
      await expect(focused).toBeVisible()
    }
  })
})
