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
        <Card className="border-l-4 border-l-emergency">
          <h2 className="font-display text-title">Emergência com risco de vida</h2>
          <p className="mt-1">
            Ligue{' '}
            <a
              href="tel:192"
              className="font-bold text-primary underline underline-offset-4"
            >
              192 (SAMU)
            </a>{' '}
            imediatamente — o atendimento vai até você. O resgate do Corpo de Bombeiros
            atende pelo{' '}
            <a
              href="tel:193"
              className="font-bold text-primary underline underline-offset-4"
            >
              193
            </a>
            .
          </p>
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
