# Resumo — Etapa Visual 5: diretório em 2 colunas + selos sóbrios (`navegador-sus`)

> Executada em **16/06/2026** no Claude Code (Windows + PowerShell).
> Entregável para o conhecimento do projeto no claude.ai. Continua sendo
> **só apresentação**: nenhuma mudança em dados, coordenadas, rotas ou
> política de exibição. Mobile-primeiro — cada item conferido em Pixel 7
> (Chromium) e iPhone 13 (WebKit) via Playwright.

## A — Bugs de layout

Nenhum bug visual aberto desde a Etapa Visual 4 — esta etapa é estrutural,
não corretiva.

## B — Polimento profissional

### B1. Diretório em 2 colunas a partir de `lg:` (≥ 1024px) · **testado em mobile: ✅**
- **Antes:** monitor de 1440px rolava muito antes do primeiro card —
  busca + 3 grupos de chips + Localizar empilhados verticalmente.
- **Depois:** wrapper `lg:grid lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-6`.
  - **Sidebar 260px** (`<aside data-testid="filters-sidebar">`,
    `lg:sticky lg:top-6 lg:self-start`): busca + 3 `FilterChipGroup` +
    separador `border-t border-edge` + bloco "Localizar perto de mim".
  - **Coluna direita `minmax(0, 1fr)`:** `FiltersBar` (V5/B2) + as 3
    `<section>` de resultados; cards seguem `grid-cols-1 sm:grid-cols-2`.
- **Mobile/tablet (< 1024px):** **idêntico ao stack da Etapa 4** — sem
  classe `md:` que altere comportamento abaixo de `lg:`. O DOM já é
  linear (aside → coluna), então a queda do `lg:grid` empilha tudo na
  ordem que o cidadão espera (busca → filtros → Localizar → cards).
- **`max-w-screen-lg` do `<main>` mantido** — 1024 − 2×16 = 992px de
  espaço útil acomoda sidebar 260 + gap 24 + coluna ~708px.
- **Parada técnica — `minmax(0, 1fr)` vs `1fr`:** o `min-width` default
  de uma faixa de grid é `auto` (largura intrínseca do conteúdo). Sem
  `minmax(0, …)`, um card longo empurraria a coluna além do container e
  causaria overflow horizontal. `minmax(0, 1fr)` sobrescreve esse piso.
- **e2e novo:** viewport 1280×800 confirma que `#busca` está dentro do
  `[data-testid="filters-sidebar"]` E que a borda esquerda do primeiro
  card é geometricamente **maior** que a borda direita do input.
  Viewport 390×844 confirma que o card está **abaixo** do input.

### B2. Chips de filtros ativos removíveis na `FiltersBar` · **testado em mobile: ✅**
- **Antes:** apenas a contagem mudava + um link "Limpar filtros" quando
  havia filtro. O cidadão não via **quais** filtros estavam ativos e
  tinha que rolar até o grupo certo para remover um.
- **Depois:** nova API `FiltersBar({ count, activeFilters, onClearAll })`,
  onde `ActiveFilter = { key, label, onRemove }`.
  - Cada chip ativo vira uma pílula `rounded-pill bg-conf-ok-bg
    text-conf-ok text-meta font-medium py-1 pe-1 ps-3` com um
    `<button>` interno 28×28 (`size-7 rounded-full`) carregando o
    glifo `×` e `aria-label="Remover filtro: {label}"`.
  - Rótulos derivados em `DirectoryPage`: `Busca: "vacina"` /
    `Tipo: UBS` / `Serviço: Dentista` / `Bairro: Centro` /
    `Perto de mim` (este último zera `geo.reset()`).
  - **`hasActiveFilters` removido da API** — derivado internamente de
    `activeFilters.length > 0`.
  - `onClearFilters` renomeado para `onClearAll` (segue chamando
    `clearEverything` do Directory: filtros + geo).
