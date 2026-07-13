import { expect, test } from '@playwright/test'

test('Onde ir? uses one tonal band sequence without weakening emergency', async ({
  page,
}) => {
  await page.goto('/onde-ir')

  const emergency = page.getByTestId('emergency-care-card')
  const bands = page.getByTestId('care-path-bands')

  await expect(
    emergency.getByRole('heading', { name: 'Emergência com risco de vida' }),
  ).toBeVisible()
  await expect(emergency.getByRole('link', { name: /SAMU/ })).toHaveAttribute(
    'href',
    'tel:192',
  )
  await expect(emergency.getByRole('link', { name: /Bombeiros/ })).toHaveAttribute(
    'href',
    'tel:193',
  )

  await expect(bands.locator('section')).toHaveCount(3)
  const styles = await page.evaluate(() => {
    const emergencyCard = document.querySelector<HTMLElement>(
      '[data-testid="emergency-care-card"]',
    )!
    const bandGroup = document.querySelector<HTMLElement>(
      '[data-testid="care-path-bands"]',
    )!
    const bandBackgrounds = Array.from(
      bandGroup.querySelectorAll<HTMLElement>('[data-band-tone]'),
    ).map((band) => getComputedStyle(band).backgroundColor)

    return {
      emergencyBackground: getComputedStyle(emergencyCard).backgroundColor,
      emergencyShadow: getComputedStyle(emergencyCard).boxShadow,
      bandBackgrounds,
    }
  })

  expect(styles.emergencyBackground).toBe('rgb(252, 235, 235)')
  expect(styles.emergencyShadow).not.toBe('none')
  expect(styles.bandBackgrounds).toEqual([
    'rgb(255, 255, 255)',
    'rgb(225, 245, 238)',
    'rgb(251, 250, 247)',
  ])
})

test('unit detail keeps category and source-conflict warnings prominent', async ({
  page,
}) => {
  await page.goto('/unidade/pronto-atendimento-umrs')

  const categoryWarning = page.getByText(
    'Informações em verificação: confirme por telefone antes de ir.',
  )
  const conflictWarning = page.locator('p', { hasText: 'Fontes oficiais divergem' })

  await expect(categoryWarning).toBeVisible()
  await expect(conflictWarning).toBeVisible()

  const readWarningStyle = (warning: typeof categoryWarning) =>
    warning.evaluate((element) => ({
      backgroundColor: getComputedStyle(element).backgroundColor,
      color: getComputedStyle(element).color,
    }))
  const warningStyles = [
    await readWarningStyle(categoryWarning),
    await readWarningStyle(conflictWarning),
  ]

  expect(warningStyles).toEqual([
    { backgroundColor: 'rgb(250, 238, 218)', color: 'rgb(133, 79, 11)' },
    { backgroundColor: 'rgb(250, 238, 218)', color: 'rgb(133, 79, 11)' },
  ])
  await expect(
    page.getByRole('heading', { name: 'Contato e funcionamento' }),
  ).toBeAttached()
  await expect(page.getByRole('link', { name: 'Ver no mapa →' })).toBeVisible()
})
