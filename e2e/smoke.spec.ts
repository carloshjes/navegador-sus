import { expect, test } from '@playwright/test'

/*
 * Smoke test: the app loads in a real browser with its non-negotiables —
 * emergency numbers visible (briefing §2) and keyboard skip-link working.
 */

test('home page renders with the real dataset', async ({ page }) => {
  await page.goto('/')

  // Etapa Visual 3 / C1: hero is "Encontre a sua unidade da rede pública."
  await expect(
    page.getByRole('heading', { name: /encontre a sua unidade da rede pública/i }),
  ).toBeVisible()

  // The unit count comes from the JSON: any number proves the pipeline.
  await expect(page.getByText(/\d+ unidades ativas/)).toBeVisible()
})

test('SAMU is visible and one tap away on the emergency bar', async ({ page }) => {
  await page.goto('/')

  const emergencyNav = page.getByRole('navigation', {
    name: 'Telefones de emergência',
  })
  await expect(emergencyNav).toBeVisible()
  // The bar now carries SAMU 192 only (Etapa Visual 2 / B3); the 193 lives
  // inside "Onde ir?" — covered by the next test.
  await expect(emergencyNav.getByText('SAMU 192')).toBeVisible()

  // "One tap away": the number is a direct tel: link, not buried in menus.
  await expect(emergencyNav.getByRole('link', { name: /SAMU/i })).toHaveAttribute(
    'href',
    'tel:192',
  )
})

test('Bombeiros 193 is reachable from the "Onde ir?" page', async ({ page }) => {
  await page.goto('/onde-ir')
  const link = page.getByRole('link', { name: /Bombeiros/i })
  await expect(link).toBeVisible()
  await expect(link).toHaveAttribute('href', 'tel:193')
})

test('skip-link is the first tab stop and targets the main content', async ({
  page,
  browserName,
}) => {
  // WebKit excludes links from the default Tab order (Safari's "Full
  // Keyboard Access" is off by default); Chromium includes them. The
  // skip-link itself reaches the content equally on both — we assert the
  // keyboard-only contract on Chromium, since on iPhone 13 the very first
  // Tab does nothing for a link target.
  test.skip(browserName === 'webkit', 'Safari excludes links from default Tab order')
  await page.goto('/')

  await page.keyboard.press('Tab')
  const skipLink = page.getByRole('link', { name: 'Pular para o conteúdo' })
  await expect(skipLink).toBeFocused()

  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/#conteudo$/)
  // The target must exist and be the main landmark.
  await expect(page.locator('main#conteudo')).toBeVisible()
})
