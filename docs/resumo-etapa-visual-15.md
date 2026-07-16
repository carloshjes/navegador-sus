# Resumo — Etapa Visual 15: ficha estruturada de unidades (`navegador-sus`)

> Executada em **16/07/2026** sobre o padrão **Cívico compacto**. A etapa
> transforma os cards do diretório em fichas operacionais de duas zonas, sem
> alterar nomes canônicos, dados, proveniência, rotas, geolocalização,
> políticas de exibição ou contagem.

## Diagnóstico e direção

Os cards repetiam uma pilha genérica de categoria, título, meta e selo. O tipo
aparecia duas vezes, endereço e telefone não chegavam à listagem e o selo
“ligue antes” não era acompanhado do número disponível no próprio registro.

A direção aprovada foi executada sem nova exploração:

- categoria como **eyebrow de texto colorido**, sem bloco;
- identificação e dados práticos separados por divisor interno;
- endereço, telefone e horário organizados como linhas de registro;
- selo de horário preservado como mecanismo obrigatório de honestidade;
- grid de duas colunas e nomes completos preservados.

Na rubrica anti-genérica, o recorte partiu de **2/12** — repetição
indiferenciada e contêiner decorativo de categoria — e ficou em **0/12**. A
estrutura continua repetível porque é um diretório, mas cada ficha agora expõe
conteúdo operacional variável e uma hierarquia documental clara.

## Parada técnica: `mt-auto` e dois links seguros

O card continua uma coluna flexível que ocupa toda a célula do grid. A zona de
dados práticos recebe `mt-auto`: ela consome o espaço restante antes do
divisor e fica ancorada à base. Assim, cards da mesma linha mantêm a mesma
altura mesmo quando nomes ou endereços quebram de forma diferente.

O título e o telefone são links independentes no fluxo normal do DOM. O
telefone não usa overlay nem pseudo-elemento sobre o card; sua própria linha e
âncora têm altura mínima de 44px. A ordem de teclado é, portanto, título →
telefone, sem alvos sobrepostos ou clique no container inteiro.

## Implementação

### Eyebrow de categoria

- `CATEGORY_STYLE` passou de `bg-cat-*` para classes literais `text-cat-*`.
- Os rótulos incluem tradução de jargão na primeira menção, como
  “UBS — posto de saúde” e “CAPS — saúde mental”.
- `CategoryTag` usa 12px, peso 700, caixa alta e tracking de `0.08em`.
- Fundo, borda, raio e padding foram removidos; `data-testid="category-tag"`
  foi preservado.
- As cores de categoria têm contraste mínimo de 5.58:1 sobre o card branco;
  o rótulo textual mantém o significado independente da cor.

### Ficha em duas zonas

- A zona de identificação contém eyebrow, nome completo e distância opcional.
- A antiga linha redundante de tipo + bairro foi removida.
- A zona prática usa `border-top` em `edge`, `mt-auto` e linhas em
  `text-meta`.
- Map pin, telefone e relógio são SVGs inline de 14px, `currentColor` e
  `aria-hidden`, sem webfont.

### Dados práticos e lacunas

- Endereço combina somente `street` e `neighborhood` existentes com “ · ”.
  Se um campo é nulo, ele some; se ambos são nulos, a linha inteira não existe.
- Telefone aparece somente quando `phone.value` existe. O texto armazenado é
  preservado e o `href` reutiliza `telHref`, que remove caracteres não
  discáveis e anotações do destino.
- O link telefônico usa `primary`, sublinhado discreto, `aria-label` com o nome
  completo e alvo de 44px.
- `openingHours.value` aparece somente quando existe. O selo de confiança é
  renderizado em todas as fichas, inclusive quando o valor está ausente e na
  unidade em construção.
- “em construção — ainda não atende”, “acesso restrito” e “informações em
  verificação” mantiveram rótulos, ícones e lógica e ficam na última linha.

## Testes atualizados

- O contrato antigo de `CategoryTag` por largura, `inline-flex` e fundo sólido
  foi reescrito para 12px, peso 700, tracking, `text-cat-*` e ausência de
  contêiner.
- A configuração tipada agora exige `text-cat-*` para todas as famílias e
  protege as traduções de UBS e CAPS.
- Endereços com os dois campos, somente rua, somente bairro e ambos nulos são
  cobertos com dados reais do dataset.
- O telefone da UBS Capoerê protege texto, `aria-label`, destino
  `tel:+555433213199`, altura de 44px e foco após o link do título.
- O teste mede que título e telefone não se sobrepõem.
- Horário preenchido e ausente são cobertos; a quantidade de linhas com selo
  é comparada à quantidade total de cards renderizados.
- A igualdade de altura por linha, ausência de hover do container e selos de
  estado continuam protegidos.
- O smoke test de `.dot-accent` passou a montar o utilitário isoladamente,
  pois a linha meta que o consumia foi removida; a cobertura de cor foi
  preservada sem recolocar o separador no card.

## Inspeção visual direta

Foram capturados e inspecionados o card da UBS Capoerê em **390px** e as duas
primeiras linhas do grid em **1024px**. A leitura móvel permaneceu compacta;
no desktop, os cards conservaram altura igual e a zona prática ficou ancorada
à base. Divisor, ícones, telefone e selos formaram níveis distintos sem sombra,
hover de container ou novos blocos decorativos.

## Resultados reais

- `npm run lint`: **verde**.
- `npm test`: **63/63 testes verdes** em 10 arquivos.
- `npm run build`: **verde**; Vite transformou 110 módulos.
- `npm run test:e2e -- --project=mobile-chromium --workers=1`: **35/35 casos
  verdes** em 16.8s.
- Preflight focal de `directory.spec.ts` + `smoke.spec.ts`: **17/17 casos
  verdes** em 8.2s.
- Captura focal para inspeção visual: **1/1 caso verde**; o arquivo de teste
  temporário não integra o produto.

## Arquivos alterados

- Componentes: `src/components/UnitCard.tsx` e `CategoryTag.tsx`.
- Configuração visual: `src/lib/category-style.ts`.
- Base CSS: remoção do override de foco legado para superfícies `bg-cat-*`.
- Testes: `src/lib/category-style.test.ts`, `e2e/directory.spec.ts` e
  `e2e/smoke.spec.ts`.
- Documentação: kit visual v1.5 e este resumo.

## Checklist final

| Critério | Resultado |
|---|---|
| Eyebrow `text-cat-*`, sem bloco, em 12px | ✅ |
| Meta redundante de tipo removida | ✅ |
| Endereço + bairro na zona prática, com nulos omitidos | ✅ |
| Telefone discável quando existe e ausente quando nulo | ✅ |
| Horário exibido somente quando `value` existe | ✅ |
| Selo de horário sempre presente | ✅ todas as fichas E2E |
| Selos de estado com rótulo e lógica intactos | ✅ |
| Cards com altura igual por linha | ✅ medição E2E desktop |
| Ordem de teclado título → telefone e alvos separados | ✅ E2E |
| Container sem hover, sombra, transformação ou animação | ✅ |
| Dados canônicos e políticas inalterados | ✅ diff auditado |

## Pendências permanentes

- Verificação telefônica dos dados: continua adiada pelo usuário.
- `X-Robots-Tag: noindex`: permanece até a verificação dos dados e a decisão
  explícita de indexar o site.
