# Resumo — Etapa Visual 6: consistência de tokens e polimento (`navegador-sus`)

> Executada em **17/06/2026** no Claude Code (dois commits: `439f1a6` às 03:05
> e `b86c816` às 04:03). **Resumo reconstruído em 13/07/2026** (Cowork), a
> partir do histórico do git — os dois commits ficaram sem o arquivo de
> resumo correspondente na hora. Reconstrução fiel às mensagens de commit e
> aos diffs; o que os commits não registram (ex.: Lighthouse) fica marcado
> como não medido, não inventado. Continua sendo **só apresentação**:
> nenhuma mudança em dados, coordenadas, rotas ou política de exibição
> (declarado explicitamente no commit `439f1a6`).

## A — Consistência de tokens (`439f1a6`, seguimento do audit P1–P3)

- **Tokens novos** em `src/index.css`:
  - `--color-emergency-soft` — substitui duas cores rosa ad-hoc que
    coexistiam (o wash do card de emergência em "Onde ir?" e o hover da
    pílula "SAMU 192") por um único token.
  - `--color-surface-hover` — hover sutil em superfícies claras/transparentes
    (usado no botão "Mais").
  - `--text-display-xl` (32px, step do hero da home) — passa a existir como
    token da escala em vez de valores soltos (`text-[32px] sm:text-[38px]`
    direto no JSX); documentado no kit §2.
- **`Button` como base compartilhada:** `LocateButton`, `EmptyState` e o
  botão "Aplicar" do `FilterChipGroup` deixaram de ter `<button>` com classes
  Tailwind duplicadas e passaram a renderizar o componente `<Button>` — um
  raio, um conjunto de estados, um lugar só para ajustar todos os CTAs
  primários.
- **`FiltersBar`:** a contagem trocou "N unidades" por "**N resultados**"
  (evitava colidir com a frase do hero, "35 unidades ativas"); tamanhos fora
  da escala (`text-[15px]`, `text-[13px]`…) migraram para os tokens
  (`text-label`, `text-meta`).
- **Chips de filtro ativos:** passaram a usar tokens de marca/interação
  (`bg-primary-soft` / `text-primary-ink`) em vez dos tokens de confiança
  (`bg-conf-ok-bg` / `text-conf-ok`) que usavam antes. É a mesma separação
  semântica do kit §9.2 (pílula = escolha do cidadão, selo de dado = estado
  do dado) aplicada a mais um componente que ainda misturava as duas
  famílias de cor.
- **Keyline de categoria no `UnitCard`:** este commit **adicionou** uma
  "espinha" de 4px na cor da família da categoria, na borda esquerda do
  card. Vale registrar porque o commit seguinte a **removeu** (item B1) —
  a espinha viveu menos de uma hora no histórico.

## B — Correções de bug (`b86c816`)

### B1. Espinha de categoria removida do card
A `CategoryTag` (kit §5) já é o sinal de categoria do card; a espinha
adicionada em A ficou redundante — dois sinais de cor para a mesma
informação. Revertida.

### B2. Disclosure "Mais/Menos" reposicionada
No desktop, os chips revelados por "Mais" agora entram **antes** do botão
no DOM (antes vinham depois). Resultado: quando expandido, "Menos" fica na
**ponta** do conjunto de chips, não presa no meio da fileira. Mobile
continua indo para o bottom-sheet, inalterado.

### B3. Bottom-sheet mobile aparecendo como "tela verde"
- **Bug:** a animação `@keyframes` do `<dialog>` rodava na transição
  `display:none` → aberto e **congelava no primeiro frame**
  (`translateY(100%)`) — o painel inteiro ficava abaixo da viewport, e só o
  `::backdrop` escuro aparecia. `toBeVisible()` no teste e2e não pegava o
  problema (o elemento *existia* e estava "visível" tecnicamente, só que
  fora da tela).
- **Correção:** o painel passou a ficar **fixado na borda inferior**
  (`inset: auto 0 0 0`) como estado de repouso — sempre visível
  independente de qualquer animação — e a entrada (slide + fade) virou uma
  transição via **`@starting-style`**.
- **Parada técnica — `@starting-style`:** uma transição CSS normal só anima
  entre dois estados de um elemento que **já existe** no DOM (ex.: hover,
  ou uma classe que muda). Quando um elemento passa de `display: none` para
  visível — como um `<dialog>` abrindo — não existe um "frame anterior" de
  onde partir: o browser não tem o que interpolar. A solução antiga para
  isso é `@keyframes` (definir manualmente os frames do zero), mas ela não
  garante que o estado de repouso final seja a "verdade" do CSS — se algo
  quebrar no meio da animação (como aconteceu aqui), o elemento pode ficar
  travado num frame intermediário errado. `@starting-style` é o mecanismo
  mais novo, pensado exatamente para isso: você declara como a propriedade
  deve ser tratada "no instante em que o elemento passa a existir/aparecer",
  e o browser anima **daquele** valor até o estado de repouso normal
  (definido fora do `@starting-style`, como qualquer CSS comum). Na prática,
  o estado de repouso (painel visível, no lugar) é sempre o que está escrito
  como padrão — a animação é só "como chegar lá"; onde o browser não suporta
  `@starting-style`, o painel simplesmente aparece direto no lugar certo, em
  vez de quebrar.
