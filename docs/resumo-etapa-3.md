# Resumo — Etapa 3: Mapa e proximidade (`navegador-sus`)

> Executada em **13/06/2026** no Claude Code. Entregável para o
> conhecimento do projeto no claude.ai.
> App no ar: <https://navegador-sus.pages.dev> · `/mapa` é a nova rota.

## O que existe agora

- **Ortografia restaurada** (Tarefa 0): acentuação PT-BR de volta em
  `name`, `address.street` e `address.neighborhood` (47 mudanças, padrão
  prefeitura). Só onde havia alta confiança; sobrenomes de imigrantes e
  grafias incertas mantidos. A divergência Kiwkto/Kwitco (Aldo Arioli) e
  o "Estevão" do Progresso ficaram registrados em `openQuestions`, não
  resolvidos por palpite.
- **Coordenadas reconciliadas** (Tarefa 1): cross-check via Nominatim +
  haversine, divergências decididas com o usuário (human-in-the-loop).
- **Mapa Leaflet/OpenStreetMap** em `/mapa`, lazy-loaded (Tarefa 2): 28
  unidades de atendimento plotadas, marcadores por categoria, popup com
  link para o detalhe, "Ver no mapa" na página de unidade.
- **"Perto de mim"** (Tarefa 3): ordena as unidades por distância em
  linha reta, com a localização processada só no aparelho.
- 8 novos testes Vitest (geo/distância/nearby) e 6 e2e (mapa + perto de
  mim). Total: **53 unitários + 14 e2e**, todos verdes.

## Reconciliação de coordenadas — tabela final

Estado das 39 unidades por procedência da coordenada:

| Fonte / verificação | Qtde | O que significa |
|---|---|---|
| `cnes` + `crossCheck: ok` | 8 | CNES corroborado pelo Nominatim (≤ 500 m) |
| `manual-map-check` | 4 | Ponto fixado pela sua conferência visual (UBS Centro, Capoerê, Aldo Arioli, Paiol Grande) — CNES estava grosseiramente errado |
| `osm-geocoding` | 5 | Ponto do Nominatim por endereço/nome exato (Estevam Carraro, São Cristóvão, Hospital de Caridade, CAPSi, Novo Atlântico) |
| `shared-address` | 4 | Hub UMRS: PA, Saúde Mental, CRM e Feridas herdam o ponto da UBS Centro |
| `cnes` + `crossCheck: unconfirmed` | 7 | Oficial e dentro de Erechim, mas sem 2ª fonte — plotado com o aviso geral; **prioridade na verificação telefônica** |
| `cnes` sem cross-check | 10 | Institucionais, SAMU, reabilitação, ocultos — **fora do mapa** |
| pendente (`geocode-manually`) | 1 | Vigilância Sanitária (sem endereço) |

**28 unidades de atendimento plotáveis** (todas com coordenada conferida:
cross-check, decisão humana ou herança de hub). Um teste-guardião
(`mappable.test.ts`) garante o invariante: nada vai ao mapa sem
coordenada verificada.

**Decisão sua que vale registrar:** para o Grupo C (7 unidades sem
cross-check), você preferiu `crossCheck: "unconfirmed"` mantendo
`source: "cnes"` em vez de `manual-map-check` — recusou registrar como
"conferido manualmente" algo que não foi. Mais rigoroso que a
recomendação inicial; é a regra "proveniência honesta" levada a sério.

## Decisões técnicas e porquês

