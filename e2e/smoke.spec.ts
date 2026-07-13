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

test('tonal header keeps the brand and navigation states legible', async ({ page }) => {
  await page.goto('/')

  const header = page.locator('header.app-header')
  const guideNav = page.getByRole('navigation', { name: 'Seções do guia' })
  const activeLink = guideNav.getByRole('link', { name: 'Início' })
  const inactiveLink = guideNav.getByRole('link', { name: 'Mapa' })

  const colors = await header.evaluate((element) => {
    const pin = element.querySelector('svg path')!
    const wordmark = element.querySelector('.font-display')!
    const active = element.querySelector('a[aria-current="page"]')!
    return {
      backgroundImage: getComputedStyle(element).backgroundImage,
      pinFill: getComputedStyle(pin).fill,
      wordmark: getComputedStyle(wordmark).color,
      activeText: getComputedStyle(active).color,
      activeBorder: getComputedStyle(active).borderBottomColor,
    }
  })

  expect(colors.backgroundImage).toContain('linear-gradient')
  expect(colors.backgroundImage).toContain('rgb(14, 94, 76)')
  expect(colors.backgroundImage).toContain('rgb(10, 74, 59)')
  expect(colors.pinFill).toBe('rgb(216, 96, 47)')
  expect(colors.wordmark).toBe('rgb(255, 255, 255)')
  expect(colors.activeText).toBe('rgb(255, 255, 255)')
  expect(colors.activeBorder).toBe('rgb(216, 96, 47)')

  // Both configured projects emulate touch devices and correctly expose
  // `hover: none`, so Tailwind does not activate hover variants there. Keep
  // the desktop hover contract explicit without faking pointer capability.
  await expect(inactiveLink).toHaveClass(/hover:border-white/)

  await inactiveLink.focus()
  await expect(inactiveLink).toHaveCSS('outline-color', 'rgb(255, 255, 255)')
  await expect(activeLink).toHaveAttribute('aria-current', 'page')
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

test('SAMU 192 has no text-decoration underline on hover (Etapa Visual 4 / A2)', async ({
  page,
}) => {
  await page.goto('/')
  const link = page
    .getByRole('navigation', { name: 'Telefones de emergência' })
    .getByRole('link', { name: /SAMU/i })
  await link.hover()
  // Both the parent <a> and the inner pill <span> must NOT have a default
  // underline in any state — the entire bar reads as a stable surface.
  const decorations = await page.evaluate(() => {
    const a = document.querySelector('nav[aria-label="Telefones de emergência"] a')!
    const pill = a.querySelector('span:last-child')!
    return {
      a: getComputedStyle(a).textDecorationLine,
      pill: getComputedStyle(pill).textDecorationLine,
    }
  })
  expect(decorations.a).toBe('none')
  expect(decorations.pill).toBe('none')
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
  await expect(skipLink).toBeVisible()
  await expect(skipLink).toHaveCSS('background-color', 'rgb(255, 255, 255)')
  await expect(skipLink).toHaveCSS('color', 'rgb(14, 94, 76)')
  await expect(skipLink).toHaveCSS('outline-color', 'rgb(14, 94, 76)')

  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/#conteudo$/)
  // The target must exist and be the main landmark.
  await expect(page.locator('main#conteudo')).toBeVisible()
})
