import type { HealthUnit } from '../data/types'
import { categoryFamily } from '../data/display-policy'
import { CATEGORY_STYLE } from '../lib/category-style'

/**
 * Category tag (kit §5): a rectangular (radius-sm) chip in the family's solid
 * color with white text — the wayfinding signal for "what kind of unit". The
 * rectangle is deliberate: status seals are pills, categories are rectangles
 * (kit §4). Meaning travels by the label, not color alone (WCAG 1.4.1).
 */
export function CategoryTag({ unit }: { unit: HealthUnit }) {
  const style = CATEGORY_STYLE[categoryFamily(unit)]
  return (
    <span
      className={`inline-flex items-center rounded-sm px-2 py-1 text-chip tracking-[0.03em] text-white uppercase ${style.className}`}
    >
      {style.label}
    </span>
  )
}
