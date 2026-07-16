# Resumo — Etapa Visual 14: pinho cívico e placa conectada (`navegador-sus`)

> Executada em **16/07/2026** sobre o padrão **Cívico compacto**. A etapa
> troca a família cromática da marca, remove o coral decorativo e transforma a
> rota ativa em uma placa conectada ao conteúdo. Nenhum dado canônico,
> proveniência, conflito, rota, geolocalização ou política de exibição foi
> alterado.

## Diagnóstico e direção

O teal anterior puxava azul e dividia a identidade com um coral decorativo.
No header escuro, o sublinhado coral tinha contraste próximo de 1.1:1 e
dependia de cor para indicar a rota. A mesma família avermelhada ainda
competia semanticamente com a emergência, onde vermelho precisa permanecer
inequívoco.

A direção aprovada foi executada sem nova exploração:

- marca em **pinho cívico** `#0F5132`;
- interface de marca restrita a pinho, branco e neutros;
- rota ativa como **placa conectada** na cor da página;
- logo do header em contorno branco;
- assets do app com pin sólido no novo verde.

A signature move é a placa “você está aqui”: o estado ativo deixa de ser uma
linha decorativa e passa a conectar fisicamente navegação e conteúdo.

### Rubrica anti-genérica

O recorte começou em **2/12**, por styling decorativo carregando parte da
hierarquia. Depois da implementação ficou em **0/12**: a cor coral foi removida
e a localização atual passou a ser comunicada por superfície, alinhamento,
forma, peso e texto.

## Parada técnica: placa sem fresta

O header anterior tinha `border-bottom` e centralizava a navegação no
desktop. Sobrepor a placa à borda exigiria margem negativa ou `z-index`,
soluções sensíveis a arredondamento de pixel e futuras mudanças de altura.

A implementação remove a borda inferior do header e ancora a nav no fundo com
`sm:self-end`. No mobile, a segunda linha do grid já mede 44px e termina no
limite inferior; no desktop, a nav de 44px também termina nesse limite. O E2E
compara as geometrias reais da placa, header e `<main>` nos seis viewports:
todos encerram/começam no mesmo pixel, sem sobreposição.

## Implementação

### Família pinho

- `primary`: `#0F5132`; branco 9.36:1 e 8.97:1 contra o creme `bg`.
- `primary-strong`: `#0A3D25`; branco 12.30:1.
- `primary-ink`: `#15603C`; 7.58:1 sobre branco e 6.55:1 sobre
  `primary-soft`.
- `primary-soft`: `#E4F2E7`, deliberadamente independente de `conf-ok-bg`.
- `accent` e `accent-text` foram removidos do tema.
- `dot-accent` permanece como nome histórico do separador, agora em
  `primary-ink`.
- Pontos decorativos do hero, contagem e FiltersBar migraram para
  `text-primary-ink`.
- Os marcadores do mapa deixaram de duplicar hex e agora consomem variáveis
  CSS dos tokens `primary`, `conf-warn`, `ink-muted` e `white`.

Os selos `conf-ok-bg`, `conf-ok` e `conf-ok-dot` ficaram byte a byte
inalterados. `cat-urgency` também permanece com seu valor próprio: é token de
categoria, não coral de marca.

### Placa conectada

- O header usa `primary` sólido, sem gradiente ou borda inferior.
- A rota ativa usa `bg`, texto `primary`, peso 600 e `radius-sm` somente nos
  cantos superiores.
- A placa preenche os 44px da linha mobile e termina flush no limite inferior
  também em `sm+`.
- Rotas inativas mantêm texto branco e recebem somente `hover:bg-white/10`,
  sem borda ou deslocamento.
- `NavLink`, `end` na rota inicial, `aria-current`, `aria-label`, piso de toque
  e `transition-control` foram preservados.
- O limite conhecido de `/mapa` foi aceito sem tratamento especial.

### Foco da navegação

O override geral do header continua branco para links sobre pinho. Uma regra
posterior e semântica, `.app-header a[aria-current='page']:focus-visible`, usa
`primary` somente na placa creme. O teste percorre a ordem real de Tab:
skip-link → marca → placa ativa → rota inativa, confirmando anel pinho na
placa e branco na aba seguinte.

### Logo e assets

- O pin do header usa `fill="none"`, `stroke="currentColor"` branco,
  `stroke-width="1.6"` e extremidades arredondadas.
- A cruz continua branca e preenchida; nunca foi recolorida para vermelho.
- O ponto do wordmark removeu `text-accent` e herda o branco do texto,
  preservando 0.28em de margem.
