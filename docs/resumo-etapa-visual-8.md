# Resumo — Etapa Visual 8: mapa dos hubs (`navegador-sus`)

> Executada em **13/07/2026**. Etapa de apresentação e interação do mapa:
> nenhum dado canônico, coordenada ou rota foi alterado. A direção “Mapa dos
> hubs” já estava decidida antes da implementação.

## O que mudou

- Unidades plotáveis com a mesma coordenada exata agora formam um grupo antes
  de o React renderizar os marcadores.
- Grupos com uma unidade continuam usando o marcador e o popup individuais da
  Etapa Visual 3.
- Grupos com duas ou mais unidades renderizam um único pin de hub, com badge de
  contagem visível. O pin e o badge usam `--color-primary`; o badge usa
  `--radius-pill` e texto branco.
- O marcador de hub tem área de 44×44px, fica acima dos pins individuais no
  empilhamento do Leaflet e recebe `aria-label` como “5 unidades neste
  endereço”. SVG e contagem visual ficam `aria-hidden`, evitando anúncio
  duplicado.
- Ao tocar o hub, o popup mostra **“No mesmo endereço funcionam:”**, a explicação
  “Endereço igual não significa serviço igual” e uma lista de nome + tipo. Cada
  item abre `/unidade/:id`.
- `?focus=<id>` agora encontra o grupo que contém a unidade. O mapa voa para a
  coordenada, abre o popup do hub e marca a unidade correspondente com
  `aria-current="location"`, fundo `primary-soft` e o texto “Em foco no mapa”.

## Decisões e porquês

### Agrupamento exato, sem aproximação

`src/lib/hubs.ts` ganhou um agrupador privado por chave, compartilhado por
`hubMates` (chave de endereço normalizada) e
`groupMappableUnitsByCoordinate` (par latitude/longitude exato). Nenhum
arredondamento ou raio de proximidade é usado: prédios vizinhos nunca viram um
hub por acidente.

No conjunto atual, a regra produz **um hub plotável**: UMRS, na coordenada
`-27.635, -52.285`, com cinco unidades:

1. UBS Centro (UMRS);
2. Pronto Atendimento Municipal;
3. Ambulatório de Saúde Mental;
4. Centro de Referência da Mulher;
5. Ambulatório de Feridas Crônicas.

Outros endereços só formarão hubs no mapa quando as coordenadas canônicas
realmente coincidirem e as unidades forem plotáveis. A etapa não aproximou
pontos nem corrigiu dados por inferência.

### Estrutura compartilhada com o detalhe

Foi criado `HubUnitList`, usado tanto por `UnitDetailPage` quanto pelo popup do
mapa. Isso mantém em um só lugar a explicação de que endereço igual não
significa serviço igual e a estrutura de links. O modo compacto do mapa
acrescenta tipo e destaque de foco; o detalhe mantém a apresentação anterior.

### Solução bespoke

Não foi adicionada `leaflet.markercluster`. O agrupamento é uma passagem linear
sobre as poucas unidades estáticas do dataset e independe de zoom. O
`package.json` e o lockfile permanecem sem alterações. O chunk gzip do mapa
passou de aproximadamente **46,43 kB para 46,75 kB** (+0,32 kB), sem custo na
home, pois o mapa continua lazy-loaded.

### Empilhamento e toque

O primeiro teste real revelou que, no zoom inicial, o pin do Hospital Santa
Terezinha podia interceptar o ponto da UMRS. O hub recebeu `zIndexOffset=1000`,
mantendo as coordenadas intactas e garantindo que a ação agregada fique
tocável. O teste deixa essa regressão coberta nos dois motores móveis.

## Testes

- `npm test`: **62 testes verdes** em 10 arquivos.
- `npm run test:e2e`: **57 testes verdes e 1 skip esperado** em 58 execuções.
  O skip continua sendo o teste de Tab do skip-link no WebKit, condicionado no
  projeto porque o Safari não inclui links na ordem de Tab padrão.
- `npm run build`: verde.
- `npm run lint`: verde.

Testes novos:

- unitário: UMRS forma um grupo de cinco unidades na coordenada esperada;
- unitário: unidade com coordenada única continua em grupo de um item;
- e2e no Pixel 7 e iPhone 13: um único hub, badge “5”, `aria-label` correto e
  popup com os cinco links;
- e2e no Pixel 7 e iPhone 13: `?focus=ambulatorio-feridas-cronicas` abre o hub e
  destaca o item correto.

