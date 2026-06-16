import { expect, test } from '@playwright/test'

/*
 * Etapa Visual 5 e2e: covers the four spec items that exercise the
 * directory's new shape:
 *  - A: 2-column layout on lg: vs mobile stack
 *  - B: removable active-filter pills in the FiltersBar
 *  - E: FiltersBar sticks to the top of the scroll on mobile
 *  - D: confidence seals carry the right inline icon (or none)
 *
 * Playwright is set up with mobile projects only (Pixel 7 + iPhone 13).
 * Desktop checks switch the viewport at the top of the test — same as
 * the existing V4 specs.
 */

const DESKTOP = { width: 1280, height: 800 }
const MOBILE = { width: 390, height: 844 }

/* ----------------------------------------------------------------- A */

test('directory: lg: sidebar with search; mobile: stacked', async ({ page }) => {
  // Desktop: search input lives inside the sidebar, and the first card
  // sits to its right (the 2-column grid kicked in).
  await page.setViewportSize(DESKTOP)
  await page.goto('/')
  const sidebar = page.locator('[data-testid="filters-sidebar"]')
  await expect(sidebar).toBeVisible()
  // The search input is INSIDE the sidebar on desktop.
  await expect(sidebar.locator('#busca')).toBeVisible()

  const inputBox = await page.locator('#busca').boundingBox()
  const cardBox = await page
    .locator('section[aria-labelledby="titulo-atendimento"] > ul > li')
    .first()
    .boundingBox()
  expect(inputBox && cardBox).toBeTruthy()
  // The first card is geometrically to the right of the input (its left
  // edge sits past the input's right edge).
  expect(cardBox!.x).toBeGreaterThan(inputBox!.x + inputBox!.width)

  // Mobile: the input is ABOVE the first card (vertical stack), same
  // structural layout as V4.
  await page.setViewportSize(MOBILE)
  await page.goto('/')
  const inputBoxM = await page.locator('#busca').boundingBox()
  const cardBoxM = await page
    .locator('section[aria-labelledby="titulo-atendimento"] > ul > li')
    .first()
    .boundingBox()
  expect(inputBoxM && cardBoxM).toBeTruthy()
  expect(cardBoxM!.y).toBeGreaterThan(inputBoxM!.y + inputBoxM!.height)
})

/* ----------------------------------------------------------------- B */

test('FiltersBar: clicking ✕ on a chip removes that filter only (V5 / B)', async ({
  page,
}) => {
  await page.setViewportSize(MOBILE)
  await page.goto('/')

  // Apply two filters: Tipo=UBS, Bairro=Centro.
  await page.getByRole('button', { name: 'UBS', exact: true }).click()
  await page.getByRole('button', { name: 'Centro', exact: true }).click()

  // The FiltersBar now exposes one remove button per active filter.
  const removeTipo = page.getByRole('button', { name: /Remover filtro: Tipo/i })
  const removeBairro = page.getByRole('button', { name: /Remover filtro: Bairro/i })
  await expect(removeTipo).toBeVisible()
  await expect(removeBairro).toBeVisible()

  // Removing Tipo drops only the tipo param and the UBS chip's pressed state.
  await removeTipo.click()
  await expect(page).not.toHaveURL(/tipo=ubs/)
  await expect(page).toHaveURL(/bairro=Centro/)
  await expect(page.getByRole('button', { name: 'UBS', exact: true })).toHaveAttribute(
    'aria-pressed',
    'false',
  )
  await expect(removeTipo).toHaveCount(0)
  await expect(removeBairro).toBeVisible()

  // Removing Bairro clears the URL completely.
  await removeBairro.click()
  await expect(page).not.toHaveURL(/bairro=/)
  await expect(page.getByRole('button', { name: /Remover filtro:/i })).toHaveCount(0)
})

