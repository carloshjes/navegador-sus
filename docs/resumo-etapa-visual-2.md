# Resumo — Etapa Visual 2: refinamento (`navegador-sus`)

> Executada em **14/06/2026** no Claude Code (Windows + PowerShell).
> Entregável para o conhecimento do projeto no claude.ai. Continua sendo
> **só apresentação**: nenhuma mudança em dados, coordenadas, rotas ou
> política de exibição. A taxonomia de tipos/serviços é a mesma — só a
> **ordem de exibição** nos filtros mudou.

## A — Correções de bug

### A1. Foco visível na cor da marca
- **Antes:** anel de foco azul-padrão do browser (default user-agent) —
  destoava do sistema e disputava com o teal da marca.
- **Depois:** `:focus-visible` global com `outline: 2px solid
  var(--color-focus)` + `outline-offset: 2px`. `--color-focus` agora resolve
  para **`var(--color-primary)`** (`#0E5E4C`): **7.71:1 sobre branco e
  7.39:1 sobre o cream `bg`** — bem acima do mínimo WCAG 1.4.11 (3:1). Para
  os fundos onde o teal sumiria (barra `emergency` e tags de categoria
  sólidas), um override troca o anel para **branco** (7.07:1 sobre
  `#A32D2D`). Vale para **inputs, `<select>`, botões, chips, links e cards
  clicáveis** — nenhum `outline: none` solto.

### A2. Conteúdo coberto pela barra de emergência
- **Antes:** `Layout` reservava só `pb-14` (56px) — no iOS a `safe-area`
  comia o restante e o último pin/card sumia.
- **Depois:** novo token `--spacing-bar: 3.5rem` + utilitário `.pb-bar`
  que faz `padding-bottom: calc(var(--spacing-bar) +
  env(safe-area-inset-bottom))`. O Layout aplica `pb-bar` na *shell* e a
  própria barra usa `h-bar` (mesma fonte de verdade). Conferido no DOM:
  com a viewport rolada para o fim, o último elemento do `/` e do `/mapa`
  fica **221 px acima** do topo da barra.
- **Parada técnica (`env(safe-area-inset-bottom)`):** a *safe-area* é uma
  variável que o iOS injeta com a altura da "barra do dedo" (notch
  inferior). Sem `env(safe-area-inset-bottom)`, o conteúdo encosta no
  metal do aparelho ou fica coberto pelo *home indicator*. O `pb-bar`
  empilha as duas reservas: altura da barra fixa + safe-area; assim a
  conta funciona em Android (safe-area = 0) e iOS (safe-area > 0) sem
  branch de plataforma.

### A3. Microcópia singular/plural
- **Antes:** `"37 resultado(s)."` — pluralidade resolvida com o `(s)`
  preguiçoso.
- **Depois:** `"1 resultado"` / `"N resultados"` — escolhe o termo certo.
  Varredura do `src/` por outras ocorrências de `(s)` ou plurais forçados:
  zero outros casos.

## B — Refinamento de design

### B1. Ícone no cabeçalho
- **Antes:** só o wordmark `navegador · sus`.
- **Depois:** o **pin + cruz branca** (kit §8) — o mesmo SVG do favicon —
  ao lado do wordmark, 26×26 px, alinhado verticalmente. Mantemos o
  `aria-label` no `<Link>`-pai; o SVG fica `aria-hidden`.

