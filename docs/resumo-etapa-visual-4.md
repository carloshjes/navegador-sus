# Resumo — Etapa Visual 4: acabamento final (`navegador-sus`)

> Executada em **15/06/2026** no Claude Code (Windows + PowerShell).
> Entregável para o conhecimento do projeto no claude.ai. Continua sendo
> **só apresentação**: nenhuma mudança em dados, coordenadas, rotas ou
> política de exibição. Mobile-primeiro — cada item conferido em Pixel 7
> (Chromium) e iPhone 13 (WebKit) via Playwright.

## A — Bugs de layout

### A1. Tag de categoria esticada até a borda do card  ·  **testado em mobile: ✅**
- **Antes:** a `CategoryTag` esticava 100% da largura do card no
  diretório em 2 colunas — filho de flex-column toma `width: 100%` por
  default; a tag não tinha `align-self`.
- **Depois:** rewrite spec-exato (kit §9.1):
  - `inline-flex items-center self-start`
  - `px-[9px] py-[4px] rounded-[3px]`
  - `text-[11px] font-bold uppercase tracking-[0.05em] leading-none text-white`
  - background do token `cat-{family}`.
- **Defesa em profundidade:** `inline-flex` E `self-start` — qualquer
  um dos dois protege contra o pai virar `block`. A combinação é o que
  garante que a tag siga pequena após qualquer refatoração futura.
- **Curiosidade do CSS** (parada técnica): o computed `display` da tag
  no DevTools aparece como `flex`, não `inline-flex`. Isso é
  *blockification* — filhos de flex/grid containers têm os valores
  `inline-*` "promovidos" para os equivalentes block. **A largura
  permanece correta** porque `align-self: flex-start` continua valendo.
  Os e2e validam pela **classe CSS escrita**, não pelo computed value.
- **Largura real medida** (e2e novo `directory.spec.ts`):
  - mobile (390×844): tag 43 px / card 358 px (≈ 8× a tag).
  - desktop (1024 px viewport): tag 43 px / card ≈ 484 px (≈ 11× a tag).

### A2. Linha embaixo de "SAMU 192" no hover  ·  **testado em mobile: ✅**
- **Antes:** `<a>` da pílula tinha `hover:underline` — o sublinhado
  default do browser surgia ao passar o mouse.
- **Depois:** `no-underline` no link inteiro, **`group-hover`** no `<a>`
  faz só o **fundo da pílula** ir de branco para `#FBE5E5` em 180 ms.
  Sem escala, sem sombra, sem pulso (briefing §2: estabilidade =
  seriedade).
- **e2e novo** (`smoke.spec.ts`) força hover via Playwright e
  inspeciona `text-decoration-line` no `<a>` e na `<span>` interna —
  ambos devem ser `none`.

### A3. Botão "Localizar" — geometria  ·  **testado em mobile: ✅**
- **Antes:** usava o `<Button>` geral (`rounded-md` = 10 px) — visual
  arredondado, fora do idioma cívico ("retângulo").
- **Depois:** novo `<LocateButton>` dedicado:
  - `bg-primary text-white`, `rounded-[4px]` (radius-sm, idioma de
    chips/tags), `px-4 py-[10px]`, `text-[13px] font-semibold
    tracking-[0.02em]`, ícone `ti-crosshair` 15 × 15 px.
  - Hover: só `bg-primary-strong` (10.2:1 sobre branco).
  - Prop `fullWidthMobile`: `w-full sm:w-auto` para empilhar no mobile
    quando o bloco "Ver as unidades mais próximas" vira `flex-col`.

## B — Polimento profissional

### B1. Indicação visual de filtros ativos + "Limpar filtros"  ·  **testado em mobile: ✅**
- **Antes:** quando filtros eram aplicados, só a contagem mudava — o
  usuário não tinha onde "voltar para o início".
