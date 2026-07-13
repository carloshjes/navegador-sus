import type { UnitWithDistance } from '../lib/nearby'
import type { GeolocationState } from '../lib/useGeolocation'
import { Button } from './Button'
import { LocateButton } from './LocateButton'
import { UnitCard } from './UnitCard'

interface QuickLocateBandProps {
  state: GeolocationState
  nearestUnit?: UnitWithDistance
  onLocate: () => void
  onReset: () => void
}

/**
 * Full-width geolocation action and nearest-unit preview for the directory.
 * Position and distance stay owned by DirectoryPage; this component only
 * presents the current geolocation state.
 */
export function QuickLocateBand({
  state,
  nearestUnit,
  onLocate,
  onReset,
}: QuickLocateBandProps) {
  const granted = state.status === 'granted'

  return (
    <section
      aria-label="Ordenar pelas mais próximas"
      data-testid="quick-locate-band"
      className="mt-4 rounded-lg border border-edge bg-primary-soft p-3 sm:p-4 lg:mt-5"
    >
      {!granted && (
        <>
          <div className="flex flex-col items-stretch gap-2 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
            <div>
              <p className="font-semibold text-ink">Ver as unidades mais próximas</p>
              <p className="text-meta text-ink-muted">
                Localização usada só neste aparelho, nunca enviada a um servidor.
              </p>
            </div>
            <LocateButton
              onClick={onLocate}
              aria-label="Ver as mais próximas de mim"
              disabled={state.status === 'prompting'}
              fullWidthMobile
            >
              {state.status === 'prompting' ? 'Obtendo localização…' : 'Localizar'}
            </LocateButton>
          </div>

          {state.status === 'denied' && (
            <p className="mt-2 text-ink-muted">
              Tudo bem — sem a localização, você pode <strong>filtrar por bairro</strong>{' '}
              acima para encontrar unidades perto de você.
            </p>
          )}
          {state.status === 'unavailable' && (
            <p className="mt-2 text-ink-muted">
              Não foi possível obter a localização neste dispositivo. Use o{' '}
              <strong>filtro por bairro</strong> acima.
            </p>
          )}
        </>
      )}

      {granted && (
        <div className="grid gap-3 lg:grid-cols-[minmax(0,0.85fr)_minmax(280px,1.15fr)] lg:items-stretch lg:gap-6">
          <div className="flex flex-col justify-center">
            <p className="font-semibold text-primary">
              Unidades ordenadas pelas mais próximas de você.
            </p>
            {/* Fixed honesty caveat — never the label "sua unidade". */}
            <p className="mt-1 text-ink">
              A unidade mais próxima pode <strong>não ser</strong> a que atende o seu
              endereço — isso é definido por território (equipes de Saúde da Família).
              Confirme na unidade ou na Secretaria de Saúde.
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-x-4">
              <a
                href="#directory-results-grid"
                className="inline-flex min-h-touch items-center text-label font-semibold text-primary underline underline-offset-4"
              >
                Ver todas ordenadas por distância
              </a>
              <Button onClick={onReset} variant="ghost" className="px-0">
                Desfazer ordenação por distância
              </Button>
            </div>
          </div>

          <div aria-live="polite" data-testid="quick-locate-preview" className="flex">
            {nearestUnit && (
              <UnitCard unit={nearestUnit.unit} distanceMeters={nearestUnit.distance} />
            )}
          </div>
        </div>
      )}
    </section>
  )
}
