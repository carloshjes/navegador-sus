import type { HealthUnit } from '../data/types'
import { categoryFamily } from '../data/display-policy'
import { CATEGORY_STYLE } from '../lib/category-style'

/**
 * Category eyebrow (Etapa Visual 15; kit §5). The family color is now carried
 * by text, without a container shape competing with the structured record.
 * All `cat-*` colors reach at least 5.58:1 on the white card surface; contrast
 * ratios are symmetric, so their former white-on-color AA result also holds
 * for color-on-white. Meaning travels by the translated label, not color alone
 * (WCAG 1.4.1).
 */
export function CategoryTag({ unit }: { unit: HealthUnit }) {
  const style = CATEGORY_STYLE[categoryFamily(unit)]
  return (
    <span
      data-testid="category-tag"
      className={`text-[12px] font-bold uppercase leading-[1.2] tracking-[0.08em] ${style.textClassName}`}
    >
      {style.label}
    </span>
  )
}
