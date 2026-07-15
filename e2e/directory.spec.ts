import { expect, test } from '@playwright/test'

/*
 * Etapa 2 e2e: the full citizen flow through the directory, and the
 * non-negotiables that must hold on every route.
 */

test('citizen flow: search → filter → detail → confidence seal', async ({ page }) => {
  await page.goto('/')

  // Accent-insensitive search: "vacinacao" must find vaccination units.
  await page.getByLabel('Buscar por nome, bairro ou serviço').fill('vacinacao')
  const typeGroup = page.getByRole('group', { name: 'Tipo de unidade' })
  await typeGroup.getByRole('button', { name: /Tipo de unidade/ }).click()
  // A native radio now writes the same shareable URL parameter.
  const ubsOption = typeGroup.getByRole('radio', {
    name: 'UBS (posto de saúde)',
    exact: true,
  })
  await ubsOption.click()

  // Filter + search state lives in the URL (shareable link).
  await expect(page).toHaveURL(/q=vacinacao/)
  await expect(page).toHaveURL(/tipo=ubs/)
  await expect(ubsOption).toBeChecked()
  const selectedStyle = await ubsOption.evaluate((radio) => {
    const row = radio.closest('label')!
    const style = getComputedStyle(row)
    return {
      backgroundColor: style.backgroundColor,
      borderLeftWidth: style.borderLeftWidth,
      boxShadow: style.boxShadow,
      fontWeight: style.fontWeight,
    }
  })
  expect(selectedStyle).toEqual({
    backgroundColor: 'rgba(0, 0, 0, 0)',
    borderLeftWidth: '0px',
    boxShadow: 'none',
    fontWeight: '600',
  })

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
    await expect(nav.getByRole('link', { name: /Bombeiros/ })).toBeVisible()
    await expect(nav.getByRole('link', { name: /SAMU/ })).toHaveAttribute(
      'href',
      'tel:192',
    )
    await expect(nav.getByRole('link', { name: /Bombeiros/ })).toHaveAttribute(
      'href',
      'tel:193',
    )
  }
})

test('empty state appears when filters zero results, clears one tap (V4 / B2)', async ({
  page,
}) => {
  await page.goto('/?q=xyzzy')
  await expect(
    page.getByRole('heading', { name: 'Nenhuma unidade combina com os filtros' }),
  ).toBeVisible()
  // The clear-filters button on the empty state resets to the full list.
  await page.getByRole('button', { name: 'Limpar filtros' }).click()
  await expect(page.getByText(/\d+ unidades/)).toBeVisible()
})

test('filters bar shows count + Limpar filtros only when active (V4 / B1)', async ({
  page,
}) => {
  // With no filters, the count row exists but no clear-filters button.
  await page.goto('/')
  await expect(page.getByText(/\d+ unidades/).first()).toBeVisible()
  await expect(page.getByRole('button', { name: 'Limpar filtros' })).toHaveCount(0)

  // Choose a radio — "Limpar filtros" appears.
  const typeGroup = page.getByRole('group', { name: 'Tipo de unidade' })
  await typeGroup.getByRole('button', { name: /Tipo de unidade/ }).click()
  const ubsOption = typeGroup.getByRole('radio', {
    name: 'UBS (posto de saúde)',
    exact: true,
  })
  await ubsOption.click()
  await expect(page).toHaveURL(/tipo=ubs/)
  await expect(ubsOption).toBeChecked()
  await expect(page.getByRole('button', { name: 'Limpar filtros' })).toBeVisible()

  // Clearing returns to the bare directory and removes the button.
  await page.getByRole('button', { name: 'Limpar filtros' }).click()
  await expect(page).not.toHaveURL(/tipo=/)
  await expect(page.getByRole('button', { name: 'Limpar filtros' })).toHaveCount(0)
})