- `theme-color` do HTML e `theme_color` do manifest passaram para `#0F5132`.
- `favicon.svg` e o gerador usam o pin sólido `#0F5132` com cruz branca.
- Foram regenerados `favicon-16.png`, `favicon-32.png`,
  `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `maskable-192.png` e
  `maskable-512.png`.
- Favicon transparente, PWA sobre branco e maskable com safe-zone foram
  inspecionados visualmente; os sete PNGs mudaram de conteúdo e receberam
  novos hashes.

## Testes atualizados

- O antigo contrato do header teal/coral foi reescrito para pinho + placa
  creme.
- Asserções cobrem fundo do header, ausência de borda, pin em contorno,
  stroke de 1.6px, wordmark/ponto brancos, fundo/texto/peso/raios da placa e
  abas inativas.
- A matriz de 320, 360, 390, 768, 1024 e 1440px mede encaixe flush, piso de
  toque, colisão, overflow e composição compartilhada.
- O foco da placa e da aba seguinte é validado por teclado.
- `dot-accent` e os novos pontos `primary-ink` têm cor computada protegida.
- Um novo caso protege meta theme-color, manifest, favicon SVG e resposta dos
  sete assets PNG.
- O contrato visual do Localizar foi atualizado somente para os novos valores
  de `primary`/`primary-strong`; comportamento e estados permaneceram iguais.
- A busca não encontrou teste unitário preso a `border-accent`, `text-accent`
  ou aos hex antigos; a cobertura unitária foi mantida integralmente.

## Responsividade e acessibilidade

- Mobile: marca na primeira linha, nav em três colunas na segunda e placa
  ativa com 44px até o limite inferior.
- `sm+`: marca centralizada verticalmente; nav ancorada no fundo; placa sem
  fresta com o conteúdo.
- A placa comunica estado por texto, fundo, peso, forma e posição, não apenas
  por cor.
- Branco sobre `primary` é AAA; `primary` sobre a placa creme é 8.97:1.
- Ordem DOM/teclado, `aria-current`, alvos de 44px e foco visível foram
  preservados.
- Não foram adicionados gradiente, sombra, blur, transformação ou animação.
  `prefers-reduced-motion` permanece intacto.

## Resultados reais

- Geração de assets: **7/7 PNGs concluídos**.
- Formatação: Prettier executado nos arquivos de texto suportados.
- `npm run lint`: **verde**.
- `npm test`: **62/62 testes verdes** em 10 arquivos.
- `npm run build`: **verde**; Vite transformou 110 módulos.
- `npm run test:e2e -- --project=mobile-chromium --workers=1`: **34/34 casos
  verdes** em 15.9s.
- Preflight focal final de `smoke.spec.ts` + `nearby.spec.ts`: **10/10 casos
  verdes** em 4.9s.

## Auditoria global das cores antigas

- Valores antigos de `primary`, `primary-strong` e `accent`: nenhuma
  ocorrência rastreada atual.
- O antigo valor de `primary-ink` permanece somente em `conf-ok`, como estado
  semântico deliberadamente independente.
- O antigo valor de `accent-text` permanece somente em `cat-urgency` e sua
  tabela no kit.
- `accent-text`: nenhum consumidor antes da remoção; token removido.
- `border-accent` e `text-accent`: ausentes do código e testes atuais. O resumo
  histórico da Etapa 10 preserva os nomes com nota explícita de que foram
  superados nesta etapa.
- O resumo da Etapa 9 removeu os hex antigos e ganhou nota de supersessão.

## Arquivos alterados

- Tema e marca: `src/index.css`, `src/components/Layout.tsx`, `Logo.tsx`,
  `FiltersBar.tsx`, `UnitCard.tsx`, `src/pages/DirectoryPage.tsx` e
  `src/components/map/markerIcons.ts`.
- Metadata e geração: `index.html`, `public/manifest.webmanifest`,
  `public/favicon.svg` e `scripts/generate-icons.mjs`.
- Assets: sete PNGs de favicon/PWA/Apple Touch/maskable em `public/`.
- E2E: `e2e/smoke.spec.ts` e `e2e/nearby.spec.ts`.
- Documentação: kit visual, notas históricas das Etapas 9/10 e este resumo.

## Checklist final

| Critério | Resultado |
|---|---|
| Nenhum hex coral fora de `cat-urgency` | ✅ |
| Família pinho com contrastes documentados | ✅ |
| Theme-color e manifest em `#0F5132` | ✅ |
| Sete PNGs regenerados | ✅ |
| Favicon/PWA com pin sólido novo | ✅ inspeção visual + E2E |
| Placa ativa sem fresta | ✅ seis viewports E2E |
| Foco pinho na placa e branco nas inativas | ✅ teclado E2E |
| Ponto do wordmark branco | ✅ cor computada E2E |
| Pin do header em contorno branco | ✅ `fill`, `stroke` e largura E2E |
| Selos de confiança inalterados | ✅ diff auditado + testes |
| Dados e políticas inalterados | ✅ diff vazio |
| Lint, unitários, build e E2E mobile verdes | ✅ |

## Pendências permanentes

- Verificação telefônica dos dados: continua adiada pelo usuário.
- `X-Robots-Tag: noindex`: permanece até a verificação dos dados e a
  decisão explícita de indexar o site.