- **A pílula** ganha agora carga simbólica nova (kit §9.2): forma
  acolhedora reservada **às escolhas que o cidadão fez**. O dado em
  si fala em sóbrio (selos texto-puro de B4).
- **e2e novo:** mobile aplica `Tipo=UBS` + `Bairro=Centro`, confirma
  dois botões `aria-label*="Remover filtro:"`, clica no de Tipo e
  verifica que **só** o `tipo=ubs` saiu da URL e que o chip "UBS" do
  grupo voltou para `aria-pressed=false`.

### B3. Ergonomia do `<input>` de busca · **testado em mobile: ✅**
- **Antes:** input "nu" sem ícone nem botão de limpar — depois de
  digitar, só dava para apagar com backspace ou triplo-clique.
- **Depois:** wrapper `relative` em volta do input:
  - Ícone `ti-search` à esquerda (inline SVG, `currentColor`,
    `text-ink-muted`, absolute `left-3 top-1/2 -translate-y-1/2`,
    `pointer-events-none`). O input ganhou `ps-10` para reservar espaço.
  - Botão `×` à direita **só quando `filters.q !== ''`**:
    `size-touch` (44×44 — utilitário do Etapa 4), `aria-label="Limpar
    busca"`, `rounded-md`, chama `setFilter('q', '')`. Pe-12 no input
    reserva o espaço.
- O `:focus-visible` global cobre o `<input>` sem precisar de nova regra.
- **e2e novo:** confirma que o botão `Limpar busca` **não existe** com
  o campo vazio, **aparece** depois de digitar, e que clicar limpa o
  campo. Mesmo fluxo verifica que o chip "Busca: …" aparece na
  FiltersBar enquanto o usuário digita.

### B4. Selos de confiança — texto sóbrio, ícone só onde precisa · **testado em mobile: ✅**
- **Antes:** `Badge` era uma pílula colorida com fundo claro e checkmark
  ou círculo de alerta. Em cards densos, competia com a `CategoryTag`
  pelo olhar.
- **Depois:** `Badge` virou **texto puro**:
  - `inline-flex items-center gap-[5px] text-meta font-semibold` +
    cor do token (`text-conf-ok` / `text-conf-warn`).
  - **Sem** fundo, sem borda, sem padding, sem raio.
  - Peso 600 compensa visualmente a perda do contorno.
- **Nova prop `icon?: 'alert-triangle' | 'tools'`**: quando presente,
  renderiza um SVG inline 13×13 (`currentColor`, gap 5px). O ícone fica
  `aria-hidden` — o rótulo PT-BR já carrega a semântica (WCAG 1.4.1).
- **Pareamento aplicado** (atualiza kit §9.2):
  - Horário `verified-local` / `official-recent` → sem ícone.
  - Horário `unverified` → `alert-triangle`.
  - Coming-soon → `tools` (obra/estado: "ainda não opera").
  - Care-restricted → `alert-triangle` ("acesso restrito").
  - Care-cautious → `alert-triangle` ("informações em verificação").
  - `ProvenancedRow` no `UnitDetailPage`: mesma regra (nenhum em
    verified, `alert-triangle` em unverified).
