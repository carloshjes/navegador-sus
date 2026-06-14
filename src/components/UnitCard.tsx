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
    <Card className="transition-colors hover:border-primary">
      {/* Category tag on top (kit §5): rectangle + family color. */}
      <CategoryTag unit={unit} />
      <h3 className="mt-2 text-unit-name">
        <Link
          to={`/unidade/${unit.id}`}
          className="text-primary underline-offset-4 hover:underline"
        >
          {unit.name}
        </Link>
      </h3>
      <p className="mt-1 text-meta text-ink-muted">
        {UNIT_TYPE_LABELS[unit.type]}
        {unit.address.neighborhood ? <> · {unit.address.neighborhood}</> : null}
      </p>
      {distanceMeters !== undefined && (
        <p className="mt-1 text-label text-primary">
          {formatStraightLineDistance(distanceMeters)} em linha reta
        </p>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        {category === 'coming-soon' ? (
          <Badge confidence="unverified" label="em construção — ainda não atende" />
        ) : (
          <Badge
            confidence={hours.confidence}
            label={HOURS_BADGE_LABELS[hours.confidence]}
          />
        )}
        {category === 'care-restricted' && (
          <Badge confidence="unverified" label="acesso restrito" />
        )}
        {category === 'care-cautious' && (
          <Badge confidence="unverified" label="informações em verificação" />
        )}
      </div>
    </Card>
  )
}
