import { expect, test } from '@playwright/test'

/*
 * Smoke test: the app loads in a real browser with its non-negotiables —
 * emergency numbers visible (briefing §2) and keyboard skip-link working.
 */

test('home page renders with the real dataset', async ({ page }) => {
  await page.goto('/')

  // Etapa Visual 3 / C1: hero is "Encontre a sua unidade da rede pública."
  await expect(
    page.getByRole('heading', { name: /encontre a sua unidade da rede pública/i }),
  ).toBeVisible()

  // The unit count comes from the JSON: any number proves the pipeline.
  await expect(page.getByText(/\d+ unidades ativas/)).toBeVisible()
})

test('solid header enlarges the mark without colliding with navigation', async ({
  page,
}) => {
  for (const viewport of [
    { width: 320, height: 568 },
    { width: 360, height: 800 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport)
    await page.goto('/')

    const header = page.locator('header.app-header')
    const guideNav = page.getByRole('navigation', { name: 'Seções do guia' })
    const activeLink = guideNav.getByRole('link', { name: 'Início' })
    const inactiveLink = guideNav.getByRole('link', { name: 'Mapa' })

    const state = await header.evaluate((element) => {
      const brandLink = element.querySelector<HTMLAnchorElement>('a[aria-label]')!
      const pin = element.querySelector<SVGElement>('svg')!
      const pinPath = pin.querySelector('path')!
      const wordmark = element.querySelector<HTMLElement>('.font-display')!
      const nav = element.querySelector<HTMLElement>('nav')!
      const active = element.querySelector<HTMLElement>('a[aria-current="page"]')!
      const brandRect = brandLink.getBoundingClientRect()
      const navRect = nav.getBoundingClientRect()
      return {
        backgroundImage: getComputedStyle(element).backgroundImage,
        backgroundColor: getComputedStyle(element).backgroundColor,
        pinFill: getComputedStyle(pinPath).fill,
        pinWidth: pin.getBoundingClientRect().width,
        wordmark: getComputedStyle(wordmark).color,
        wordmarkSize: Number.parseFloat(getComputedStyle(wordmark).fontSize),
        wordmarkWeight: getComputedStyle(wordmark).fontWeight,
        activeText: getComputedStyle(active).color,
        activeBorder: getComputedStyle(active).borderBottomColor,
        noCollision: brandRect.bottom <= navRect.top + 1,
        navWithinViewport: navRect.left >= 0 && navRect.right <= window.innerWidth,
        noHorizontalOverflow:
          document.documentElement.scrollWidth <= document.documentElement.clientWidth,
      }
    })

    expect(state.backgroundImage).toBe('none')
    expect(state.backgroundColor).toBe('rgb(14, 94, 76)')
    expect(state.pinFill).toBe('rgb(216, 96, 47)')
    expect(state.pinWidth).toBeGreaterThanOrEqual(34)
    expect(state.wordmarkSize).toBeGreaterThanOrEqual(22)
    expect(state.wordmarkWeight).toBe('600')
    expect(state.wordmark).toBe('rgb(255, 255, 255)')
    expect(state.activeText).toBe('rgb(255, 255, 255)')
    expect(state.activeBorder).toBe('rgb(216, 96, 47)')
    expect(state.noCollision).toBe(true)
    expect(state.navWithinViewport).toBe(true)
    expect(state.noHorizontalOverflow).toBe(true)

    await inactiveLink.focus()
    await expect(inactiveLink).toHaveCSS('outline-color', 'rgb(255, 255, 255)')
    await expect(activeLink).toHaveAttribute('aria-current', 'page')
  }
})

test('shared civic chrome fits every required responsive viewport', async ({
  page,
  browserName,
}) => {
  // Chromium owns the complete breakpoint matrix. The preceding header test
  // still covers three mobile widths in WebKit; resizing six times in this
  // additional matrix hangs the Windows WebKit runner without adding a
  // distinct CSS branch.
  test.skip(browserName === 'webkit', 'Full breakpoint matrix runs in Chromium')

  const viewports = [
    { width: 320, height: 568 },
    { width: 360, height: 800 },
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 1024, height: 800 },
    { width: 1440, height: 900 },
  ]

  for (const viewport of viewports) {
    await page.setViewportSize(viewport)
    await page.goto('/')

    const metrics = await page.evaluate(() => {
      const header = document.querySelector<HTMLElement>('header.app-header')!
      const brand = header.querySelector<HTMLAnchorElement>('a[aria-label]')!
      const guideNav = header.querySelector<HTMLElement>('nav')!
      const dock = document.querySelector<HTMLElement>(
        'nav[aria-label="Telefones de emergência"]',
      )!
      const actionRects = Array.from(dock.querySelectorAll('a')).map((action) =>
        action.getBoundingClientRect(),
      )
      const actionRadii = Array.from(dock.querySelectorAll('a')).map((action) =>
        Number.parseFloat(getComputedStyle(action).borderRadius),
      )
      const locateButton = document.querySelector<HTMLButtonElement>(
        '[data-testid="quick-locate-band"] button',
      )!
      const locateBand = document.querySelector<HTMLElement>(
        '[data-testid="quick-locate-band"]',
      )!
      const locateRect = locateButton.getBoundingClientRect()
      const locateBandRect = locateBand.getBoundingClientRect()
      const brandRect = brand.getBoundingClientRect()
      const guideRect = guideNav.getBoundingClientRect()
      return {
        noHorizontalOverflow:
          document.documentElement.scrollWidth <= document.documentElement.clientWidth,
        brandAndNavSeparated:
          window.innerWidth < 640
            ? brandRect.bottom <= guideRect.top + 1
            : brandRect.right <= guideRect.left,
        navWithinViewport: guideRect.left >= 0 && guideRect.right <= window.innerWidth,
        actionsWithinViewport: actionRects.every(
          (rect) => rect.left >= 0 && rect.right <= window.innerWidth,
        ),
        actionsMeetTouchFloor: actionRects.every(
          (rect) => rect.width >= 44 && rect.height >= 44,
        ),
        actionsStayCompact: actionRects.every((rect) => rect.width < 150),
        actionsArePills: actionRadii.every((radius) => radius >= 22),
        locateIsCompact:
          locateRect.height >= 44 && locateRect.width < locateBandRect.width * 0.6,
      }
    })

    expect(metrics).toEqual({
      noHorizontalOverflow: true,
      brandAndNavSeparated: true,
      navWithinViewport: true,
      actionsWithinViewport: true,
      actionsMeetTouchFloor: true,
      actionsStayCompact: true,
      actionsArePills: true,
      locateIsCompact: true,
    })

    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
    const footerOverlap = await page.evaluate(() => {
      const footer = document.querySelector('footer')!
      const dock = document.querySelector('nav[aria-label="Telefones de emergência"]')!
      return footer.getBoundingClientRect().bottom - dock.getBoundingClientRect().top
    })
    expect(footerOverlap).toBeLessThanOrEqual(1)
  }
})