- **Depois:** novo `<FiltersBar>` acima da grade:
  - **À esquerda:** "N unidades**.**" (Figtree 700 15 px, ponto coral —
    motivo C2 #2).
  - **À direita:** `"Limpar filtros"` (teal 12 px semibold, hover
    underline) **só quando há filtro ativo** — texto, busca, tipo,
    serviço, bairro **ou** geolocalização. `clearEverything` zera
    filtros E desativa o "perto de mim".
- **Borda inferior** separa do grid de cards.
- **`aria-live="polite"`** na região de resultados → leitores de tela
  são informados do número quando o filtro muda (Etapa Visual 4 / D3).
- **e2e novo** confirma que o botão **aparece** quando se aplica um
  chip e **some** quando se clica em "Limpar filtros".

### B2. Estado vazio desenhado  ·  **testado em mobile: ✅**
- **Antes:** card cinza com "Nada por aqui com esses critérios." —
  texto puro, sem sinal visual.
- **Depois:** novo `<EmptyState>`:
  - **Pin do kit §8** em `ink-muted` com `opacity: 0.4`, 56 × 56 px,
    sem a cruz interna (decorativo).
  - **`<h2>` 16 px Figtree 700**: "Nenhuma unidade combina com os
    filtros".
  - Hint 13 px: "Tente remover algum filtro ou usar termos mais
    amplos na busca.".
  - **Botão secundário** `Limpar filtros` (`rounded-[4px]` para
    casar com o LocateButton, mas em tom teal-light: `border-primary`
    + `bg-surface` + hover `bg-primary-soft`).
- **e2e novo** verifica `/​?q=xyzzy` mostra o `<h2>` e que clicar no
  botão volta para a lista cheia.

### B3. "Mais ▾" — botão de texto teal  ·  **testado em mobile: ✅**
- **Antes:** estilizado como chip cinza inativo → se misturava aos
  chips inativos visualmente.
- **Depois:** botão de texto, **sem borda**, cor teal, `font-semibold`,
  com `<ChevronDown />` que **gira 180°** quando aberto.
- Mesma altura dos chips (`min-h-touch`) para alinhar a linha.
- Hover: bg teal-cream sutil `#F2EEE5` em 150 ms.

### B4. Bottom-sheet no mobile  ·  **testado em mobile: ✅**
- **Antes:** "Mais" expandia 20-30 chips inline mesmo no mobile —
  empurrava o conteúdo para fora da tela.
- **Depois:** `<dialog>` semântico nativo com classe `.bottom-sheet`:
  - **Mobile** (< 640 px, via `matchMedia`): `dialogRef.showModal()`
    abre o sheet como modal — *focus trap*, **Esc** e clique no
    backdrop fechando tudo de graça (gentileza do `<dialog>` nativo).
  - **Desktop** (≥ 640 px): o sheet nunca abre; expande inline como
    antes (com chevron rotacionando).
- **Estrutura do sheet:**
  - Header com título ("Mais tipos / serviços / bairros") + botão
    fechar **44 × 44 px** (`size-touch`, novo utilitário).
  - **Grid 2 colunas** de chips, scrollável (`max-h-[80dvh]
    overflow-y-auto`).
  - Botão sticky no rodapé: **"Aplicar"** (primary sólido).
- **Animação:** slide-up 200 ms via `@keyframes bottom-sheet-up` —
  zerada pelo `prefers-reduced-motion` global.
- **`<dialog>` nativo** (parada técnica): a tag `<dialog>` ganhou
  suporte amplo (Safari 15.4+, Chrome 37+, Firefox 98+). Quando
  abrir via `showModal()`, o browser **isola foco** (sem precisar
  `aria-modal` ou polyfill), **fecha em Esc** sozinho e oferece o
  pseudo-elemento `::backdrop` para o overlay escuro. Polyfill
  desnecessário no escopo do projeto.
- **e2e novo:**
  - viewport 390×844: clicar em "Mais tipos" abre `dialog[open]`,
    botão "Fechar" remove o `open`, foco volta ao trigger.
  - viewport 1024×800: `dialog[open]` **nunca** aparece; o botão
    "Menos" aparece quando o painel inline está aberto.

### B5. Ritmo vertical consistente  ·  **testado em mobile: ✅**
- **Escala única** aplicada e documentada:
  - Entre seções principais (hero → busca, busca → "Localizar",
    "Localizar" → contagem): **`mt-6`** (24 px).
  - Dentro de uma seção (entre `FiltersBar` e a grade, entre
    `<h2>` "Em breve" e o grid): **`mt-4`** (16 px).
  - Gap do grid: **`gap-3`** mobile, **`sm:gap-4`** desktop.
  - Padding interno dos cards: **`p-4`** (16 px) — mantido.
- Saltos de 8/12/20 px misturados foram eliminados.

### B6. Subtítulo do card — middot coral disciplinado  ·  **testado em mobile: ✅**
- Auditoria do `src/` por `text-accent` / `dot-accent`:
  - `Logo`: ponto coral entre "navegador" e "sus" (kit §7).
  - `UnitCard`: `dot-accent` entre tipo e bairro (kit §C2 #1).
  - Hero: `text-accent` no ponto final de "rede pública." (kit §C2
    #2 — motivo aplicado ao título).
  - `35 unidades ativas.`: `text-accent` no ponto final (kit §C2 #2).
  - `FiltersBar`: `text-accent` no ponto final da contagem (mesma
    aplicação #2).
- **Zero usos errantes** — auditoria limpa. A regra na classe CSS
  `.dot-accent` está documentada no `index.css`.

## C — Sistema visual consolidado

### C1. Especificação da `CategoryTag` no kit  ·  **feito**
- Adicionada seção **§9.1** em `docs/kit-visual-navegador-sus.md`:
  display, padding, raio, tipografia, paleta, **proibições** explícitas
  (`width:100%`, `display:block`, `flex` sem `align-self`) e a nota
  sobre *blockification* (`display:flex` no computed devolve "errado",
  mas a largura segue correta). Inclui a justificativa do **teste
  e2e** validar pela classe, não pelo computed value.

### C2. `:focus-visible` em todos os interativos  ·  **auditado**
- Busca por `outline-none` / `outline: none` no `src/` → **zero
  resultados**. A regra global do `index.css` (Etapa Visual 2 / A1)
  aplica `outline: 2px solid var(--color-focus)` (=`primary`) com
  override branco em `.bg-emergency :focus-visible` e em
  `[class*='bg-cat-'] :focus-visible`. Todos os interativos (chips,
  buttons, "Mais", "Limpar filtros", `LocateButton`, NavLink, dialog
  close) herdam.
- **`CategoryTag` sem foco**: por design, a tag não é clicável; só os
  interativos teriam ring.

### C3. Hover de cards — só border  ·  **mantido**
- `transition-card` em `UnitCard.tsx` faz só `border-color 180ms`. Sem
  `transform`, `box-shadow`, `scale`. Nenhum card no codebase usa
  outro tipo de hover.

### C4. `prefers-reduced-motion` cobrindo o novo  ·  **conferido**
- A regra global no `@layer base` do `index.css` força
  `transition-duration: 0.01ms !important` e
  `animation-duration: 0.01ms !important` em **todos** os elementos.
- **Cobertura nova confirmada:**
  - Rotação do chevron (Tailwind `transition-transform`) → zero.
  - Slide do bottom-sheet (`@keyframes bottom-sheet-up`) → zero.
  - Hover do fundo da pílula SAMU (`transition-colors`) → zero.
  - "Limpar filtros" hover (`hover:underline`) → não anima, instantâneo.

## Lighthouse (mobile) — registrado em 15/06/2026

Build de produção (`vite preview` em :4173), Chrome do sistema,
`--form-factor=mobile`. Idêntico à Etapa Visual 3:

| Categoria | Home | Unidade | Onde ir? | Mapa |
|---|---|---|---|---|
| Performance | **98** | — | — | — |
| Accessibility | **100** | **100** | **100** | **96** |
| Best Practices | **100** | — | — | — |
| SEO | 63 | — | — | — |

- **Accessibility ≥ 90 em tudo, 100 em três páginas** (meta da etapa
  atingida). O bottom-sheet usa `<dialog>` nativo — `aria-modal`,
  focus trap e Esc são gratuitos.
- **`aria-expanded`** correto no botão "Mais ▾" (true/false sincronizado).
- **`aria-live="polite"`** na região de resultados anuncia mudanças
  de contagem.
- **Performance 98** — sem mudança.
- **SEO 63** segue sendo o `noindex` deliberado.

## Testes

- `npm test` → **10 arquivos, 60 testes verdes** (sem regressões).
- `npm run test:e2e` → **41 verdes em dois dispositivos** + 1 skip
  documentado (skip-link em WebKit — Safari exclui links da Tab
  order). Antes da Etapa V4: 33 testes; depois: **41 + 1 skip**.
- **E2e novos (V4):**
  - `smoke.spec.ts`: "SAMU 192 has no text-decoration underline on
    hover" — força hover via Playwright e checa
    `getComputedStyle().textDecorationLine === 'none'` no `<a>` e na
    pílula interna.
  - `directory.spec.ts`:
    - "CategoryTag is its content width, not full card width" —
      valida `classList` (contém `inline-flex` e `self-start`),
      `align-self === 'flex-start'`, e largura ≥ 3× menor que o card.
    - "filters bar shows count + Limpar filtros only when active" —
      botão **invisível** no estado limpo; aparece ao clicar UBS,
      some ao clicar "Limpar filtros".
    - "empty state appears when filters zero results, clears one tap"
      — `/?q=xyzzy` mostra o `<h2>`, botão volta à lista cheia.
    - "mobile: Mais opens a bottom-sheet; desktop: inline" — em
      viewport 390 px o `<dialog open>` aparece; em 1024 px nunca
      aparece, em troca surge o botão "Menos" inline.

## Pendências

- **B8 / clustering do mapa** (Etapa Visual 2): segue **adiado para a
  Fase 4**. Continua sendo a única pendência visual de produto.
- **Auditoria WCAG/Lighthouse formal**: na Fase 4.

## Critérios de conclusão — checagem

| Critério | Status |
|---|---|
| `CategoryTag` pequena, à esquerda, em todos os cards | ✅ + e2e + spec no kit §9.1 |
| "SAMU 192" sem sublinhado no hover | ✅ + e2e checando `text-decoration-line` |
| "Localizar" retangular `rounded-[4px]`, hover só escurece | ✅ |
| "Limpar filtros" aparece quando há filtros ativos | ✅ + e2e |
| Estado vazio desenhado | ✅ + e2e |
| "Mais ▾" como texto teal + chevron + bottom-sheet no mobile | ✅ + e2e em ambos viewports |
| Ritmo vertical consistente (mt-6 / mt-4 / gap-3 mobile, gap-4 desktop) | ✅ |
| Especificação da `CategoryTag` documentada no kit (§9.1) | ✅ |
| Testes verdes (60 unit + 41 e2e, 1 skip documentado) | ✅ |
| Lighthouse registrado | ✅ (Home 98 / 100 / 100 / 63) |
| Resumo escrito | ✅ (este arquivo) |
