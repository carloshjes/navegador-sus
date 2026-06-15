# Resumo — Etapa Visual 3: acabamento e personalidade (`navegador-sus`)

> Executada em **14/06/2026** no Claude Code (Windows + PowerShell).
> Entregável para o conhecimento do projeto no claude.ai. Continua sendo
> **só apresentação**: nenhuma mudança em dados, coordenadas, rotas ou
> política de exibição. Mobile primeiro — cada item conferido em
> Pixel 7 (Chromium) e iPhone 13 (WebKit) via Playwright.

## A — Correções de bug

### A1. Mapa cobrindo o rodapé no mobile  ·  **testado em mobile: ✅**
- **Antes:** o contêiner do mapa usava `h-[65vh]`. Em iPhone 13, o
  documento ficava maior que a viewport e a `EmergencyBar` (fixa) cobria
  ~56 px do extremo sul do mapa quando o usuário rolava até o fim.
- **Depois:** a `MapPage` virou um **layout viewport-fit** que não rola:
  - novo token `--spacing-header: 3.75rem` (60 px);
  - utilitário `.h-mappage` =
    `100dvh − var(--spacing-header) − var(--spacing-bar) − env(safe-area-inset-bottom)`;
  - dentro, o contêiner do Leaflet recebe `flex-1 min-h-0`, então
    **absorve o espaço restante** depois do título + legenda; o rodapé
    "Prefere uma lista?" continua dentro do mesmo wrapper. Nada da página
    rola, e a barra vermelha **nunca toca** o mapa, em nenhuma altura.
- **Por que `dvh` e não `vh`** (parada técnica): no Safari iOS, a UI do
  browser (URL bar, toolbars) **encolhe e cresce** durante o uso. `100vh`
  fica **travado no tamanho inicial**, então quando a URL bar reaparece,
  o conteúdo "passa" do final visível. `100dvh` (*dynamic viewport
  height*) acompanha esse movimento — ideal para mapas e telas onde a
  página inteira é a UI.
- **`min-h-0` em flex** (parada técnica): por default, flex-items têm
  `min-height: auto`, o que significa "não menor que o conteúdo".
  Quando o conteúdo é um `.leaflet-container` interno alto, o item tenta
  ficar maior que `flex-1` permite e o layout estoura. `min-h-0`
  desbloqueia o filho — agora ele **pode encolher abaixo do seu
  conteúdo intrínseco** porque o pai (o flex column) decide o tamanho.
- **Regressão guardada por e2e**: `e2e/map.spec.ts` agora roda em
  **Pixel 7 + iPhone 13** e mede `frame.bottom − bar.top ≤ 1px` (slack
  para sub-pixel). Sem regressão: 0 px de sobreposição.

### A2. Cards com alturas desiguais em duas colunas  ·  **testado em mobile: ✅**
- **Antes:** com `sm:grid-cols-2`, cards lado a lado tinham alturas
  diferentes (selos extras, nomes maiores), criando "buracos" no grid.
- **Depois:** o `<UnitCard>` virou **flex column** que preenche a célula
  inteira do grid:
  - `<Card className="flex h-full flex-col …">` (CSS Grid já estica
    items por default — `h-full` faz o card aproveitar essa altura);
  - o **bloco de status** recebe `mt-auto`, empurrando-o para o pé do
    card. Cards com pouco texto ficam com espaço entre subtítulo e selo;
    cards com texto longo encostam — mas o **selo sempre na mesma linha
    visual** dentro de cada par.
- **Por que `align-items: stretch` em grid** (parada técnica): é o
  default do `display: grid`. Mas se algo (uma classe utilitária, um
  `align-items` ancestral) sobrescreve para `start`, o problema volta.
  Aqui, fazer o **card por dentro** ser um flex-column com `h-full`
  resolve sem depender do default do grid — defesa em profundidade.
- **e2e novo** (`directory.spec.ts`): viewport 1024×800, mede a altura
  dos quatro primeiros cards e verifica que `(0,1)` e `(2,3)` (pares na
  mesma linha) batem com 1 px de slack.

## B — Ajustes de produto

### B1. Nav: "Início" como item explícito  ·  **testado em mobile: ✅**
- **Antes:** a marca era o único caminho para a home. Convenção, mas
  invisível.
- **Depois:** `<NavLink to="/" end>Início</NavLink>` à esquerda de Mapa
  e Onde ir?, e os três compartilham um estilo novo:
  - inativo: `border-b-2 border-transparent`
  - ativo: `border-b-2 border-accent font-semibold` — **sublinhado
    coral**, o motivo do ponto do logo aplicado à navegação;
  - a borda inativa transparente mantém a mesma altura — sem jitter na
    troca de rota.
