import { expect, test } from '@playwright/test'

/*
 * Etapa Visual 7 — QuickLocateBand states. Playwright runs every case in
 * both configured mobile projects: Pixel 7 and iPhone 13.
 */

test('idle: compact action follows its label and keeps search in view', async ({
  page,
}) => {
  await page.goto('/')

  const band = page.getByTestId('quick-locate-band')
  await expect(band.getByText('Ver as unidades mais próximas')).toBeVisible()
  await expect(
    band.getByText('Localização usada só neste aparelho, nunca enviada a um servidor.'),
  ).toBeVisible()
  const locateButton = band.getByRole('button', { name: 'Ver as mais próximas de mim' })
  await expect(locateButton).toBeVisible()
  await expect(band.getByTestId('quick-locate-preview')).toHaveCount(0)

  const geometry = await Promise.all([locateButton.boundingBox(), band.boundingBox()])
  expect(geometry[0]).not.toBeNull()
  expect(geometry[1]).not.toBeNull()
  expect(geometry[0]!.height).toBeGreaterThanOrEqual(44)
  expect(geometry[0]!.width).toBeLessThan(geometry[1]!.width * 0.6)

  const visualContract = await band.evaluate((element) => {
    const bandStyle = getComputedStyle(element)
    const button = element.querySelector('button')!
    const buttonStyle = getComputedStyle(button)
    const icon = button.querySelector('svg')!
    return {
      band: {
        backgroundColor: bandStyle.backgroundColor,
        borderTopWidth: bandStyle.borderTopWidth,
        borderBottomWidth: bandStyle.borderBottomWidth,
        borderLeftWidth: bandStyle.borderLeftWidth,
        borderRightWidth: bandStyle.borderRightWidth,
        borderRadius: bandStyle.borderRadius,
        boxShadow: bandStyle.boxShadow,
      },
      button: {
        backgroundColor: buttonStyle.backgroundColor,
        borderColor: buttonStyle.borderTopColor,
        borderWidth: buttonStyle.borderTopWidth,
        borderRadius: buttonStyle.borderRadius,
        fontWeight: buttonStyle.fontWeight,
        paddingLeft: buttonStyle.paddingLeft,
        iconWidth: icon.getBoundingClientRect().width,
      },
    }
  })
  expect(visualContract).toEqual({
    band: {
      backgroundColor: 'rgba(0, 0, 0, 0)',
      borderTopWidth: '1px',
      borderBottomWidth: '1px',
      borderLeftWidth: '0px',
      borderRightWidth: '0px',
      borderRadius: '0px',
      boxShadow: 'none',
    },
    button: {
      backgroundColor: 'rgb(14, 94, 76)',
      borderColor: 'rgb(10, 74, 59)',
      borderWidth: '1px',
      borderRadius: '10px',
      fontWeight: '600',
      paddingLeft: '20px',
      iconWidth: 18,
    },
  })

  // The promoted action is outside the sidebar and compact enough that the
  // search field remains visible in the initial mobile viewport.
  await expect(
    page.getByTestId('filters-sidebar').getByTestId('quick-locate-band'),
  ).toHaveCount(0)
  await expect(page.locator('#busca')).toBeInViewport()
})

test('prompting: compact action stays disabled while geolocation is pending', async ({
  page,
}) => {
  await page.addInitScript(() => {
    navigator.geolocation.getCurrentPosition = () => undefined
  })
  await page.goto('/')

  const band = page.getByTestId('quick-locate-band')
  const locateButton = band.getByRole('button', { name: 'Ver as mais próximas de mim' })
  await locateButton.click()
  await expect(locateButton).toBeDisabled()
  await expect(locateButton).toHaveText(/Obtendo localização/)

  const [buttonBox, bandBox] = await Promise.all([
    locateButton.boundingBox(),
    band.boundingBox(),
  ])
  expect(buttonBox).not.toBeNull()
  expect(bandBox).not.toBeNull()
  expect(buttonBox!.height).toBeGreaterThanOrEqual(44)
  expect(buttonBox!.width).toBeLessThan(bandBox!.width * 0.8)
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
  // Graceful: the neighborhood consultation group is still in the flow.
  await expect(page.getByRole('group', { name: 'Bairro' })).toBeVisible()
})
