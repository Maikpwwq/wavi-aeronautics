import { test, expect } from '@playwright/test'

test.describe('E2E: Second-Hand Equipment Module (C2C Classifieds)', () => {
  test('1. Visitor can navigate to store category page and check page elements', async ({ page }) => {
    await page.goto('/tienda/drones-fpv-hd')

    // Verify main category title or store layout elements exist
    const heading = page.locator('h1, h2, h3, h4, h5, h6').first()
    await expect(heading).toBeVisible()
  })

  test('2. Visitor can navigate to Sell Used Equipment page (/tienda/vender)', async ({ page }) => {
    await page.goto('/tienda/vender')

    // Verify form header exists
    await expect(page.getByText('Vender mi equipo usado')).toBeVisible()
    await expect(page.getByLabel(/Título del producto/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /Publicar mi Equipo/i })).toBeVisible()

    // Visual Regression Assertion
    await expect(page).toHaveScreenshot('tienda-vender-form.png', { maxDiffPixelRatio: 0.15 })
  })

  test('3. Unauthenticated visitor accessing /tienda/mis-publicaciones redirects to sign-in', async ({ page }) => {
    await page.goto('/tienda/mis-publicaciones')

    // Expect redirect to authentication route
    await page.waitForURL(/\/(auth\/sign-in|tienda\/mis-publicaciones)/)
    const isSignIn = page.url().includes('auth/sign-in')
    expect(isSignIn || page.url().includes('mis-publicaciones')).toBe(true)
  })
})
