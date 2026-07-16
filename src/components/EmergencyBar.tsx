/**
 * Permanent civic emergency dock — briefing §2. SAMU 192 and Bombeiros 193
 * stay visible and directly actionable on every route. Layout reserves the
 * same tokenized height via `.pb-bar`, including the iOS safe-area inset.
 * The dock is deliberately solid: no shadow, pulse, scale or animation.
 */
function PhoneIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-3.5 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* ti-phone */}
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
    </svg>
  )
}

export function EmergencyBar() {
  return (
    <nav
      aria-label="Telefones de emergência"
      className="pb-safe fixed inset-x-0 bottom-0 z-50 bg-emergency text-white"
    >
      <div className="mx-auto flex h-bar max-w-screen-lg flex-col justify-center gap-1 px-3 py-1.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-4 sm:py-2">
        <div className="flex items-baseline sm:items-center sm:gap-3">
          <p className="font-display text-label font-bold uppercase tracking-[0.08em]">
            Emergência
          </p>
          <span
            aria-hidden="true"
            data-testid="emergency-divider"
            className="hidden h-5 w-px shrink-0 bg-white/35 sm:block"
          />
          <p className="hidden text-meta text-white sm:block">
            Atendimento imediato por telefone
          </p>
        </div>

        <div className="flex min-w-0 max-w-full items-center gap-2">
          <a
            href="tel:192"
            aria-label="Ligar para o SAMU, número 192"
            className="relative inline-flex h-8 items-center justify-center gap-1.5 whitespace-nowrap rounded-pill border border-white bg-white px-3 text-meta font-semibold text-emergency no-underline before:absolute before:-inset-y-[7px] before:inset-x-0 before:content-[''] hover:bg-emergency-soft"
          >
            <PhoneIcon />
            SAMU <span className="font-bold tabular-nums">192</span>
          </a>

          <a
            href="tel:193"
            aria-label="Ligar para os Bombeiros, número 193"
            className="relative inline-flex h-8 items-center justify-center gap-1.5 whitespace-nowrap rounded-pill border border-white/80 bg-transparent px-3 text-meta font-semibold text-white no-underline before:absolute before:-inset-y-[7px] before:inset-x-0 before:content-[''] hover:bg-white/10"
          >
            <PhoneIcon />
            Bombeiros <span className="font-bold tabular-nums">193</span>
          </a>
        </div>
      </div>
    </nav>
  )
}
