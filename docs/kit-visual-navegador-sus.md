# Kit Visual — navegador · sus Erechim

> Identidade visual definitiva do projeto. Substitui a paleta **provisória**
> da Fase 1. Adicionar ao conhecimento do projeto.
> **Versão 1.4** — 16/07/2026 (pinho cívico e placa conectada da Etapa
> Visual 14). Tema: **somente claro** na v1.
> Todas as cores foram verificadas por contraste (WCAG); as razões estão
> anotadas em cada token. Identificadores em inglês; rótulos de UI em PT-BR.

## 1. Identidade

- **Nome do produto:** navegador · sus Erechim (encerra o codinome `navegador-sus`, que segue só como nome de repositório/pastas).
- **Conceito:** *wayfinding* — orientação na rede pública de saúde. Calor humano (acolhimento) + clareza de sinalização (categorias) + credibilidade de serviço público.
- **Tom visual:** cívico caloroso. Sério sem ser frio, claro sem ser infantil.

## 2. Tipografia

Duas famílias, ambas open source (SIL OFL):

- **Display (títulos):** **Figtree** — pesos 600 e 700.
- **Corpo e interface:** **Public Sans** — pesos 400, 500, 600. (Fonte do design system do governo dos EUA; alta legibilidade, ar de serviço público.)

**Carregamento — auto-hospedar (não usar o CDN do Google).** Instalar via
`@fontsource/figtree` e `@fontsource/public-sans` (npm) e importar no código.
Motivos: (a) o PWA offline-first da Fase 4 **não funciona com fontes via CDN**
— elas precisam estar no cache local; (b) mantém a CSP estrita em `'self'`
(sem adicionar `fonts.googleapis.com`/`fonts.gstatic.com`), coerente com a
cadeia de segurança do projeto; (c) privacidade (sem request ao Google);
(d) performance previsível. Subsetting latin + latin-ext (cobre PT-BR).

**Escala (mobile-first):**

| Token | Tamanho / line-height | Fonte · peso | Uso |
|---|---|---|---|
| `display-xl` | 32px (→38px ≥640px) / 1.08 | Figtree 700 | hero da home ("Encontre a sua unidade…") — único passo responsivo da escala |
| `display-lg` | 28px / 1.15 | Figtree 700 | títulos de páginas internas (detalhe, "Onde ir?", 404) |
| `display` | 22px / 1.2 | Figtree 700 | títulos de seção grandes |
| `title` | 18px / 1.3 | Figtree 600 | subtítulos |
| `unit-name` | 16px / 1.3 | Public Sans 600 | nome da unidade no card |
| `body` | 16px / 1.6 | Public Sans 400 | texto base (16px ajuda leitura de idosos) |
| `label` | 14px / 1.4 | Public Sans 500 | rótulos, botões |
| `meta` | 13px / 1.45 | Public Sans 400 | metadados (bairro, datas) |

Piso de 12px em qualquer texto. Títulos com `letter-spacing: -0.01em`.

## 3. Paleta (tema claro) — tokens e contraste

**Neutros e superfícies**

| Token | Hex | Uso | Contraste |
|---|---|---|---|
| `ink` | `#16302A` | texto principal | 14.1:1 sobre branco (AAA) |
| `text-secondary` | `#5B6B66` | texto secundário, meta | 5.6:1 (AA) |
| `surface` | `#FFFFFF` | cards, barras | — |
| `bg` | `#FBFAF7` | fundo da página (creme quente) | — |
| `border` | `#EEE9DF` | bordas sutis | — |
| `border-strong` | `#E0DBD0` | bordas de ênfase | — |

**Marca**

| Token | Hex | Uso | Contraste |
|---|---|---|---|
| `primary` | `#0F5132` | pinho cívico da marca, botões e ícone | branco 9.36:1 (AAA); 8.97:1 sobre `bg` |
| `primary-strong` | `#0A3D25` | hover/active de ações `primary` sólidas | branco 12.30:1 (AAA) |
| `primary-ink` | `#15603C` | texto, separadores e realce sobre fundos claros | 7.58:1 sobre branco; 6.55:1 sobre `primary-soft` (AA) |
| `primary-soft` | `#E4F2E7` | lavagem verde-pinho para estados discretos | — |

