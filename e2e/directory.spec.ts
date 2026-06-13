import { expect, test } from '@playwright/test'

/*
 * Etapa 2 e2e: the full citizen flow through the directory, and the
 * non-negotiables that must hold on every route.
 */

test('citizen flow: search → filter → detail → confidence seal', async ({ page }) => {
  await page.goto('/')

  // Accent-insensitive search: "vacinacao" must find vaccination units.
  await page.getByLabel('Buscar por nome, bairro ou serviço').fill('vacinacao')
  await page.getByLabel('Tipo de unidade').selectOption('ubs')

  // Filter + search state lives in the URL (shareable link).
  await expect(page).toHaveURL(/q=vacinacao/)
  await expect(page).toHaveURL(/tipo=ubs/)

  await page.getByRole('link', { name: 'UBS Capoerê' }).click()

  await expect(page.getByRole('heading', { level: 1, name: 'UBS Capoerê' })).toBeVisible()
  // SPA route change must move focus to the new page title.
  await expect(page.locator('#page-title')).toBeFocused()

  // The honesty mechanism: unverified hours carry the call-ahead seal...
  await expect(page.getByText('horário não confirmado — ligue antes')).toBeVisible()
  // ...and verified fields carry their verification date.
  await expect(page.getByText(/conferido em \d{2}\/\d{2}\/\d{4}/).first()).toBeVisible()
})

test('EmergencyBar is one tap away on every route', async ({ page }) => {
  for (const path of ['/', '/unidade/ubs-centro-umrs', '/onde-ir', '/nao-existe']) {
    await page.goto(path)
    const nav = page.getByRole('navigation', { name: 'Telefones de emergência' })
    await expect(nav.getByRole('link', { name: /SAMU/ })).toBeVisible()
    await expect(nav.getByRole('link', { name: /SAMU/ })).toHaveAttribute(
      'href',
      'tel:192',
    )
  }
})

test('empty search result offers a one-tap reset', async ({ page }) => {
  await page.goto('/?q=xyzzy')
  await expect(page.getByText('Nenhuma unidade encontrada.')).toBeVisible()
  await page.getByRole('button', { name: 'Limpar busca e filtros' }).click()
  await expect(page.getByText(/\d+ resultado/)).toBeVisible()
})

test('hub cross-links: same address, different services', async ({ page }) => {
  await page.goto('/unidade/ubs-centro-umrs')
  await expect(
    page.getByRole('heading', { name: 'No mesmo endereço funcionam:' }),
  ).toBeVisible()

  await page.getByRole('link', { name: 'Pronto Atendimento Municipal (UMRS)' }).click()

  // The PA renders under maximum caution: banner present, no 24h anywhere.
  await expect(
    page.getByText('Informações em verificação: confirme por telefone antes de ir.'),
  ).toBeVisible()
  await expect(page.locator('main')).not.toContainText(/24\s*h/i)
})

test('hidden units are not reachable by deep link', async ({ page }) => {
  for (const slug of ['sami-erechim', 'ambulatorio-covid-19']) {
    await page.goto(`/unidade/${slug}`)
    await expect(
      page.getByRole('heading', { name: 'Página não encontrada' }),
    ).toBeVisible()
  }
})