- **`end` no NavLink**: sem isso, NavLink trata qualquer rota como filha
  de "/" — Início ficaria ativo em todas as páginas. Com `end`, casa só
  na rota exata.

### B2. "Copiar endereço" removido  ·  **testado em mobile: ✅**
- **Antes:** botão secundário "Copiar endereço" com handler de
  clipboard, estado `copied` com `setTimeout` para limpar.
- **Depois:** texto puro selecionável. O gesto nativo de selecionar e
  copiar já cobre, e quem quer ir até a unidade abre "Ver no mapa".
  **Sem testes e2e dependiam do botão**. Removidos: import de
  `useState`, import de `Button`, ~25 linhas do componente.

### B3. "Localizar" como bloco de ação primária  ·  **testado em mobile: ✅**
- **Antes:** botão `outline` desbotado com texto longo
  ("Ver as mais próximas de mim").
- **Depois:** **bloco de ação** no card branco:
  - À **esquerda**: título "Ver as unidades mais próximas" (font-semibold,
    `ink`) + subtítulo de privacidade "Localização usada só neste
    aparelho, nunca enviada a um servidor." (text-meta, `text-secondary`)
    — a ressalva do briefing §2 fica visível por design;
  - À **direita**: botão **primário sólido** (`primary` + branco) com
    ícone `ti-crosshair` + texto **"Localizar"**;
  - No mobile, o flex vira `flex-col` e o botão fica full-width.
- **Acessibilidade preservada**: o botão mantém o
  `aria-label="Ver as mais próximas de mim"` longo (mesmo nome que os
  e2e já usam), só o **rótulo visual** mudou para "Localizar".

## C — Personalidade

### C1. Hero com eyebrow + título com palavra-chave colorida  ·  **testado em mobile: ✅**
- **Eyebrow** ("ERECHIM — RS"): novo componente `<Eyebrow>` + classe
  `.eyebrow` no CSS — `Public Sans 600 11px / letter-spacing 0.1em /
  uppercase / primary`, com `::before` 18 × 1 px no `currentColor`
  (`primary`) e gap de 8 px. **`::before` em vez de SVG/border**: é o
  pseudo-elemento padrão para "ornamento que pertence ao texto", não
  precisa de markup novo, herda cor e tamanho do pai automaticamente.
- **Hero h1**: `font-display font-bold leading-[1.08]
  tracking-[-0.015em] text-[32px] sm:text-[38px]` — Figtree 700, métricas
  apertadas, escala responsiva. **Texto**: `Encontre a sua unidade da
  <span text-primary>rede pública<span text-accent>.</span></span>` —
  "rede pública" em **teal** com o **ponto coral** fechando a frase.
- **Frase de contagem** (C2): `35 unidades ativas.` em Figtree 700
  (`font-display strong`) com o ponto final em coral. "ativas" continua
  sendo um termo do projeto (data-honesty — distingue de `planned` /
  `deactivated`), por isso ficou.
- **Marker "v. desenvolvimento"** mantido como inline-meta discreto.

### C2. Motivo coral repetido com disciplina  ·  **testado em mobile: ✅**
A regra está documentada num comentário do CSS (`.dot-accent`): o ponto
coral aparece **apenas** em três padrões, sempre como separador, peso
700, `margin: 0 0.35em`:
1. **Bairro · sublocal** no `<UnitCard>` (entre o tipo da unidade e o
   bairro): "UBS (posto de saúde) **·** Aldo Arioli".
2. **Frase de contagem** "35 unidades **.**" — o ponto final.
3. **Eyebrow** quando precisa separar dois termos (não usado na home —
   "ERECHIM — RS" usa traços; previsto para subpáginas).
- **No nav, o motivo vira sublinhado coral** (B1) — não o ponto.
- A classe `.dot-accent` carrega a regra: usar fora desses padrões viola
  a disciplina do kit.

### C3. Cards reestruturados (borda neutra)  ·  **testado em mobile: ✅**
- Borda **neutra `edge` 1 px**, raio `radius-lg` — mantém.
- Tag de categoria no topo — mantém.
- **Título do card** agora em **Figtree 700, 16 px**, `tracking-tight
  leading-tight`. Contraste de fonte (Figtree no título vs. Public Sans
  no corpo) faz a hierarquia sem precisar inflar tamanhos. Aplicado com
  `font-display text-base font-bold`.
- **Subtítulo "tipo · bairro"** com `.dot-accent` no separador (C2).
- **Selo de status no pé via `mt-auto`** (A2). O selo continua sendo o
  **único** sinal visual de confiança — sem borda colorida nem fundo de
  alerta no próprio card.
- **`line-clamp-2`** no link do título: nomes longos ficam em duas
  linhas no card, e o atributo `title={unit.name}` preserva o nome
  inteiro para leitores de tela e tooltip do mouse — **o nome completo
  aparece intacto na página de detalhe**. Nada foi alterado no JSON.

