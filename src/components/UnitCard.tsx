import { Link } from 'react-router'
import type { HealthUnit } from '../data/types'
import { displayCategory } from '../data/display-policy'
import { UNIT_TYPE_LABELS } from '../data/labels'
import { HOURS_BADGE_LABELS } from '../lib/provenance-ui'
import { formatStraightLineDistance } from '../lib/geo'
import { Badge } from './Badge'
import { Card } from './Card'
import { CategoryTag } from './CategoryTag'

/**
 * Directory listing card. The confidence seal on the opening hours is
 * mandatory honesty (report §10) — it never gets omitted to look nicer.
 * `distanceMeters` is shown only when the user opted into "perto de mim".
 *
 * Etapa Visual 3 / A2+C3:
 *  - card is a flex column with status-seal pushed to the bottom via
 *    `mt-auto`, so cards in the same row reach equal heights (the grid
 *    stretches by default; the card now fills the cell);
 *  - title is Figtree (font-display) for hierarchy against Public Sans body,
 *    with `line-clamp-2` so a long unit name never blows up the row — the
 *    full name remains in the link's `title` attribute and on the detail
 *    page, so nothing is lost to assistive tech;
 *  - subtitle uses the coral middot motif between type and neighborhood.
 */
export function UnitCard({
  unit,
  distanceMeters,
}: {
  unit: HealthUnit
  distanceMeters?: number
}) {
  const category = displayCategory(unit)
  const hours = unit.openingHours

  return (
    <Card className="transition-card flex h-full w-full flex-col hover:border-border-strong">
      {/* Category tag on top (kit §5): rectangle + family color. It is the
          single category signal on the card — no redundant colored spine. */}
      <CategoryTag unit={unit} />
      <h3 className="mt-2 font-display text-base font-bold leading-tight tracking-tight">
        <Link
          to={`/unidade/${unit.id}`}
          title={unit.name}
          className="line-clamp-2 text-primary underline-offset-4 hover:underline"
        >
          {unit.name}
        </Link>
      </h3>
      <p className="mt-1 text-meta text-ink-muted">
        {UNIT_TYPE_LABELS[unit.type]}
        {unit.address.neighborhood && (
          <>
            <span aria-hidden="true" className="dot-accent">
              ·
            </span>
            {unit.address.neighborhood}
          </>
        )}
      </p>
      {distanceMeters !== undefined && (
        <p className="mt-1 text-label text-primary">
          {formatStraightLineDistance(distanceMeters)} em linha reta
        </p>
      )}

      {/* Status block pushed to the bottom — equal-height cards in 2-col.
          Etapa Visual 5 / D: seals are now sober text; the optional icon
          differentiates the sub-type of caution (alert-triangle = "verify
          first", tools = "doesn't operate yet"). See kit §9.2. */}
      <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-3">
        {category === 'coming-soon' ? (
          <Badge
            confidence="unverified"
            label="em construção — ainda não atende"
            icon="tools"
          />
        ) : (
          <Badge
            confidence={hours.confidence}
            label={HOURS_BADGE_LABELS[hours.confidence]}
            icon={hours.confidence === 'unverified' ? 'alert-triangle' : undefined}
          />
        )}
        {category === 'care-restricted' && (
          <Badge confidence="unverified" label="acesso restrito" icon="alert-triangle" />
        )}
        {category === 'care-cautious' && (
          <Badge
            confidence="unverified"
            label="informações em verificação"
            icon="alert-triangle"
          />
        )}
      </div>
    </Card>
  )
}
