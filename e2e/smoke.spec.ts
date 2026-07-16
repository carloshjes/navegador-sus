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
  await expect(page.locator('.text-primary-ink').first()).toHaveCSS(
    'color',
    'rgb(21, 96, 60)',
  )
  await expect(page.locator('.dot-accent').first()).toHaveCSS('color', 'rgb(21, 96, 60)')
})

test('pine header connects the active plate and outlined mark to the page', async ({
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
      const pinCross = pin.querySelector('rect')!
      const wordmark = element.querySelector<HTMLElement>('.font-display')!
      const wordmarkDot = wordmark.querySelector<HTMLElement>('span')!
      const nav = element.querySelector<HTMLElement>('nav')!
      const active = element.querySelector<HTMLElement>('a[aria-current="page"]')!
      const inactive = Array.from(nav.querySelectorAll('a')).find(
        (link) => !link.hasAttribute('aria-current'),
      )!
      const main = document.querySelector<HTMLElement>('main#conteudo')!
      const headerRect = element.getBoundingClientRect()
      const brandRect = brandLink.getBoundingClientRect()
      const navRect = nav.getBoundingClientRect()
      const activeRect = active.getBoundingClientRect()
      return {
        backgroundImage: getComputedStyle(element).backgroundImage,
        backgroundColor: getComputedStyle(element).backgroundColor,
        borderBottomWidth: getComputedStyle(element).borderBottomWidth,
        pinFill: getComputedStyle(pinPath).fill,
        pinStroke: getComputedStyle(pinPath).stroke,
        pinStrokeWidth: getComputedStyle(pinPath).strokeWidth,
        pinStrokeLinecap: getComputedStyle(pinPath).strokeLinecap,
        pinStrokeLinejoin: getComputedStyle(pinPath).strokeLinejoin,
        pinCrossFill: getComputedStyle(pinCross).fill,
        pinWidth: pin.getBoundingClientRect().width,
        wordmark: getComputedStyle(wordmark).color,
        wordmarkDot: getComputedStyle(wordmarkDot).color,
        wordmarkSize: Number.parseFloat(getComputedStyle(wordmark).fontSize),
        wordmarkWeight: getComputedStyle(wordmark).fontWeight,
        activeText: getComputedStyle(active).color,
        activeBackground: getComputedStyle(active).backgroundColor,
        activeWeight: getComputedStyle(active).fontWeight,
        activeBorderWidth: getComputedStyle(active).borderBottomWidth,
        activeTopRadius: getComputedStyle(active).borderTopLeftRadius,
        activeBottomRadius: getComputedStyle(active).borderBottomLeftRadius,
        activeHeight: activeRect.height,
        activeFlush: Math.abs(activeRect.bottom - headerRect.bottom) <= 0.5,
        contentConnected:
          Math.abs(main.getBoundingClientRect().top - headerRect.bottom) <= 0.5,
        inactiveText: getComputedStyle(inactive).color,
        inactiveBackground: getComputedStyle(inactive).backgroundColor,
        inactiveBorderWidth: getComputedStyle(inactive).borderBottomWidth,
        inactiveClasses: Array.from(inactive.classList),
        noCollision: brandRect.bottom <= navRect.top + 1,
        navWithinViewport: navRect.left >= 0 && navRect.right <= window.innerWidth,
        noHorizontalOverflow:
          document.documentElement.scrollWidth <= document.documentElement.clientWidth,
      }
    })

    expect(state.backgroundImage).toBe('none')
    expect(state.backgroundColor).toBe('rgb(15, 81, 50)')
    expect(state.borderBottomWidth).toBe('0px')
    expect(state.pinFill).toBe('none')
    expect(state.pinStroke).toBe('rgb(255, 255, 255)')
    expect(state.pinStrokeWidth).toBe('1.6px')
    expect(state.pinStrokeLinecap).toBe('round')
    expect(state.pinStrokeLinejoin).toBe('round')
    expect(state.pinCrossFill).toBe('rgb(255, 255, 255)')
    expect(state.pinWidth).toBeGreaterThanOrEqual(34)
    expect(state.wordmarkSize).toBeGreaterThanOrEqual(22)
    expect(state.wordmarkWeight).toBe('600')
    expect(state.wordmark).toBe('rgb(255, 255, 255)')
    expect(state.wordmarkDot).toBe('rgb(255, 255, 255)')
    expect(state.activeText).toBe('rgb(15, 81, 50)')
    expect(state.activeBackground).toBe('rgb(251, 250, 247)')
    expect(state.activeWeight).toBe('600')
    expect(state.activeBorderWidth).toBe('0px')
    expect(state.activeTopRadius).toBe('4px')
    expect(state.activeBottomRadius).toBe('0px')
    expect(state.activeHeight).toBeGreaterThanOrEqual(44)
    expect(state.activeFlush).toBe(true)
    expect(state.contentConnected).toBe(true)
    expect(state.inactiveText).toBe('rgb(255, 255, 255)')
    expect(state.inactiveBackground).toBe('rgba(0, 0, 0, 0)')
    expect(state.inactiveBorderWidth).toBe('0px')
    expect(state.inactiveClasses).toContain('hover:bg-white/10')
    expect(state.noCollision).toBe(true)
    expect(state.navWithinViewport).toBe(true)
    expect(state.noHorizontalOverflow).toBe(true)

    // Keyboard order: skip link → brand → active plate → next route.
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await expect(activeLink).toBeFocused()
    await expect(activeLink).toHaveCSS('outline-color', 'rgb(15, 81, 50)')
    await page.keyboard.press('Tab')
    await expect(inactiveLink).toBeFocused()
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
      const activeRoute = guideNav.querySelector<HTMLElement>('a[aria-current="page"]')!
      const main = document.querySelector<HTMLElement>('main#conteudo')!
      const dock = document.querySelector<HTMLElement>(
        'nav[aria-label="Telefones de emergência"]',
      )!
      const actionRects = Array.from(dock.querySelectorAll('a')).map((action) =>
        action.getBoundingClientRect(),
      )
      const actionRadii = Array.from(dock.querySelectorAll('a')).map((action) =>
        Number.parseFloat(getComputedStyle(action).borderRadius),
      )
      const actionHitAreas = Array.from(dock.querySelectorAll('a')).map((action) => {
        const pseudo = getComputedStyle(action, '::before')
        return {
          width: Number.parseFloat(pseudo.width),
          height: Number.parseFloat(pseudo.height),
        }
      })
      const divider = dock.querySelector<HTMLElement>(
        '[data-testid="emergency-divider"]',
      )!
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
      const headerRect = header.getBoundingClientRect()
      const activeRouteRect = activeRoute.getBoundingClientRect()
      return {
        noHorizontalOverflow:
          document.documentElement.scrollWidth <= document.documentElement.clientWidth,
        brandAndNavSeparated:
          window.innerWidth < 640
            ? brandRect.bottom <= guideRect.top + 1
            : brandRect.right <= guideRect.left,
        navWithinViewport: guideRect.left >= 0 && guideRect.right <= window.innerWidth,
        activePlateFlush:
          Math.abs(activeRouteRect.bottom - headerRect.bottom) <= 0.5 &&
          Math.abs(main.getBoundingClientRect().top - headerRect.bottom) <= 0.5,
        activePlateKeepsTouchFloor: activeRouteRect.height >= 44,
        actionsWithinViewport: actionRects.every(
          (rect) => rect.left >= 0 && rect.right <= window.innerWidth,
        ),
        actionsMeetTouchFloor: actionHitAreas.every(
          (area) => area.width >= 44 && area.height >= 44,
        ),
        actionsStayCompact: actionRects.every(
          (rect) => rect.width < 150 && rect.height >= 31 && rect.height <= 33,
        ),
        actionsArePills: actionRadii.every((radius) => radius >= 22),
        actionsHavePhoneIcons: dock.querySelectorAll('a svg').length === 2,
        dividerMatchesBreakpoint:
          getComputedStyle(divider).display ===
          (window.innerWidth >= 640 ? 'block' : 'none'),
        locateIsCompact:
          locateRect.height >= 44 && locateRect.width < locateBandRect.width * 0.6,
      }
    })

    expect(metrics).toEqual({
      noHorizontalOverflow: true,
      brandAndNavSeparated: true,
      navWithinViewport: true,
      activePlateFlush: true,
      activePlateKeepsTouchFloor: true,
      actionsWithinViewport: true,
      actionsMeetTouchFloor: true,
      actionsStayCompact: true,
      actionsArePills: true,
      actionsHavePhoneIcons: true,
      dividerMatchesBreakpoint: true,
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
  await expect(emergencyNav.getByTestId('emergency-divider')).toBeHidden()

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
      const hitArea = getComputedStyle(link, '::before')
      const icon = link.querySelector('svg')!
      const number = link.querySelector('span')!
      return {
        textDecoration: style.textDecorationLine,
        backgroundColor: style.backgroundColor,
        color: style.color,
        borderColor: style.borderTopColor,
        borderClass: Array.from(link.classList).find((className) =>
          className.startsWith('border-white'),
        ),
        borderWidth: style.borderTopWidth,
        boxShadow: style.boxShadow,
        transform: style.transform,
        animationName: style.animationName,
        borderRadius: Number.parseFloat(style.borderRadius),
        width: link.getBoundingClientRect().width,
        height: link.getBoundingClientRect().height,
        hitWidth: Number.parseFloat(hitArea.width),
        hitHeight: Number.parseFloat(hitArea.height),
        iconWidth: icon.getBoundingClientRect().width,
        iconStroke: icon.getAttribute('stroke'),
        iconAriaHidden: icon.getAttribute('aria-hidden'),
        numberWeight: getComputedStyle(number).fontWeight,
        numberVariant: getComputedStyle(number).fontVariantNumeric,
      }
    }),
  )
  for (const style of styles) {
    expect(style.textDecoration).toBe('none')
    expect(style.borderWidth).toBe('1px')
    expect(style.boxShadow).toBe('none')
    expect(style.transform).toBe('none')
    expect(style.animationName).toBe('none')
    expect(style.borderRadius).toBeGreaterThanOrEqual(22)
    expect(style.width).toBeLessThan(150)
    expect(style.height).toBeGreaterThanOrEqual(31)
    expect(style.height).toBeLessThanOrEqual(33)
    expect(style.hitWidth).toBeGreaterThanOrEqual(44)
    expect(style.hitHeight).toBeGreaterThanOrEqual(44)
    expect(style.iconWidth).toBe(14)
    expect(style.iconStroke).toBe('currentColor')
    expect(style.iconAriaHidden).toBe('true')
    expect(style.numberWeight).toBe('700')
    expect(style.numberVariant).toContain('tabular-nums')
  }
  expect(styles[0]).toMatchObject({
    backgroundColor: 'rgb(255, 255, 255)',
    color: 'rgb(163, 45, 45)',
    borderColor: 'rgb(255, 255, 255)',
    borderClass: 'border-white',
  })
  expect(styles[1]).toMatchObject({
    backgroundColor: 'rgba(0, 0, 0, 0)',
    color: 'rgb(255, 255, 255)',
    borderClass: 'border-white/80',
  })
  expect(styles[1].borderColor).toContain('/ 0.8)')

  await page.setViewportSize({ width: 1024, height: 800 })
  await expect(emergencyNav.getByTestId('emergency-divider')).toBeVisible()
  const dividerStyle = await emergencyNav
    .getByTestId('emergency-divider')
    .evaluate((divider) => ({
      backgroundColor: getComputedStyle(divider).backgroundColor,
      backgroundClass: Array.from(divider.classList).find((className) =>
        className.startsWith('bg-white'),
      ),
      height: divider.getBoundingClientRect().height,
      width: divider.getBoundingClientRect().width,
    }))
  expect(dividerStyle).toMatchObject({
    backgroundClass: 'bg-white/35',
    height: 20,
    width: 1,
  })
  expect(dividerStyle.backgroundColor).toContain('/ 0.35)')

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
  await expect(skipLink).toHaveCSS('color', 'rgb(15, 81, 50)')
  await expect(skipLink).toHaveCSS('outline-color', 'rgb(15, 81, 50)')

  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/#conteudo$/)
  // The target must exist and be the main landmark.
  await expect(page.locator('main#conteudo')).toBeVisible()
})

test('brand metadata and app icon expose the solid pine mark', async ({ page }) => {
  await page.goto('/')

  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute(
    'content',
    '#0F5132',
  )

  const manifestResponse = await page.request.get('/manifest.webmanifest')
  expect(manifestResponse.ok()).toBe(true)
  expect((await manifestResponse.json()).theme_color).toBe('#0F5132')

  const faviconResponse = await page.request.get('/favicon.svg')
  expect(faviconResponse.ok()).toBe(true)
  const favicon = await faviconResponse.text()
  expect(favicon).toContain('fill="#0F5132"')
  expect(favicon).toContain('fill="#FFFFFF"')

  for (const asset of [
    '/favicon-16.png',
    '/favicon-32.png',
    '/apple-touch-icon.png',
    '/icon-192.png',
    '/icon-512.png',
    '/maskable-192.png',
    '/maskable-512.png',
  ]) {
    const response = await page.request.get(asset)
    expect(response.ok()).toBe(true)
    expect(response.headers()['content-type']).toBe('image/png')
    expect((await response.body()).byteLength).toBeGreaterThan(0)
  }
})
