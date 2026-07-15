import { expect, test } from '@playwright/test'

test('Onde ir? renders an ordered textual access map without raised cards', async ({
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
  await expect(bands.locator('h2')).toHaveText([
    'Urgência sem risco de vida',
    'Rotina e acompanhamento',
    'Especialidades',
  ])
  await expect(bands).toContainText('Atendimento presencial')
  await expect(bands).toContainText('Porta de entrada')
  await expect(bands).toContainText('Acesso encaminhado')
  await expect(bands).toContainText(
    'O horário de funcionamento não está confirmado — ligue antes de ir.',
  )
  await expect(bands).toContainText('por encaminhamento')
  await expect(
    bands.getByRole('link', { name: 'Ver o Pronto Atendimento' }),
  ).toHaveAttribute('href', '/unidade/pronto-atendimento-umrs')
  await expect(
    bands.getByRole('link', { name: 'Ver as UBS (postos de saúde)' }),
  ).toHaveAttribute('href', '/?tipo=ubs')

  const styles = await page.evaluate(() => {
    const emergencyCard = document.querySelector<HTMLElement>(
      '[data-testid="emergency-care-card"]',
    )!
    const bandGroup = document.querySelector<HTMLElement>(
      '[data-testid="care-path-bands"]',
    )!
    const accessRows = Array.from(
      bandGroup.querySelectorAll<HTMLElement>('[data-access-row]'),
    ).map((row) => {
      const style = getComputedStyle(row)
      return {
        backgroundColor: style.backgroundColor,
        borderBottomWidth: style.borderBottomWidth,
        borderLeftWidth: style.borderLeftWidth,
        borderRightWidth: style.borderRightWidth,
      }
    })
    const phoneActions = Array.from(emergencyCard.querySelectorAll('a')).map((link) => {
      const style = getComputedStyle(link)
      const rect = link.getBoundingClientRect()
      return {
        borderRadius: Number.parseFloat(style.borderRadius),
        borderWidth: style.borderTopWidth,
        height: rect.height,
        width: rect.width,
      }
    })

    return {
      emergencyBackground: getComputedStyle(emergencyCard).backgroundColor,
      emergencyShadow: getComputedStyle(emergencyCard).boxShadow,
      emergencyBorderTop: getComputedStyle(emergencyCard).borderTopWidth,
      accessRows,
      phoneActions,
    }
  })

  expect(styles.emergencyBackground).toBe('rgb(252, 235, 235)')
  expect(styles.emergencyShadow).toBe('none')
  expect(styles.emergencyBorderTop).toBe('0px')
  expect(styles.accessRows).toEqual(
    Array.from({ length: 3 }, () => ({
      backgroundColor: 'rgba(0, 0, 0, 0)',
      borderBottomWidth: '1px',
      borderLeftWidth: '0px',
      borderRightWidth: '0px',
    })),
  )
  expect(
    styles.phoneActions.every(
      (action) =>
        action.borderRadius >= 22 &&
        action.borderWidth === '0px' &&
        action.height >= 44 &&
        action.width < 160,
    ),
  ).toBe(true)

  await expect(
    page.getByText(/em caso de divergência, são eles que valem/i),
  ).toBeVisible()

  await page.setViewportSize({ width: 1024, height: 800 })
  await page.goto('/onde-ir')
  const desktopComposition = await page
    .getByTestId('care-path-bands')
    .evaluate((element) => ({
      columns: Array.from(element.querySelectorAll('section')).map(
        (section) => getComputedStyle(section).gridTemplateColumns,
      ),
      noHorizontalOverflow:
        document.documentElement.scrollWidth <= document.documentElement.clientWidth,
    }))
  expect(desktopComposition.columns.every((columns) => columns.startsWith('180px'))).toBe(
    true,
  )
  expect(desktopComposition.noHorizontalOverflow).toBe(true)
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
