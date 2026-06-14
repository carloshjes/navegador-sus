# Resumo — Etapa Visual: identidade definitiva (`navegador-sus`)

> Executada em **14/06/2026** no Claude Code (Windows + PowerShell).
> Entregável para o conhecimento do projeto no claude.ai. Esta etapa foi
> **só apresentação**: nenhuma mudança em dados, coordenadas, rotas ou
> política de exibição (além de **anexar a cor por categoria**).

## O que mudou

Trocada a **paleta provisória da Fase 1** pela identidade definitiva do
`docs/kit-visual-navegador-sus.md` (Kit Visual v1.0). O princípio se
manteve: a identidade vive em **tokens** — trocar a aparência custou editar
o `@theme` de `src/index.css` e os componentes que o consomem, sem mexer em
lógica. Os **53 testes unitários + 14 e2e** seguiram de rede de segurança
(agora **56 + 14**, com o teste novo de cores de categoria).

### 1. Fontes auto-hospedadas (`@fontsource`)

- `@fontsource/figtree` (600/700) + `@fontsource/public-sans` (400/500/600),
  importadas em `src/main.tsx` — **só os subsets latin + latin-ext** (cobrem
  PT-BR) e só os pesos em uso. O build empacota 10 `@font-face` em
  `dist/assets/` (woff2/woff); **zero** referência a `fonts.googleapis.com`
  ou `gstatic` (conferido no bundle).
- **Por que local, não CDN** (parada técnica): (a) o PWA offline-first da
  Fase 4 **não funciona com fonte via CDN** — ela precisa estar no cache
  local; (b) mantém a CSP estrita em **`font-src 'self'`** (o `_headers` não
  precisou de nenhuma origem nova); (c) privacidade (sem request ao Google);
  (d) performance previsível. O `_headers` segue intocado (CSP `self` para
  fontes; `X-Robots-Tag: noindex` mantido).

### 2. Tokens no `@theme` (kit §3/§4)

- Implementados **todos** os tokens do kit: neutros/superfícies, marca,
  emergência, confiança (2 famílias) e as **7 cores de categoria**; raios
  (`sm/md/lg/pill`) e a **escala tipográfica** (`display-lg…chip`, com
  line-height, letter-spacing −0.01em e peso embutidos por passo).
- Os **comentários de contraste** do kit ficam ao lado de cada cor
  (documentação viva da meta AA); cada razão foi **recalculada** e bate com
  o kit (ex.: `ink` 14.1:1, `primary` 7.71:1, `conf-warn` 5.87:1, todas as
  `cat-*` ≥ 5.58:1 sobre branco).
- **Avisos de "paleta provisória" removidos** do `src/index.css` e do
  `favicon.svg`.
- Decisão de nomenclatura: os papéis do kit `text-secondary` e `border`
  foram implementados nos tokens já existentes do código (`ink-muted` e
  `edge`) — mesma cor, mesmo contraste, nomes estáveis — para não renomear
  classes em todo o app. Tokens **novos**: `primary-ink`, `primary-soft`,
  `accent`, `accent-text`, `border-strong`, `cat-*`, escala de tipografia,
  `radius-pill`. `primary-strong` (hover, o kit é silente) é o único token
  de suporte: branco sobre ele dá 10.2:1.

### 3. Componentes (regra de forma: **categoria = retângulo, status = pílula**)

- **`CategoryTag`** (novo): retângulo `radius-sm`, cor da família sólida +
  texto branco, caixa-alta, `letter-spacing 0.03em`. No topo de cada card.
- **`Badge`** (selo de status, API inalterada): pílula `radius-pill`, duas
  famílias (success/warning) mapeando os 4 níveis de `confidence` do kit §6
  — `verified-local` com ✓, `official-recent` com dot, caução com ícone de
  alerta. Significado sempre no texto (cor nunca é o único sinal).
- **`FilterChip`** (novo): retângulo `radius-sm`, `<button aria-pressed>`,
  ativo `primary` sólido / inativo `surface` + `border-strong`. O filtro
  **"Tipo de unidade"** virou um grupo de chips (mesmo parâmetro `tipo` na
  URL, mesmo comportamento — só o controle mudou de `<select>`).
- **`Button`/`Card`/`EmergencyBar`** repassados aos novos tokens; pílulas
  de serviço na página de unidade ficaram **neutras** de propósito (não se
  confundem com tag de categoria nem com selo).
- **`Logo`** (novo): a marca `navegador · sus` (Figtree 700, `primary`) com
  o ponto `·` em `accent` (coral, `margin 0.28em`) e o qualificador
  "Erechim · rede pública de saúde" (`text-secondary`).

### 4. Cores de categoria na camada de exibição (kit §3)

- `categoryFamily(unit)` + `UNIT_TYPE_FAMILY` em `display-policy.ts` (config
  tipada — `Record` total, o compilador exige cobertura), com o mesmo
  override institucional do `displayCategory` (CEREST → `admin`).
- `CATEGORY_STYLE` (família → cor `cat-*` + rótulo) em
  `src/lib/category-style.ts`.
- **Teste novo** (`category-style.test.ts`): todo tipo mapeia para uma
  família com cor; toda unidade exibível tem estilo; override de CEREST.

### 5. Logotipo no header

- O header deixou de ser a barra teal sólida (paleta provisória) e virou
  uma **superfície clara** (`surface` + borda), onde a marca em `primary` +
  ponto coral aparece com contraste. Nome de trabalho exibido trocado pelo
  **nome real do produto**: `navegador · sus Erechim` (kit §1) — também no
  `<title>` e no sufixo de título de cada rota.

### 6. Ícone e favicons (kit §8)