test('emergency dock keeps SAMU and Bombeiros visible and one tap away', async ({
  page,
}) => {
  await page.goto('/')

  const emergencyNav = page.getByRole('navigation', {
    name: 'Telefones de emergência',
  })
  await expect(emergencyNav).toBeVisible()
  await expect(emergencyNav.getByText('Emergência')).toBeVisible()
  await expect(emergencyNav.getByText('SAMU 192')).toBeVisible()
  await expect(emergencyNav.getByText('Bombeiros 193')).toBeVisible()
  await expect(emergencyNav).not.toContainText('Ligar para o SAMU')

  await expect(emergencyNav.getByRole('link', { name: /SAMU/i })).toHaveAttribute(
    'href',
    'tel:192',
  )
  await expect(emergencyNav.getByRole('link', { name: /Bombeiros/i })).toHaveAttribute(
    'href',
    'tel:193',
  )

  const styles = await emergencyNav.locator('a').evaluateAll((links) =>
    links.map((link) => {
      const style = getComputedStyle(link)
      return {
        textDecoration: style.textDecorationLine,
        boxShadow: style.boxShadow,
        transform: style.transform,
        animationName: style.animationName,
        borderRadius: Number.parseFloat(style.borderRadius),
        width: link.getBoundingClientRect().width,
        height: link.getBoundingClientRect().height,
      }
    }),
  )
  for (const style of styles) {
    expect(style.textDecoration).toBe('none')
    expect(style.boxShadow).toBe('none')
    expect(style.transform).toBe('none')
    expect(style.animationName).toBe('none')
    expect(style.borderRadius).toBeGreaterThanOrEqual(22)
    expect(style.width).toBeLessThan(150)
    expect(style.height).toBeGreaterThanOrEqual(44)
  }

  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
  const overlap = await page.evaluate(() => {
    const footer = document.querySelector('footer')!
    const dock = document.querySelector('nav[aria-label="Telefones de emergência"]')!
    return footer.getBoundingClientRect().bottom - dock.getBoundingClientRect().top
  })
  expect(overlap).toBeLessThanOrEqual(1)
})

test('skip-link is the first tab stop and targets the main content', async ({
  page,
  browserName,
}) => {
  // WebKit excludes links from the default Tab order (Safari's "Full
  // Keyboard Access" is off by default); Chromium includes them. The
  // skip-link itself reaches the content equally on both — we assert the
  // keyboard-only contract on Chromium, since on iPhone 13 the very first
  // Tab does nothing for a link target.
  test.skip(browserName === 'webkit', 'Safari excludes links from default Tab order')
  await page.goto('/')

  await page.keyboard.press('Tab')
  const skipLink = page.getByRole('link', { name: 'Pular para o conteúdo' })
  await expect(skipLink).toBeFocused()
  await expect(skipLink).toBeVisible()
  await expect(skipLink).toHaveCSS('background-color', 'rgb(255, 255, 255)')
  await expect(skipLink).toHaveCSS('color', 'rgb(14, 94, 76)')
  await expect(skipLink).toHaveCSS('outline-color', 'rgb(14, 94, 76)')

  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/#conteudo$/)
  // The target must exist and be the main landmark.
  await expect(page.locator('main#conteudo')).toBeVisible()
})
