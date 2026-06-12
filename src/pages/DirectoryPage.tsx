import { useMemo } from 'react'
import { useSearchParams } from 'react-router'
import { activeUnits, dataset } from '../data/units'
import type { HealthUnit, ServiceSlug, UnitType } from '../data/types'
import { compareUnitsForListing, displayCategory } from '../data/display-policy'
import { SERVICE_LABELS, UNIT_TYPE_LABELS } from '../data/labels'
import { matchesQuery } from '../lib/search'
import { usePageTitle } from '../lib/route-focus'
import { Button } from '../components/Button'
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

  /* Filter options reflect what actually exists among displayed units. */
  const options = useMemo(() => {
    const visible = [...sections.care, ...sections.comingSoon, ...sections.institutional]
    const services = new Set<ServiceSlug>()
    const types = new Set<UnitType>()
    const neighborhoods = new Set<string>()
    for (const unit of visible) {
      for (const slug of unit.services) services.add(slug)
      types.add(unit.type)
      if (unit.address.neighborhood) neighborhoods.add(unit.address.neighborhood)
    }
    const byLabel = (a: string, b: string) => a.localeCompare(b, 'pt-BR')
    return {
      services: [...services].sort((a, b) =>
        byLabel(SERVICE_LABELS[a], SERVICE_LABELS[b]),
      ),
      types: [...types].sort((a, b) => byLabel(UNIT_TYPE_LABELS[a], UNIT_TYPE_LABELS[b])),
      neighborhoods: [...neighborhoods].sort(byLabel),
    }
  }, [sections])

  const care = sections.care.filter((unit) => matchesFilters(unit, filters))
  const comingSoon = sections.comingSoon.filter((unit) => matchesFilters(unit, filters))
  const institutional = sections.institutional.filter((unit) =>
    matchesFilters(unit, filters),
  )

  const nothingFound = care.length + comingSoon.length + institutional.length === 0
  const filtering =
    filters.q !== '' ||
    filters.servico !== '' ||
    filters.tipo !== '' ||
    filters.bairro !== ''

  const selectClass =
    'min-h-touch w-full rounded-md border border-edge bg-surface px-3 text-ink'

  return (
    <>
      <h1 id="page-title" tabIndex={-1} className="text-2xl font-bold">
        Rede pública de saúde de Erechim/RS
      </h1>
      <p className="mt-2 text-ink-muted">
        O guia conhece hoje <strong>{activeUnits.length} unidades ativas</strong> da rede
        pública do município. Os dados ainda estão em verificação — confirme por telefone
        antes de ir.
      </p>

      {/* Search + filters; state mirrored in the URL (shareable links).
          <search> is already a search landmark — no role attribute needed. */}
      <search aria-label="Buscar e filtrar unidades">
        <form
          className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2"
          onSubmit={(event) => event.preventDefault()}
        >
          <div className="sm:col-span-2">
            <label htmlFor="busca" className="mb-1 block font-semibold">
              Buscar por nome, bairro ou serviço
            </label>
            <input
              id="busca"
              type="search"
              value={filters.q}
              onChange={(event) => setFilter('q', event.target.value)}
              placeholder="Ex.: vacina, Capoerê, dentista…"
              className={selectClass}
            />
          </div>

          <div>
            <label htmlFor="filtro-servico" className="mb-1 block font-semibold">
              Serviço
            </label>
            <select
              id="filtro-servico"
              value={filters.servico}
              onChange={(event) => setFilter('servico', event.target.value)}
              className={selectClass}
            >
              <option value="">Todos os serviços</option>
              {options.services.map((slug) => (
                <option key={slug} value={slug}>
                  {SERVICE_LABELS[slug]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="filtro-tipo" className="mb-1 block font-semibold">
              Tipo de unidade
            </label>
            <select
              id="filtro-tipo"
              value={filters.tipo}
              onChange={(event) => setFilter('tipo', event.target.value)}
              className={selectClass}
            >
              <option value="">Todos os tipos</option>
              {options.types.map((type) => (
                <option key={type} value={type}>
                  {UNIT_TYPE_LABELS[type]}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="filtro-bairro" className="mb-1 block font-semibold">
              Bairro da unidade
            </label>
            <select
              id="filtro-bairro"
              value={filters.bairro}
              onChange={(event) => setFilter('bairro', event.target.value)}
              className={selectClass}
            >
              <option value="">Todos os bairros</option>
              {options.neighborhoods.map((neighborhood) => (
                <option key={neighborhood} value={neighborhood}>
                  {neighborhood}
                </option>
              ))}
            </select>
          </div>
        </form>
      </search>

      {/* Result count announced to screen readers on every change. */}
      <p aria-live="polite" className="mt-4 text-ink-muted">
        {nothingFound
          ? 'Nenhuma unidade encontrada.'
          : `${care.length + comingSoon.length + institutional.length} resultado(s).`}
      </p>

      {nothingFound && (
        <div className="mt-4 rounded-lg border border-edge bg-surface-muted p-6 text-center">
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
        <section aria-labelledby="titulo-atendimento" className="mt-6">
          <h2 id="titulo-atendimento" className="sr-only">
            Unidades de atendimento
          </h2>
          <ul className="grid grid-cols-1 gap-3">
            {care.map((unit) => (
              <li key={unit.id}>
                <UnitCard unit={unit} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {comingSoon.length > 0 && (
        <section aria-labelledby="titulo-em-breve" className="mt-8">
          <h2 id="titulo-em-breve" className="text-xl font-bold">
            Em breve
          </h2>
          <ul className="mt-3 grid grid-cols-1 gap-3">
            {comingSoon.map((unit) => (
              <li key={unit.id}>
                <UnitCard unit={unit} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {institutional.length > 0 && (
        <section aria-labelledby="titulo-institucional" className="mt-8">
          <h2 id="titulo-institucional" className="text-xl font-bold">
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
