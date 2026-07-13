# navegador-sus

> **Status: em desenvolvimento — dados em verificação.** Este é um protótipo;
> os dados exibidos ainda não passaram pela rodada de verificação local
> (telefônica) e carregam selos de confiança explícitos na interface.

Guia informativo (PWA) da rede pública de saúde de **Erechim/RS**: qual
unidade atende cada região, horários, serviços oferecidos e canais de
emergência — com a **proveniência de cada dado exposta ao usuário**
(fonte, nível de confiança e data de verificação).

O nome do produto é **navegador · sus Erechim**; `navegador-sus` segue como
codinome técnico (repositório e pastas).

## O que este app é

- Um **diretório curado** da rede pública de saúde de Erechim, construído
  sobre dados públicos (CNES/DataSUS, Prefeitura de Erechim) com curadoria
  manual e validação cruzada de fontes.
- Um app **honesto sobre o que não sabe**: dado não confirmado aparece com
  aviso ("horário não confirmado — ligue antes"), nunca como certeza.
- **Acessível por construção** (meta: WCAG 2.2 AA) e pensado para celulares
  modestos em redes lentas.

## O que este app NÃO é (limites permanentes)

Estes limites valem para todas as versões e não são negociáveis:

- **Não diagnostica, não faz triagem, não recomenda conduta ou
  medicamento.** Nada aqui é orientação clínica.
- **Não agenda consultas nem acessa sistemas oficiais** (e-SUS, regulação).
- **Não substitui os canais oficiais.** O app informa e direciona; em caso
  de divergência, o canal oficial prevalece.
- **Não coleta dados pessoais.** Sem login, sem cadastro, sem analytics
  invasivo. Geolocalização (fase futura) processada só no dispositivo.
- **Não lista nomes de profissionais de saúde** — o app lista serviços,
  não pessoas.
- **Emergência sempre visível:** SAMU **192** e Bombeiros **193** ficam em
  destaque permanente na interface.

## Stack

Vite + React + TypeScript + Tailwind CSS · dados em JSON tipado e
versionado no repositório · testes com Vitest e Playwright · deploy no
Cloudflare Pages.

## Como rodar

Pré-requisitos: [Node.js LTS](https://nodejs.org/) (≥ 20) e git.

```bash
git clone <url-do-repositorio>
cd navegador-sus
npm install
npm run dev        # servidor de desenvolvimento (http://localhost:5173)
npm test           # validação dos dados + testes unitários (Vitest)
npm run test:e2e   # smoke test end-to-end (Playwright)
npm run build      # build de produção em dist/
```

## Dados

A fonte canônica dos dados do app é `src/data/unidades-saude-erechim.json`
(schema 0.2, com proveniência campo a campo). A pasta `docs/` guarda os
entregáveis da Etapa 0 (mapeamento) — consulte `docs/relatorio-mapeamento.md`
para a metodologia de pesquisa e os conflitos registrados entre fontes.

Regra do projeto: **nenhum dado é inventado**. Divergência entre fontes é
registrada (campo `conflicts`), não resolvida por palpite; conteúdo só
muda com fonte nova ou verificação local.

## Licença

[MIT](LICENSE).
