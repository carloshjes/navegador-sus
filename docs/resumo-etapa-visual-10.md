# Resumo — Etapa Visual 10: cabeçalho tonal (`navegador-sus`)

> Executada em **13/07/2026** sobre a regra de profundidade tonal da Etapa
> Visual 9. Etapa exclusivamente de apresentação: nenhum dado, conteúdo, rota
> ou política de exibição foi alterado.
>
> **Nota posterior:** o coral, `border-accent` e `text-accent` documentados
> abaixo foram removidos na Etapa Visual 14. O texto permanece como registro
> do estado daquela etapa.

## O que mudou

- O `<header>` compartilhado por todas as rotas trocou `bg-surface` pelo token
  existente `bg-primary-tonal`, mantendo o gradiente estritamente entre
  `primary → primary-strong`.
- O cabeçalho recebeu a classe estrutural `app-header`, usada para aplicar
  anel de foco branco somente aos controles dentro dessa superfície escura.
- Os links da navegação passaram de `text-primary` para `text-white`.
- O link ativo preserva a borda inferior coral `border-accent`; o hover do
  link inativo agora usa `hover:border-white`, visível sobre as duas pontas do
  gradiente.
- A navegação trocou `transition-card` por `transition-chip`. Desde a Etapa 9,
  `transition-card` cobre `box-shadow`, não a borda; `transition-chip` devolve
  a transição curta de `border-color` e continua subordinada à regra global de
  `prefers-reduced-motion`.
- No `Logo`, o corpo do pin passou de teal para coral (`text-accent`), mantendo
  a cruz branca visível. O wordmark passou para branco; o ponto coral central
  permaneceu igual.
- O `<main>` e o `<footer>` não receberam gradiente nem mudança de superfície.

## Decisões e porquês

### Uma única superfície invertida

O cabeçalho é a única faixa clara→escura do app. A mudança dá presença ao
chrome mais recorrente sem transformar cada seção em uma superfície de marca.
Rodapé, conteúdo, cards, filtros, categorias e status continuam no sistema
claro existente.

Não foi criado um segundo gradiente. `bg-primary-tonal` reutiliza exatamente o
token da Etapa 9: `linear-gradient(to bottom, primary, primary-strong)`. Branco
sobre as duas pontas já estava documentado em **7,71:1** e **10,22:1**,
portanto a navegação e o wordmark mantêm AA/AAA ao longo do trajeto.

### Marca coral + branca

Pin branco não seria uma solução: a cruz do SVG já usa dois retângulos com
`fill="#fff"`, então corpo e símbolo se fundiriam. O coral preserva a relação
original — cruz clara sobre pin colorido — e repete o mesmo acento presente no
ponto do wordmark e na borda do item ativo.

`Logo` continua sem prop de tema. A busca global confirmou que ele só é
renderizado no cabeçalho; introduzir uma variante sem segundo consumidor seria
abstração antecipada.

### Estados e foco

- item ativo: texto branco + borda coral;
- item inativo: texto branco + borda transparente, branca no hover;
- links dentro de `.app-header`: anel branco em `:focus-visible`;
- skip-link: continua fora do header, com superfície branca, texto primary e
  anel primary próprios ao receber foco.

O seletor global ficou explícito:
`.bg-emergency :focus-visible`, `.app-header :focus-visible` e tags de
categoria escuras recebem `outline-color: #ffffff`. O skip-link não é
capturado por essa regra.

### Passagem anti-genérica

A rubrica de seis itens terminou em **0/12**. O gradiente reforça uma região
que já é estruturalmente persistente; não substitui ordem, tipografia ou
navegação. As ações de contenção foram manter somente uma superfície invertida,
preservar o rodapé claro e não adicionar sombra, blur ou efeito novo ao header.

## Testes

- `npm test`: **62 testes verdes** em 10 arquivos.
- `npm run test:e2e -- --workers=1 --reporter=line`: **59 testes verdes e 1
  skip esperado** em 60 execuções.
