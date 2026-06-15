/**
 * Empty state (Etapa Visual 4 / B2). Shown when the citizen's filters return
 * zero units. The kit pin (§8) appears large and faded in `ink-muted`; below
 * it, a brief title in Figtree, a one-line hint, and a teal-text button to
 * clear the filters. No mascot, no colored illustration — the visual identity
 * keeps its discipline even when there's nothing to show.
 */
export function EmptyState({ onClearFilters }: { onClearFilters: () => void }) {
  return (
    <div className="flex flex-col items-center px-4 py-12 text-center">
      <svg
        width="56"
        height="56"
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="mb-4 text-ink-muted opacity-40"
      >
        {/* Pin do logo (kit §8) em currentColor, sem a cruz interna — o
            ícone aqui é decorativo e a cruz branca disputaria com o fundo
            cream/branco do estado vazio. */}
        <path
          d="M12 1.6c-4.3 0-7.8 3.4-7.8 7.5 0 5.3 7.8 13.3 7.8 13.3s7.8-8 7.8-13.3c0-4.1-3.5-7.5-7.8-7.5z"
          fill="currentColor"
        />
      </svg>
      <h2 className="mb-1 font-display text-[16px] font-bold text-ink">
        Nenhuma unidade combina com os filtros
      </h2>
      <p className="mb-5 max-w-[280px] text-[13px] text-ink-muted">
        Tente remover algum filtro ou usar termos mais amplos na busca.
      </p>
      <button
        type="button"
        onClick={onClearFilters}
        className="inline-flex min-h-touch items-center justify-center gap-2 rounded-[4px] border border-primary bg-surface px-4 py-[10px] text-[13px] font-semibold text-primary no-underline transition-colors duration-[180ms] ease-out hover:bg-primary-soft"
      >
        Limpar filtros
      </button>
    </div>
  )
}
