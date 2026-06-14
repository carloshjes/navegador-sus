import { useMemo } from 'react'
import { useSearchParams } from 'react-router'
import { activeUnits, dataset } from '../data/units'
import type { HealthUnit, ServiceSlug, UnitType } from '../data/types'
import { compareUnitsForListing, displayCategory } from '../data/display-policy'
import {
  SERVICE_FILTER_PRIORITY,
  SERVICE_LABELS,
  TYPE_FILTER_PRIORITY,
  UNIT_TYPE_LABELS,
  UNIT_TYPE_SHORT_LABELS,
  serviceChipLabel,
} from '../data/labels'
import { matchesQuery } from '../lib/search'
import { withDistances } from '../lib/nearby'
import { useGeolocation } from '../lib/useGeolocation'
import { usePageTitle } from '../lib/route-focus'
import { Button } from '../components/Button'
import { FilterChipGroup } from '../components/FilterChipGroup'
import { UnitCard } from '../components/UnitCard'

/** Filter state lives in the URL so any view is a shareable link. */
interface Filters {
  q: string
  servico: string
  tipo: string
  bairro: string
}

function matchesFilters(unit: HealthUnit, filters: Filters): boolean {
  if (!matchesQuery(unit, filters.q)) return false
  if (filters.servico && !unit.services.includes(filters.servico as ServiceSlug)) {
    return false
  }
  if (filters.tipo && unit.type !== filters.tipo) return false
  // Neighborhood filter uses the unit's own address ONLY: ESF coverage
  // areas are still unmapped (critical gap #3) — no "your unit" guesses.
  if (filters.bairro && unit.address.neighborhood !== filters.bairro) return false
  return true
}

