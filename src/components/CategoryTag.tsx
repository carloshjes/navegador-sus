import type { HealthUnit } from '../data/types'
import { categoryFamily } from '../data/display-policy'
import { CATEGORY_STYLE } from '../lib/category-style'

/**
 * Category tag (Etapa Visual 4 / A1; kit §5 + components.md). A small solid
 * rectangle in the family color with white text, the wayfinding signal for
 * "what kind of unit". **Width is defined by content** — never stretches.
 *
 * Critical (regression root cause): UnitCard is `flex flex-col h-full` for
 * equal-height cards, and flex-column children take 100% width by default.
 * The tag MUST be `inline-flex` AND `self-start` so it stays its natural
 * width whether the parent is flex or block. Removing either invites the
 * "tag esticada" bug back. Document this constraint in tests too.
 *
 * Meaning travels by the label, not color alone (WCAG 1.4.1).
 */
export function CategoryTag({ unit }: { unit: HealthUnit }) {
  const style = CATEGORY_STYLE[categoryFamily(unit)]
  return (
    <span
      data-testid="category-tag"
      className={`inline-flex items-center self-start rounded-[3px] px-[9px] py-[4px] text-[11px] font-bold uppercase leading-none tracking-[0.05em] text-white ${style.className}`}
    >
      {style.label}
    </span>
  )
}