> A marca não possui mais família `accent`: a interface usa pinho, branco e
> neutros. Vermelho sobre verde escuro fica perto de 1.1:1 e não sustenta
> hierarquia ou legibilidade; além disso, vermelho pertence à emergência, não
> à decoração. `cat-urgency` permanece abaixo como token independente de
> categoria — não é acento de marca.

**Emergência**

| Token | Hex | Uso | Contraste |
|---|---|---|---|
| `emergency` | `#A32D2D` | barra de emergência (SAMU 192), sempre visível | branco 7.07:1 (AAA) |

**Confiança do dado (selos de status)** — fundo claro + texto escuro da mesma família:

| Estado | bg | texto | acento |
|---|---|---|---|
| OK (`success`) | `#E1F5EE` | `#0F6E56` (5.46:1 AA) | dot `#1D9E75` |
| Cautela (`warning`) | `#FAEEDA` | `#854F0B` (5.87:1 AA) | ícone `ti-alert-circle` |

> Achado do cálculo: o âmbar **não** atinge AA como cor sólida (nem com texto branco, nem escuro). Por isso o selo de cautela é sempre **âmbar-claro com texto marrom-escuro**, nunca âmbar sólido.

> `conf-ok-bg`, `conf-ok` e `conf-ok-dot` continuam deliberadamente
> independentes da família da marca. Semelhança entre verdes não autoriza
> reutilizar token de status como `primary` ou vice-versa.

**Cores de categoria (tags)** — sólidas, com **texto branco** (todas AA):

| Categoria | Token | Hex | Contraste (branco) |
|---|---|---|---|
| UBS / atenção básica | `cat-ubs` | `#185FA5` | 6.52:1 |
| Urgência / PA | `cat-urgency` | `#B5421F` | 5.58:1 |
| Hospital | `cat-hospital` | `#9A2D3F` | 7.44:1 |
| Saúde mental / CAPS | `cat-mental` | `#534AB7` | 6.93:1 |
| Especialidades | `cat-specialty` | `#15667A` | 6.54:1 |
| Farmácia | `cat-pharmacy` | `#3B6D11` | 6.21:1 |
| Apoio / institucional | `cat-admin` | `#5F5E5A` | 6.49:1 |

## 4. Forma, raios e espaçamento

| Token | Valor | Uso |
|---|---|---|
| `radius-sm` | 4px | **tags de categoria** (retangular — o traço de sinalização) |
| `radius-md` | 10px | inputs, ações utilitárias e cards de unidade |
| `radius-lg` | 14px | agrupamentos grandes legados que ainda exijam contenção |
| `radius-pill` | 999px | **chamadas telefônicas** compactas |

- Espaçamento na escala 4 / 8 / 12 / 16 / 24 / 32.
- **Alvo de toque mínimo 44×44px** (botões, radios com rótulo e links de ação) — regra do projeto.
- Sem gradientes, sem sombras decorativas (só anel de foco funcional).

> Regra de forma que organiza a UI: **categoria = retângulo curto**
> (`radius-sm`), **utilidade e registro = retângulo compacto**
> (`radius-md`) e **telefonia = cápsula** (`radius-pill`). Estados de
> confiança permanecem texto semântico, conforme §9.2.

## 5. Componentes

