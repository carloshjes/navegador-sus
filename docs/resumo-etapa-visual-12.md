# Resumo — Etapa Visual 12: sinalização cívica calma (`navegador-sus`)

> Executada em **14/07/2026** e refinada em **15/07/2026** com o padrão
> **Cívico compacto**, ainda no mesmo worktree. Esta etapa reformula a
> apresentação e os contratos de interação da interface. Nenhum dado canônico, coordenada,
> proveniência, conflito, rota, geolocalização, política de exibição ou regra
> de busca foi alterado.

## Diagnóstico inicial

A tese do produto passou pelo `project-direction-scout` em modo
`sanity-check`: o guia continua específico e defensável porque organiza a rede
pública real de Erechim, informa incertezas e conflitos, não pede conta e não
oferece diagnóstico, triagem ou recomendação clínica. Não foi feito
brainstorming de funcionalidades.

A interface, porém, ainda usava convenções visuais genéricas que enfraqueciam
essa tese:

- cabeçalho e botões primários dependiam de gradiente tonal;
- a marca tinha pouca presença em relação à navegação;
- Cards pareciam objetos elevados e se moviam no hover;
- filtros formavam uma parede de pequenos blocos e o fluxo mobile dependia de
  um `<dialog>` em formato de bottom-sheet;
- a barra de emergência era funcional, mas tinha pouca estrutura de serviço;
- a página Onde ir? ainda aproximava orientações de uma coleção de Cards.

### Rubrica anti-genérica inicial

| Item | Nota | Evidência inicial |
|---|---:|---|
| Introdução genérica | 0 | O produto e Erechim já apareciam com clareza. |
| Card farm | 2 | Unidades e orientações eram apresentadas como objetos elevados repetidos. |
| Peso visual equivalente | 1 | Filtros e ações competiam em blocos semelhantes. |
| CTA padrão | 1 | Gradiente tonal aproximava a ação principal de um padrão de produto genérico. |
| Estrutura decorativa | 2 | Sombra, elevação e gradiente faziam parte da hierarquia. |
| Baixa especificidade | 0 | Conteúdo, fontes e limites eram locais e específicos. |
| **Total** | **6/12** | Acima da meta final de 0–3. |

## Direção e signature move

O `creative-ui-director` foi aplicado em
`design-system-constrained-upgrade`, com profundidade completa. A direção
escolhida foi **registro cívico de orientação**: superfícies sólidas,
separação por borda e espaçamento, hierarquia tipográfica e cores restritas a
marca, categoria, confiança e emergência.

A signature move compartilhada transforma a aplicação em um sistema de
sinalização:

1. placa sólida no cabeçalho;
2. índice de consulta nos filtros;
3. registros estáveis para as unidades;
4. dock cívico permanente para emergência;
5. linhas rotuladas de acesso na página Onde ir?.

A estrutura foi conferida para continuar legível sem cor: ordem, títulos,
indicadores nativos, bordas e espaçamento carregam a hierarquia; a cor apenas a
reforça.

## Implementação

### Marca e cabeçalho

- `Logo` passou a 34px no mobile e 38px a partir de `sm`; o wordmark subiu para
  `text-display`, usa Figtree 600 por classe específica e nunca é ocultado.
- Pin, cruz e wordmark continuam uma única marca acessível: o desenho está
  `aria-hidden` e o link fornece um único nome.
- Em telas estreitas, marca e navegação ocupam duas linhas; a partir de `sm`,
  recompõem uma linha. Início, Mapa e Onde ir? permanecem completos.
- O cabeçalho usa `primary` sólido, sem `background-image`; o estado ativo
  coral, o texto branco e o foco visível foram preservados.
- Botões primários também migraram para `primary` sólido, com
  `primary-strong` apenas em estados interativos.

### Cards e superfícies

- O primitivo `Card` agora usa `surface`, `edge` e `radius-md`, sem sombra,
  filtro ou transformação.
- `UnitCard` não possui transformação, transição de elevação ou hover no
  contêiner. O link do título continua comunicando a interação.
- Categoria permanece como o único sinal colorido da família da unidade;
  confiança, alertas e conteúdo foram preservados.
- Consumidores de `Card` foram auditados. Emergência e avisos recuperam
  hierarquia por semântica, superfície, cor e borda, nunca por nova sombra.
