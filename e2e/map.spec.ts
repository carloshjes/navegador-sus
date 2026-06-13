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

test('EmergencyBar is one tap away on the map route', async ({ page }) => {
  await page.goto('/mapa')
  const nav = page.getByRole('navigation', { name: 'Telefones de emergência' })
  await expect(nav.getByRole('link', { name: /SAMU/ })).toHaveAttribute('href', 'tel:192')
})

test('the detail page links to the map only for plotted units', async ({ page }) => {
  // SAMU is care but kept off the map (a phone channel): no "ver no mapa".
  await page.goto('/unidade/samu-erechim')
  await expect(page.getByRole('link', { name: /Ver no mapa/ })).toHaveCount(0)

  await page.goto('/unidade/ubs-centro-umrs')
  await expect(page.getByRole('link', { name: /Ver no mapa/ })).toBeVisible()
})