- **Cabeçalho e navegação:** faixa `primary` sólida, sem borda inferior. A rota ativa é uma placa conectada ao conteúdo: `bg`, texto `primary`, peso 600, `radius-sm` somente nos cantos superiores, altura mínima de 44px e encaixe direto no limite inferior do header. Rotas inativas usam texto branco e `hover:bg-white/10`, sem linha ou deslocamento. O foco é `primary` na placa creme e branco nas rotas sobre o header.
- **Lista de filtro** (Todos / UBS / Urgência…): `fieldset` + `legend` e radios nativos em linhas transparentes com altura mínima de 44px. O radio marcado é o indicador persistente e o texto selecionado usa peso 600; não há faixa preenchida, check duplicado, marcador lateral, card, pílula ou borda fechada por item. No desktop, as listas ficam abertas na lateral sticky. Abaixo de `lg`, cada grupo é um disclosure no fluxo normal; listas longas usam “Ver mais/menos” inline, nunca `<dialog>`.
- **Tag de categoria** (no card): retangular `radius-sm`, cor da categoria sólida + texto branco, Public Sans 700 / 11px. Letra espaçada (`0.05em`); pode usar caixa alta curta ("UBS", "SAÚDE MENTAL").
- **Selo de status** (confiança): texto sóbrio com cor semântica, rótulo completo e ícone quando necessário; ver §9.2.
- **Botão primário:** `primary` sólido, texto branco, `radius-md`, altura ≥44px; `primary-strong` somente em hover/active.
- **Card de unidade:** `surface`, `border`/`edge` 1px, `radius-md`, padding 14–16px; tag de categoria no topo, `unit-name`, `meta` e confiança no rodapé. `box-shadow`, `filter` e `transform` computam como `none` em repouso e hover; a interação permanece no link do título e no foco.
- **Ação Localizar:** faixa aberta no fundo natural da página, sem fundo colorido, card, raio ou régua lateral; `border-top`/`border-bottom` em `edge` separam a utilidade do conteúdo vizinho. O botão usa `primary` sólido, texto branco, `radius-md`, keyline de 1px em `primary-strong`, altura mínima de 44px, padding horizontal de 20px, rótulo 600 e crosshair inline de 18px. A largura segue texto + ícone; fica abaixo e alinhado ao início no mobile e à direita da explicação no desktop.
- **Dock de emergência:** `emergency` sólido, rótulo “Emergência” e duas cápsulas `tel:` com a mesma estrutura: telefone inline de 14px + nome + número 700 com algarismos tabulares. A caixa visual mede cerca de 32px de altura e um pseudo-elemento transparente expande cada hit area para pelo menos 44×44px. SAMU é preenchida em branco, com texto `emergency` e borda branca de 1px; Bombeiros é transparente, com texto branco e borda branca a 80%. A partir de `sm`, rótulo, divisor vertical branco a 35% e texto de apoio formam uma régua à esquerda, com as ações à direita; abaixo de `sm`, rótulo e ações ocupam duas linhas e o divisor some. Sem sombra, pulso, escala, glow ou animação.

## 6. Estados de confiança → tratamento na UI

| `confidence` | Selo | Texto exemplo |
|---|---|---|
| `verified-local` (futuro) | success + `ti-check` | "Horário confirmado" |
| `official-recent` | success | "Aberto · até 19h30" |
| `official-stale` | warning (suave) | "Fonte oficial — pode ter mudado" |
| `unverified` | warning | "Horário não confirmado — ligue antes" |

A proveniência continua exposta: o selo comunica a confiança do dado, nunca a esconde.

## 7. Logotipo

- **Marca:** `navegador` + `·` + `sus`, em **Figtree 600**. O ponto `·` herda a cor do wordmark e mantém **margin 0.28em de cada lado**; não existe acento coral independente.
- **Qualificador:** "Erechim · rede pública de saúde", em **Public Sans**, `text-secondary`.
- **Variações:** completa (marca + qualificador) · compacta (só `navegador · sus`) · ícone isolado.
- Não inclinar, não separar a cor do ponto da cor do wordmark e não usar sobre fundos de baixo contraste.
- **No cabeçalho:** pin em contorno branco de aproximadamente 1.6px, sem preenchimento, com extremidades arredondadas e cruz branca preenchida; 34px no mobile e 38px a partir de `sm`. Wordmark e ponto usam branco, no passo `display` (22px), **Figtree 600**, sobre `primary` sólido. Em 320–390px, marca e navegação ocupam duas linhas; a partir de `sm`, uma linha. O link externo fornece o único nome acessível da marca e o SVG/texto interno fica `aria-hidden`.
- **Nos assets do app:** favicon, PWA, Apple Touch e maskable mantêm o pin **sólido** em `primary`; o contorno branco é exclusivo da variante sobre o cabeçalho.

## 8. Ícone do app

Pin (cor `primary`) com cruz **branca** vazada. Sem tile/quadrado colorido de
fundo. A cruz é branca por decisão deliberada: a **cruz vermelha é emblema
protegido** (Convenções de Genebra + legislação brasileira) e seu uso por
terceiros é vedado — branca comunica "saúde" sem risco e tem contraste máximo.

SVG-fonte (24×24, escalável):