- `npm run build`: verde.
- `npm run lint`: verde.

A suíte e2e foi serializada porque já havia um Vite do workspace ativo em
`localhost:5173`; esse processo foi reutilizado e preservado. Os dois casos
adicionados pelo novo contrato — um por motor móvel — verificam:

- gradiente compilado com as pontas RGB de `primary` e `primary-strong`;
- pin coral, wordmark branco e navegação branca;
- borda coral do item ativo;
- contrato `hover:border-white` do item inativo (os projetos móveis anunciam
  corretamente `hover: none`, portanto não se falsificou hover de desktop);
- anel de foco branco no link dentro do cabeçalho.

O teste preexistente do skip-link passou a conferir também que, ao ganhar foco,
ele fica visível com fundo branco, texto primary e anel primary antes de levar
o teclado para `main#conteudo`. Esse fluxo passa no Chromium; o WebKit mantém o
skip esperado porque o Safari não inclui links na ordem de Tab padrão sem Full
Keyboard Access.

## Lighthouse

Medição da build de produção com perfil mobile do Lighthouse **13.4.0**, em
13/07/2026:

| Categoria | Etapa Visual 9 | Etapa Visual 10 | Resultado |
|---|---:|---:|---|
| Performance | 98 | **98** | igual |
| Acessibilidade | 100 | **100** | igual |
| Boas práticas | 100 | **100** | igual |
| SEO | 63 | **63** | igual |

Métricas auxiliares: FCP 2,0s; LCP 2,0s; TBT 0ms; CLS 0,019; Speed Index
2,0s. O SEO continua limitado pelo `noindex` intencional.

Como na Etapa 9, o relatório JSON completo foi gravado antes de o sandbox
negar ao `chrome-launcher` a remoção posterior do perfil temporário. O CLI
retornou 1 nessa limpeza, mas `fetchTime`, categorias e métricas estavam
presentes no relatório válido.

## Inspeção visual

O navegador conectado bloqueou explicitamente `http://localhost:5173` por uma
preferência de segurança e proibiu usar outra superfície como contorno. A
sessão foi encerrada sem contornar essa preferência.

Nos dois motores móveis, CSS computado confirmou o gradiente, texto branco,
pin e borda ativos em coral, anel branco dentro do header e skip-link branco +
primary. Essa verificação objetiva protege o contrato de contraste, mas **não
é registrada como inspeção visual humana**. A percepção do coral e do anel
sobre a faixa tonal ainda deve ser conferida por Carlos no preview local.

## Pendências

- **Inspeção visual direta:** conferir o cabeçalho em mobile e desktop, com
  atenção ao hover branco, borda coral ativa, foco branco e skip-link focado;
  bloqueada nesta sessão pela preferência de segurança do navegador.
- **Verificação telefônica dos dados:** continua adiada.
- **`X-Robots-Tag: noindex`:** permanece até a verificação dos dados e a
  decisão explícita de indexar o site.

## Critérios de conclusão — checagem

| Critério | Status |
|---|---|
| Etapa Visual 9 presente e reutilizada | ✅ `bg-primary-tonal` |
| Header com gradiente; main e footer claros | ✅ |
| Navegação branca, ativo coral e hover branco | ✅ contrato e2e |
| Pin coral, cruz branca e wordmark branco | ✅ contrato e2e |
| Foco branco dentro do header | ✅ contrato e2e |
| Skip-link visível com superfície própria ao focar | ✅ Chromium e2e |
| Contraste branco nas pontas 7,71:1 e 10,22:1 | ✅ documentação preservada |
| `npm test` e suíte e2e verdes | ✅ 62 unit; 59 e2e + 1 skip esperado |
| Lighthouse Accessibility igual ou acima da Etapa 9 | ✅ 100 = 100 |
| Inspeção visual de coral/foco/hover | ⚠️ bloqueada; CSS computado validado |
| Resumo escrito | ✅ este arquivo |
