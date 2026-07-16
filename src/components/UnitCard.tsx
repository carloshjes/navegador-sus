import { Link } from 'react-router'
import type { HealthUnit } from '../data/types'
import { displayCategory } from '../data/display-policy'
import { HOURS_BADGE_LABELS, telHref } from '../lib/provenance-ui'
import { formatStraightLineDistance } from '../lib/geo'
import { Badge } from './Badge'
import { Card } from './Card'
import { CategoryTag } from './CategoryTag'

/**
 * Directory record with two zones: identity first, practical data below the
 * internal divider. `mt-auto` anchors the practical zone to the card base so
 * sibling cards keep equal heights. The hours confidence seal is mandatory
 * honesty (report §10) and is rendered even when the value is absent.
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
  const address = [unit.address.street, unit.address.neighborhood]
    .filter((part): part is string => part !== null)
    .join(' · ')
  const phone = unit.phone.value

  return (
    <Card data-testid="unit-card" className="flex h-full w-full flex-col">
      <div data-testid="unit-card-identification">
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
        {distanceMeters !== undefined && (
          <p className="mt-1 text-label text-primary">
            {formatStraightLineDistance(distanceMeters)} em linha reta
          </p>
        )}
      </div>

      <div
        data-testid="unit-card-practical"
        className="mt-auto border-t border-edge pt-3"
      >
        <div className="flex flex-col gap-1">
          {address && (
            <div
              data-testid="unit-card-address"
              className="flex items-start gap-2 text-meta text-ink-muted"
            >
              <MapPinIcon />
              <span>{address}</span>
            </div>
          )}

          {phone !== null && (
            <div
              data-testid="unit-card-phone"
              className="flex min-h-touch items-center gap-2 text-meta"
            >
              <PhoneIcon />
              <a
                href={telHref(phone)}
                aria-label={`Ligar para ${unit.name}`}
                className="inline-flex min-h-touch items-center text-primary underline decoration-current/50 underline-offset-4"
              >
                {phone}
              </a>
            </div>
          )}

          <div
            data-testid="unit-card-hours"
            className="flex items-start gap-2 text-meta text-ink-muted"
          >
            <ClockIcon />
            <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1">
              {hours.value !== null && <span>{hours.value}</span>}
              <Badge
                confidence={hours.confidence}
                label={HOURS_BADGE_LABELS[hours.confidence]}
                icon={hours.confidence === 'unverified' ? 'alert-triangle' : undefined}
              />
            </div>
          </div>
        </div>

        {(category === 'coming-soon' ||
          category === 'care-restricted' ||
          category === 'care-cautious') && (
          <div
            data-testid="unit-card-state"
            className="mt-2 flex flex-wrap gap-x-4 gap-y-1"
          >
            {category === 'coming-soon' && (
              <Badge
                confidence="unverified"
                label="em construção — ainda não atende"
                icon="tools"
              />
            )}
            {category === 'care-restricted' && (
              <Badge
                confidence="unverified"
                label="acesso restrito"
                icon="alert-triangle"
              />
            )}
            {category === 'care-cautious' && (
              <Badge
                confidence="unverified"
                label="informações em verificação"
                icon="alert-triangle"
              />
            )}
          </div>
        )}
      </div>
    </Card>
  )
}

function MapPinIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-0.5 size-3.5 shrink-0 text-ink-muted"
    >
      <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-3.5 shrink-0 text-ink-muted"
    >
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-0.5 size-3.5 shrink-0 text-ink-muted"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  )
}