```svg
<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="navegador sus Erechim">
  <path d="M12 1.6c-4.3 0-7.8 3.4-7.8 7.5 0 5.3 7.8 13.3 7.8 13.3s7.8-8 7.8-13.3c0-4.1-3.5-7.5-7.8-7.5z" fill="#0F5132"/>
  <rect x="10.85" y="5.4" width="2.3" height="7.4" rx="0.5" fill="#FFFFFF"/>
  <rect x="8.4" y="7.95" width="7.2" height="2.3" rx="0.5" fill="#FFFFFF"/>
</svg>
```

**Geração de assets:**
- `favicon` 16/32px e mark no header: pin sobre **fundo transparente**.
- Ícones de PWA (192/512px), `apple-touch-icon` (180px) e versão **maskable**: pin centralizado com *safe-zone*, sobre **fundo branco** `#FFFFFF` (não um tile verde — respeita "sem bloco colorido"). O recorte do Android vira um círculo branco com o pin, limpo.

## 9. Componentes — especificação visual

### 9.1 Tag de categoria (`CategoryTag`) — Etapa Visual 4 / A1

Retângulo sólido pequeno, na cor da família, com texto branco.
**Largura definida pelo conteúdo** — nunca estica.

- `display: inline-flex; align-items: center; align-self: flex-start`
- `padding: 4px 9px`
- `border-radius: 3px`
- texto: Public Sans 700 / 11px / `line-height: 1` /
  `text-transform: uppercase` / `letter-spacing: 0.05em` / `color: white`
- background: token `cat-{family}` do §3
- **Sem foco visível** (a tag não é clicável; a regra
  `:focus-visible` global só fala de interativos)

**Famílias:** `ubs`, `urgency`, `hospital`, `mental`, `specialty`,
`pharmacy`, `admin` (§3 — *Cores de categoria*).

**Proibido (causa raiz dos bugs já vistos):**
- `width: 100%`, `display: block`, `flex` *sem* `align-self: flex-start`
- envelopar em wrapper sem `display: flex`
- `text-decoration: underline` no hover (a tag não é link)

Em flex-column (UnitCard é `flex flex-col h-full`), filhos ocupam 100%
da largura por default. **Tanto `inline-flex` quanto `self-start` são
obrigatórios** — defesa em profundidade caso o pai vire `block` no
futuro.

> **Curiosidade que assusta no DevTools:** o filho de um flex container
> tem o `display` *blockificado* — `inline-flex` aparece como `flex` no
> computed style, `inline-block` aparece como `block`. **A largura
> permanece correta** (o `inline-` foi escrito para o caso de o pai
> virar block); o `display` só dá a impressão de ter mudado. O teste em
> `e2e/directory.spec.ts` valida o contrato pela **classe CSS escrita**,
> não pelo computed value — é a classe que protege refatorações.

### 9.2 Selo de confiança como texto (`Badge`) — Etapa Visual 5 / D

O estado de confiança não adota a cápsula reservada à telefonia: aqui a
separação semântica vem de texto explícito e ícone de cautela quando necessário.

O selo de status é agora **texto puro**, sem fundo, sem borda, sem raio.
A pílula colorida competia com a tag de categoria (também colorida) pela
atenção do olho; o texto colorido + ícone opcional é mais sóbrio e
deixa o card respirar.

- `display: inline-flex; align-items: center; gap: 5px`
- texto: Public Sans 600 / 13px (`text-meta font-semibold`)
- cor por família (tokens `text-conf-ok` / `text-conf-warn` do §3)
- ícone opcional 13×13, `aria-hidden`, herda `currentColor`

Filtros ativos também não usam pílulas: `FiltersBar` apresenta ações de texto
removíveis com “×”. A separação é coerente: categoria usa retângulo sólido;
confiança usa texto semântico; escolhas usam radio na origem e ação textual no
resumo.

**Quando entra ícone (e qual):**

| Call-site (`UnitCard` / `UnitDetailPage`) | Confidence | Label | Ícone |
|---|---|---|---|
| Horário, `verified-local` / `official-recent` | mesma | "horário confirmado por telefone" / "horário de fonte oficial" | — |
| Horário, `unverified` | `unverified` | "horário não confirmado — ligue antes" | `alert-triangle` |
| Coming-soon (card no diretório) | `unverified` | "em construção — ainda não atende" | `tools` |
| Care-restricted | `unverified` | "acesso restrito" | `alert-triangle` |
| Care-cautious | `unverified` | "informações em verificação" | `alert-triangle` |
| `ProvenancedRow`, `unverified` | (mesmo) | (mesmo) | `alert-triangle` |
| `ProvenancedRow`, demais | (mesmo) | (mesmo) | — |