- Tokens `shadow-resting`, `shadow-raised`, gradiente tonal e estilos de
  bottom-sheet foram removidos depois da busca global por consumidores.

### Filtros

- A parede de chips foi substituída por listas verticais de radios nativos,
  dentro de `fieldset` + `legend`.
- Cada linha tem pelo menos 44px, rótulo completo, fundo transparente e radio
  persistente. O texto selecionado usa peso 600; não há faixa preenchida,
  marcador lateral ou check duplicado. A seleção não depende só de cor.
- A mesma composição DOM atende todos os breakpoints. No desktop, as listas
  ficam abertas na lateral sticky; abaixo de `lg`, os grupos são disclosures
  no fluxo normal.
- Listas longas usam Ver mais/Ver menos inline com `aria-expanded` e
  `aria-controls`; não há `<dialog>`, overlay, foco preso ou `matchMedia`.
- A opção selecionada fora do corte continua renderizada quando a lista é
  recolhida. Os controles de expandir/recolher recuperam foco explicitamente,
  inclusive no WebKit.
- Parâmetros de URL, busca, remoção individual, Limpar filtros, contagem e
  `aria-live` foram preservados. Filtros ativos viraram ações textuais
  removíveis, sem recriar uma parede de pílulas.
- `FilterChip.tsx` foi removido; o novo primitivo é `FilterOption.tsx`.

### Dock de emergência

- A barra fixa apresenta o rótulo visível **Emergência** e duas cápsulas
  compactas: **SAMU 192** em branco e **Bombeiros 193** em branco translúcido.
  Os `aria-labels` preservam a instrução completa “Ligar para”.
- Os links `tel:192` e `tel:193` permanecem visíveis e diretamente acionáveis
  em todas as rotas.
- O dock é sólido e não usa sombra, pulso, escala, glow ou animação.
- No mobile, rótulo e ações ocupam duas linhas compactas; no desktop,
  recompõem a linha única dentro de `max-w-screen-lg`.
- `safe-area`, reserva inferior das páginas e cálculo do mapa continuam
  ligados ao mesmo token de altura.

### Onde ir?

- A introdução foi encurtada e explicita as portas de acesso ao SUS em
  Erechim.
- Emergência permanece como primeira região e maior prioridade semântica,
  em uma faixa `emergency-soft` aberta, sem contorno, Card ou sombra; SAMU 192
  e Bombeiros 193 usam as cápsulas compactas do sistema.
- As três orientações seguintes formam um mapa textual no fundo natural da
  página, separado somente por divisores horizontais: rótulo de acesso na
  coluna estreita e conteúdo na coluna principal. No mobile, cada linha
  empilha internamente sem virar Card.

### Refinamento Cívico compacto — 15/07/2026

O refinamento não reabriu a direção do produto. Ele removeu os resíduos de
massa visual encontrados depois da primeira passagem:

- wordmark de 700 para 600, sem alterar o token `text-display` usado por
  títulos;
- opção selecionada sem `primary-soft` e sem check redundante;
- Card de unidade de `radius-lg`/`border-strong` para
  `radius-md`/`border-edge`;
- Localizar com largura automática e alinhamento ao início no mobile;
- chamadas telefônicas curtas em `radius-pill`;
- dock reduzido de 92/72px para 80/60px;
- Onde ir? sem contorno vermelho e sem alternância de grandes fundos.

A gramática final de forma é funcional: categoria usa retângulo curto;
utilidade e registro usam retângulo compacto; telefonia usa cápsula;
seleção usa o radio nativo em linha aberta; sequência informativa usa
tipografia e divisores.
- A ordem e os contratos foram preservados: emergência com risco de vida;
  urgência sem risco de vida; rotina e acompanhamento; especialidades por
  encaminhamento.
- Permanecem explícitos o horário não confirmado do PA, o acesso a
  especialidades por encaminhamento e a prevalência dos canais oficiais.
- Não há sintomas, doenças, questionário, diagnóstico, triagem ou
  recomendação de conduta.

## Arquivos alterados

- Estrutura e componentes: `src/components/Logo.tsx`, `Layout.tsx`,
  `Button.tsx`, `Card.tsx`, `UnitCard.tsx`, `EmergencyBar.tsx`,
  `FilterChipGroup.tsx`, `FilterOption.tsx`, `FiltersBar.tsx`, `Badge.tsx`,
  `QuickLocateBand.tsx` e `LocateButton.tsx`; `FilterChip.tsx` foi removido.
