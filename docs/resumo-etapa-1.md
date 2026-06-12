# Resumo — Etapa 1: Fundação técnica (`navegador-sus`)

> Executada em **12/06/2026** no Claude Code (Windows + PowerShell).
> Este arquivo é o entregável para o conhecimento do projeto no claude.ai.

## O que existe agora

Repositório git completo (branch `main`, commits semânticos em inglês) com:

- **App React + TypeScript + Vite + Tailwind v4** que carrega o JSON real
  e exibe a contagem de **35 unidades ativas** (pipeline de dados provado).
- **Design system provisório** em tokens CSS (`@theme` no
  `src/index.css`): paleta sóbria institucional, **contraste AA calculado
  e anotado em comentário** par a par (pior caso 5.96:1; mínimo exigido
  4.5:1), foco visível forte, alvos de toque ≥ 44px (token
  `--spacing-touch`), `prefers-reduced-motion`, system font stack.
  Trocar a direção visual futura = editar um bloco de CSS.
- **Componentes base:** `Button`, `Card`, `Badge` (selos de confiança com
  rótulos PT-BR; `verified-local` já previsto) e `EmergencyBar` (SAMU 192
  + Bombeiros 193, fixa no rodapé, links `tel:` de um toque).
- **Camada de dados tipada** (`src/data/types.ts`): tipos do schema 0.2
  com uniões discriminadas (`ProvenancedField`, `Coordinates`) — "lat sem
  lng" e "valor sem fonte" são estados não representáveis. Vocabulários
  (`CONFIDENCE_LEVELS`, `SERVICE_SLUGS`…) como arrays `as const`
  reutilizados pelo zod.
- **Validação zod** (`src/data/schema.ts`) integrada ao `npm test`, com
  guarda de equivalência em tempo de compilação entre schema e tipos.
- **Testes:** 12 unitários Vitest (integridade dos dados) + 3 e2e
  Playwright (smoke em viewport mobile). Tudo verde.
- **`CLAUDE.md`** na raiz: a embaixada do briefing — limites §2, regras de
  dados, convenções, método e metas que toda sessão futura deve obedecer.
- **`public/_headers`** com a cadeia de segurança comentada (CSP estrita
  `self`, HSTS, nosniff, Referrer-Policy, Permissions-Policy com
  `geolocation=(self)`, anti-iframe e **`X-Robots-Tag: noindex`** até a
  verificação dos dados — condição de remoção documentada no arquivo).
- `docs/` com os três artefatos da Etapa 0 (o JSON em `docs/` é snapshot
  congelado; o canônico vive em `src/data/`).

## Decisões tomadas (e porquês)

| Decisão | Justificativa |
|---|---|
| **Licença MIT** (decidida com o usuário) | Zero atrito para adoção por UFFS/Secretaria; coerente com o objetivo de protótipo-argumento; inclinação já registrada no briefing. |
| Planilha `verificacao-telefonica-unidades.xlsx` **fora do repo** (gitignored) | É ferramenta de trabalho viva; commitar snapshot criaria duas versões "oficiais". |
| Tailwind **v4** com plugin `@tailwindcss/vite` e tokens via `@theme` | Versão estável atual; tokens viram classes utilitárias automaticamente. |
| `verified-local` **já incluído** no enum de confiança | A rodada telefônica está planejada (planilha pronta); incluir agora custa zero e evita migração. |
| Higiene CAIC: `phone.value = null` (não o número cru) | Número de 7 dígitos não é discável; o valor cru do CNES foi preservado verbatim em `conflicts`. Única alteração de conteúdo da fase. |
| TypeScript `strict: true` (o template não ligava) | Sem strict null checks, os contratos de proveniência seriam decorativos. |
| Identidade git global: "Carlos de Jesus" + e-mail do usuário | Nome veio da conta Windows; ajustável com `git config --global user.name "..."`. |
| e2e roda em viewport mobile (Pixel 7) | Mobile-first é decorrência direta do público-alvo (briefing §3). |

## Script de coordenadas — resultado (12/06/2026)

`npm run fetch:coordinates` → API `apidadosabertos.saude.gov.br` (1 req/s):

- **34 resolvidas** dentro da caixa de Erechim, gravadas com
  `source: "cnes"` e `checkedAt: 2026-06-12`.
- **2 suspeitas** (fora da caixa; coordenada gravada + `flag: "suspect"`,
  exigem revisão manual):
  - `ubs-capoere` (−27.226, −52.272) — ao norte da caixa; distrito rural
    pode legitimamente cair fora, conferir no mapa;
  - `ubs-prisional` (−27.689, −52.893) — a oeste da caixa.
