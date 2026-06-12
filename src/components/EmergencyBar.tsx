/**
 * Permanent emergency bar — briefing §2: SAMU 192 (and Bombeiros 193)
 * always visible, never more than one tap away. Fixed to the bottom of
 * the viewport (thumb-reachable on mobile); the app shell reserves
 * matching space so content is never hidden behind it.
 */
export function EmergencyBar() {
  return (
    <nav
      aria-label="Telefones de emergência"
      className="pb-safe fixed inset-x-0 bottom-0 z-50 bg-emergency text-white"
    >
      <ul className="mx-auto flex max-w-screen-md">
        <li className="flex-1">
          <a
            href="tel:192"
            className="flex min-h-touch items-center justify-center gap-1 px-2 font-bold underline-offset-4 hover:underline"
          >
            <span aria-hidden="true">SAMU</span>
            <span className="sr-only">Ligar para o SAMU, telefone</span>
            <span className="text-lg">192</span>
          </a>
        </li>
        <li aria-hidden="true" className="w-px self-stretch bg-white/40" />
        <li className="flex-1">
          <a
            href="tel:193"
            className="flex min-h-touch items-center justify-center gap-1 px-2 font-bold underline-offset-4 hover:underline"
          >
            <span aria-hidden="true">Bombeiros</span>
            <span className="sr-only">Ligar para os Bombeiros, telefone</span>
            <span className="text-lg">193</span>
          </a>
        </li>
      </ul>
    </nav>
  )
}
