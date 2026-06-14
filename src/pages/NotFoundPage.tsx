import { Link } from 'react-router'
import { usePageTitle } from '../lib/route-focus'

/** Friendly 404 — also rendered for hidden/unknown unit slugs. */
export function NotFoundPage() {
  usePageTitle('Página não encontrada')

  return (
    <>
      <h1 id="page-title" tabIndex={-1} className="font-display text-display-lg">
        Página não encontrada
      </h1>
      <p className="mt-2 text-ink-muted">
        O endereço pode estar errado, ou esta unidade não está disponível no guia.
      </p>
      <p className="mt-4">
        <Link to="/" className="font-semibold text-primary underline underline-offset-4">
          Ir para o diretório de unidades
        </Link>
      </p>
    </>
  )
}