test('search input: clear ✕ appears only when there is text (V5 / C+B)', async ({
  page,
}) => {
  await page.setViewportSize(MOBILE)
  await page.goto('/')

  // Empty state: no clear button.
  await expect(page.getByRole('button', { name: 'Limpar busca' })).toHaveCount(0)

  await page.getByLabel('Buscar por nome, bairro ou serviço').fill('vacina')

  // After typing, the per-input clear button appears AND a "Busca:" chip
  // shows up in the FiltersBar with its own remove button.
  const clearSearch = page.getByRole('button', { name: 'Limpar busca' })
  await expect(clearSearch).toBeVisible()
  await expect(page.getByRole('button', { name: /Remover filtro: Busca/i })).toBeVisible()

  await clearSearch.click()
  await expect(page.locator('#busca')).toHaveValue('')
  await expect(clearSearch).toHaveCount(0)
})

/* ----------------------------------------------------------------- E */

test('FiltersBar: sticks at top on mobile scroll; not on desktop (V5 / E)', async ({
  page,
}) => {
  // Mobile: confirm `position: sticky` is in effect, then scroll FAR past
  // the bar's natural offsetTop (so much that, if not sticky, the bar would
  // be well above the viewport). With sticky engaged, the bar's top edge
  // pins at y ≈ 0; without it, y would be a large negative number.
  await page.setViewportSize(MOBILE)
  await page.goto('/')
  const bar = page.locator('section[aria-label="Resultados"] > div').first()
  const mobilePos = await bar.evaluate((el) => getComputedStyle(el).position)
  expect(mobilePos).toBe('sticky')

  // Scroll way past the bar's natural position. evaluate returns the
  // pre-scroll offsetTop of the bar (relative to document); scrolling to
  // that + 500 guarantees we're past it.
  const offsetTop = await bar.evaluate((el) => el.getBoundingClientRect().top + window.scrollY)
  await page.evaluate((target) => window.scrollTo(0, target), offsetTop + 500)
  const yMobile = await bar.evaluate((el) => el.getBoundingClientRect().y)
  expect(yMobile).toBeGreaterThanOrEqual(0)
  expect(yMobile).toBeLessThanOrEqual(2)

  // Desktop (≥ lg): `lg:static` overrides — computed position is `static`,
  // so the bar scrolls with the page (y is negative once we scroll past it).
  await page.setViewportSize(DESKTOP)
  await page.goto('/')
  const barD = page.locator('section[aria-label="Resultados"] > div').first()
  const desktopPos = await barD.evaluate((el) => getComputedStyle(el).position)
  expect(desktopPos).toBe('static')
  const offsetTopD = await barD.evaluate(
    (el) => el.getBoundingClientRect().top + window.scrollY,
  )
  await page.evaluate((target) => window.scrollTo(0, target), offsetTopD + 400)
  const yDesktop = await barD.evaluate((el) => el.getBoundingClientRect().y)
  expect(yDesktop).toBeLessThan(0)
})

/* ----------------------------------------------------------------- D */

test('confidence seals: icons by sub-type, none on verified (V5 / D)', async ({
  page,
}) => {
  // coming-soon → `tools` icon co-located with "em construção" on the
  // directory card (the detail page uses a different "Em construção"
  // banner without the inline-icon Badge). The `has` + `hasText` combo
  // asserts both pieces of evidence land in the same Badge <span>.
  await page.goto('/')
  const constructionSeal = page.locator('span', {
    has: page.locator('svg[data-icon="tools"]'),
    hasText: 'em construção — ainda não atende',
  })
  await expect(constructionSeal.first()).toBeVisible()

  // unverified hours → `alert-triangle` co-located with the call-ahead text.
  await page.goto('/unidade/ubs-capoere')
  const unverifiedSeal = page.locator('span', {
    has: page.locator('svg[data-icon="alert-triangle"]'),
    hasText: 'horário não confirmado — ligue antes',
  })
  await expect(unverifiedSeal).toHaveCount(1)
  await expect(unverifiedSeal).toBeVisible()

  // verified hours → no icon inside the Badge <span>. UBS Centro (UMRS)
  // carries `official-recent` openingHours — the canonical verified case.
  await page.goto('/unidade/ubs-centro-umrs')
  const verifiedSeal = page
    .locator('span', { hasText: 'horário de fonte oficial' })
    .first()
  await expect(verifiedSeal).toBeVisible()
  await expect(verifiedSeal.locator('svg')).toHaveCount(0)
})
