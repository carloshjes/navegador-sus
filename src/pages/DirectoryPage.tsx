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
  serviceSummaryLabel,
} from '../data/labels'
import { matchesQuery } from '../lib/search'
import { withDistances } from '../lib/nearby'
import { useGeolocation } from '../lib/useGeolocation'
import { usePageTitle } from '../lib/route-focus'
import { EmptyState } from '../components/EmptyState'
import { Eyebrow } from '../components/Eyebrow'
import { FilterChipGroup } from '../components/FilterChipGroup'
import { FiltersBar, type ActiveFilter } from '../components/FiltersBar'
import { QuickLocateBand } from '../components/QuickLocateBand'
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

/* Inline glyphs (kept here because they're only used in the search input).
   Tabler-shaped, currentColor — same approach as Badge / LocateButton. */
function SearchGlyph() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="10" cy="10" r="6" />
      <path d="m20 20-5.2-5.2" />
    </svg>
  )
}

function XGlyph() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
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
     Each consultation list is ordered priority-first: the choices citizens
     reach for stay above the inline "Ver mais" disclosure. */
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

  /* Visible options per group before the inline disclosure. Type priority
     covers 8 of 11 types in the dataset. */
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
  // Active state includes geolocation: "perto de mim" mutates the order,
  // so the citizen should be able to reset it from the same "Limpar filtros"
  // affordance (Etapa Visual 4 / B1). clearEverything resets filters AND geo.
  const clearEverything = () => {
    clearFilters()
    if (geo.state.status === 'granted') geo.reset()
  }

  /* Build the removable active-filter actions from each URL param and
     geolocation. Each entry carries its own `onRemove`, so FiltersBar stays
     unaware of the data model. */
  const activeFilters: ActiveFilter[] = []
  if (filters.q !== '') {
    activeFilters.push({
      key: 'q',
      label: `Busca: "${filters.q}"`,
      onRemove: () => setFilter('q', ''),
    })
  }
  if (filters.tipo !== '') {
    activeFilters.push({
      key: 'tipo',
      label: `Tipo: ${UNIT_TYPE_SHORT_LABELS[filters.tipo as UnitType]}`,
      onRemove: () => setFilter('tipo', ''),
    })
  }
  if (filters.servico !== '') {
    activeFilters.push({
      key: 'servico',
      label: `Serviço: ${serviceSummaryLabel(filters.servico as ServiceSlug)}`,
      onRemove: () => setFilter('servico', ''),
    })
  }
  if (filters.bairro !== '') {
    activeFilters.push({
      key: 'bairro',
      label: `Bairro: ${filters.bairro}`,
      onRemove: () => setFilter('bairro', ''),
    })
  }
  if (geo.state.status === 'granted') {
    activeFilters.push({
      key: 'geo',
      label: 'Perto de mim',
      onRemove: () => geo.reset(),
    })
  }

  /* Search input + accessible radio groups. One DOM composition serves the
     sticky desktop consultation area and the inline mobile disclosures. */
  const searchAndFilters = (
    /* <search> is already a search landmark — no role attribute needed. */
    <search aria-label="Buscar e filtrar unidades">
      <form className="flex flex-col" onSubmit={(event) => event.preventDefault()}>
        <div className="pb-4">
          <label htmlFor="busca" className="mb-1 block font-semibold">
            Buscar por nome, bairro ou serviço
          </label>
          {/* Etapa Visual 5 / C: search input ergonomics. The wrapper is
              `relative` so the icon + clear button can sit on top of the
              field. ps-10 reserves space for the leading magnifier; the
              trailing × is 44×44 (touch floor) and only renders when the
              field has text. The clear button calls setFilter('q', ''). */}
          <div className="relative">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
            >
              <SearchGlyph />
            </span>
            <input
              id="busca"
              type="search"
              value={filters.q}
              onChange={(event) => setFilter('q', event.target.value)}
              placeholder="Ex.: vacina, Capoerê, dentista…"
              className="min-h-touch w-full rounded-md border border-edge bg-surface ps-10 pe-12 text-ink"
            />
            {filters.q !== '' && (
              <button
                type="button"
                onClick={() => setFilter('q', '')}
                aria-label="Limpar busca"
                className="absolute right-1 top-1/2 inline-flex size-touch -translate-y-1/2 items-center justify-center rounded-md text-ink-muted hover:bg-bg"
              >
                <XGlyph />
              </button>
            )}
          </div>
        </div>

        <FilterChipGroup
          legend="Tipo de unidade"
          options={options.types.map((type) => ({
            value: type,
            label: UNIT_TYPE_LABELS[type],
          }))}
          value={filters.tipo}
          onChange={(v) => setFilter('tipo', v)}
          prioritySlots={TYPE_VISIBLE}
          moreLabel="tipos"
        />

        <FilterChipGroup
          legend="Serviço"
          options={options.services.map((slug) => ({
            value: slug,
            label: SERVICE_LABELS[slug],
          }))}
          value={filters.servico}
          onChange={(v) => setFilter('servico', v)}
          prioritySlots={SERVICE_VISIBLE}
          moreLabel="serviços"
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
          moreLabel="bairros"
        />
      </form>
    </search>
  )

  /* Results column. `aria-live="polite"` on the count announces the number
     to screen readers whenever filters change. FiltersBar exposes each
     active choice as a removable text action. */
  const resultsColumn = (
    <section aria-label="Resultados" aria-live="polite">
      {!nothingFound && (
        <FiltersBar
          count={totalResults}
          activeFilters={activeFilters}
          onClearAll={clearEverything}
        />
      )}

      {nothingFound && <EmptyState onClearFilters={clearEverything} />}

      {care.length > 0 && (
        <section aria-labelledby="titulo-atendimento">
          <h2 id="titulo-atendimento" className="sr-only">
            Unidades de atendimento
          </h2>
          <ul
            id="directory-results-grid"
            className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4"
          >
            {careWithDistance.map(({ unit, distance }) => (
              <li key={unit.id} className="flex">
                <UnitCard unit={unit} distanceMeters={distance} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {comingSoon.length > 0 && (
        <section aria-labelledby="titulo-em-breve" className="mt-6">
          <h2 id="titulo-em-breve" className="font-display text-display">
            Em breve
          </h2>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            {comingSoon.map((unit) => (
              <li key={unit.id} className="flex">
                <UnitCard unit={unit} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {institutional.length > 0 && (
        <section aria-labelledby="titulo-institucional" className="mt-6">
          <h2 id="titulo-institucional" className="font-display text-display">
            Órgãos e contatos institucionais
          </h2>
          <p className="mt-1 text-ink-muted">
            Gestão e vigilância em saúde — não são locais de atendimento de rotina.
          </p>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:gap-4">
            {institutional.map((unit) => (
              <li key={unit.id} className="flex">
                <UnitCard unit={unit} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </section>
  )

  return (
    <>
      <Eyebrow>Erechim — RS</Eyebrow>
      {/* Hero (Etapa Visual 3 / C1): Figtree 700, tightened metrics; the
          phrase "rede pública" takes the brand pine, ending with a darker
          primary dot — the kit motif applied at title scale. The page title is the
          same a11y target (id="page-title", tabIndex={-1}) so route-focus
          keeps working. */}
      <h1
        id="page-title"
        tabIndex={-1}
        className="mt-2 font-display text-display-xl sm:text-[38px]"
      >
        Encontre a sua unidade da{' '}
        <span className="text-primary">
          rede pública
          <span aria-hidden="true" className="text-primary-ink">
            .
          </span>
        </span>
      </h1>
      <p className="mt-3 text-ink-muted">
        O guia conhece hoje{' '}
        {/* Count phrase (C2): Figtree 700 with the sentence-final dot in
            primary-ink — the brand motif applied to a number that matters.
            "ativas" stays in to distinguish from planned/deactivated units
            (data-honesty word from briefing §5). */}
        <strong className="font-display text-ink">
          {activeUnits.length} unidades ativas
          <span aria-hidden="true" className="text-primary-ink">
            .
          </span>
        </strong>{' '}
        Dados ainda em verificação — confirme por telefone antes de ir.{' '}
        {/* Discreet "v. desenvolvimento" marker, never a flashy ribbon. */}
        <span className="ms-1 inline-block align-middle text-meta text-ink-muted">
          (versão em desenvolvimento)
        </span>
      </p>

      <QuickLocateBand
        state={geo.state}
        nearestUnit={careWithDistance[0]}
        onLocate={geo.request}
        onReset={geo.reset}
      />

      {/* Two-column directory at lg: (≥ 1024px). The 272px consultation rail
          holds search + radio lists; the right
          column carries the FiltersBar + results. Below lg the layout falls
          back to the V4 stack — children render sequentially in DOM order,
          which already matches the mobile flow we want.

          Why `minmax(0, 1fr)` and not `1fr`: in CSS grid, a track's min-width
          defaults to `auto`, which is the **intrinsic** content min-width.
          Long card text would push the column wider than the container and
          create horizontal overflow. `minmax(0, 1fr)` overrides that floor
          so the column can actually shrink to fit. */}
      <div
        className="mt-6 lg:grid lg:grid-cols-[272px_minmax(0,1fr)] lg:gap-6"
        data-testid="directory-grid"
      >
        <aside
          data-testid="filters-sidebar"
          className="flex flex-col lg:sticky lg:top-4 lg:self-start"
        >
          {searchAndFilters}
        </aside>
        {/* mt-6 only below lg — on the desktop grid, the gap-6 already spaces
            this column from the sidebar (and the column starts at row 1). */}
        <div className="mt-6 lg:mt-0">{resultsColumn}</div>
      </div>
    </>
  )
}
