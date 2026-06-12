import { EmergencyBar } from './components/EmergencyBar'
import { Card } from './components/Card'
import { activeUnits, dataset } from './data/units'

/** "2026-06-11" -> "11/06/2026" (UI is PT-BR; data dates are ISO). */
function formatDateBR(isoDate: string): string {
  const [year, month, day] = isoDate.split('-')
  return `${day}/${month}/${year}`
}

function App() {
  return (
    /* pb reserves room for the fixed EmergencyBar so content never hides
       behind it (the bar itself handles the iOS safe area). */
    <div className="flex min-h-dvh flex-col pb-14">
      {/* Keyboard/screen-reader users can jump straight to content. */}
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-surface focus:px-4 focus:py-2 focus:font-semibold focus:text-primary"
      >
        Pular para o conteúdo
      </a>

      <header className="bg-primary text-white">
        <div className="mx-auto flex w-full max-w-screen-md flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3">
          <p className="text-lg font-bold">navegador-sus</p>
          <p className="rounded-full border border-white/60 px-3 py-0.5 text-sm">
            versão em desenvolvimento
          </p>
        </div>
      </header>

      <main id="conteudo" className="mx-auto w-full max-w-screen-md grow px-4 py-8">
        <h1 className="text-2xl font-bold">
          Rede pública de saúde de Erechim/RS{' '}
          <span className="font-normal text-ink-muted">(guia em construção)</span>
        </h1>

        {/* Loads the real dataset: proof that the data pipeline works. */}
        <Card className="mt-6">
          <p className="text-lg">
            O guia conhece hoje{' '}
            <strong className="text-primary">{activeUnits.length} unidades ativas</strong>{' '}
            da rede pública de saúde do município.
          </p>
          <p className="mt-2 text-ink-muted">
            O diretório completo, com busca por serviço e bairro, chega na próxima fase.
            Os dados ainda estão em verificação.
          </p>
        </Card>
      </main>

      <footer className="bg-surface-muted">
        <div className="mx-auto w-full max-w-screen-md px-4 py-6 text-ink-muted">
          <p>
            Este app informa e direciona; <strong>não substitui</strong> os canais
            oficiais. Em caso de divergência, vale a informação da unidade ou da
            Secretaria Municipal de Saúde.
          </p>
          <p className="mt-2 text-sm">
            Dados públicos (CNES/DataSUS e Prefeitura de Erechim) levantados em{' '}
            {formatDateBR(dataset.generatedAt)}.
          </p>
        </div>
      </footer>

      <EmergencyBar />
    </div>
  )
}

export default App
