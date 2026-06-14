import type { CategoryFamily } from '../data/display-policy'

/**
 * Visual style per category family (kit §3/§5): a solid `cat-*` color with
 * white text, and a short PT-BR label. The category TAG renders these as a
 * rectangle (radius-sm) — the wayfinding signal that says "what kind of unit
 * this is", distinct from the status seal (a pill) that says "is it open /
 * confirmed". Color is never the only signal: the label carries the meaning
 * (WCAG 1.4.1), and the tag is uppercased in CSS, so labels stay normal-case
 * here.
 *
 * `className` is a full literal Tailwind class so the JIT compiler sees it;
 * every `cat-*` color is AA on white (ratios in src/index.css).
 */
export const CATEGORY_STYLE: Record<
  CategoryFamily,
  { label: string; className: string }
> = {
  ubs: { label: 'UBS', className: 'bg-cat-ubs' },
  urgency: { label: 'Urgência', className: 'bg-cat-urgency' },
  hospital: { label: 'Hospital', className: 'bg-cat-hospital' },
  mental: { label: 'Saúde mental', className: 'bg-cat-mental' },
  specialty: { label: 'Especialidades', className: 'bg-cat-specialty' },
  pharmacy: { label: 'Farmácia', className: 'bg-cat-pharmacy' },
  admin: { label: 'Apoio', className: 'bg-cat-admin' },
}
