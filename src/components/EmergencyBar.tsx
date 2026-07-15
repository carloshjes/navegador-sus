/**
 * Permanent civic emergency dock — briefing §2. SAMU 192 and Bombeiros 193
 * stay visible and directly actionable on every route. Layout reserves the
 * same tokenized height via `.pb-bar`, including the iOS safe-area inset.
 * The dock is deliberately solid: no shadow, pulse, scale or animation.
 */
export function EmergencyBar() {
  return (
    <nav
      aria-label="Telefones de emergência"
      className="pb-safe fixed inset-x-0 bottom-0 z-50 bg-emergency text-white"
    >
      <div className="mx-auto flex h-bar max-w-screen-lg flex-col justify-center gap-1 px-3 py-1.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-4 sm:py-2">
        <div className="flex items-baseline gap-3 sm:block">
          <p className="font-display text-label font-bold uppercase tracking-[0.08em]">
            Emergência
          </p>
          <p className="hidden text-meta text-white sm:mt-0.5 sm:block">
            Atendimento imediato por telefone
          </p>
        </div>

        <div className="flex min-w-0 max-w-full items-center gap-2">
          <a
            href="tel:192"
            aria-label="Ligar para o SAMU, número 192"
            className="inline-flex min-h-touch items-center justify-center whitespace-nowrap rounded-pill bg-white px-3 text-label font-semibold text-emergency no-underline hover:bg-emergency-soft"
          >
            SAMU&nbsp;<strong>192</strong>
          </a>

          <a
            href="tel:193"
            aria-label="Ligar para os Bombeiros, número 193"
            className="inline-flex min-h-touch items-center justify-center whitespace-nowrap rounded-pill bg-white/15 px-3 text-label font-semibold text-white no-underline hover:bg-white/20"
          >
            Bombeiros&nbsp;<strong>193</strong>
          </a>
        </div>
      </div>
    </nav>
  )
}