test('CategoryTag is its content width, not full card width (V4 / A1)', async ({
  page,
}) => {
  await page.goto('/')
  await page.locator('[data-testid="category-tag"]').first().waitFor()
  const result = await page.evaluate(() => {
    const tag = document.querySelector<HTMLElement>('[data-testid="category-tag"]')!
    const tagRect = tag.getBoundingClientRect()
    // The flex column ancestor (the Card) is the width benchmark.
    const card = tag.closest<HTMLElement>('div.flex.flex-col')!
    const cardRect = card.getBoundingClientRect()
    const cs = getComputedStyle(tag)
    return {
      tagWidth: tagRect.width,
      cardWidth: cardRect.width,
      alignSelf: cs.alignSelf,
      classList: [...tag.classList],
    }
  })
  // The author class set must include `inline-flex` and `self-start`. Both
  // are required (defense in depth — see docs/kit §9.1). Note: computed
  // `display` is `flex`, not `inline-flex`, because CSS blockifies any
  // `inline-*` flex/grid item to its block equivalent. The CLASS is what
  // protects future refactors, so that's what we assert here.
  expect(result.classList).toContain('inline-flex')
  expect(result.classList).toContain('self-start')
  expect(result.alignSelf).toBe('flex-start')
  // The rendered width stays close to content; the card width is at least
  // 3× the tag width even on a 375px mobile column.
  expect(result.tagWidth * 3).toBeLessThan(result.cardWidth)
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

test('directory cards in a row reach equal heights (no grid holes)', async ({ page }) => {
  // Etapa Visual 3 / A2: cards are flex columns with mt-auto on the status
  // block; the grid stretches them so heights match. Use a desktop-sized
  // viewport so the sm:grid-cols-2 rule kicks in.
  await page.setViewportSize({ width: 1024, height: 800 })
  await page.goto('/')
  const cards = page.locator('section[aria-labelledby="titulo-atendimento"] > ul > li')
  const heights = await cards.evaluateAll((els) =>
    els
      .slice(0, 4)
      .map((el) => Math.round((el as HTMLElement).getBoundingClientRect().height)),
  )
  // Pair (0,1) and (2,3) sit on the same row — heights inside each pair
  // must match (allow 1px sub-pixel slack).
  expect(Math.abs(heights[0] - heights[1])).toBeLessThanOrEqual(1)
  expect(Math.abs(heights[2] - heights[3])).toBeLessThanOrEqual(1)
})

test('unit records stay flat at rest and hover without losing content', async ({
  page,
}) => {
  await page.goto('/')
  const card = page.getByTestId('unit-card').filter({
    has: page.getByRole('link', { name: 'UBS Capoerê' }),
  })
  await expect(card).toHaveCount(1)
  await expect(card.getByTestId('category-tag')).toBeVisible()
  await expect(card.getByText('horário não confirmado — ligue antes')).toBeVisible()

  const readGeometry = () =>
    card.evaluate((element) => {
      const rect = element.getBoundingClientRect()
      const style = getComputedStyle(element)
      return {
        x: rect.x,
        documentY: rect.y + window.scrollY,
        width: rect.width,
        height: rect.height,
        boxShadow: style.boxShadow,
        backgroundColor: style.backgroundColor,
        borderColor: style.borderTopColor,
        borderRadius: style.borderRadius,
        filter: style.filter,
        transform: style.transform,
      }
    })

  const before = await readGeometry()
  await card.hover()
  const after = await readGeometry()
  expect(before.boxShadow).toBe('none')
  expect(after.boxShadow).toBe('none')
  expect(before.backgroundColor).toBe('rgb(255, 255, 255)')
  expect(after.backgroundColor).toBe('rgb(255, 255, 255)')
  expect(before.borderColor).toBe('rgb(238, 233, 223)')
  expect(after.borderColor).toBe('rgb(238, 233, 223)')
  expect(before.borderRadius).toBe('10px')
  expect(after.borderRadius).toBe('10px')
  expect(before.filter).toBe('none')
  expect(after.filter).toBe('none')
  expect(before.transform).toBe('none')
  expect(after.transform).toBe('none')
  expect(after).toMatchObject({
    x: before.x,
    documentY: before.documentY,
    width: before.width,
    height: before.height,
  })
})

test('mobile filters expand inline with stable focus and no horizontal overflow', async ({
  page,
}) => {
  for (const viewport of [
    { width: 320, height: 568 },
    { width: 360, height: 800 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport)
    await page.goto('/')

    const group = page.getByRole('group', { name: 'Tipo de unidade' })
    const groupToggle = group.getByRole('button', { name: /Tipo de unidade/ })
    await expect(groupToggle).toHaveAttribute('aria-expanded', 'false')
    await groupToggle.click()
    await expect(groupToggle).toHaveAttribute('aria-expanded', 'true')

    const more = group.getByRole('button', { name: 'Ver mais tipos' })
    await expect(more).toHaveAttribute('aria-expanded', 'false')
    await more.click()
    const less = group.getByRole('button', { name: 'Ver menos tipos' })
    await expect(less).toHaveAttribute('aria-expanded', 'true')

    const selected = group.getByRole('radio', { name: 'Vigilância em saúde' })
    await selected.click()
    await expect(selected).toBeChecked()
    await expect(page).toHaveURL(/tipo=surveillance/)

    await less.click()
    const moreAgain = group.getByRole('button', { name: 'Ver mais tipos' })
    await expect(moreAgain).toBeFocused()
    await expect(selected).toBeVisible()
    await expect(selected).toBeChecked()

    await groupToggle.click()
    await expect(groupToggle).toBeFocused()
    await expect(groupToggle).toHaveAttribute('aria-expanded', 'false')
    await expect(groupToggle).toContainText('Selecionado: Vigilância em saúde')
    await expect(page.locator('dialog')).toHaveCount(0)

    const noOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
    )
    expect(noOverflow).toBe(true)
  }

  await page.setViewportSize({ width: 1024, height: 800 })
  await page.goto('/')
  const desktopGroup = page.getByRole('group', { name: 'Tipo de unidade' })
  await expect(
    desktopGroup.getByRole('radio', { name: 'UBS (posto de saúde)' }),
  ).toBeVisible()
  await expect(desktopGroup.getByRole('button', { name: 'Ver mais tipos' })).toBeVisible()
  await expect(page.locator('dialog')).toHaveCount(0)
})

test('hidden units are not reachable by deep link', async ({ page }) => {
  for (const slug of ['sami-erechim', 'ambulatorio-covid-19']) {
    await page.goto(`/unidade/${slug}`)
    await expect(
      page.getByRole('heading', { name: 'Página não encontrada' }),
    ).toBeVisible()
  }
})