| Decisão | Justificativa |
|---|---|
| `react-leaflet` (não Leaflet puro) | Integração declarativa com React 19; menos código imperativo de sincronização. |
| `/mapa` **lazy-loaded** (`React.lazy`) | O Leaflet (~46 KB gzip) fica em chunk próprio, baixado só ao abrir o mapa — Performance da home preservada (99). |
| Marcadores `divIcon` (SVG), não PNG | Elimina a pegadinha clássica do Leaflet com bundlers (assets de ícone) e permite diferenciar categorias por cor. |
| Cor + **texto** (popup e legenda) | Cor nunca é o único sinal (WCAG 1.4.1). |
| "Ver no mapa" é **link**, não minimapa | Um minimapa puxaria o Leaflet para o bundle do detalhe; o link mantém o detalhe leve. |
| **ErrorBoundary** no mapa | Falha do Leaflet degrada para um link à listagem, não derruba o app. |
| Geolocalização: **sem reverse geocoding** | Converter posição em endereço enviaria a localização a um terceiro; ordenar por distância é 100% local. Privacidade por arquitetura. |
| Nominatim com fallback (sem nº, sem tipo de via, por nome) | Cobertura fraca de Erechim no OSM; os fallbacks recuperaram 8 cross-checks e localizaram POIs com grafia divergente (Kramer/Kraemer). |

## Lighthouse (mobile) — 13/06/2026

| Categoria | Home (`/`) | Mapa (`/mapa`) |
|---|---|---|
| Performance | **99** | **92** |
| Accessibility | **100** | 96 |
| Best Practices | **100** | 96 |
| SEO | 63 | 66 |

Tudo **≥ 90** (meta do briefing), exceto SEO — limitado de propósito
pelo `X-Robots-Tag: noindex` + `robots.txt` (dados não verificados; some
quando a verificação telefônica liberar). No `/mapa`:
- **Accessibility 96**: `target-size` dos marcadores — decorre do hub
  UMRS (4 unidades no mesmo endereço empilham marcadores num ponto),
  exceção reconhecida do WCAG 2.5.8 para mapas; a listagem é o caminho
  equivalente acessível. Os controles de zoom foram elevados a 44px.
- **Best Practices 96**: `image-size-responsive` das tiles OSM (256px) —
  inerente ao Leaflet/OSM; usar tiles retina dobraria a banda, contra o
  público de redes lentas.

## Segurança

CSP do `_headers` estendida: `img-src` ganhou `tile.openstreetmap.org`
(só isso; `script-src`, `style-src` e `connect-src` seguem `'self'`).
`X-Robots-Tag: noindex` **mantido** — dados ainda não verificados.

## Pendências (herdadas + novas)

- **Verificação telefônica** (planilha fora do repo): além dos itens da
  Etapa 0, agora inclui confirmar o ponto exato das **7 unidades
  `crossCheck: unconfirmed`** (anotado nos `openQuestions` de cada uma) e
  a grafia da rua da **UBS Aldo Arioli** (Kiwkto/Kwitco).
- **Fora do mapa até obter dado**: Vigilância Sanitária e Unidade
  Municipal de Reabilitação (sem endereço), UBS Prisional (acesso
  restrito, coordenada `suspect`).
- **Hub UMRS no mapa**: 4 unidades no mesmo ponto se sobrepõem — um
  *cluster*/leque de marcadores seria a evolução natural (não nesta fase).
- Territorialização ESF segue sendo a lacuna que impede "qual minha
  unidade" — por isso "perto de mim" traz a ressalva fixa.
- Direção visual definitiva e nome do produto: ainda pendentes.
- Fase 4 (PWA + auditoria WCAG/Lighthouse formal) é o próximo passo;
  cache offline de tiles entra lá.

## Critérios de conclusão — checagem

| Critério | Status |
|---|---|
| Mapa no ar com unidades de atendimento plotadas com coordenada conferida | ✅ 28 plotáveis, todas verificadas |
| "Perto de mim" funcionando com a ressalva de referência | ✅ ordena por distância, sem "sua unidade" |
| Ortografia restaurada nos campos exibidos | ✅ 47 correções de alta confiança |
| Testes unitários e e2e verdes | ✅ 53 + 14 |
| Lighthouse registrado | ✅ home 99/100/100, mapa 92/96/96 |
| Resumo escrito | ✅ este arquivo |
