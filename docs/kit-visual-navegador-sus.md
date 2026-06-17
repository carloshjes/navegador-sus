# Kit Visual — navegador · sus Erechim

> Identidade visual definitiva do projeto. Substitui a paleta **provisória**
> da Fase 1. Adicionar ao conhecimento do projeto.
> **Versão 1.0** — 13/06/2026. Tema: **somente claro** na v1.
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
| `chip` | 13px / 1 | Public Sans 600 | texto de chips e tags |

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
| `border-strong` | `#E0DBD0` | bordas de ênfase, chips inativos | — |

**Marca**

| Token | Hex | Uso | Contraste |
|---|---|---|---|
| `primary` | `#0E5E4C` | cor da marca (teal), botões, ícone | 7.71:1 sobre branco (AAA) |
| `primary-ink` | `#0F6E56` | texto/realce sobre fundos claros | 5.46:1 sobre `#E1F5EE` (AA) |
| `accent` | `#D8602F` | coral **decorativo** (ponto do logo, detalhes grandes ≥24px) | 3.73:1 — **não usar em texto pequeno** |
| `accent-text` | `#B5421F` | coral para **texto** | 5.58:1 sobre branco (AA) |

> Achado do cálculo: o coral tem dois tons de propósito — `accent` só para elementos grandes/decorativos, `accent-text` para qualquer texto.

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

**Cores de categoria (tags/chips)** — sólidas, com **texto branco** (todas AA):

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
| `radius-sm` | 4px | **chips e tags** (retangular — o traço de sinalização) |
| `radius-md` | 10px | inputs, botões |
| `radius-lg` | 14px | cards |
| `radius-pill` | 999px | **selos de status** (pílula — o traço acolhedor) |

- Espaçamento na escala 4 / 8 / 12 / 16 / 24 / 32.
- **Alvo de toque mínimo 44×44px** (botões, chips, links de ação) — regra do projeto.
- Sem gradientes, sem sombras decorativas (só anel de foco funcional).

> Regra de forma que organiza a UI: **categoria = retângulo** (`radius-sm`), **status = pílula** (`radius-pill`). A diferença de forma separa "que tipo de unidade é" de "está aberto/confirmado".

## 5. Componentes

- **Chip de filtro** (Todas / UBS / Urgência…): retangular `radius-sm`, altura ≥36px (toque ≥44 com área). Ativo: `primary` sólido + texto branco. Inativo: `surface` + `border-strong` + `text-secondary`.
- **Tag de categoria** (no card): retangular `radius-sm`, cor da categoria sólida + texto branco, `chip` 13px. Letra levemente espaçada (`0.03em`); pode usar caixa alta curta ("UBS", "SAÚDE MENTAL").
- **Selo de status** (confiança): pílula `radius-pill`, fundo/texto da família (success/warning), com dot ou ícone à esquerda.
- **Botão primário:** `primary` sólido, texto branco, `radius-md`, altura ≥44px.
- **Card de unidade:** `surface`, `border` 1px, `radius-lg`, padding 14–16px; tag de categoria no topo, `unit-name`, `meta`, selo de status, chevron de navegação.
- **Barra de emergência:** `emergency` sólida, texto branco, `ti-phone-call` + "Emergência" + "SAMU 192" — sempre visível (briefing §2).

## 6. Estados de confiança → tratamento na UI

| `confidence` | Selo | Texto exemplo |
|---|---|---|
| `verified-local` (futuro) | success + `ti-check` | "Horário confirmado" |
| `official-recent` | success | "Aberto · até 19h30" |
| `official-stale` | warning (suave) | "Fonte oficial — pode ter mudado" |
| `unverified` | warning | "Horário não confirmado — ligue antes" |

A proveniência continua exposta: o selo comunica a confiança do dado, nunca a esconde.

## 7. Logotipo

- **Marca:** `navegador` + `·` + `sus`, em **Figtree 700**, cor `primary`. O ponto `·` é `accent` (coral) com **margin 0.28em de cada lado** (arejado).
- **Qualificador:** "Erechim · rede pública de saúde", em **Public Sans**, `text-secondary`.
- **Variações:** completa (marca + qualificador) · compacta (só `navegador · sus`) · ícone isolado.
- Não inclinar, não recolorir o ponto para fora do coral/`primary`, não usar sobre fundos de baixo contraste.

## 8. Ícone do app

Pin (cor `primary`) com cruz **branca** vazada. Sem tile/quadrado colorido de
fundo. A cruz é branca por decisão deliberada: a **cruz vermelha é emblema
protegido** (Convenções de Genebra + legislação brasileira) e seu uso por
terceiros é vedado — branca comunica "saúde" sem risco e tem contraste máximo.

SVG-fonte (24×24, escalável):

```svg
<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="navegador sus Erechim">
  <path d="M12 1.6c-4.3 0-7.8 3.4-7.8 7.5 0 5.3 7.8 13.3 7.8 13.3s7.8-8 7.8-13.3c0-4.1-3.5-7.5-7.8-7.5z" fill="#0E5E4C"/>
  <rect x="10.85" y="5.4" width="2.3" height="7.4" rx="0.5" fill="#FFFFFF"/>
  <rect x="8.4" y="7.95" width="7.2" height="2.3" rx="0.5" fill="#FFFFFF"/>
</svg>
```

**Geração de assets:**
- `favicon` 16/32px e mark no header: pin sobre **fundo transparente**.
- Ícones de PWA (192/512px), `apple-touch-icon` (180px) e versão **maskable**: pin centralizado com *safe-zone*, sobre **fundo branco** `#FFFFFF` (não o tile teal — respeita "sem bloco colorido"). O recorte do Android vira um círculo branco com o pin, limpo.

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

A regra do §4 ("status = pílula") é **parcialmente quebrada** aqui — e a
quebra é o sistema visual ficando mais honesto, não menos.

O selo de status é agora **texto puro**, sem fundo, sem borda, sem raio.
A pílula colorida competia com a tag de categoria (também colorida) pela
atenção do olho; o texto colorido + ícone opcional é mais sóbrio e
deixa o card respirar.

- `display: inline-flex; align-items: center; gap: 5px`
- texto: Public Sans 600 / 13px (`text-meta font-semibold`)
- cor por família (tokens `text-conf-ok` / `text-conf-warn` do §3)
- ícone opcional 13×13, `aria-hidden`, herda `currentColor`

**A pílula passa a ser o vocabulário dos chips de filtros ativos**
(`FiltersBar` v5/B) — a forma "acolhedora" agora marca **as escolhas que
o cidadão fez**, não o estado do dado. A separação é coerente: o dado
informa em sóbrio; o usuário interage em acolhedor.

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

## 10. Acessibilidade (herda das metas do projeto)

- Contraste AA garantido por construção (tabelas acima).
- Cor **nunca** é o único sinal: categoria sempre tem rótulo textual; status tem ícone + texto.
- Foco visível forte; navegação por teclado; alvos ≥44px; `prefers-reduced-motion` respeitado.
- A auditoria formal acontece na Fase 4.