- `public/favicon.svg` agora é o **pin `primary` com cruz branca vazada**
  do kit (a cruz é branca de propósito: a cruz vermelha é emblema protegido).
- `scripts/generate-icons.mjs` rasteriza o SVG com o **Chromium do
  Playwright** (já era dependência — sem lib nativa de imagem nova) e gera,
  em `public/`: `favicon-16/32` (transparente), `apple-touch-icon` (180),
  `icon-192/512` (PWA, fundo branco) e `maskable-192/512`. PNGs commitados;
  o Cloudflare só serve (sem tooling no build). Reproduzível por
  `npm run generate:icons`.
- **Maskable** (parada técnica): o Android recorta o ícone numa forma
  arbitrária (círculo, squircle…) e pode cortar até os 20% externos. Por
  isso a versão maskable tem **mais respiro** (pin em ~60% da tela, dentro
  da *safe-zone*) — assim o recorte nunca come a cruz. Tudo sobre **fundo
  branco** (não tile teal — respeita "sem bloco colorido" do kit); o
  recorte do Android vira um círculo branco limpo com o pin.
- `index.html`: links de favicon (svg + png 16/32), `apple-touch-icon`,
  `<link rel="manifest">` e `<meta name="theme-color" content="#0E5E4C">`.
- `public/manifest.webmanifest` (novo): ícones (any + maskable),
  `theme_color #0E5E4C`, `background_color #FBFAF7`, `lang pt-BR`. É só o
  manifesto de ícones/cores — o service worker e o resto do PWA continuam
  para a Fase 4.

## Lighthouse (mobile) — registrado em 14/06/2026

Build de produção (`vite preview`), Chrome do sistema, `--form-factor=mobile`.

| Categoria | Home | Unidade | Onde ir? | Mapa |
|---|---|---|---|---|
| Performance | **97** | — | — | — |
| Accessibility | **100** | **100** | **100** | **96** |
| Best Practices | **100** | — | — | — |
| SEO | 63 | — | — | — |

- **Accessibility mantida em 100** na home (meta da etapa: "manter/subir";
  ideal 100 na home ✅). Igual à Etapa 3 (home 100, mapa 96).
- **Performance 97** (Etapa 3 era 99): a queda de 2 pontos é o custo das
  duas famílias de fonte auto-hospedadas — ainda **bem acima de ≥90**.
- **SEO 63**: único audit que falha é **`is-crawlable`** — o `noindex`
  **deliberado** (dados ainda não verificados). Sobe sozinho para ~100
  quando o bloqueio for levantado, sem mudança de código.
- **Mapa, Accessibility 96**: dois audits, **ambos do Leaflet** e não desta
  etapa — `target-size` (links da atribuição OSM) e
  `label-content-name-mismatch` (botões de zoom com texto `+`/`−` e nome
  acessível "Zoom in/out"). A auditoria WCAG formal é da Fase 4.

## Contraste real conferido na UI montada

Inspeção do DOM renderizado (não só do token):

| Elemento | Computado | Bate com o kit |
|---|---|---|
| `body` (fundo) | `#FBFAF7` | ✅ `bg` |
| h1 | Figtree 700, 28px, `-0.28px` (−0.01em) | ✅ `display-lg` |
| corpo | Public Sans | ✅ |
| ponto do logo | `rgb(216,96,47)` = `#D8602F` | ✅ `accent` |
| chip ativo | `#0E5E4C`, branco, raio 4px, 44px | ✅ retângulo |
| tag UBS | `#185FA5`, branco, raio 4px, caixa-alta | ✅ `cat-ubs` |
| selo OK | bg `#E1F5EE` / texto `#0F6E56`, raio 999px | ✅ pílula success |
| selo cautela | bg `#FAEEDA` / texto `#854F0B`, raio 999px | ✅ pílula warning |

## Antes / depois (resumo)

- **Antes:** header teal sólido, fonte do sistema, paleta institucional
  sóbria provisória, sem tags de categoria, filtros 100% em `<select>`,
  favicon "n" provisório.
- **Depois:** header claro com a marca `navegador · sus` (ponto coral),
  Figtree nos títulos + Public Sans no corpo, paleta verificada do kit,
  **tag de categoria colorida** em cada card, filtro de tipo em **chips**,
  selos de confiança em **pílula** com ícone, pin de saúde como ícone do
  app + favicons + maskable.

## Pendências (herdadas, inalteradas por esta etapa)

- **Verificação telefônica** dos dados (planilha fora do repo) → quando
  acontecer: `verified-local` + `checkedAt`; o selo ✓ já está implementado.
- **Remover `X-Robots-Tag: noindex`** (e o `robots.txt`) quando os dados
  forem verificados — aí o SEO vai a ~100 sozinho.
- **Fase 4:** PWA completo (service worker, offline) + auditoria WCAG/
  Lighthouse formal. Os audits do Leaflet no mapa entram aí.
- **Dark mode:** fora da v1 (tema claro apenas).

## Critérios de conclusão — checagem

| Critério | Status |
|---|---|
| Identidade no ar (tokens, tipografia, logo, ícone/favicons) | ✅ |
| Regra categoria = retângulo / status = pílula | ✅ (conferida no DOM) |
| Cores de categoria em config tipada e testada | ✅ `category-style.test.ts` |
| `npm test` + `npm run test:e2e` verdes | ✅ 56 unit + 14 e2e |
| Lint + typecheck + build verdes | ✅ |
| Lighthouse registrado | ✅ home 97/100/100/63; mapa a11y 96 |
| Avisos de "paleta provisória" removidos | ✅ |
| CSP segue `font-src 'self'` / `noindex` mantido | ✅ `_headers` intocado |
