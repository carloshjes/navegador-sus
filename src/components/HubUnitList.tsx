import { Link } from 'react-router'
import type { HealthUnit } from '../data/types'
import { UNIT_TYPE_LABELS } from '../data/labels'

interface HubUnitListProps {
  units: HealthUnit[]
  compact?: boolean
  focusedId?: string | null
  showTypes?: boolean
}

/** Shared explanation and unit links for address hubs on detail and map views. */
export function HubUnitList({
  units,
  compact = false,
  focusedId = null,
  showTypes = false,
}: HubUnitListProps) {
  return (
    <>
      <p className={`${compact ? 'my-1' : 'mt-1'} text-meta text-ink-muted`}>
        Endereço igual não significa serviço igual — cada unidade abaixo tem atendimento
        próprio.
      </p>
      <ul className={`${compact ? 'mt-2 gap-1' : 'mt-3 gap-2'} grid grid-cols-1`}>
        {units.map((unit) => {
          const isFocused = unit.id === focusedId
          return (
            <li key={unit.id}>
              <Link
                to={`/unidade/${unit.id}`}
                aria-current={isFocused ? 'location' : undefined}
                className={`min-h-touch rounded-md border px-3 text-primary underline-offset-4 hover:border-primary hover:underline ${
                  compact ? 'flex flex-col justify-center py-1' : 'flex items-center'
                } ${isFocused ? 'border-primary bg-primary-soft' : 'border-edge'}`}
              >
                {showTypes ? (
                  <>
                    <span className="font-semibold leading-tight">{unit.name}</span>
                    <span className="text-meta text-ink-muted">
                      {UNIT_TYPE_LABELS[unit.type]}
                    </span>
                    {isFocused && (
                      <span className="text-meta font-semibold text-primary">
                        Em foco no mapa
                      </span>
                    )}
                  </>
                ) : (
                  unit.name
                )}
              </Link>
            </li>
          )
        })}
      </ul>
    </>
  )
}
