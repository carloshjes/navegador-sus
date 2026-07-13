# Resumo — Etapa Visual 11: ritmo de faixas (`navegador-sus`)

> Executada em **13/07/2026** sobre as regras de profundidade tonal e do
> cabeçalho das Etapas Visuais 9 e 10. Etapa exclusivamente de apresentação:
> nenhum dado, conteúdo, rota ou critério de exibição foi alterado.

## O que mudou

- `WhereToGoPage` deixou de apresentar as três orientações não emergenciais
  como uma pilha de Cards equivalentes.
- Urgência sem risco de vida, rotina/acompanhamento e especialidades agora
  formam uma única sequência semântica de faixas, com moldura compartilhada e
  alternância `bg-surface` → `bg-primary-soft` → `bg-bg`.
- Cada faixa é um `<section>` nomeado pelo próprio `<h2>`, preservando a
  hierarquia de títulos e a navegação assistiva.
- O Card de emergência permaneceu separado, com os mesmos textos, ícone e
  links `tel:192`/`tel:193`. A classe semântica passou a
  `bg-emergency-soft!` para vencer o `bg-surface` do primitivo `Card` e
  restaurar o fundo de emergência que já era pretendido antes desta etapa.
- A elevação de repouso da Etapa 9 continua no Card de emergência. O grupo de
  faixas usa borda e alternância tonal, sem uma segunda sombra concorrente.
- `UnitDetailPage` não recebeu alteração estrutural, por decisão deliberada.
- Foi adicionado um contrato e2e específico da Etapa 11 para proteger tons,
  elevação da emergência e proeminência dos avisos de categoria/conflito.

## Decisões e porquês

### Uma sequência, não três novos cards coloridos

As três orientações descrevem um percurso contínuo pela rede. Uma moldura
compartilhada comunica essa relação melhor do que três caixas independentes e
evita repetir o problema de “card farm”. As superfícies alternadas criam ritmo
de leitura sem adicionar matiz: são exatamente os tokens claros já existentes.

O Card de emergência não participa dessa sequência. Ele conserva fundo
semântico próprio, sombra de repouso e links telefônicos grandes; assim, SAMU
192 e Bombeiros 193 continuam sendo o bloco de maior urgência da página.

### Elevação proporcional

Uma primeira implementação também aplicava `shadow-resting` à moldura das
faixas. Borda, mudança tonal e recorte arredondado já estabeleciam o mesmo
agrupamento, e a sombra adicional fazia a sequência competir com o Card de
emergência. Em cinco medições com essa sombra, `/onde-ir` oscilou entre 97 e 98
em Performance, com mediana 97.

A versão final reserva a elevação ao Card semanticamente prioritário. Sem a
sombra do agrupamento, três medições consecutivas fecharam em 98, com LCP de
2,0 s. A escala da Etapa 9 continua aplicada onde ajuda a hierarquia, em vez de
virar decoração uniforme.

### Por que `UnitDetailPage` permaneceu sequencial

A página de detalhe varia bastante conforme a unidade. Seu fluxo atual é
linear e informativo:

1. identidade da unidade;
2. aviso de categoria, quando existe;
3. conflito de fontes, quando existe;
4. contato, horário e proveniência;
5. serviços e unidades no mesmo endereço, quando existem.

Nas unidades curtas, faixas seriam apenas ornamentação. Nas mais completas,
elas separariam visualmente avisos que precisam ser lidos em continuidade
direta com contato e horário. Por isso o padrão não foi forçado: o Card de
contato permanece ancorado imediatamente depois dos avisos, e serviços/hub
continuam extensões naturais da mesma ficha.

O caso mais exigente, `/unidade/pronto-atendimento-umrs`, foi usado no contrato
e2e e no Lighthouse porque reúne aviso de categoria, conflito de fontes,
contato, serviços e unidades no mesmo endereço.

### Fundo de emergência e precedência de utilitários

O teste de CSS computado encontrou uma divergência preexistente: o consumidor
declarava `bg-emergency-soft`, mas o `bg-surface` incorporado ao `Card` vencia
na ordem gerada pelo Tailwind. A correção usa o modificador importante do
Tailwind v4 no consumidor específico. Não há cor literal ou novo matiz; o
token `emergency-soft` continua sendo a única fonte da cor.

### Passagem anti-genérica

A rubrica de seis itens terminou em **0/12**. A alternância não substitui a
hierarquia: ordem, títulos, conteúdo e bloco emergencial continuam definindo o
percurso. A contenção veio de agrupar as três orientações em uma composição,
usar somente tokens existentes e manter a sombra exclusivamente no elemento
prioritário.

## Testes

