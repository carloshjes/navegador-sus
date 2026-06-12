import { expect, test } from '@playwright/test'

/*
 * Smoke test: the app loads in a real browser with its non-negotiables —
 * emergency numbers visible (briefing §2) and keyboard skip-link working.
 */

test('home page renders with the real dataset', async ({ page }) => {
  await page.goto('/')

  await expect(
    page.getByRole('heading', { name: /rede pública de saúde de erechim/i }),
  ).toBeVisible()

  // The unit count comes from the JSON: any number proves the pipeline.
  await expect(page.getByText(/\d+ unidades ativas/)).toBeVisible()
})

test('emergency numbers are visible and one tap away', async ({ page }) => {
  await page.goto('/')

  const emergencyNav = page.getByRole('navigation', {
    name: 'Telefones de emergência',
  })
  await expect(emergencyNav).toBeVisible()
  await expect(emergencyNav.getByText('192')).toBeVisible()
  await expect(emergencyNav.getByText('193')).toBeVisible()

  // "One tap away": the numbers are direct tel: links, not buried in menus.
  await expect(emergencyNav.getByRole('link', { name: /SAMU/i })).toHaveAttribute(
    'href',
    'tel:192',
  )
})

test('skip-link is the first tab stop and targets the main content', async ({ page }) => {
  await page.goto('/')

  await page.keyboard.press('Tab')
  const skipLink = page.getByRole('link', { name: 'Pular para o conteúdo' })
  await expect(skipLink).toBeFocused()

  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/#conteudo$/)
  // The target must exist and be the main landmark.
  await expect(page.locator('main#conteudo')).toBeVisible()
})
