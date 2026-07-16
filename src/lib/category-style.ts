import type { CategoryFamily } from '../data/display-policy'

/**
 * Visual style per category family (kit §3/§5): a `cat-*` text color and a
 * short PT-BR eyebrow label. Jargon is translated at first mention while the
 * full unit name remains untouched. Color is never the only signal: the label
 * carries the meaning (WCAG 1.4.1), and CSS supplies uppercase presentation.
 *
 * `textClassName` is a full literal Tailwind class so the compiler sees it;
 * every `cat-*` color is AA on the white card surface (ratios in index.css).
 */
export const CATEGORY_STYLE: Record<
  CategoryFamily,
  { label: string; textClassName: string }
> = {
  ubs: { label: 'UBS — posto de saúde', textClassName: 'text-cat-ubs' },
  urgency: {
    label: 'Urgência — pronto atendimento',
    textClassName: 'text-cat-urgency',
  },
  hospital: { label: 'Hospital', textClassName: 'text-cat-hospital' },
  mental: { label: 'CAPS — saúde mental', textClassName: 'text-cat-mental' },
  specialty: {
    label: 'Especialidades',
    textClassName: 'text-cat-specialty',
  },
  pharmacy: { label: 'Farmácia', textClassName: 'text-cat-pharmacy' },
  admin: {
    label: 'Apoio — gestão e vigilância',
    textClassName: 'text-cat-admin',
  },
}