- Páginas: `src/pages/DirectoryPage.tsx` e
  `src/pages/WhereToGoPage.tsx`.
- Tokens e utilitários: `src/index.css`.
- Rótulos e contratos unitários: `src/data/labels.ts` e
  `src/data/labels.test.ts`.
- E2E: `e2e/smoke.spec.ts`, `directory.spec.ts`, `map.spec.ts`,
  `nearby.spec.ts`, `v5.spec.ts` e `visual11.spec.ts`.
- Documentação: `docs/kit-visual-navegador-sus.md` e este resumo.
- Higiene local: `.gitignore` passou a ignorar `.tmp/`, usado pelos perfis e
  relatórios temporários do Lighthouse.

## Responsividade e acessibilidade

Os contratos automatizados cobrem **320×568, 360×800, 390×844, 768×1024,
1024×800 e 1440×900**. Foram verificados:

- ausência de overflow horizontal;
- marca e navegação sem colisão;
- expansão inline sem alterar a largura da página;
- opção selecionada preservada ao recolher;
- conteúdo final acima do dock fixo;
- ordem DOM igual à ordem visual;
- controles com piso de 44px;
- foco visível e retorno de foco nos disclosures;
- radios, `fieldset`, `legend`, `aria-expanded`, `aria-controls` e
  `aria-live` preservados;
- `prefers-reduced-motion` continua zerando transições.

O cabeçalho mede 100px em telas estreitas e 68px a partir de `sm`; o dock
mede 80px e 60px, respectivamente. `h-header`, `h-bar`, `pb-bar` e
`h-mappage` consomem esses tokens, evitando números divergentes entre layout e
mapa.

## Testes e resultados reais

- Formatação: executada somente nos arquivos tocados.
- `npm run lint`: **verde**.
- `npm test`: **62/62 testes verdes** em 10 arquivos.
- `npm run build`: **verde**.
- Suíte mobile Chromium:
  `npm run test:e2e -- --project=mobile-chromium --workers=1` concluiu com
  **33/33 casos verdes** em 14,8s.
- Contratos alterados no iPhone/WebKit: **8/8 verdes** em 9,5s, cobrindo
  wordmark, seleção transparente, Cards computados, expansão inline,
  Localizar nos estados idle/prompting, dock e Onde ir?.

### Limitação da execução e2e agregada

`npm run test:e2e -- --workers=1` excedeu 240s sem emitir progresso ou falha de
asserção. A execução completa apenas do projeto iPhone repetiu o bloqueio e
excedeu 180s. Em ambos os casos, processos `WebKitNetworkProcess` ficaram
órfãos e o sandbox não conseguiu encerrá-los; os processos Node iniciados
por esta sessão foram encerrados por PID. Portanto, a suíte agregada de 66
casos não é registrada como verde.

O teste matricial dos seis viewports roda em Chromium. No WebKit, esse caso
específico é pulado porque a sequência de seis redimensionamentos trava o
processo no Windows; os três viewports mobile do cabeçalho e os oito fluxos
refinados continuam cobertos no projeto iPhone. Nenhuma asserção de
comportamento foi removida para acomodar a implementação.

## Lighthouse

O Lighthouse não foi repetido neste refinamento, pois não fazia parte da lista
de comandos solicitada. A última medição da Etapa 12, em 14/07/2026, foi:

| Rota | Performance | Acessibilidade | Boas práticas | SEO |
|---|---:|---:|---:|---:|
| `/` | **98** | **100** | **100** | **63** |
| `/onde-ir` | **98** | **100** | **100** | **63** |

Na home: FCP 1,8s; LCP 2,0s; TBT 0ms; CLS 0,015. Em `/onde-ir`: FCP 2,0s;
LCP 2,0s; TBT 0ms; CLS 0,002. O SEO continua abaixo de 90 por causa do
`noindex` intencional; a proteção não foi removida.

Os relatórios foram gerados. O CLI retornou erro somente ao tentar excluir o
perfil temporário depois da coleta (`EPERM`), limitação já observada nas
etapas anteriores.

## Inspeção visual