- `npm test`: **62 testes verdes** em 10 arquivos.
- `npm run build`: verde.
- `npm run lint`: verde.
- `npm run test:e2e -- --project=mobile-chromium --workers=1`: **32 testes
  verdes**.
- Contrato da Etapa 11 isolado nos dois projetos móveis: **4 testes verdes**
  (2 Chromium + 2 iPhone/WebKit).

O contrato novo confirma por CSS computado:

- Card de emergência em `#fcebeb`, com sombra de repouso;
- três faixas em branco, `primary-soft` e `bg`, nessa ordem;
- SAMU 192 e Bombeiros 193 visíveis e com os mesmos `tel:`;
- aviso de categoria e aviso de conflito com fundo `#faeeda` e texto
  `#854f0b`;
- contato e link para o mapa preservados na página de detalhe.

### Limitação do WebKit na sessão

A execução agregada de `npm run test:e2e` iniciou os **64 casos** sem registrar
falha, mas ficou pendurada no último caso WebKit até o timeout do comando. O
mesmo projeto iPhone repetiu o problema ao acumular vários testes em um único
processo; os casos problemáticos passaram quando executados isoladamente.

A inspeção do Windows encontrou cinco `WebKitNetworkProcess` órfãos do
`ms-playwright`, de execuções anteriores, que não podiam ser encerrados pelo
sandbox (`Acesso negado`). Portanto, a suíte integral não pode ser registrada
como verde nesta sessão. É necessário repeti-la em uma sessão limpa do
Playwright/Windows. Não houve alteração de código ou de asserção para mascarar
essa falha ambiental.

## Lighthouse

Medição da build final de produção com perfil mobile do Lighthouse **13.4.0**,
em 13/07/2026:

| Rota | Performance | Acessibilidade | Boas práticas | SEO |
|---|---:|---:|---:|---:|
| Referência da Etapa 10 | 98 | 100 | 100 | 63 |
| `/onde-ir` | **98** | **100** | **100** | **63** |
| `/unidade/pronto-atendimento-umrs` | **99** | **100** | **100** | **63** |

`/onde-ir` repetiu 98/100/100/63 em três coletas consecutivas da build final.
Métricas medianas: FCP 2,0 s; LCP 2,0 s; TBT 0 ms; CLS 0,006; Speed Index
2,0 s.

No detalhe: FCP 1,7 s; LCP 1,8 s; TBT 0 ms; CLS 0; Speed Index 1,7 s. O SEO
continua limitado pelo `noindex` intencional.

Os relatórios JSON foram gravados integralmente. Como nas etapas anteriores,
o sandbox negou ao `chrome-launcher` apenas a remoção posterior dos perfis
temporários (`EPERM`), fazendo o CLI retornar 1 depois da coleta válida.

## Inspeção visual

O navegador conectado mantém uma preferência de segurança que bloqueia os
endereços locais do app e proíbe contornar a restrição por outra superfície.
Ela foi respeitada, portanto esta etapa não registra inspeção visual humana.

Nos dois motores móveis, a verificação automatizada confirmou os três tons,
o fundo e a elevação da emergência, os links telefônicos e os avisos de
categoria/conflito. Isso protege objetivamente a proeminência existente, mas a
percepção do ritmo completo ainda deve ser conferida por Carlos no preview
local.

## Pendências

- **Suíte e2e agregada no WebKit:** repetir `npm run test:e2e` depois de
  encerrar os processos órfãos ou reiniciar a sessão do Windows.
- **Inspeção visual direta:** conferir a sequência de faixas em mobile e
  desktop e confirmar que a emergência continua dominando a página.
- **Verificação telefônica dos dados:** continua adiada.
- **`X-Robots-Tag: noindex`:** permanece até a verificação dos dados e a
  decisão explícita de indexar o site.

## Critérios de conclusão — checagem

| Critério | Status |
|---|---|
| Etapas Visuais 9 e 10 preservadas | ✅ |
| `WhereToGoPage` organizada em faixas de largura total | ✅ |
| Somente tokens `surface`, `primary-soft` e `bg` nas novas faixas | ✅ |
| Emergência, SAMU 192 e Bombeiros 193 preservados | ✅ contrato e2e |
| Avisos de categoria e conflito sem perda de proeminência | ✅ contrato e2e |
| Decisão sobre `UnitDetailPage` documentada sem forçar o padrão | ✅ |
| `npm test`, build e lint verdes | ✅ |
| Contrato novo verde em Chromium e WebKit | ✅ 4/4 |
| `npm run test:e2e` agregado verde | ⚠️ bloqueado por processos WebKit órfãos |
| Lighthouse mobile igual ou acima da Etapa 10 | ✅ 98 e 99 |
| Inspeção visual direta | ⚠️ bloqueada; CSS computado validado |
| Resumo escrito | ✅ este arquivo |