export function DirectoryPage() {
  usePageTitle('Rede pública de saúde de Erechim/RS')
  const [searchParams, setSearchParams] = useSearchParams()

  const filters: Filters = {
    q: searchParams.get('q') ?? '',
    servico: searchParams.get('servico') ?? '',
    tipo: searchParams.get('tipo') ?? '',
    bairro: searchParams.get('bairro') ?? '',
  }

  const setFilter = (key: keyof Filters, value: string) => {
    const next = new URLSearchParams(searchParams)
    if (value) {
      next.set(key, value)
    } else {
      next.delete(key)
    }
    // replace: typing in the search box must not pile up history entries.
    setSearchParams(next, { replace: true })
  }

  const clearFilters = () => setSearchParams({}, { replace: true })

  /* Categorize the whole dataset once; filters re-evaluate per keystroke. */
  const sections = useMemo(() => {
    const care: HealthUnit[] = []
    const comingSoon: HealthUnit[] = []
    const institutional: HealthUnit[] = []
    for (const unit of dataset.units) {
      const category = displayCategory(unit)
      if (category === 'care' || category === 'care-restricted') care.push(unit)
      else if (category === 'care-cautious') care.push(unit)
      else if (category === 'coming-soon') comingSoon.push(unit)
      else if (category === 'institutional') institutional.push(unit)
      // 'hidden' never renders anywhere.
    }
    care.sort(compareUnitsForListing)
    institutional.sort(compareUnitsForListing)
    return { care, comingSoon, institutional }
  }, [])

  /* Filter options reflect what actually exists among displayed units.
     Each list is ordered priority-first (Etapa Visual 2 / B5): the chips
     the citizen reaches for live up top; the rest stay behind "Mais …". */
  const options = useMemo(() => {
    const visible = [...sections.care, ...sections.comingSoon, ...sections.institutional]
    const services = new Set<ServiceSlug>()
    const types = new Set<UnitType>()
    const neighborhoodCount = new Map<string, number>()
    for (const unit of visible) {
      for (const slug of unit.services) services.add(slug)
      types.add(unit.type)
      if (unit.address.neighborhood) {
        const n = unit.address.neighborhood
        neighborhoodCount.set(n, (neighborhoodCount.get(n) ?? 0) + 1)
      }
    }
    const byLabel = (a: string, b: string) => a.localeCompare(b, 'pt-BR')

    // Priority first (in their declared order), the rest alphabetical after.
    const orderByPriority = <T extends string>(
      all: T[],
      priority: readonly T[],
      label: (slug: T) => string,
    ): T[] => {
      const present = new Set(all)
      const head = priority.filter((slug) => present.has(slug))
      const headSet = new Set(head)
      const tail = all.filter((slug) => !headSet.has(slug))
      tail.sort((a, b) => byLabel(label(a), label(b)))
      return [...head, ...tail]
    }

    // Neighborhoods don't have a curated priority list — rank by count of
    // units (more cards = more likely the citizen searches it), tiebreak
    // alphabetical. This gives the same "common upfront" effect for free.
    const neighborhoodsRanked = [...neighborhoodCount.keys()].sort((a, b) => {
      const delta = (neighborhoodCount.get(b) ?? 0) - (neighborhoodCount.get(a) ?? 0)
      return delta !== 0 ? delta : byLabel(a, b)
    })

    return {
      services: orderByPriority(
        [...services],
        SERVICE_FILTER_PRIORITY,
        (s) => SERVICE_LABELS[s],
      ),
      types: orderByPriority(
        [...types],
        TYPE_FILTER_PRIORITY,
        (s) => UNIT_TYPE_LABELS[s],
      ),
      neighborhoods: neighborhoodsRanked,
    }
  }, [sections])

  /* Visible chips per group before "Mais …" (the rest open via disclosure).
     Type priority covers 8 of 11 types in the dataset — the remaining 3
     fit naturally under "Mais tipos". */
  const TYPE_VISIBLE = TYPE_FILTER_PRIORITY.length
  const SERVICE_VISIBLE = SERVICE_FILTER_PRIORITY.length
  const NEIGHBORHOOD_VISIBLE = 6

  const care = sections.care.filter((unit) => matchesFilters(unit, filters))
  const comingSoon = sections.comingSoon.filter((unit) => matchesFilters(unit, filters))
  const institutional = sections.institutional.filter((unit) =>
    matchesFilters(unit, filters),
  )

  // "Perto de mim": position read on-device only, used here to sort the
  // care units by straight-line distance. Never sent anywhere; no reverse
  // geocoding (briefing §2).
  const geo = useGeolocation()
  const userPosition = geo.state.status === 'granted' ? geo.state.position : null
  const careWithDistance = withDistances(care, userPosition)

  const totalResults = care.length + comingSoon.length + institutional.length
  const nothingFound = totalResults === 0
  const filtering =
    filters.q !== '' ||
    filters.servico !== '' ||
    filters.tipo !== '' ||
    filters.bairro !== ''

  return (
    <>
      <h1 id="page-title" tabIndex={-1} className="font-display text-display-lg">
        Rede pública de saúde de Erechim/RS
      </h1>
      <p className="mt-2 text-ink-muted">
        O guia conhece hoje <strong>{activeUnits.length} unidades ativas</strong> da rede
        pública do município. Os dados ainda estão em verificação — confirme por telefone
        antes de ir.{' '}
        {/* "versão em desenvolvimento" moved out of the header (B2): a
            discreet inline marker, never a flashy ribbon. */}
        <span className="ms-1 inline-block align-middle text-meta text-ink-muted">
          (versão em desenvolvimento)
        </span>
      </p>

      {/* Search + filters; state mirrored in the URL (shareable links).
          <search> is already a search landmark — no role attribute needed.
          All three filters are chip groups (Etapa Visual 2 / B5); the
          textual search already covers service and neighborhood, so these
          chips are complements with a "Mais …" disclosure for long lists. */}
      <search aria-label="Buscar e filtrar unidades">
        <form
          className="mt-6 flex flex-col gap-4"
          onSubmit={(event) => event.preventDefault()}
        >
          <div>
            <label htmlFor="busca" className="mb-1 block font-semibold">
              Buscar por nome, bairro ou serviço
            </label>
            <input
              id="busca"
              type="search"
              value={filters.q}
              onChange={(event) => setFilter('q', event.target.value)}
              placeholder="Ex.: vacina, Capoerê, dentista…"
              className="min-h-touch w-full rounded-md border border-edge bg-surface px-3 text-ink"
            />
          </div>

          <FilterChipGroup
            legend="Tipo de unidade"
            options={options.types.map((type) => ({
              value: type,
              label: UNIT_TYPE_SHORT_LABELS[type],
            }))}
            value={filters.tipo}
            onChange={(v) => setFilter('tipo', v)}
            prioritySlots={TYPE_VISIBLE}
            moreLabel="Mais tipos"
          />

          <FilterChipGroup
            legend="Serviço"
            options={options.services.map((slug) => ({
              value: slug,
              label: serviceChipLabel(slug),
            }))}
            value={filters.servico}
            onChange={(v) => setFilter('servico', v)}
            prioritySlots={SERVICE_VISIBLE}
            moreLabel="Mais serviços"
          />

          <FilterChipGroup
            legend="Bairro"
            options={options.neighborhoods.map((name) => ({
              value: name,
              label: name,
            }))}
            value={filters.bairro}
            onChange={(v) => setFilter('bairro', v)}
            prioritySlots={NEIGHBORHOOD_VISIBLE}
            moreLabel="Mais bairros"
          />
        </form>
      </search>

      {/* "Perto de mim": the explanation comes BEFORE the permission prompt
          (briefing §2 — location stays on the device, never sent). */}
      <section aria-label="Ordenar pelas mais próximas" className="mt-8">
        {geo.state.status !== 'granted' && (
          <div className="rounded-lg border border-edge bg-surface p-4">
            <p className="text-ink-muted">
              Podemos ordenar as unidades pelas mais próximas de você. Sua localização é
              usada <strong>só neste aparelho</strong> e nunca é enviada a nenhum
              servidor.
            </p>
            <Button
              onClick={geo.request}
              variant="secondary"
              className="mt-3"
              disabled={geo.state.status === 'prompting'}
            >
              {geo.state.status === 'prompting'
                ? 'Obtendo localização…'
                : 'Ver as mais próximas de mim'}
            </Button>
            {geo.state.status === 'denied' && (
              <p className="mt-3 text-ink-muted">
                Tudo bem — sem a localização, você pode{' '}
                <strong>filtrar por bairro</strong> acima para encontrar unidades perto de
                você.
              </p>
            )}
            {geo.state.status === 'unavailable' && (
              <p className="mt-3 text-ink-muted">
                Não foi possível obter a localização neste dispositivo. Use o{' '}
                <strong>filtro por bairro</strong> acima.
              </p>
            )}
          </div>
        )}
        {geo.state.status === 'granted' && (
          <div className="rounded-lg bg-primary-soft p-4">
            <p className="font-semibold text-primary">
              Unidades ordenadas pelas mais próximas de você.
            </p>
            {/* Fixed honesty caveat — never the label "sua unidade". */}
            <p className="mt-1 text-ink">
              A unidade mais próxima pode <strong>não ser</strong> a que atende o seu
              endereço — isso é definido por território (equipes de Saúde da Família).
              Confirme na unidade ou na Secretaria de Saúde.
            </p>
            <Button onClick={geo.reset} variant="ghost" className="mt-2 px-0">
              Desfazer ordenação por distância
            </Button>
          </div>
        )}
      </section>

      {/* Result count announced to screen readers on every change. PT-BR
          plural: "1 resultado" vs. "N resultados" (Etapa Visual 2 / A3). */}
      <p aria-live="polite" className="mt-4 text-ink-muted">
        {nothingFound
          ? 'Nenhuma unidade encontrada.'
          : `${totalResults} ${totalResults === 1 ? 'resultado' : 'resultados'}.`}
      </p>

      {nothingFound && (
        <div className="mt-4 rounded-lg border border-edge bg-surface p-6 text-center">
          <p className="font-semibold">Nada por aqui com esses critérios.</p>
          <p className="mt-1 text-ink-muted">
            Tente outro termo (a busca aceita escrever sem acento) ou limpe os filtros.
          </p>
          {filtering && (
            <Button onClick={clearFilters} variant="secondary" className="mt-4">
              Limpar busca e filtros
            </Button>
          )}
        </div>
      )}

      {care.length > 0 && (
        <section aria-labelledby="titulo-atendimento" className="mt-8">
          <h2 id="titulo-atendimento" className="sr-only">
            Unidades de atendimento
          </h2>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {careWithDistance.map(({ unit, distance }) => (
              <li key={unit.id}>
                <UnitCard unit={unit} distanceMeters={distance} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {comingSoon.length > 0 && (
        <section aria-labelledby="titulo-em-breve" className="mt-10">
          <h2 id="titulo-em-breve" className="font-display text-display">
            Em breve
          </h2>
          <ul className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {comingSoon.map((unit) => (
              <li key={unit.id}>
                <UnitCard unit={unit} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {institutional.length > 0 && (
        <section aria-labelledby="titulo-institucional" className="mt-10">
          <h2 id="titulo-institucional" className="font-display text-display">
            Órgãos e contatos institucionais
          </h2>
          <p className="mt-1 text-ink-muted">
            Gestão e vigilância em saúde — não são locais de atendimento de rotina.
          </p>
          <ul className="mt-3 grid grid-cols-1 gap-3">
            {institutional.map((unit) => (
              <li key={unit.id}>
                <UnitCard unit={unit} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  )
}