- **Teste e2e reforçado:** a asserção antiga (`toBeVisible()`) foi trocada
  por uma checagem de *bounding box* — confirma que o painel está ancorado
  na borda inferior e sua metade está dentro da viewport de 844px. É
  especificamente o tipo de checagem que teria pego o bug original.

### B4. Espaço entre endereço e "Ver no mapa"
Na página de unidade, o link "Ver no mapa →" estava ~40px afastado do
endereço a que se refere. Ajustado com `last:pb-0` no bloco de endereço
(mesmo padrão já usado no `ProvenancedRow`) + `mt-4` → `mt-2` no link,
mantendo o alvo de toque de 44px.

### B5. Hover de "SAMU 192" / "Bombeiros 193" no card de emergência
O card de emergência da página "Onde ir?" ainda usava sublinhado no hover
dos dois botões-pílula. Trocado por escurecimento de fundo — novo token
`--color-emergency-strong` (`#8a2626`, branco sobre ele em 8.8:1 AAA) —
replicando o mesmo ajuste que a Etapa Visual 4/A2 já tinha aplicado à
pílula "SAMU 192" do rodapé.

## Testes

- `npm test`: **60 testes verdes** (número declarado no commit `439f1a6`;
  `b86c816` não roda schema/dados e não altera nenhum `.test.ts`, então não
  há razão para o número ter mudado — mas o commit não reafirma o total).
- `npm run test:e2e`: **51 verdes** declarados em `439f1a6`. O commit
  `b86c816` **não informa** um novo total; o diff mostra assertivas novas
  adicionadas a um teste **já existente** (`directory.spec.ts`, bottom-sheet)
  em vez de um spec novo — então é possível que o total de casos não tenha
  mudado, só ficou mais rigoroso. Fica registrado como não confirmado, em
  vez de presumido.

## Lighthouse

**Não medido nesta rodada** — nenhum dos dois commits registra números de
Lighthouse (diferente de todas as etapas visuais anteriores, que fechavam
com a tabela de mobile). Como as mudanças são pontuais (tokens + 5 bugs de
CSS/layout, sem JS novo relevante), a expectativa é que os números da Etapa
Visual 5 (Home 97/100/100/63, Mapa a11y 96) sigam válidos, mas isso é uma
inferência, não uma medição — recomendo rodar `npm run build && npm run
preview` + Lighthouse mobile antes de tratar isso como confirmado,
especialmente porque a Fase 4 vai auditar formalmente de qualquer jeito.

## Pendências (herdadas, sem mudança nesta etapa)

- **B8 / clustering do mapa** (Etapa Visual 2): segue **adiado para a
  Fase 4** — ainda a única pendência visual de produto em aberto.
- **Auditoria WCAG/Lighthouse formal**: Fase 4, não iniciada (sem service
  worker, sem manifesto de offline — só o manifesto de ícones da Etapa
  Visual 1).
- **Verificação telefônica dos dados**: planilha pronta
  (`verificacao-telefonica-unidades.xlsx`, fora do repo), 22 linhas — todas
  ainda **"Pendente"** em 13/07/2026 (conferido nesta sessão).
- **Lighthouse desta rodada**: pendente de medição real (ver seção acima).

## Nota de proveniência deste documento

Este arquivo não existia até 13/07/2026. Foi escrito numa sessão do Cowork
que leu `git log`/`git show` dos commits `439f1a6` e `b86c816` (17/06/2026)
para reconstruir o que a Etapa Visual 6 mudou, já que os dois commits não
tinham sido fechados com o resumo de praxe do projeto. Todo conteúdo aqui
vem das mensagens de commit e dos diffs reais — nada foi inferido sobre o
que o código faz sem checar o diff correspondente.

## Critérios de conclusão — checagem

| Critério | Status |
|---|---|
| Tokens novos (`emergency-soft`, `surface-hover`, `display-xl`) documentados no kit | ✅ kit §2 (conforme commit) |
| CTAs primários unificados no componente `Button` | ✅ `LocateButton`, `EmptyState`, "Aplicar" |
| Bug do bottom-sheet "tela verde" corrigido | ✅ `@starting-style` + teste de bounding box |
| "Menos" na ponta do conjunto de chips (desktop) | ✅ |
| Espinha de categoria (adicionada e revertida na mesma etapa) | ✅ removida — `CategoryTag` é o único sinal |
| Gap endereço → "Ver no mapa" ajustado | ✅ mantendo alvo de 44px |
| Hover de emergência consistente (rodapé + card "Onde ir?") | ✅ |
| Testes verdes | ✅ 60 unit (439f1a6) — e2e 51 declarado em 439f1a6, total pós-b86c816 não confirmado |
| Lighthouse registrado | ❌ não medido nesta rodada (ver seção Lighthouse) |
| Resumo escrito | ✅ este arquivo (reconstruído retroativamente) |
