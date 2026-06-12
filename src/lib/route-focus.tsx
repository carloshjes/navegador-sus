import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router'

/**
 * SPA route changes don't reload the document, so the browser's free
 * accessibility behaviors (focus reset, new-page announcement) never
 * happen. Each page renders its h1 with id="page-title" and
 * tabIndex={-1}; this hook moves focus there on every route change
 * (skipping the initial load, where natural document focus is correct).
 */
export function useRouteFocus(): void {
  const { pathname } = useLocation()
  // Compare against the previous pathname instead of counting renders:
  // React StrictMode mounts effects twice in development, which would
  // defeat a naive "skip first render" flag and steal focus on load.
  const lastPathname = useRef(pathname)

  useEffect(() => {
    if (lastPathname.current === pathname) return
    lastPathname.current = pathname
    document.getElementById('page-title')?.focus()
  }, [pathname])
}

/**
 * Per-page document.title — what screen readers announce and what the
 * browser tab shows. Suffix keeps the codename for orientation.
 */
export function usePageTitle(title: string): void {
  useEffect(() => {
    document.title = `${title} — navegador-sus`
  }, [title])
}