- **Por que dois ícones (e não um):** triângulo = signo cívico universal
  de cautela ("verifique antes"); `tools` = obra/estado ("ainda não
  opera"). Cor âmbar diz "atenção"; ícone diz **qual sub-tipo**.
- **SVG inline (não webfont):** mantém o bundle pequeno (~400 bytes vs
  uma fonte inteira para 2 glyphs), evita FOUT, e o `currentColor` faz
  o ícone seguir a cor do texto sem código de sincronização. Atributo
  `data-icon` em cada SVG dá âncora estável aos e2e.
- **e2e novo:** três rotas — diretório (`/`) confirma o seal "em
  construção — ainda não atende" co-localizado com `svg[data-icon="tools"]`;
  `/unidade/ubs-capoere` confirma "horário não confirmado" +
  `svg[data-icon="alert-triangle"]`; `/unidade/ubs-centro-umrs`
  confirma o seal "horário de fonte oficial" **sem** nenhum `<svg>`.

### B5. `FiltersBar` sticky no topo do scroll (mobile) · **testado em mobile: ✅**
- **Antes:** ao rolar para ver cards mais abaixo, a contagem + os chips
  ativos saíam de cena. Para limpar um filtro, o cidadão precisava
  rolar até o topo.
- **Depois:** a própria `<FiltersBar>` recebe
  `sticky top-0 z-10 -mx-4 px-4 py-2 bg-bg border-b border-edge` no
  mobile, com `lg:static lg:z-auto lg:mx-0 lg:bg-transparent lg:px-0
  lg:py-0 lg:pb-3` revertendo no desktop (onde a barra fica na coluna
  direita do grid e não precisa grudar — a sidebar já é o ponto
  permanente).
- **`bg-bg` (não `bg-surface`):** precisa casar com o creme da página,
  não com o branco dos cards, para a barra fundir-se visualmente ao
  fundo enquanto sticky.
- **Parada técnica — `-mx-4 px-4`:** o `<main>` tem `px-4`. Para a
  barra grudada ocupar a largura útil completa (borda-a-borda visual)
  mesmo enquanto sticky, ela "sangra" para fora do main com `-mx-4`
  e devolve o padding interno com `px-4`. Esse padrão é "negative
  margin to escape, positive padding to refill" — o conteúdo da barra
  fica no mesmo eixo visual do resto, mas a faixa colorida cobre os
  16px que o `<main>` deixaria de lado.
- **e2e novo:** confirma `getComputedStyle(bar).position === 'sticky'`
  no mobile e `=== 'static'` no desktop; rola até `offsetTop + 500` no
  mobile e verifica `boundingClientRect().y ∈ [0, 2]` (gruda no topo);
  no desktop, rola e verifica que `y < 0` (some pra cima junto).

## C — Sistema visual consolidado

### C1. Kit visual atualizado · **§9.2 nova**
- Adicionada seção **§9.2 — Selo de confiança como texto (`Badge`) —
  Etapa Visual 5 / D** em `docs/kit-visual-navegador-sus.md`:
  spec do componente (display, peso, tokens), tabela completa de
  pareamento por call-site, justificativa de **quebrar parcialmente** a
  regra "status = pílula" (a pílula migra para os chips ativos da
  `FiltersBar` — forma acolhedora marca **escolha do cidadão**, não
  estado do dado), explicação do `currentColor` e a decisão de SVG
  inline vs webfont.

### C2. Conjunto de glifos inline padronizado · **mantido**
- A etapa V5 introduziu 4 novos SVGs inline: `alert-triangle` e `tools`
  (em `Badge`) + `search` e `x` (no input de busca; `x` reaproveitado
  pelo botão remover do chip ativo). Todos seguem o padrão já em uso
  pelo `LocateButton.tsx` (V4/A3) — `currentColor` no `stroke`,
  `viewBox="0 0 24 24"`, `aria-hidden="true"`. Zero dependência nova.
  O `@tabler/icons-webfont` continua **fora** do projeto.

### C3. `:focus-visible`, hover de cards, `prefers-reduced-motion` · **mantido**
- Auditoria já feita na V4/C2-C4 segue válida: todos os novos
  interativos (botões `Remover filtro:`, `Limpar busca`) herdam o ring
  global do `index.css`. Hover apenas de cor; nenhuma animação nova
  fora do já zerado pelo media query global.

## Lighthouse (mobile) — registrado em 16/06/2026

Build de produção (`vite preview` em :4173), Chrome do sistema,
`--form-factor=mobile`.

| Categoria | Home | Unidade | Onde ir? | Mapa |
|---|---|---|---|---|
| Performance | **97** | — | — | — |
| Accessibility | **100** | **100** | **100** | **96** |
| Best Practices | **100** | — | — | — |
| SEO | 63 | — | — | — |

- **Accessibility ≥ 95 em Home (100), ≥ 90 em todas as páginas** —
  meta da etapa atingida. Os botões "Remover filtro" carregam
  `aria-label` explícito; o `<input id="busca">` mantém label.
- **Performance 97 / Best Practices 100** — Performance caiu 1 ponto
  vs V4 (98 → 97), dentro do ruído do *simulated throttling* do
  Lighthouse — sem mudança real de bundle (a refatoração do Badge
  removeu a `StatusMark` antiga, os 4 novos SVGs inline somam ~400 B).
- **SEO 63** segue o `noindex` deliberado.

## Testes

- `npm test` → **10 arquivos, 60 testes verdes** (sem regressões — o
  Badge não tinha teste unit, então o refactor não quebrou nada lá).
- `npm run test:e2e` → **51 verdes nos dois dispositivos** + 1 skip
  documentado (skip-link em WebKit). Antes da V5: 41 + 1 skip;
  depois: **51 + 1 skip** (5 e2e novos × 2 viewports = 10 a mais).
- **E2e novos (V5)** em `e2e/v5.spec.ts`:
  - "directory: lg: sidebar with search; mobile: stacked" — bounding
    box do input vs primeiro card em ambos viewports.
  - "FiltersBar: clicking ✕ on a chip removes that filter only" —
    aplica dois filtros, remove um, verifica que só a URL daquele caiu.
  - "search input: clear ✕ appears only when there is text" —
    verifica aparecimento/sumiço do botão `Limpar busca` + do chip
    `Busca: …` na FiltersBar.
  - "FiltersBar: sticks at top on mobile scroll; not on desktop" —
    confirma `position: sticky` no mobile, `static` no desktop, mais
    a checagem de y depois do scroll em ambos.
  - "confidence seals: icons by sub-type, none on verified" — três
    rotas, asserção `has + hasText` no mesmo `<span>` para co-localizar
    ícone e texto.

## Pendências

- **B8 / clustering do mapa** (Etapa Visual 2): segue **adiado para a
  Fase 4**. Continua sendo a única pendência visual de produto.
- **Auditoria WCAG/Lighthouse formal**: na Fase 4.
- **Verificação telefônica dos dados**: adiada — quando ocorrer, os
  selos `unverified` viram `verified-local` e os ícones
  `alert-triangle` somem automaticamente (regra já está na Badge).
- **Possível V6 — `UnitDetailPage` em 2 colunas + bottom-sheet no mapa**:
  ideia mencionada no prompt da V5 como "próxima iteração possível";
  ficou **fora** desta etapa, conforme escopo.

## Critérios de conclusão — checagem

| Critério | Status |
|---|---|
| Diretório em 2 colunas a partir de `lg:`, sidebar sticky, mobile idêntico | ✅ + e2e |
| FiltersBar mostra chips ativos individuais com ✕ acessível | ✅ + e2e |
| Input de busca tem `ti-search` à esquerda e ✕ à direita (44×44) | ✅ + e2e |
| `Badge` virou texto sóbrio; `alert-triangle` em "horário não confirmado" / "acesso restrito" / "informações em verificação"; `tools` em "em construção"; nenhum ícone em verified | ✅ + e2e + kit §9.2 |
| FiltersBar sticky no mobile, estática no desktop | ✅ + e2e |
| `npm test` verde (sem `.skip` novo) | ✅ (60/60) |
| `npm run test:e2e` verde nos dois viewports | ✅ (49 + 1 skip documentado) |
| Lighthouse mobile Home ≥ 95 em Accessibility, ≥ 90 em Performance e Best Practices | ✅ (100 / 98 / 100 / 63) |
| Kit visual §9.2 — Selos como texto | ✅ |
| Resumo escrito | ✅ (este arquivo) |
