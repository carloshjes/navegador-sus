import { expect, test } from '@playwright/test'

/*
 * "Perto de mim" — geolocation mocked at the browser API level
 * (addInitScript runs before the app boots), exercising both outcomes.
 */

test('granted: sorts care units by distance with the honesty caveat', async ({
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

  // The fixed honesty caveat must appear; the label "sua unidade" must not.
  await expect(
    page.getByText(/pode .*não ser.* a que atende o seu endereço/),
  ).toBeVisible()
  await expect(page.locator('body')).not.toContainText('sua unidade')

  // Nearest-first: the first care card is Presidente Vargas, with a distance.
  const firstCard = page
    .locator('section[aria-labelledby="titulo-atendimento"] li')
    .first()
  await expect(firstCard.getByRole('heading')).toContainText('Presidente Vargas')
  await expect(firstCard.getByText(/em linha reta/)).toBeVisible()
})

test('denied: falls back to the neighborhood filter, no nagging', async ({ page }) => {
  await page.addInitScript(() => {
    navigator.geolocation.getCurrentPosition = (_success, error) =>
      error?.({ code: 1, PERMISSION_DENIED: 1 } as GeolocationPositionError)
  })
  await page.goto('/')

  await page.getByRole('button', { name: 'Ver as mais próximas de mim' }).click()

  await expect(page.getByText(/filtrar por bairro/)).toBeVisible()
  // Graceful: the neighborhood chip group is still right there.
  await expect(page.getByRole('group', { name: 'Bairro' })).toBeVisible()
})