Em 15/07/2026, a inspeção real da nova build foi tentada novamente no
navegador conectado. A política de segurança bloqueou `127.0.0.1:4173` e
instruiu explicitamente a não contornar a restrição por outra superfície; ela
foi respeitada. Assim, esta sessão **não registra aprovação visual direta**.

Os testes de navegador verificaram dimensões, CSS computado, ausência de
sombra, filtro e transformação, geometria antes/depois do hover, seleção
transparente, peso 600 do wordmark, largura do Localizar, overflow, colisão,
foco, ordem, cápsulas telefônicas e espaço reservado pelo dock. Essa evidência
protege o contrato estrutural, mas a leitura perceptiva final deve ser conferida
no preview local nos seis breakpoints.

### Rubrica anti-genérica depois da implementação

Passagem estrutural do refinamento: **0/12**.

| Item | Nota | Ação corretiva |
|---|---:|---|
| Introdução genérica | 0 | Onde ir? abre com as portas de acesso ao SUS em Erechim. |
| Card farm | 0 | Filtros são linhas abertas, unidades são registros planos e Onde ir? usa divisores. |
| Peso visual equivalente | 0 | Utilidade, telefonia, seleção e registro usam formas funcionalmente distintas. |
| CTA padrão | 0 | Localizar é retângulo compacto; telefonia usa cápsulas curtas e sem frase interna. |
| Estrutura decorativa | 0 | Faixa verde selecionada, contorno vermelho, fundos alternados, sombras e gradientes foram removidos. |
| Baixa especificidade | 0 | Erechim, rede municipal, proveniência e alertas locais permanecem centrais. |

A nota está dentro da meta 0–3. Como a inspeção direta foi bloqueada, ela
deve ser tratada como resultado estrutural, não como julgamento visual final.

## Revisão final do diff

- Dados canônicos e snapshot em `docs/`: **sem alterações**.
- Cores literais novas fora dos tokens: **nenhuma**.
- Tokens antigos de gradiente e sombra: **sem consumidores e removidos**.
- `Card`: **`surface` + `edge` + `radius-md`; sombra, filtro e transformação
  computam `none` em repouso e hover**.
- Seleção dos filtros: **fundo transparente, sem check ou marcador lateral**.
- `<dialog>`, bottom-sheet, `matchMedia` e `FilterChip`: **sem consumidores**.
- Comentários que descreviam chips, gradiente ou elevação como contrato
  atual: **atualizados**.
- Foco, teclado, alvos, overflow e reserva do dock: **protegidos por testes**.
- Testes da aparência antiga: **reescritos para o novo contrato, não
  apagados**.

## Pendências

- **Inspeção visual direta:** abrir a build local e conferir os seis
  breakpoints, especialmente densidade do dock em 320px e varredura de Onde
  ir? em desktop.
- **Suíte e2e agregada no WebKit:** repetir em uma sessão limpa do
  Playwright/Windows para obter encerramento e sumário formal.
- **Verificação telefônica dos dados:** continua adiada pelo usuário.
- **`X-Robots-Tag: noindex`:** permanece até a verificação dos dados e a
  decisão explícita de indexar o site.

## Critérios de conclusão — checagem

| Critério | Status |
|---|---|
| Marca maior, wordmark 600 e nome acessível único | ✅ contrato e2e |
| Cabeçalho sólido, sem `background-image` | ✅ |
| Cards `radius-md` sem sombra, filtro, elevação ou salto | ✅ contrato e2e |
| Filtros em linhas transparentes com radio nativo | ✅ contrato e2e |
| Expansão inline sem `<dialog>` | ✅ Chromium + WebKit isolado |
| Localizar compacto e estados preservados | ✅ Chromium + WebKit isolado |
| SAMU 192 e Bombeiros 193 em cápsulas acionáveis | ✅ contrato e2e |
| Onde ir? aberto, com divisores e sem triagem | ✅ contrato e2e |
| Dados e políticas preservados | ✅ diff auditado |
| Lint, unitários e build verdes | ✅ |
| Último Lighthouse dentro das metas | ✅ medição de 14/07 |
| Suíte e2e agregada com encerramento verde | ⚠️ bloqueada no shutdown do WebKit |
| Inspeção visual direta | ⚠️ bloqueada pela política do navegador |
| Kit visual e resumo atualizados | ✅ |
