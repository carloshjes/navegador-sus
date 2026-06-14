# CLAUDE.md — regras permanentes do `navegador-sus`

Este arquivo destila o `docs/briefing-navegador-sus.md` (v1.1). Toda sessão
do Claude Code neste repositório deve obedecer ao que está aqui, mesmo que
um prompt de etapa não repita. Em conflito, o briefing prevalece.

## O que o projeto é

PWA informativo da rede pública de saúde de Erechim/RS. Valores do produto,
**em ordem**: precisão da informação > acessibilidade > experiência visual.
Lacuna marcada vale mais que dado incerto.

## Limites permanentes (briefing §2 — inegociáveis)

Valem para qualquer código, texto de UI ou conteúdo, em qualquer fase:

1. **Não diagnostica, não faz triagem, não recomenda conduta ou
   medicamento.** Nada que se pareça com orientação clínica ou
   "verificador de sintomas".
2. **Não agenda consultas nem acessa sistemas oficiais** (e-SUS,
   regulação) — fora do escopo até existir convênio formal.
3. **Não substitui canais oficiais.** O app informa e direciona; em
   divergência, o canal oficial prevalece (e o app diz isso).
4. **Emergência em destaque permanente:** SAMU 192 (e Bombeiros 193)
   sempre visíveis, nunca a mais de um toque de distância.
5. **Não coleta dados pessoais.** Sem login, sem analytics invasivo.
   Geolocalização só no dispositivo, nunca enviada a servidor.
6. **Não lista nomes de profissionais de saúde.** O app lista serviços,
   não pessoas (minimização de dados).

## Regras de dados (valor nº 1 do produto)

- **Nunca inventar dado.** Divergência entre fontes se registra (campo
  `conflicts`), não se resolve por palpite. Conteúdo só muda com fonte
  nova ou verificação local documentada.
- Todo dado volátil (telefone, horário, serviços, abrangência) carrega
  **fonte + nível de confiança + data de verificação** (`ProvenancedField`).
- Os selos de confiança na UI ("horário não confirmado — ligue antes")
  são o mecanismo de honestidade do app: **não suavizar nem omitir**.
- Fonte canônica: `src/data/unidades-saude-erechim.json` (schema 0.2).
  O JSON em `docs/` é snapshot congelado da Etapa 0 — não editar.
- Unidades `deactivated` e `planned` nunca contam/aparecem como ativas.

## Convenções de código

- **Código, identificadores e comentários em inglês; textos de UI em
  PT-BR.** Slugs de serviços/tipos são chaves estáveis em inglês com
  rótulo PT-BR na interface.
- Commits semânticos em inglês (`feat:`, `fix:`, `docs:`, `chore:`,
  `test:`, `data:` para mudanças de conteúdo dos dados).
- Stack fixada: Vite + React + TypeScript + Tailwind, Vitest +
  Playwright, deploy no Cloudflare Pages. Fora da v1: Firebase,
  autenticação, banco de dados, IA.

## Método de trabalho

- **Vibe coding com paradas técnicas:** o usuário está no 1º semestre de
  Ciência da Computação e o projeto também é veículo de aprendizado. Em
  decisões de arquitetura e conceitos novos, **explicar antes de
  implementar** (teoria → exemplo, analogias ajudam). Boilerplate e
  configuração repetitiva fluem sem cerimônia.
- Decisões que o briefing deixa em aberto: **perguntar antes de assumir**.
- Cada fase termina com um resumo em `docs/` para o conhecimento do
  projeto no claude.ai.

## Metas de qualidade (briefing §5)

- Lighthouse ≥ 90 nas quatro categorias, em perfil mobile.
- **WCAG 2.2 AA** desde a fundação: contraste AA documentado nos tokens,
  foco visível, navegação completa por teclado, HTML semântico
  (`lang="pt-BR"`, landmarks, skip-link), alvos de toque ≥ 44px,
  `prefers-reduced-motion` respeitado.
- Mobile-first; linguagem simples (jargão do SUS traduzido na primeira
  menção: "UBS (posto de saúde)").

## Estado atual e pendências

- **Identidade visual definitiva aplicada** (Etapa Visual — Kit Visual
  v1.0, `docs/kit-visual-navegador-sus.md`): tokens no `@theme` de
  `src/index.css`, fontes auto-hospedadas (Figtree/Public Sans), logotipo
  e ícone. A troca de aparência continua custando só a edição dos tokens.
  Regra de forma: **categoria = retângulo, status = pílula**.
- **Verificação telefônica dos dados: adiada** pelo usuário (planilha
  própria, fora do repo). Quando acontecer, dados confirmados recebem
  `confidence: "verified-local"` + data da ligação.
- O site fica público mas com **`X-Robots-Tag: noindex`** até os dados
  serem verificados (comentado em `public/_headers`).
- **Nome do produto:** `navegador · sus Erechim` (kit §1). O `navegador-sus`
  segue só como codinome de repositório/pastas.
