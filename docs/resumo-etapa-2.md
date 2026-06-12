# Resumo — Etapa 2: Diretório de unidades (`navegador-sus`)

> Executada em **12/06/2026** no Claude Code, na mesma sessão da Etapa 1.
> Entregável para o conhecimento do projeto no claude.ai.
> App no ar: <https://navegador-sus.pages.dev> (deploy contínuo via push).

## O que existe agora

O app deixou de ser "contagem de unidades" e virou um **diretório
navegável** com a proveniência dos dados exposta:

- **Rotas** (React Router 7): `/` (diretório), `/unidade/:id` (detalhe,
  slug = `id` do JSON), `/onde-ir` (explicador) e 404 amigável.
  Acessibilidade de SPA reconstruída à mão: a cada troca de rota o foco
  vai para o `h1` da página e o `document.title` é atualizado.
- **Política de exibição** como config tipada e testada
  (`src/data/display-policy.ts`): `care` / `care-restricted` (UBS
  Prisional, aviso claro) / `care-cautious` (só o PA; **nenhuma menção a
  24h**) / `coming-soon` (UBS Novo Atlântico) / `institutional` (SMS,
  11ª CRS, VISA, NUVEPI, CEREST — seção "Órgãos e contatos
  institucionais") / `hidden` (SAMI desativado, Ambulatório COVID-19 não
  confirmado — dão 404 até em deep link).
- **Listagem**: card com nome, tipo traduzido, bairro e o selo de
  confiança do horário (sempre presente); ordenação estável tipo→nome.
- **Busca** acento-insensível (NFD + remoção de diacríticos), cobrindo
  nome, bairro, tipo traduzido, rótulos de serviço e aliases explícitos
  ("Estevão Carraro" → UBS Estevam Carraro; "DST" → SAE) — sem tocar no
  JSON canônico.
- **Filtros** por serviço (rótulos PT-BR do relatório §6), tipo e bairro
  do endereço, combináveis com a busca e espelhados na URL (link
  compartilhável). Estado vazio com botão "Limpar busca e filtros".
- **Detalhe**: cada campo volátil com selo + "conferido em DD/MM/AAAA";
  telefone como `tel:+55…`; copiar endereço; conflitos entre fontes
  viram aviso honesto padronizado ("fontes oficiais divergem — ligue
  antes"), nunca o texto interno cru; `openQuestions` não aparecem.
  **Hubs**: "No mesmo endereço funcionam:" com links cruzados (UMRS com
  5 serviços; Santo Dal Bosco 160 e 200), derivado por normalização de
  endereço, com teste.
- **"Onde ir?"**: as camadas da rede em linguagem simples (somente
  relatório §2): 192 → PA (com ressalva de horário) → UBS →
  especialidades por encaminhamento. Zero sintomas, zero conduta; fecha
  remetendo aos canais oficiais.

## Lighthouse (mobile) — registrado em 12/06/2026

| Categoria | Produção | Local, sem bloqueio de indexação |
|---|---|---|
| Performance | **100** | 100 |
| Accessibility | **100** | 100 |
| Best Practices | **100** | 100 |
| SEO | 63 | **100** |

O SEO de produção tem **uma única auditoria falhando: `is-crawlable`** —
consequência direta e deliberada do `X-Robots-Tag: noindex` +
`robots.txt` Disallow-all da Etapa 1 (dados ainda não verificados). Com
o bloqueio levantado, o app pontua 100 nas quatro categorias; quando a
verificação telefônica acontecer, remover o header (instrução no
`_headers`) e liberar o `robots.txt` (instrução no próprio arquivo) —
o ≥90 real vem junto, sem mudança de código.

Correção que a medição revelou: não existia `robots.txt`, então o
fallback de SPA servia HTML nesse caminho; criado
`public/robots.txt` (Disallow-all enquanto durar o noindex).

## Decisões e porquês

| Decisão | Justificativa |
|---|---|
| React Router 7 (padrão, não troquei) | Biblioteca canônica, leve no modo declarativo; nada no escopo pedia alternativa. |
| Política de exibição como **dados** (config + testes), não `if`s na UI | Regras sensíveis (PA sem 24h, ocultos com 404) ficam auditáveis e testáveis num lugar só. |
| `verify` → oculto **por padrão**, PA na allowlist | Postura segura: unidade não confirmada só aparece por decisão explícita e documentada. |
| CEREST institucional **por id** | O tipo no JSON é `specialty-center`, mas relatório §3 e o prompt da etapa o agrupam com gestão/vigilância; exceção comentada no código. |
| Textos do dataset não são exibidos crus | A prosa interna é ASCII sem acentos e carrega refs de pesquisa; a UI usa cópias padronizadas em PT-BR correto (ex.: aviso da UBS Prisional) — mesmo significado, nenhum valor de dado alterado. |
| Aliases de busca na config, não no JSON | O JSON é o registro fiel das fontes; grafias alternativas são preocupação de UI. |
| Foco por comparação de pathname (não "primeiro render") | O StrictMode do React monta efeitos 2× em dev e quebrava a guarda ingênua — pegadinha clássica de SPA. |

## Pendências (herdadas + novas)

- **Nomes de unidades aparecem como estão no JSON** (ASCII sem acentos,
  ex.: "UBS Capoere") — fiel à regra "UI consome o JSON como está".
  Candidata à rodada de verificação: confirmar grafias oficiais e
  acentuar **no dado**, com fonte.
- `coverageNeighborhoods` não é exibido (textos com notas internas;
  territorialização ESF segue sendo a lacuna crítica nº 3).
- `regionalReference` (FHSTE) e `notes` não exibidos — avaliar
  curadoria na Fase 3.
- Verificação telefônica, conferência visual das coordenadas suspeitas
  e direção visual definitiva: como na Etapa 1.
- Próxima fase (3): mapa Leaflet + geolocalização no dispositivo
  (lembrar de adicionar os domínios de tiles OSM à CSP, comentário já
  está no `_headers`).

## Critérios de conclusão — checagem

| Critério | Status |
|---|---|
| Diretório navegável no ar (busca, filtros, detalhe, "Onde ir?") | ✅ <https://navegador-sus.pages.dev> |
| Política de exibição como config testada | ✅ 9 testes dedicados |
| Testes verdes | ✅ 37 unitários + 8 e2e (mobile) |
| Lighthouse ≥ 90 registrado | ✅ 100/100/100 + SEO 63→100 explicado acima |
| Resumo escrito | ✅ este arquivo |