### C4. Micro-interações sóbrias com `prefers-reduced-motion`  ·  **testado em mobile: ✅**
- **Hover de cards interativos** (`.transition-card`):
  `transition: border-color 180ms ease-out` — apenas a borda fica um
  tom mais firme (de `edge` para `border-strong`). **Sem escala, sem
  sombra crescendo, sem elevação.**
- **Hover de chips inativos** (`.transition-chip`):
  `transition: background-color, color, border-color 150ms ease-out`. O
  fundo vai para `bg` (cream sutil); chip ativo não muda.
- **Focus ring**: `transition: outline-color 120ms ease-out` no
  `:focus-visible` global — o anel teal **aparece** suave, nunca anima
  o layout.
- **`@media (prefers-reduced-motion: reduce)`** (parada técnica): essa
  media query é a forma padrão do usuário dizer "tenho vestibular, TDAH,
  enxaqueca ou simplesmente prefiro sem movimento" no nível do sistema
  operacional. Quando o usuário liga isso, o browser nos avisa via essa
  query, e a regra no `@layer base` do `index.css` força
  `transition-duration: 0.01ms` (≈ zero) em tudo. **Respeitar essa
  preferência é regra de acessibilidade do projeto desde a Fase 1.**
- **Proibido nesta etapa** (registrado no chat de planejamento e
  respeitado): glassmorphism, gradientes coloridos, sombras grandes,
  blur de fundo, "cards flutuando", animações decorativas.

## Lighthouse (mobile) — registrado em 14/06/2026

Build de produção (`vite preview` em :4173), Chrome do sistema,
`--form-factor=mobile`.

| Categoria | Home | Unidade | Onde ir? | Mapa |
|---|---|---|---|---|
| Performance | **98** | — | — | — |
| Accessibility | **100** | **100** | **100** | **96** |
| Best Practices | **100** | — | — | — |
| SEO | 63 | — | — | — |

- **Accessibility 100 em três páginas e 96 no mapa** — igual à Etapa
  Visual 2; os dois audits que tiram 4 pontos do mapa são do próprio
  Leaflet (`target-size` da atribuição OSM e
  `label-content-name-mismatch` nos `+`/`−`), não regressões.
- **Performance 98** — sem mudança; a Etapa 3 não introduziu JS novo
  além do `Eyebrow` (componente trivial).
- **SEO 63** segue sendo só o `noindex` deliberado.

## Testes

- `npm test` → **10 arquivos, 60 testes verdes** (sem regressões).
- `npm run test:e2e` → **33 testes verdes em dois dispositivos** (Pixel 7
  + iPhone 13), 1 skip documentado:
  - Etapa Visual 2 fechou com 15 testes em um device.
  - Etapa Visual 3 dobrou para 17 testes × 2 devices = 34 execuções.
  - O 1 skip é o `smoke / skip-link` em WebKit (Safari exclui links da
    ordem de Tab por default — `Full Keyboard Access` desligado). O
    teste segue rodando em Chromium.
- **e2e novos**:
  - `directory.spec.ts` — equal-height cards em 2 colunas;
  - `map.spec.ts` — sem sobreposição entre o mapa e a barra de emergência
    (rodando em ambos os devices, garantindo a correção do A1 nos dois
    motores de browser).
- **Playwright config**: adicionado o projeto `iphone-13` (WebKit).
  Quem clonar precisa rodar `npx playwright install webkit` uma vez.

## O que ficou fora desta etapa

- **B8 — clustering do mapa** (do prompt da Etapa Visual 2): segue
  adiado para a **Fase 4**, conforme combinado. Continua sendo a única
  pendência visual de produto.
- **Auditoria WCAG/Lighthouse formal**: prevista para a Fase 4.

## Critérios de conclusão — checagem

| Critério | Status |
|---|---|
| Mapa não cobre rodapé (iPhone 13 + Pixel 7) | ✅ + e2e novo em ambos |
| Cards com alturas iguais lado a lado | ✅ + e2e novo |
| "Início" no nav com sublinhado coral no ativo | ✅ |
| "Copiar endereço" removido | ✅ |
| "Ver mais próximas" como bloco com botão primário | ✅ |
| Hero com eyebrow + título com palavra-chave colorida + ponto coral | ✅ |
| Motivo `·` coral nos três lugares previstos, com disciplina | ✅ + classe `.dot-accent` com a regra documentada |
| Cards com Figtree no título, borda neutra, status no pé via `mt-auto` | ✅ |
| Micro-interações sóbrias com `prefers-reduced-motion` respeitado | ✅ |
| Testes verdes | ✅ 60 unit + 33 e2e (1 skip documentado) |
| Lighthouse registrado | ✅ |
| Resumo escrito | ✅ (este arquivo) |