- **3 pendentes** (`geocode-manually` mantido):
  - `ubs-novo-atlantico-demoliner` — sem código CNES (em obra);
  - `pronto-atendimento-umrs` — sem código CNES (conflito nº 1 da Etapa 0);
  - `vigilancia-sanitaria` — ficha CNES sem coordenadas.
- **Ressalva de precisão (registrada, não "resolvida"):** algumas
  coordenadas aceitas pela caixa parecem arredondadas/imprecisas no
  cadastro CNES — ex.: `ubs-centro-umrs` (lng −52.112, ~16 km a leste do
  centro), `ubs-estevam-carraro`, `ubs-aldo-arioli`, `ubs-paiol-grande`,
  `unidade-municipal-reabilitacao`; `sami-erechim` e `crs-11` vieram com o
  mesmo par arredondado (−27.634, −52.274), provável centroide. **Fazer a
  conferência visual (passo 2 do plano §7 do relatório) antes da Fase 3**;
  fallback Nominatim/OSM documentado no mesmo plano.

## Como rodar

```bash
npm install            # 1x
npx playwright install chromium   # 1x, para o e2e
npm run dev            # http://localhost:5173
npm test               # validação do schema + integridade dos dados
npm run test:e2e       # smoke e2e (sobe o dev server sozinho)
npm run build          # produção em dist/
npm run fetch:coordinates  # re-extrai coordenadas do CNES (reescreve o JSON)
```

## Deploy — concluído em 12/06/2026

**URL pública: <https://navegador-sus.pages.dev>** (Cloudflare Pages,
deploy contínuo: push na `main` publica automaticamente). Repositório:
<https://github.com/carloshjes/navegador-sus>. Verificação pós-deploy:
HTTP 200, os 7 headers de segurança ativos (incluindo
`x-robots-tag: noindex`) e o bundle servindo o dataset real.

Passo a passo executado (registro para replicar em projetos futuros):

1. **GitHub:** criar repositório vazio `navegador-sus` (público;
   sem README/license — o repo local já os tem). Depois:
   ```bash
   git remote add origin https://github.com/<seu-usuario>/navegador-sus.git
   git push -u origin main
   ```
2. **Cloudflare Pages:** painel → *Workers & Pages* → *Create* → *Pages*
   → *Connect to Git* → autorizar e escolher `navegador-sus`.
   - Framework preset: **Vite** · Build command: **`npm run build`** ·
     Build output: **`dist`**.
   - Em *Environment variables*, adicionar **`NODE_VERSION = 22`**
     (o default do Pages pode ser antigo demais para o Vite 8).
3. *Save and Deploy* → a URL `https://navegador-sus.pages.dev` (ou
   variação) fica no ar. Push na `main` = deploy automático.
4. **Conferir:** abrir a URL e (a) ver a contagem de unidades, (b) checar
   os headers (DevTools → Network → documento → Headers) — deve haver
   `x-robots-tag: noindex`.

Notas do caminho real no painel (jun/2026): o fluxo padrão "Create" leva
a **Workers** — o Pages fica no link discreto "Looking to deploy Pages?
Get started" no rodapé; e o framework preset correto chama-se
**React (Vite)** (não confundir com "VitePress", que é outra ferramenta).

## Em aberto (herdado + novo)

- **Verificação telefônica** (planilha pronta, fora do repo) — quando
  acontecer: dados confirmados → `confidence: "verified-local"` +
  `checkedAt`; divergências → `conflicts`. Os testes de integridade vão
  conferir o formato automaticamente.
- **Conferência visual das coordenadas** suspeitas/imprecisas (antes da
  Fase 3); fallback Nominatim para as 3 pendentes.
- **Territorialização ESF** (lacuna crítica nº 3 da Etapa 0) — destrava o
  "qual minha unidade" da Fase 3.
- **Direção visual definitiva + nome do produto** (briefing §8) — quando
  decidida, trocar tokens em `src/index.css` (e remover os avisos de
  "provisório").
- **Remover `X-Robots-Tag: noindex`** quando os dados estiverem
  verificados (instrução no próprio `_headers`).
- Fase 2 (diretório de unidades) é o próximo passo de produto.

## Critérios de conclusão — checagem

| Critério | Status |
|---|---|
| `npm run dev`, `npm run build`, `npm test` verdes | ✅ (+ 3 e2e Playwright verdes) |
| Coordenadas extraídas ou justificadas unidade a unidade | ✅ 34 + 2 suspeitas justificadas + 3 pendentes justificadas |
| Deploy público acessível | ✅ <https://navegador-sus.pages.dev> (contínuo, via GitHub) |
| `CLAUDE.md` e `docs/resumo-etapa-1.md` escritos | ✅ |
