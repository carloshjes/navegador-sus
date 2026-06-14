/**
 * Generate the favicon/PWA PNGs from the kit §8 pin (public/favicon.svg is
 * the SVG source of truth). Rasterizes with Playwright's Chromium — already a
 * dev dependency (e2e), so no extra native image library. Output PNGs are
 * committed to public/; Cloudflare just serves them (no build-time tooling).
 *
 * Run: node scripts/generate-icons.mjs  (after `npx playwright install chromium`)
 *
 * Per kit §8:
 *  - favicon 16/32: pin on TRANSPARENT background.
 *  - apple-touch (180), PWA any (192/512), maskable (192/512): pin centered
 *    on a WHITE background (#FFFFFF) — never a teal tile. Maskable gets extra
 *    padding so the pin stays inside the Android safe zone.
 */
import { chromium } from '@playwright/test'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const publicDir = join(here, '..', 'public')

/** The kit §8 pin, scaled to `px`. White cross (protected-emblem reason). */
const pinSvg = (px) =>
  `<svg width="${px}" height="${px}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 1.6c-4.3 0-7.8 3.4-7.8 7.5 0 5.3 7.8 13.3 7.8 13.3s7.8-8 7.8-13.3c0-4.1-3.5-7.5-7.8-7.5z" fill="#0E5E4C"/>
    <rect x="10.85" y="5.4" width="2.3" height="7.4" rx="0.5" fill="#FFFFFF"/>
    <rect x="8.4" y="7.95" width="7.2" height="2.3" rx="0.5" fill="#FFFFFF"/>
  </svg>`

// file → { size, factor (pin size as a fraction of canvas), bg | null }.
const TARGETS = {
  'favicon-16.png': { size: 16, factor: 1, bg: null },
  'favicon-32.png': { size: 32, factor: 1, bg: null },
  'apple-touch-icon.png': { size: 180, factor: 0.78, bg: '#FFFFFF' },
  'icon-192.png': { size: 192, factor: 0.78, bg: '#FFFFFF' },
  'icon-512.png': { size: 512, factor: 0.78, bg: '#FFFFFF' },
  // Maskable: more padding so the pin sits inside the 80% safe zone.
  'maskable-192.png': { size: 192, factor: 0.6, bg: '#FFFFFF' },
  'maskable-512.png': { size: 512, factor: 0.6, bg: '#FFFFFF' },
}

const browser = await chromium.launch()
const page = await browser.newPage({ deviceScaleFactor: 1 })

for (const [name, { size, factor, bg }] of Object.entries(TARGETS)) {
  await page.setViewportSize({ width: size, height: size })
  await page.setContent(
    `<!doctype html><html><head><meta charset="utf-8"><style>
      html,body{margin:0;padding:0;width:${size}px;height:${size}px}
      body{display:flex;align-items:center;justify-content:center;${bg ? `background:${bg};` : ''}}
    </style></head><body>${pinSvg(Math.round(size * factor))}</body></html>`,
  )
  await page.screenshot({
    path: join(publicDir, name),
    omitBackground: !bg,
    clip: { x: 0, y: 0, width: size, height: size },
  })
  console.log(`✓ ${name} (${size}×${size}${bg ? ' on white' : ' transparent'})`)
}

await browser.close()
