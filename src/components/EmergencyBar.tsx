/**
 * Permanent emergency bar — briefing §2: SAMU 192 always visible, never more
 * than one tap away. Fixed to the bottom of the viewport (thumb-reachable on
 * mobile); Layout reserves matching space via `.pb-bar` so content is never
 * hidden behind it.
 *
 * Etapa Visual 2 / B3: redesigned as a single SAMU action — `ti-phone-call`
 * icon + "Emergência" + a white pill with "SAMU 192". Bombeiros 193 stayed
 * in the prompt-approved preview only inside the "Onde ir?" page; this is a
 * deliberate deviation from briefing §2 (which named the 193 too), recorded
 * in docs/resumo-etapa-visual-2.md. White text/icon on `emergency` red is
 * 7.07:1 (AAA); the white pill puts the dialable number in extra evidence.
 */
export function EmergencyBar() {
  return (
    <nav
      aria-label="Telefones de emergência"
      className="pb-safe fixed inset-x-0 bottom-0 z-50 bg-emergency text-white"
    >
      <div className="mx-auto flex max-w-screen-lg justify-center px-4">
        <a
          href="tel:192"
          className="flex h-bar min-h-touch items-center gap-3 px-2 font-semibold underline-offset-4 hover:underline"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="size-5 shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Phone-call glyph (compact, no third-party icon font). */}
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.97.36 1.92.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.89.34 1.84.57 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          <span>Emergência</span>
          <span className="rounded-pill bg-white px-3 py-1 text-label font-bold text-emergency">
            <span className="sr-only">Ligar para o SAMU, telefone </span>
            SAMU 192
          </span>
        </a>
      </div>
    </nav>
  )
}
