import { Link } from 'react-router'
import { usePageTitle } from '../lib/route-focus'

/**
 * Textual map of the public network's access points. This page explains how
 * the system is organized; it never interprets symptoms, diagnoses, severity
 * or conduct. Emergency phone actions remain direct and unconditional.
 */
export function WhereToGoPage() {
  usePageTitle('Onde ir? Como a rede de saúde se organiza')

  return (
    <>
      <header className="max-w-3xl">
        <p className="text-meta font-semibold uppercase tracking-[0.08em] text-primary">
          Portas de acesso ao SUS em Erechim
        </p>
        <h1 id="page-title" tabIndex={-1} className="mt-2 font-display text-display-lg">
          Onde ir?
        </h1>
        <p className="mt-2 text-ink-muted">
          Veja como a rede pública se organiza e quais canais já estão disponíveis neste
          guia.
        </p>
      </header>

      <section
        aria-labelledby="titulo-emergencia"
        data-testid="emergency-care-card"
        className="mt-6 bg-emergency-soft px-4 py-5 sm:px-5"
      >
        <div className="grid gap-3 sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-6">
          <p className="text-meta font-bold uppercase tracking-[0.08em] text-emergency">
            Acesso imediato
          </p>
          <div>
            <div className="flex items-start gap-3">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="mt-0.5 size-6 shrink-0 text-emergency"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.97.36 1.92.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.89.34 1.84.57 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <div>
                <h2
                  id="titulo-emergencia"
                  className="font-display text-title text-emergency"
                >
                  Emergência com risco de vida
                </h2>
                <p className="mt-1">
                  Ligue imediatamente — o atendimento vai até você. O 192 é o SAMU
                  (Serviço de Atendimento Móvel de Urgência); o 193 é o resgate do Corpo
                  de Bombeiros.
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href="tel:192"
                aria-label="Ligar para o SAMU, número 192"
                className="inline-flex min-h-touch items-center rounded-pill bg-emergency px-4 text-label font-bold text-white no-underline hover:bg-emergency-strong"
              >
                SAMU 192
              </a>
              <a
                href="tel:193"
                aria-label="Ligar para os Bombeiros, número 193"
                className="inline-flex min-h-touch items-center rounded-pill bg-white px-4 text-label font-bold text-emergency no-underline hover:bg-bg"
              >
                Bombeiros 193
              </a>
            </div>
          </div>
        </div>
      </section>

      <div data-testid="care-path-bands" className="mt-6 border-t border-edge">
        <section
          aria-labelledby="titulo-urgencia"
          data-access-row
          className="grid gap-2 border-b border-edge py-5 sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-6"
        >
          <p className="text-meta font-semibold uppercase tracking-[0.08em] text-ink-muted">
            Atendimento presencial
          </p>
          <div>
            <h2 id="titulo-urgencia" className="font-display text-title">
              Urgência sem risco de vida
            </h2>
            <p className="mt-1">
              A prefeitura mantém o Pronto Atendimento municipal (UMRS), na Rua Alemanha,
              985.{' '}
              <strong>
                O horário de funcionamento não está confirmado — ligue antes de ir.
              </strong>
            </p>
            <Link
              to="/unidade/pronto-atendimento-umrs"
              className="mt-2 inline-flex min-h-touch items-center font-semibold text-primary underline underline-offset-4"
            >
              Ver o Pronto Atendimento
            </Link>
          </div>
        </section>

        <section
          aria-labelledby="titulo-rotina"
          data-access-row
          className="grid gap-2 border-b border-edge py-5 sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-6"
        >
          <p className="text-meta font-semibold uppercase tracking-[0.08em] text-ink-muted">
            Porta de entrada
          </p>
          <div>
            <h2 id="titulo-rotina" className="font-display text-title">
              Rotina e acompanhamento
            </h2>
            <p className="mt-1">
              A porta de entrada do dia a dia é a UBS (posto de saúde) do seu bairro, para
              os serviços de rotina e o acompanhamento contínuo.
            </p>
            <Link
              to="/?tipo=ubs"
              className="mt-2 inline-flex min-h-touch items-center font-semibold text-primary underline underline-offset-4"
            >
              Ver as UBS (postos de saúde)
            </Link>
          </div>
        </section>

        <section
          aria-labelledby="titulo-especialidades"
          data-access-row
          className="grid gap-2 border-b border-edge py-5 sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-6"
        >
          <p className="text-meta font-semibold uppercase tracking-[0.08em] text-ink-muted">
            Acesso encaminhado
          </p>
          <div>
            <h2 id="titulo-especialidades" className="font-display text-title">
              Especialidades
            </h2>
            <p className="mt-1">
              O atendimento especializado (CRE, CEO, CAPS e outros) funciona{' '}
              <strong>por encaminhamento</strong>. O acesso começa pela rede de atenção
              básica.
            </p>
          </div>
        </section>
      </div>

      <p className="mt-6 border-t border-border-strong py-4 text-ink-muted">
        Na dúvida, ligue para a unidade antes de sair de casa ou consulte os canais
        oficiais da Prefeitura e da Secretaria Municipal de Saúde — em caso de
        divergência, são eles que valem.
      </p>
    </>
  )
}
