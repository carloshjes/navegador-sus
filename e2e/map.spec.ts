import { expect, test } from '@playwright/test'

/*
 * Map e2e. Markers are divIcons (no network), so these assertions don't
 * depend on the external OSM tiles actually loading.
 */

test('map page loads with markers and visible OSM attribution', async ({ page }) => {
  await page.goto('/mapa')

  await expect(
    page.getByRole('heading', { level: 1, name: /Mapa das unidades/ }),
  ).toBeVisible()
  await expect(page.locator('.leaflet-marker-icon').first()).toBeVisible()

  // Attribution is mandatory and must be visible (OSM/ODbL).
  const attribution = page.locator('.leaflet-control-attribution')
  await expect(attribution).toContainText('OpenStreetMap')
  await expect(attribution.getByRole('link', { name: 'OpenStreetMap' })).toHaveAttribute(
    'href',
    /openstreetmap\.org\/copyright/,
  )
})

test('"ver no mapa" focuses the unit and opens its popup', async ({ page }) => {
  await page.goto('/mapa?focus=hospital-de-caridade')

  const popup = page.locator('.leaflet-popup-content')
  await expect(popup).toBeVisible()
  await expect(popup).toContainText('Hospital de Caridade')
  await expect(popup.getByRole('link', { name: /Ver detalhes/ })).toHaveAttribute(
    'href',
    '/unidade/hospital-de-caridade',
  )
})

test('shared coordinates render one counted hub with every unit in its popup', async ({
  page,
}) => {
  await page.goto('/mapa')

  const hubMarker = page.locator('.nav-hub-marker')
  await expect(hubMarker).toHaveCount(1)
  await expect(hubMarker).toHaveAttribute('aria-label', '5 unidades neste endereço')
  await expect(hubMarker.locator('.nav-hub-marker__badge')).toHaveText('5')

  await hubMarker.click()
  const popup = page.locator('.leaflet-popup-content')
  await expect(popup.getByText('No mesmo endereço funcionam:')).toBeVisible()

  const units = [
    ['UBS Centro', '/unidade/ubs-centro-umrs'],
    ['Pronto Atendimento Municipal', '/unidade/pronto-atendimento-umrs'],
    ['Ambulatório de Saúde Mental', '/unidade/ambulatorio-saude-mental'],
    ['Centro de Referência da Mulher', '/unidade/centro-referencia-mulher'],
    ['Ambulatório de Feridas Crônicas', '/unidade/ambulatorio-feridas-cronicas'],
  ] as const
  for (const [name, href] of units) {
    await expect(popup.getByRole('link', { name: new RegExp(name) })).toHaveAttribute(
      'href',
      href,
    )
  }
})

test('?focus opens the containing hub and highlights that unit in the list', async ({
  page,
}) => {
  await page.goto('/mapa?focus=ambulatorio-feridas-cronicas')

  const popup = page.locator('.leaflet-popup-content')
  await expect(popup).toBeVisible()
  const focusedUnit = popup.getByRole('link', { name: /Ambulatório de Feridas Crônicas/ })
  await expect(focusedUnit).toHaveAttribute(
    'href',
    '/unidade/ambulatorio-feridas-cronicas',
  )
  await expect(focusedUnit).toHaveAttribute('aria-current', 'location')
  await expect(focusedUnit.getByText('Em foco no mapa')).toBeVisible()
})

test('EmergencyBar is one tap away on the map route', async ({ page }) => {
  await page.goto('/mapa')
  const nav = page.getByRole('navigation', { name: 'Telefones de emergência' })
  await expect(nav.getByRole('link', { name: /SAMU/ })).toHaveAttribute('href', 'tel:192')
})

test('map container never slides under the emergency bar on mobile', async ({ page }) => {
  // Regression guard for Etapa Visual 3 / A1: the .h-mapframe utility
  // computes height = dvh − header − bar − safe-area, so the Leaflet
  // viewport's bottom edge must stay above the bar's top edge on a phone.
  await page.goto('/mapa')
  await page.locator('.leaflet-container').first().waitFor()
  const overlap = await page.evaluate(() => {
    const frame = document.querySelector('.leaflet-container')!.parentElement!
    const bar = document.querySelector('nav[aria-label="Telefones de emergência"]')!
    return frame.getBoundingClientRect().bottom - bar.getBoundingClientRect().top
  })
  // ≤ 0 means the map ends before the bar starts. A 1px slack covers
  // sub-pixel rounding without admitting any visible overlap.
  expect(overlap).toBeLessThanOrEqual(1)
})

test('the detail page links to the map only for plotted units', async ({ page }) => {
  // SAMU is care but kept off the map (a phone channel): no "ver no mapa".
  await page.goto('/unidade/samu-erechim')
  await expect(page.getByRole('link', { name: /Ver no mapa/ })).toHaveCount(0)

  await page.goto('/unidade/ubs-centro-umrs')
  await expect(page.getByRole('link', { name: /Ver no mapa/ })).toBeVisible()
})
