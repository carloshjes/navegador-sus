import { Link } from 'react-router'
import { usePageTitle } from '../lib/route-focus'
import { Card } from '../components/Card'

/**
 * Navigational explainer ONLY (report §2). Hard limits from CLAUDE.md:
 * this page explains HOW THE SYSTEM IS ORGANIZED — it never mentions
 * symptoms, never suggests what condition goes where, never recommends
 * conduct. That would be triage, which this app must never do.
 */
export function WhereToGoPage() {
  usePageTitle('Onde ir? Como a rede de saúde se organiza')

  return (
    <>
      <h1 id="page-title" tabIndex={-1} className="font-display text-display-lg">
        Onde ir? Como a rede de saúde de Erechim se organiza
      </h1>
      <p className="mt-2 text-ink-muted">
        O SUS de Erechim funciona em camadas. Saber qual porta usar economiza tempo — o
        seu e o de quem precisa do atendimento.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4">
        {/* Emergency card (Etapa Visual 2 / B4): clean block, no left ribbon.
            Subtle full border, phone icon in `emergency`, and the two numbers
            as big dial-pill links — the "ti-phone-call" affordance is the
            shape, not a framework callout. */}
        <Card className="bg-[#FCEBEB]">
          <div className="flex items-start gap-3">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="mt-1 size-6 shrink-0 text-emergency"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.97.36 1.92.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.89.34 1.84.57 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <div>
              <h2 className="font-display text-title text-emergency">
                Emergência com risco de vida
              </h2>
              <p className="mt-1">
                Ligue imediatamente — o atendimento vai até você. O 192 é o SAMU (Serviço
                de Atendimento Móvel de Urgência); o 193 é o resgate do Corpo de
                Bombeiros.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <a
                  href="tel:192"
                  className="inline-flex min-h-touch items-center rounded-pill bg-emergency px-4 font-bold text-white underline-offset-4 hover:underline"
                >
                  <span className="sr-only">Ligar para o SAMU, telefone </span>
                  SAMU 192
                </a>
                <a
                  href="tel:193"
                  className="inline-flex min-h-touch items-center rounded-pill bg-emergency px-4 font-bold text-white underline-offset-4 hover:underline"
                >
                  <span className="sr-only">Ligar para os Bombeiros, telefone </span>
                  Bombeiros 193
                </a>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="font-display text-title">
            Urgência que não é emergência com risco de vida
          </h2>
          <p className="mt-1">
            A prefeitura mantém o{' '}
            <Link
              to="/unidade/pronto-atendimento-umrs"
              className="font-semibold text-primary underline underline-offset-4"
            >
              Pronto Atendimento municipal (UMRS)
            </Link>
            , na Rua Alemanha, 985.{' '}
            <strong>
              O horário de funcionamento não está confirmado — ligue antes de ir.
            </strong>
          </p>
        </Card>

        <Card>
          <h2 className="font-display text-title">Rotina e acompanhamento</h2>
          <p className="mt-1">
            A porta de entrada do dia a dia é a{' '}
            <Link
              to="/?tipo=ubs"
              className="font-semibold text-primary underline underline-offset-4"
            >
              UBS (posto de saúde) do seu bairro
            </Link>
            : consultas, vacinas, curativos, exames, retirada de medicamentos e
            acompanhamento contínuo.
          </p>
        </Card>

        <Card>
          <h2 className="font-display text-title">Especialidades</h2>
          <p className="mt-1">
            O atendimento especializado (CRE, CEO, CAPS e outros) funciona{' '}
            <strong>por encaminhamento</strong>: o caminho começa na sua UBS, que avalia e
            encaminha quando necessário.
          </p>
        </Card>
      </div>

      <p className="mt-6 rounded-lg border border-edge bg-surface p-4 text-ink-muted">
        Na dúvida, ligue para a unidade antes de sair de casa ou consulte os canais
        oficiais da Prefeitura e da Secretaria Municipal de Saúde — em caso de
        divergência, são eles que valem.
      </p>
    </>
  )
}
