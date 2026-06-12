import { defineConfig, devices } from '@playwright/test'

/**
 * E2E smoke tests. Playwright starts the Vite dev server itself (webServer)
 * and reuses one that is already running during local development.
 */
export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:5173',
  },
  projects: [
    /* Mobile viewport first — the product is mobile-first (briefing §3). */
    { name: 'mobile-chromium', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
})
