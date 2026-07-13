# Resumo — Etapa Visual 7: resposta rápida no topo (`navegador-sus`)

> Executada em **13/07/2026**. Etapa exclusivamente de apresentação:
> nenhuma mudança em dados, coordenadas, rotas ou política de exibição. A
> direção visual já estava decidida antes da implementação.

## O que mudou

- Foi criado `src/components/QuickLocateBand.tsx`, renderizado em largura
  total entre o contador da home e o grid de sidebar + resultados.
- O antigo `locateBlock` saiu do `aside`. A busca e os três grupos
  `FilterChipGroup` (tipo, serviço e bairro) permanecem no mesmo lugar e na
  mesma ordem.
- No estado inicial, a faixa preserva o título, o aviso de privacidade e o
  `LocateButton` existentes. O layout fica empilhado no mobile e passa para
  texto à esquerda / botão à direita em `lg` (1024px).
- Nos estados negado e indisponível, as mensagens anteriores foram mantidas
  dentro da nova faixa.
- No estado concedido, a faixa mostra um `UnitCard` real alimentado pelo
  primeiro item de `careWithDistance`, com a distância em linha reta, e o
  link **“Ver todas ordenadas por distância”**, que aponta para o grid de
  resultados.
- O preview recebeu `aria-live="polite"`. O aviso de territorialidade e a
  ação para desfazer a ordenação foram preservados, pois fazem parte da
  honestidade e da reversibilidade do fluxo existente.

## Decisões e porquês

### Responsabilidade do componente

`DirectoryPage` continua dona de filtros, geolocalização e cálculo de
distâncias. `QuickLocateBand` recebe somente o estado, o primeiro resultado
já ordenado e os callbacks de localizar/desfazer. Assim, a etapa muda a
hierarquia visual sem duplicar regra de negócio nem deslocar a política de
dados para um componente de apresentação.

### Preview coerente com os resultados

O card promovido vem de `careWithDistance[0]`, a mesma coleção usada pelo
grid. Portanto, filtros ativos e ordenação por distância continuam
produzindo a mesma primeira unidade na faixa e na lista; não existe um card
decorativo ou um segundo cálculo concorrente.

### Compactação e tokens

- A faixa usa apenas tokens já existentes: `bg-primary-soft`, `border-edge`,
  `rounded-lg` e as cores tipográficas do kit. Não foram criadas cores,
  raios ou sombras.
- O crosshair continua vindo do `LocateButton`; nenhum ícone foi copiado.
- No mobile, `p-3`, `gap-2` e texto secundário em `text-meta` mantêm a ação
  compacta. Um teste geométrico confirma que o campo de busca ainda aparece
  na primeira viewport tanto no Pixel 7 quanto no iPhone 13.
- `src/index.css` não foi alterado. O foco visível global e o tratamento de
  `prefers-reduced-motion` permanecem exatamente como estavam.

## Testes

- `npm test`: **60 testes verdes** em 10 arquivos.
- `npm run test:e2e`: **53 testes verdes e 1 skip esperado** em 54 execuções.
  O skip é o teste de Tab do skip-link no WebKit, já condicionado no projeto
  porque o Safari não inclui links na ordem de Tab padrão.
- Casos novos da faixa: **6 execuções verdes** — estados inicial, concedido
  e negado, cada um no Pixel 7 (Chromium) e no iPhone 13 (WebKit).
- `npm run build`: verde.
- `npm run lint`: verde.

Os casos novos verificam também que a faixa está fora da sidebar, que o
preview usa um `UnitCard` real com distância, que a região tem
`aria-live="polite"`, que o link leva ao grid e que a busca permanece na
viewport inicial.

## Lighthouse

Medição da build de produção com Vite Preview, perfil mobile do Lighthouse
**13.4.0**, em 13/07/2026:

| Categoria | Referência registrada na Etapa Visual 6* | Etapa Visual 7 | Resultado |
|---|---:|---:|---|
| Performance | 97 | **100** | acima (+3) |
| Acessibilidade | 100 | **100** | igual |
| Boas práticas | 100 | **100** | igual |
| SEO | 63 | **63** | igual |

\* A Etapa Visual 6 não fez uma coleta própria; seu resumo registra
97/100/100/63 como a referência herdada da Etapa Visual 5. A comparação aqui
usa essa referência de forma explícita, sem tratá-la como uma medição que não
existiu.

Métricas auxiliares da rodada: FCP 1,4s; LCP 1,5s; TBT 0ms; CLS 0,011; Speed
Index 1,4s. O SEO permanece em 63 pelo `noindex` intencional enquanto os dados
não passam pela verificação telefônica.

## Auditoria conservadora de código morto

A passagem `code-audit-cleanup` ficou limitada ao antigo `locateBlock` e aos
arquivos tocados nesta etapa. O bloco duplicado e seus imports obsoletos
(`Button` e `LocateButton` em `DirectoryPage`) foram removidos. Busca global,
TypeScript com `noUnusedLocals`, lint, build e as suítes de teste não
encontraram referência órfã ou código morto restante. Confiança **alta** no
escopo verificado; nenhum contrato público existente, rota, dado ou arquivo
gerado foi alterado pela limpeza.

## Pendências

- **Verificação telefônica dos dados:** continua adiada; campos confirmados
  ainda dependerão de `confidence: "verified-local"` e da data da ligação.
- **`X-Robots-Tag: noindex`:** permanece até a verificação dos dados e a
  decisão explícita de indexar o site.
- **B8 / clustering do mapa:** segue adiado para a Fase 4.
- **Auditoria formal WCAG/PWA:** segue pertencendo à Fase 4; esta etapa
  validou o recorte da home e não substitui a auditoria completa.

## Critérios de conclusão — checagem

| Critério | Status |
|---|---|
| `QuickLocateBand` entre contador e grid principal | ✅ |
| `locateBlock` removido da sidebar; três grupos de filtro preservados | ✅ |
| Estado inicial com textos e `LocateButton` existentes | ✅ |
| Estado concedido com `UnitCard` real + link para o grid | ✅ |
| Estados negado/indisponível com mensagens anteriores | ✅ |
| Preview com `aria-live="polite"` | ✅ |
| Somente tokens existentes; crosshair reaproveitado | ✅ |
| Foco global e `prefers-reduced-motion` preservados | ✅ |
| Busca visível sem rolar no Pixel 7 e iPhone 13 | ✅ teste e2e |
| `npm test` e `npm run test:e2e` verdes | ✅ 60 unit; 53 e2e + 1 skip esperado |
| Lighthouse mobile igual ou acima da referência | ✅ 100/100/100/63 |
| Auditoria de código morto concluída | ✅ sem resíduos detectados |
| Resumo escrito | ✅ este arquivo |