### B2. Cabeçalho compacto + pílula "versão em desenvolvimento"
- **Antes:** header com duas linhas (logo + qualificador "Erechim · rede
  pública de saúde") + pílula "versão em desenvolvimento" + nav — alto
  demais no mobile.
- **Depois:** uma linha só (pin + wordmark à esquerda, nav à direita). O
  wordmark também perdeu o qualificador embaixo. A marcação de versão saiu
  do header e virou um **parêntese discreto inline** no texto introdutório
  da home, em `text-meta text-ink-muted`. O `<title>` da aba e o
  `aria-label` do logo continuam carregando o nome completo.

### B3. Rodapé só com SAMU
- **Antes:** barra dividida em dois links — SAMU 192 / Bombeiros 193.
- **Depois:** uma única ação centralizada — **ícone `phone-call` +
  "Emergência" + pílula branca "SAMU 192"** sobre o fundo `emergency`. Os
  números chamam por `tel:192`; `aria-label`/`sr-only` preservados.
- **Decisão registrada (briefing §2):** o briefing original pedia "SAMU
  192 **e** Bombeiros 193 sempre visíveis". Removi o 193 da barra a pedido
  do usuário; o 193 segue **um clique de distância** dentro de "Onde ir?"
  (testado por um e2e novo que checa o `tel:193`). Como o briefing prevalece
  sobre o CLAUDE.md em conflito, deixei esta nota explícita aqui para
  rastreio futuro: se o pedido voltar a ser "ambos sempre visíveis", o
  retorno é trocar a `EmergencyBar` por um layout de duas ações (a barra
  já está parametrizada por `--spacing-bar`, então não há ajuste de
  layout em cascata).

### B4. Card "Emergência com risco de vida" (página "Onde ir?")
- **Antes:** `Card` com `border-l-4 border-l-emergency` — visual de
  "callout de framework".
- **Depois:** `Card` com *wash* suave `#FCEBEB` (sem barra lateral, só a
  borda completa do Card). Ícone `phone-call` em `emergency`, título em
  Figtree na cor `emergency`, e **dois botões-pílula** `SAMU 192` e
  `Bombeiros 193` sobre fundo `emergency` — números como ação, não como
  texto-âncora dentro do parágrafo.

### B5. Filtros — todos em chips, com "Mais …"
- **Antes:** Tipo já era chip (Etapa Visual 1), mas Serviço e Bairro eram
  `<select>`s desalinhados.
- **Depois:** **Tipo, Serviço e Bairro** usam o mesmo `<FilterChipGroup>`.
  Cada grupo é `<fieldset><legend>` + `<button aria-pressed>` (não cor
  sozinha), com a disclosure `<button aria-expanded aria-controls>` para
  "Mais …".
  - **Tipo** (`TYPE_FILTER_PRIORITY` em `src/data/labels.ts`):
    UBS, Pronto atend., Hospital, CAPS, Especialidades, Odonto (CEO),
    Farmácia, Reabilitação **+ "Mais tipos ▾"** revela SAMU, Gestão,
    Ponto de atend., Promoção, Saúde prisional, Vigilância.
  - **Serviço** (`SERVICE_FILTER_PRIORITY`): vacinação, consultas,
    dentista, saúde da mulher, pediatria, saúde mental, medicamentos,
    urgência leve, laboratório — **+ "Mais serviços ▾"** para o restante.
  - **Bairro:** os 6 bairros com mais unidades como chips iniciais (o
    *ranking* é por contagem; tiebreak alfabético). **+ "Mais bairros ▾"**.
  - **Estado preservado nas URLs.** Quando o filtro ativo cai além do
    corte ("Mais"), a disclosure abre sozinha — o chip selecionado nunca
    fica escondido (`activeBeyondCut` em `FilterChipGroup`).
- **Teste de cobertura novo** (`src/data/labels.test.ts`): todo
  `UnitType` tem rótulo curto + cheio; todo `ServiceSlug` tem rótulo de
  chip; `TYPE_FILTER_PRIORITY` e `SERVICE_FILTER_PRIORITY` só referenciam
  slugs reais e não repetem.

### B6. Densidade e espaçamento
- **Antes:** saltos irregulares entre seções do diretório (`mt-6`/`mt-8`
  alternando), formulário em `grid gap-3` que não dialogava com as outras
  seções.
- **Depois:** ritmo padronizado — `mt-8` entre a busca, "perto de mim" e
  o bloco de resultados; `mt-10` entre listas de seção ("Em breve" /
  "Institucional"). O formulário virou `flex flex-col gap-4` (cada
  fieldset com `gap-4` interno).

### B7. Desktop (telas largas)
- **Antes:** `max-w-screen-md` (768 px) — coluna estreita no desktop,
  vazios grandes nas laterais.
- **Depois:** `max-w-screen-lg` (1024 px) no header, no `<main>` e no
  rodapé. A lista principal do diretório vira **2 colunas** (`sm:grid-cols-2`)
  a partir de ~640 px; "Em breve" também, "Institucional" mantém 1 coluna
  (lista secundária). Mobile-first preservado: tudo segue `grid-cols-1`
  abaixo de `sm`.

### B8. Pins sobrepostos no mapa — **adiado para a Fase 4**
- **Status:** documentado, não implementado. O hub da UMRS de fato
  empilha 4 unidades no mesmo endereço (`Pronto Atendimento`, `Ambulatório
  de Saúde Mental`, `Centro de Referência da Mulher`, `Ambulatório de
  Feridas Crônicas`), virando um amontoado.
- **Por que adiar:** clustering pede uma biblioteca nova
  (`leaflet.markercluster`), CSS próprio, e mexe na semântica do popup —
  é uma mudança *do mapa*, não de identidade. O prompt autoriza
  explicitamente jogar para a Fase 4 ("que já mexe no mapa"). O cross-link
  "no mesmo endereço funcionam:" no detalhe da UMRS continua sendo o
  caminho equivalente para chegar nas unidades vizinhas hoje.
- **O que entra na Fase 4:** avaliar `leaflet.markercluster` *vs.*
  `spiderfy` puro; manter a *attribution* OSM; manter o foco na unidade
  via `?focus=`.

## Lighthouse (mobile) — registrado em 14/06/2026

Build de produção (`vite preview` em :4173), Chrome do sistema,
`--form-factor=mobile`.

| Categoria | Home | Unidade | Onde ir? | Mapa |
|---|---|---|---|---|
| Performance | **98** | — | — | — |
| Accessibility | **100** | **100** | **100** | **96** |
| Best Practices | **100** | — | — | — |
| SEO | 63 | — | — | — |

- **Accessibility ≥90 em tudo, 100 em três páginas** (meta da etapa
  atingida). Igual à Etapa Visual 1 (home 100, mapa 96).
- **Performance: +1 ponto** (Etapa Visual 1: 97 → 98). Removendo a pílula
  do header e o `<select>` do Serviço/Bairro, o DOM da home encolheu.
- **SEO 63** é o `noindex` deliberado (único audit que falha:
  `is-crawlable`); sobe sozinho para ~100 quando o bloqueio for
  levantado, sem mudança de código.
- **Mapa 96** — os mesmos dois audits do Leaflet de antes
  (`target-size` na atribuição OSM, `label-content-name-mismatch` nos
  `+`/`−`); auditoria WCAG formal está na Fase 4.

## Testes

- `npm test` → **10 arquivos, 60 testes verdes** (Etapa Visual 1 fechou
  com 56; +4 do `labels.test.ts`).
- `npm run test:e2e` → **15 testes verdes** (Etapa Visual 1: 14; +1 do
  novo "Bombeiros 193 reachable from Onde ir?"). Ajustes só onde o
  controle mudou de tipo:
  - `smoke.spec.ts`: a barra agora carrega só "SAMU 192".
  - `nearby.spec.ts`: bairro virou chip — `getByRole('group', {name:
    'Bairro'})` no lugar do antigo `#filtro-bairro`. **A asserção de
    comportamento ("filtro presente quando geo é negada") não foi
    afrouxada.**

## O que ficou fora desta etapa

- **B8 clustering** — adiado para a Fase 4 (justificado acima).
- **Auditoria WCAG/Lighthouse formal** — sempre prevista para a Fase 4.

## Critérios de conclusão — checagem

| Critério | Status |
|---|---|
| Foco visível na cor da marca em **todos** os interativos | ✅ `:focus-visible` global em `--color-primary`; override branco em `bg-emergency`/`bg-cat-*` |
| Nada coberto pela barra de emergência | ✅ `.pb-bar` (com `env(safe-area-inset-bottom)`) confirmado no DOM em `/` e `/mapa` |
| Ícone no header | ✅ pin do kit §8 ao lado do wordmark |
| Rodapé só SAMU; 193 preservado no "Onde ir?" | ✅ + e2e novo |
| Card de emergência redesenhado sem barra lateral | ✅ |
| Três filtros em chips com "Mais …" | ✅ + teste de cobertura de `TYPE_FILTER_PRIORITY`/`SERVICE_FILTER_PRIORITY` |
| Densidade revista | ✅ ritmo `mt-8` / `mt-10` consistente |
| Desktop aproveitado | ✅ `max-w-screen-lg` + `sm:grid-cols-2` na lista principal |
| Testes verdes | ✅ 60 unit + 15 e2e |
| Lighthouse registrado | ✅ |
| Resumo escrito | ✅ (este arquivo) |
