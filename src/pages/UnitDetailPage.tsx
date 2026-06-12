import { useState, type ReactNode } from 'react'
import { Link, useParams } from 'react-router'
import { dataset } from '../data/units'
import type { HealthUnit, ProvenancedField } from '../data/types'
import { displayCategory, isLinkable, RESTRICTION_NOTICES } from '../data/display-policy'
import { SERVICE_LABELS, UNIT_TYPE_LABELS } from '../data/labels'
import { hubMates } from '../lib/hubs'
import { formatDateBR, HOURS_BADGE_LABELS, telHref } from '../lib/provenance-ui'
import { usePageTitle } from '../lib/route-focus'
import { Badge } from '../components/Badge'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { NotFoundPage } from './NotFoundPage'

/**
 * One volatile field with its provenance made visible: value (or honest
 * absence), confidence seal and verification date. The seal is the
 * product's honesty mechanism — every volatile field shows one.
 */
function ProvenancedRow({
  label,
  field,
  badgeLabel,
  children,
}: {
  label: string
  field: ProvenancedField<string>
  badgeLabel?: string
  children?: ReactNode
}) {
  return (
    <div className="border-edge border-t py-3 first:border-t-0 first:pt-0 last:pb-0">
      <dt className="font-semibold">{label}</dt>
      <dd className="mt-1">
        {field.value !== null ? (
          <>
            <div>{children ?? field.value}</div>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <Badge confidence={field.confidence} label={badgeLabel} />
              <span className="text-sm text-ink-muted">
                conferido em {formatDateBR(field.checkedAt)}
              </span>
            </div>
          </>
        ) : (
          <div className="mt-1">
            <Badge
              confidence="unverified"
              label={badgeLabel ?? 'não confirmado — ligue antes'}
            />
          </div>
        )}
      </dd>
    </div>
  )
}

function AddressBlock({ unit }: { unit: HealthUnit }) {
  const [copied, setCopied] = useState(false)
  const { street, neighborhood, city, state, zipCode } = unit.address
  if (!street) return null

  const fullAddress = [
    street,
    neighborhood,
    `${city}/${state}`,
    zipCode ? `CEP ${zipCode}` : null,
  ]
    .filter(Boolean)
    .join(', ')

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(fullAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // Clipboard can be unavailable (permissions/old browser): no crash,
      // the address remains selectable text.
    }
  }

  return (
    <div className="border-edge border-t py-3">
      <dt className="font-semibold">Endereço</dt>
      <dd className="mt-1">
        <div>{fullAddress}</div>
        <div className="mt-2 flex items-center gap-3">
          <Button variant="secondary" onClick={copy}>
            Copiar endereço
          </Button>
          <span aria-live="polite" className="text-sm text-ink-muted">
            {copied ? 'Endereço copiado!' : ''}
          </span>
        </div>
      </dd>
    </div>
  )
}

export function UnitDetailPage() {
  const { id } = useParams()
  const unit = dataset.units.find((candidate) => candidate.id === id)

  // Unknown slug or hidden unit (SAMI, COVID ambulatory): friendly 404.
  if (!unit || !isLinkable(unit)) return <NotFoundPage />

  return <UnitDetail unit={unit} />
}

function UnitDetail({ unit }: { unit: HealthUnit }) {
  usePageTitle(unit.name)
  const category = displayCategory(unit)
  const mates = hubMates(unit, dataset.units)
  const restriction = RESTRICTION_NOTICES[unit.id]

  return (
    <>
      <Link to="/" className="text-primary underline underline-offset-4">
        ← Voltar ao diretório
      </Link>

      <h1 id="page-title" tabIndex={-1} className="mt-3 text-2xl font-bold">
        {unit.name}
      </h1>
      <p className="mt-1 text-lg text-ink-muted">{UNIT_TYPE_LABELS[unit.type]}</p>

      {category === 'coming-soon' && (
        <p className="mt-4 rounded-lg bg-conf-stale-bg p-4 font-semibold text-conf-stale">
          Em construção — esta unidade ainda não atende o público.
        </p>
      )}
      {category === 'care-cautious' && (
        <p className="mt-4 rounded-lg bg-conf-unverified-bg p-4 font-semibold text-conf-unverified">
          Informações em verificação: confirme por telefone antes de ir.
        </p>
      )}
      {category === 'care-restricted' && restriction && (
        <p className="mt-4 rounded-lg bg-conf-unverified-bg p-4 font-semibold text-conf-unverified">
          {restriction}
        </p>
      )}
      {category === 'institutional' && (
        <p className="mt-4 rounded-lg bg-surface-muted p-4 text-ink-muted">
          Órgão de gestão ou vigilância da rede de saúde — para atendimento de rotina,
          procure sua UBS.
        </p>
      )}

      {/* Sources disagree about this unit (Etapa 0 conflicts field). The
          internal research notes stay internal; the user gets the honest
          consequence. */}
      {unit.conflicts.length > 0 && category !== 'coming-soon' && (
        <p className="mt-4 rounded-lg bg-conf-stale-bg p-4 text-conf-stale">
          <strong>Fontes oficiais divergem</strong> sobre informações desta unidade (como
          horário ou telefone). Na dúvida, ligue antes de ir.
        </p>
      )}

      <Card className="mt-6">
        <h2 className="sr-only">Contato e funcionamento</h2>
        <dl>
          <ProvenancedRow label="Telefone" field={unit.phone}>
            {unit.phone.value !== null && (
              <a
                href={telHref(unit.phone.value)}
                className="font-semibold text-primary underline underline-offset-4"
              >
                {unit.phone.value}
              </a>
            )}
          </ProvenancedRow>

          <ProvenancedRow
            label="Horário de funcionamento"
            field={unit.openingHours}
            badgeLabel={HOURS_BADGE_LABELS[unit.openingHours.confidence]}
          />

          {unit.email && unit.email.value !== null && (
            <ProvenancedRow label="E-mail" field={unit.email}>
              <a
                href={`mailto:${unit.email.value}`}
                className="text-primary underline underline-offset-4"
              >
                {unit.email.value}
              </a>
            </ProvenancedRow>
          )}

          <AddressBlock unit={unit} />
        </dl>
      </Card>

      {unit.services.length > 0 && (
        <section aria-labelledby="titulo-servicos" className="mt-6">
          <h2 id="titulo-servicos" className="text-xl font-bold">
            Serviços
          </h2>
          {unit.servicesNote && (
            <p className="mt-1 text-sm text-ink-muted">
              Lista baseada na descrição geral das fontes oficiais — confirme a oferta
              diretamente com a unidade.
            </p>
          )}
          <ul className="mt-3 flex flex-wrap gap-2">
            {unit.services.map((slug) => (
              <li
                key={slug}
                className="rounded-full bg-primary-soft px-3 py-1 text-primary"
              >
                {SERVICE_LABELS[slug]}
              </li>
            ))}
          </ul>
        </section>
      )}

      {mates.length > 0 && (
        <section aria-labelledby="titulo-hub" className="mt-6">
          <h2 id="titulo-hub" className="text-xl font-bold">
            No mesmo endereço funcionam:
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            Endereço igual não significa serviço igual — cada unidade abaixo tem
            atendimento próprio.
          </p>
          <ul className="mt-3 grid grid-cols-1 gap-2">
            {mates.map((mate) => (
              <li key={mate.id}>
                <Link
                  to={`/unidade/${mate.id}`}
                  className="flex min-h-touch items-center rounded-md border border-edge px-3 text-primary underline-offset-4 hover:border-primary hover:underline"
                >
                  {mate.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  )
}