**Por que dois ícones diferentes (e não só um):** o triângulo é o signo
cívico universal de cautela ("verifique antes"); o `tools` indica
obra/estado ("ainda não opera"). A cor âmbar diz **atenção**; o ícone
diz **qual sub-tipo** de atenção. Sem o ícone, o âmbar virava ambíguo.

**Acessibilidade (WCAG 1.4.1 — cor não é o único sinal):** o rótulo
PT-BR carrega a semântica completa ("horário não confirmado — ligue
antes" / "em construção — ainda não atende"). Ícone e cor são reforços
visuais; o leitor de tela recebe a mesma informação via texto. Por isso
os SVGs ficam `aria-hidden`.

**Por que SVG inline e não webfont (`@tabler/icons-webfont`):** a fonte
de ícones precisaria de uma dependência inteira para carregar 2 glyphs,
custaria FOUT (texto sem ícone até a fonte chegar) e, no PWA offline da
Fase 4, mais um arquivo para o cache. Os SVGs inline herdam
`currentColor` — a cor do ícone segue a cor do texto **sem código de
sincronização** — e somam ~400 bytes ao bundle final.

> `currentColor` (parada técnica): palavra-chave do CSS que resolve para
> o valor da propriedade `color` do próprio elemento. Quando o `stroke`
> ou `fill` de um SVG é `currentColor`, o ícone passa a herdar
> automaticamente a cor do texto vizinho. Defina a cor uma vez no
> `<span>` da Badge; o ícone vai junto. É o equivalente CSS de "faz o
> que o texto faz".

### 9.3 Sistema de orientação cívica — Etapas Visuais 12–14

A composição compartilhada funciona como sinalização pública, não como uma
coleção de objetos elevados:

- cabeçalho em `primary` sólido, sem `background-image` ou borda inferior; a
  rota ativa forma uma placa `bg` conectada ao conteúdo, enquanto marca e
  rotas inativas permanecem brancas sobre o pinho;
- filtros como listas verticais de consulta, com grupos progressivamente
  revelados no mobile e lateral sticky no desktop;
- unidades como registros sólidos em `surface` + `edge` + `radius-md`, sem
  sombras, filtros ou movimento do container;
- “Onde ir?” como mapa textual: faixa aberta de emergência primeiro e,
  abaixo, linhas no fundo natural separadas por divisores, com rótulo de
  acesso na coluna estreita e explicação na coluna principal;
- a utilidade Localizar como faixa aberta entre divisores horizontais, sem
  repetir o padrão genérico de callout, e com a ação delimitada por keyline;
- o dock como régua de serviço no desktop: rótulo, divisor, contexto e par
  telefônico preenchido × contornado; no mobile, a mesma hierarquia recompõe
  duas linhas sem sacrificar a área de toque;
- `.dot-accent` permanece como nome histórico do separador tipográfico, mas
  agora usa `primary-ink`; aparece somente nos pontos disciplinados do motivo
  e nunca introduz uma segunda família de marca;
- cor reforça marca, categoria, confiança e emergência, mas divisores,
  tipografia, ordem e alinhamento preservam a leitura em escala de cinza.

Os tokens `--spacing-header` e `--spacing-bar` acompanham a recomposição:
100px/80px abaixo de `sm` e 68px/60px a partir de `sm`. `h-header`, `h-bar`,
`pb-bar` e `h-mappage` consomem esses valores; mudar a altura de qualquer
chrome exige atualizar o conjunto, não um componente isolado.

## 10. Acessibilidade (herda das metas do projeto)

- Contraste AA garantido por construção (tabelas acima).
- Cor **nunca** é o único sinal: categoria sempre tem rótulo textual; status tem ícone + texto.
- Foco visível forte; navegação por teclado; alvos ≥44px; `prefers-reduced-motion` respeitado.
- A auditoria formal acontece na Fase 4.
