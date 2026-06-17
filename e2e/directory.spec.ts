import { expect, test } from '@playwright/test'

/*
 * Etapa 2 e2e: the full citizen flow through the directory, and the
 * non-negotiables that must hold on every route.
 */

test('citizen flow: search → filter → detail → confidence seal', async ({ page }) => {
  await page.goto('/')

  // Accent-insensitive search: "vacinacao" must find vaccination units.
  await page.getByLabel('Buscar por nome, bairro ou serviço').fill('vacinacao')
  // Type filter is now a chip group (kit §5); clicking sets the same URL param.
  await page.getByRole('button', { name: 'UBS', exact: true }).click()

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

  // Click any chip — "Limpar filtros" appears.
  await page.getByRole('button', { name: 'UBS', exact: true }).click()
  await expect(page).toHaveURL(/tipo=ubs/)
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

test('mobile: Mais opens a bottom-sheet; desktop: inline (V4 / B4)', async ({ page }) => {
  // ---- Mobile: bottom sheet opens via <dialog open> ----
  await page.setViewportSize({ width: 390, height: 844 })
  // Reduced motion makes the entry instant (our CSS zeroes the transition),
  // so we measure the RESTING position deterministically — no flakiness from
  // sampling mid-slide. The resting invariant ("ends on screen") holds for the
  // animated path too, since both settle at the same place.
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  // The Tipo group has 8 priority chips + the rest behind "Mais tipos".
  await page.getByRole('button', { name: 'Mais tipos' }).first().click()
  const sheet = page.locator('dialog.bottom-sheet[open]').first()
  await expect(sheet).toBeVisible()
  // Regression guard (audit #3): the panel must be ON SCREEN, not merely
  // present. The old @keyframes entry froze at translateY(100%) and pushed
  // the sheet entirely below the viewport (only the dark ::backdrop showed —
  // the "green screen"); toBeVisible() did not catch it. Assert the panel is
  // anchored to the bottom edge and its body sits within the 844px viewport.
  const box = await sheet.boundingBox()
  expect(box).not.toBeNull()
  expect(box!.y).toBeGreaterThanOrEqual(0)
  expect(box!.y + box!.height / 2).toBeLessThan(844) // center is on screen
  expect(box!.y + box!.height).toBeGreaterThan(844 - 4) // bottom pinned to edge
  // Close button restores focus to the trigger.
  await sheet.getByRole('button', { name: 'Fechar' }).click()
  await expect(page.locator('dialog.bottom-sheet[open]')).toHaveCount(0)

  // ---- Desktop: inline expand, no <dialog open> ever ----
  await page.setViewportSize({ width: 1024, height: 800 })
  await page.goto('/')
  await page.getByRole('button', { name: 'Mais tipos' }).first().click()
  // On desktop, the chevron rotates and the rest of the chips appear in line.
  await expect(page.locator('dialog.bottom-sheet[open]')).toHaveCount(0)
  // The collapse button now reads "Menos".
  await expect(page.getByRole('button', { name: /^Menos/ })).toBeVisible()
})

test('hidden units are not reachable by deep link', async ({ page }) => {
  for (const slug of ['sami-erechim', 'ambulatorio-covid-19']) {
    await page.goto(`/unidade/${slug}`)
    await expect(
      page.getByRole('heading', { name: 'Página não encontrada' }),
    ).toBeVisible()
  }
})
