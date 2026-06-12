# Briefing — Navegador do SUS Erechim

> Documento de referência do projeto. Adicionar ao conhecimento do projeto
> para que todos os chats de execução partam das mesmas decisões.
> **Versão 1.1** — 11/06/2026 (revisada após análise crítica; muda da 1.0:
> escopo negativo, acessibilidade transversal, metas mensuráveis,
> minimização de dados, codinome e licença).

## 1. Visão

PWA que ajuda a população de Erechim/RS a navegar a rede pública de saúde:
qual unidade atende cada endereço/bairro, horários, serviços oferecidos,
documentos necessários, fluxos de atendimento e campanhas. **Somente
informação pública** — sem login, sem dados pessoais, sem agendamento na v1.

Valores do produto, em ordem: **precisão da informação** > acessibilidade >
experiência visual profissional. Lacuna marcada vale mais que dado incerto.

Objetivo estratégico paralelo: servir de protótipo-argumento para vínculo
com a UFFS (extensão/IC) e eventual parceria com a Secretaria Municipal
de Saúde (que destravaria versões futuras com agendamento).

**Codinome de trabalho:** `navegador-sus` (repositório, pastas e
referências técnicas). Nome final do produto: pendente.

## 2. O que o app NÃO é (limites permanentes)

Estes limites valem para todas as fases e **nenhum chat de execução deve
violá-los**, mesmo que pareça útil:

- **Não diagnostica, não triagem, não recomenda conduta ou medicamento.**
  Nada de "verificador de sintomas" ou conteúdo que se pareça com
  orientação clínica.
- **Não agenda consultas nem acessa sistemas oficiais** (e-SUS, regulação).
  Isso depende de convênio formal — fora do escopo até existir parceria.
- **Não substitui canais oficiais.** O app informa e direciona; em
  divergência, o canal oficial prevalece (e o app diz isso).
- **Emergência em destaque permanente:** SAMU 192 (e Bombeiros 193)
  visível na interface, nunca a mais de um toque de distância.
- **Não coleta dados pessoais dos usuários** na v1. Geolocalização só no
  dispositivo, nunca enviada a servidor. Sem analytics invasivo.
- **Não lista nomes de profissionais de saúde.** O CNES publica nomes,
  mas são dado volátil e desnecessário: o app lista *serviços*, não
  pessoas (minimização de dados).

## 3. Público e princípios de UX

População geral de Erechim, com atenção a idosos, pessoas com baixa
visão/letramento digital e celulares modestos em redes lentas. Decorrências:

- **Mobile-first** em tudo; desktop é o caso secundário.
- **Linguagem simples:** evitar jargão administrativo do SUS; na primeira
  menção, traduzir ("UBS (posto de saúde)").
- Tipografia generosa, contraste forte, alvos de toque amplos.
- Conteúdo funciona offline e em conexão ruim (ver PWA).

## 4. Stack decidida (e por quê)

| Camada | Escolha | Justificativa resumida |
|---|---|---|
| UI | React + TypeScript | Lições 2 e 6 do projeto anterior (DOM manual, ausência de tipos) |
| Build | Vite | Modularização natural (lição 1) |
| CSS | Tailwind | Metodologia para o CSS não crescer sem controle (lição 3) |
| Mapa | Leaflet + OpenStreetMap | Gratuito, sem chave de API, open source, visual profissional |
| Dados v1 | JSON tipado versionado no repositório | Dados públicos, mudam raramente; sem necessidade de banco |
| Hosting | Cloudflare Pages | Banda ilimitada, headers via `_headers`, mesma plataforma do padrão Worker-proxy já dominado |
| App | PWA offline-first (service worker) | Público-alvo nem sempre tem bom plano de dados |
| Testes | Vitest (unitário) + Playwright (e2e) | Lição 4 — primeiro contato com testes automatizados |

Explicitamente **fora** da v1: Firebase, autenticação, banco de dados, IA.
Se o assistente de IA entrar em fase futura, usar o padrão Worker-proxy
do projeto anterior (Cloudflare Workers + KV).

## 5. Metas de qualidade (verificáveis)

- **Lighthouse ≥ 90 nas quatro categorias** (Performance, Accessibility,
  Best Practices, SEO), medido em perfil mobile.
- **WCAG 2.2 nível AA**: contraste, foco visível, navegação completa por
  teclado, HTML semântico, leitores de tela. Construída desde a Fase 1
  (design system), não adaptada depois — a Fase 4 é a *auditoria formal*.
- **Dados com proveniência:** todo dado volátil (telefone, horário,
  serviços, abrangência) carrega fonte, nível de confiança e data de
  verificação. Princípio permanente, não só da Etapa 0.

## 6. Fases

0. **Mapeamento de dados** — inventário da rede de saúde de Erechim
   (CNES/DataSUS, prefeitura, curadoria manual), benchmark de soluções
   existentes e definição do escopo v1.
1. **Fundação técnica** — repositório, Vite + React + TS + Tailwind,
   design system com base de acessibilidade (tokens com contraste AA,
   foco, semântica), deploy contínuo no Cloudflare Pages.
2. **Diretório de unidades** — listagem, busca, filtros por serviço/bairro
   (sobre a taxonomia de serviços definida na Etapa 0).
3. **Mapa** — Leaflet, geolocalização local, "qual minha unidade de
   referência" (depende das coordenadas capturadas na Etapa 0).
4. **PWA e auditoria** — offline, instalável, auditoria formal WCAG +
   Lighthouse com correções.
5. **Extras** — campanhas de vacinação, assistente IA (Worker-proxy),
   painel de atualização de dados.

Cada fase termina com entrega usável e com um arquivo de resumo
adicionado ao conhecimento do projeto.

## 7. Convenções de trabalho

- **Fluxo:** chat de planejamento (centro de comando) gera o prompt de cada
  etapa → etapa executada em chat novo do projeto, no Claude Code (fases de
  código) ou no Cowork (documentos/planilhas) → resultado resumido em `.md`
  e adicionado ao conhecimento do projeto.
- **Código:** comentários e identificadores em inglês; textos da interface
  em português (PT-BR).
- **Método:** vibe coding com "paradas técnicas" — nas decisões de
  arquitetura e conceitos importantes, explicar antes de seguir.
- **Dados:** nunca inventar; divergência entre fontes é registrada, não
  resolvida por palpite.

## 8. Pendências abertas

- **Nome final do app** (codinome `navegador-sus` até lá).
- **Direção visual** — fazer protótipos de paleta antes de fixar, como no
  projeto anterior.
- **Licença open source** — decidir na Fase 1; inclinação: MIT (fortalece
  o argumento de extensão universitária e facilita adoção).