O teste anterior de foco em `hospital-de-caridade` segue verde, cobrindo que o
marcador individual e o link “Ver detalhes” mantiveram o contrato existente.

## Lighthouse

Duas medições da build de produção com Vite Preview, perfil mobile do
Lighthouse **13.4.0**, foram estáveis:

| Rodada | Performance | Acessibilidade | Boas práticas | SEO |
|---|---:|---:|---:|---:|
| 1 | 81 | **96** | 96 | 66 |
| 2 | 81 | **96** | 96 | 66 |

A Etapa Visual 6 não fez coleta própria nem registrou uma tabela completa do
mapa; seu resumo preserva somente a referência **“Mapa a11y 96”**, herdada da
Etapa Visual 5. A Etapa Visual 8 manteve exatamente esses **96 pontos**, portanto
atende ao comparador disponível sem inventar baselines para as outras
categorias.

Os dois audits de acessibilidade reprovados não incluem o hub novo:

- `target-size`: pins **individuais** do Leaflet ainda medem 28×36px;
- `label-content-name-mismatch`: rótulos preexistentes do logotipo e da barra de
  emergência.

Métricas das rodadas: FCP 2,1s; LCP 4,4–4,5s; TBT 0ms; CLS 0,081; Speed Index
2,1s. **Performance 81 continua abaixo da meta global de 90** e fica registrada
como pendência real para a auditoria da Fase 4; a maior parte visual do mapa
depende do carregamento lazy do Leaflet e dos tiles externos do OpenStreetMap.
Boas práticas 96 aponta a resolução dos tiles OSM no perfil de densidade do
Lighthouse. SEO permanece afetado pelo `noindex` intencional.

## Auditoria conservadora de código morto

A passagem `code-audit-cleanup` ficou limitada aos arquivos do mapa e à lógica
individual anterior. O array privado `mappableUnits` e o import direto de
`isMappable` saíram de `UnitsMap`, substituídos pelos grupos derivados em
`hubs.ts`. Busca global, TypeScript com `noUnusedLocals`, lint, build e as duas
suítes não encontraram helpers, refs ou imports órfãos.

`markerIcon`, `markerVariant` e o popup individual foram mantidos porque todos
os grupos de uma unidade continuam dependendo deles; removê-los quebraria o
comportamento explicitamente protegido pelos testes. Confiança **alta** no
escopo verificado. Nenhum arquivo gerado, lockfile, dado ou contrato de rota foi
alterado pela limpeza.

## Pendências

- **Performance do `/mapa`:** 81 no Lighthouse mobile; investigar na Fase 4 sem
  sacrificar o carregamento lazy da home ou a atribuição/qualidade dos tiles.
- **Pins individuais de 28×36px:** continuam no audit `target-size` do Leaflet;
  o hub novo já usa 44×44px. Correção global fica para a auditoria formal de
  acessibilidade, como definido no escopo desta etapa.
- **Mismatch de rótulos do logo/barra de emergência:** preexistente e fora do
  componente de hub; mapear na auditoria WCAG da Fase 4.
- **Verificação telefônica dos dados e `noindex`:** permanecem como antes.

O antigo item visual **B8 / sobreposição de marcadores em hubs está resolvido**
para todas as coordenadas compartilhadas presentes e futuras no dataset.

## Critérios de conclusão — checagem

| Critério | Status |
|---|---|
| Unidades plotáveis agrupadas por coordenada exata | ✅ |
| Lógica generalizada a partir de `hubs.ts` | ✅ |
| Grupo de uma unidade preserva marcador/popup individual | ✅ e2e existente verde |
| Grupo de 2+ usa um pin primary com badge `radius-pill` | ✅ |
| Popup lista nome + tipo e links de todas as unidades | ✅ 5/5 na UMRS |
| Marcador com rótulo acessível e visuais `aria-hidden` | ✅ |
| `?focus=` abre o hub e destaca a unidade correta | ✅ Pixel 7 + iPhone 13 |
| Sem `leaflet.markercluster` ou dependência nova | ✅ package/lockfile intactos |
| `npm test` e `npm run test:e2e` verdes | ✅ 62 unit; 57 e2e + 1 skip esperado |
| Lighthouse do mapa mantém a11y da Etapa Visual 6 | ✅ 96 = 96 |
| Auditoria de código morto concluída | ✅ sem resíduos detectados |
| Resumo escrito | ✅ este arquivo |
