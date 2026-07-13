import { expect, test } from '@playwright/test'

/*
 * Etapa Visual 7 — QuickLocateBand states. Playwright runs every case in
 * both configured mobile projects: Pixel 7 and iPhone 13.
 */

test('idle: full-width action stays compact and keeps search in view', async ({
  page,
}) => {
  await page.goto('/')

  const band = page.getByTestId('quick-locate-band')
  await expect(band.getByText('Ver as unidades mais próximas')).toBeVisible()
  await expect(
    band.getByText('Localização usada só neste aparelho, nunca enviada a um servidor.'),
  ).toBeVisible()
  await expect(
    band.getByRole('button', { name: 'Ver as mais próximas de mim' }),
  ).toBeVisible()
  await expect(band.getByTestId('quick-locate-preview')).toHaveCount(0)

  // The promoted action is outside the sidebar and compact enough that the
  // search field remains visible in the initial mobile viewport.
  await expect(
    page.getByTestId('filters-sidebar').getByTestId('quick-locate-band'),
  ).toHaveCount(0)
  await expect(page.locator('#busca')).toBeInViewport()
})

test('granted: previews the nearest real card and links to the sorted grid', async ({
  page,
}) => {
  // A point next to UBS Presidente Vargas.
  await page.addInitScript(() => {
    navigator.geolocation.getCurrentPosition = (success) =>
      success({
        coords: { latitude: -27.646, longitude: -52.298 },
      } as GeolocationPosition)
  })
  await page.goto('/')

  await page.getByRole('button', { name: 'Ver as mais próximas de mim' }).click()

  const band = page.getByTestId('quick-locate-band')
  const preview = band.getByTestId('quick-locate-preview')
  await expect(preview).toHaveAttribute('aria-live', 'polite')
  await expect(preview.getByRole('heading')).toContainText('Presidente Vargas')
  await expect(preview.getByText(/em linha reta/)).toBeVisible()

  // The fixed honesty caveat must appear; the "this IS your unit" claim
  // must not surface in the granted-geolocation panel. The hero copy
  // "Encontre a sua unidade da rede pública" is a discovery framing
  // outside that panel — the rule (CLAUDE.md, briefing §3) bites here,
  // where a result is being shown to the user.
  const grantedPanel = page.locator('section[aria-label="Ordenar pelas mais próximas"]')
  await expect(
    grantedPanel.getByText(/pode .*não ser.* a que atende o seu endereço/),
  ).toBeVisible()
  await expect(grantedPanel).not.toContainText('sua unidade')
  // Cards must never tag any unit as "sua unidade" / "sua UBS".
  const cardsList = page.locator('section[aria-labelledby="titulo-atendimento"] > ul')
  await expect(cardsList).not.toContainText(/sua\s+(unidade|UBS)/i)

  // Nearest-first: the first care card is Presidente Vargas, with a distance.
  const firstCard = page
    .locator('section[aria-labelledby="titulo-atendimento"] li')
    .first()
  await expect(firstCard.getByRole('heading')).toContainText('Presidente Vargas')
  await expect(firstCard.getByText(/em linha reta/)).toBeVisible()

  await band.getByRole('link', { name: 'Ver todas ordenadas por distância' }).click()
  await expect(page).toHaveURL(/#directory-results-grid$/)
  await expect(page.locator('#directory-results-grid')).toBeInViewport()
})

test('denied: falls back to the neighborhood filter, no nagging', async ({ page }) => {
  await page.addInitScript(() => {
    navigator.geolocation.getCurrentPosition = (_success, error) =>
      error?.({ code: 1, PERMISSION_DENIED: 1 } as GeolocationPositionError)
  })
  await page.goto('/')

  await page.getByRole('button', { name: 'Ver as mais próximas de mim' }).click()

  const band = page.getByTestId('quick-locate-band')
  await expect(band.getByText(/filtrar por bairro/)).toBeVisible()
  await expect(
    band.getByRole('button', { name: 'Ver as mais próximas de mim' }),
  ).toBeVisible()
  // Graceful: the neighborhood chip group is still right there.
  await expect(page.getByRole('group', { name: 'Bairro' })).toBeVisible()
})
