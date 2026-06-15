import type { ReactNode } from 'react'

/**
 * Eyebrow label (Etapa Visual 3 / C1) — a small UPPERCASE Public Sans tag
 * that sits above the page title, preceded by a short horizontal rule (the
 * `::before` lives in the `.eyebrow` CSS class in src/index.css). It is the
 * brand's wayfinding signal applied at page scale: "you are here in the
 * project's geography" before the title says what.
 */
export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow">{children}</p>
}
