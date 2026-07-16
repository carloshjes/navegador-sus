# Resumo — Etapa Visual 13: dock telefônico e faixa Localizar (`navegador-sus`)

> Executada em **16/07/2026** sobre o padrão **Cívico compacto** da Etapa
> Visual 12. Esta etapa corrige dois tratamentos visuais apontados na inspeção
> direta do usuário. Nenhum dado canônico, proveniência, conflito, rota,
> geolocalização, política de exibição ou texto de honestidade foi alterado.

## Diagnóstico e direção

O dock de emergência tinha duas ações soltas e estruturalmente diferentes:
SAMU era branca, enquanto Bombeiros dependia de um fundo branco translúcido
que parecia um estado desabilitado sobre o vermelho. As duas cápsulas não
tinham ícone de telefone, e rótulo, contexto e ações não formavam uma única
régua de serviço.

O Localizar repetia o padrão genérico de callout: botão sólido dentro de um
card verde-claro arredondado. A contenção decorativa contrariava a linguagem
aberta e orientada por divisores consolidada na Etapa Visual 12.

A direção aprovada foi executada sem nova exploração: **par telefônico de
cápsulas preenchida × contornada** no dock e **faixa aberta** para Localizar.
A signature move é retirar a contenção genérica e fazer alinhamento, divisores,
ícones e keylines carregarem a hierarquia.

### Rubrica anti-genérica

O recorte começou em **4/12**, com problema claro em CTA genérico e estrutura
decorativa. Depois da implementação, ficou em **0/12**: o Localizar deixou de
ser um card/callout e o dock passou a ter hierarquia funcional específica de
telefonia, sem efeitos decorativos.

## Parada técnica: caixa visual × alvo de toque

As cápsulas precisavam parecer menores sem violar o piso de toque de 44×44px.
Cada link passou a ter caixa visual de 32px e `position: relative`; o
`::before` transparente e absoluto se estende 7px acima e abaixo da caixa
interna. Como a borda de 1px reduz a caixa de referência interna a 30px, o
resultado efetivo é **30 + 7 + 7 = 44px**.

O primeiro preflight mediu 42px com extensão de 6px e revelou essa diferença
do box model. O inset foi corrigido para 7px e o teste passou a proteger
separadamente os 32px visuais e os 44px interativos.

## Implementação

### Dock de emergência

- SAMU 192 e Bombeiros 193 usam a mesma estrutura: SVG inline `ti-phone` de
  14px, nome e número.
- Os números usam peso 700 e `tabular-nums` para leitura de sinalização.
- SAMU tem fundo branco, texto `emergency` e borda branca de 1px.
- Bombeiros tem fundo transparente, texto branco e `border-white/80`; o antigo
  `bg-white/15` foi removido.
- As cápsulas têm 32px de altura visual, padding horizontal de 12px, gap de
  6px e hit area transparente de 44px.
- A partir de `sm`, “Emergência”, divisor branco a 35% e “Atendimento imediato
  por telefone” formam uma linha à esquerda; as cápsulas ficam à direita.
- Abaixo de `sm`, o dock mantém rótulo e ações em duas linhas e oculta o
  divisor.
- `tel:192`, `tel:193`, `aria-labels`, `h-bar`, `pb-safe`, foco visível e a
  ausência de sombra, transformação e animação foram preservados.

### Localizar

- `QuickLocateBand` perdeu `bg-primary-soft`, `rounded-lg` e a borda fechada.
- A seção agora usa o fundo natural da página, `border-top`/`border-bottom`
  em `edge` e espaçamento vertical; não existe régua lateral.
- O `LocateButton` manteve `primary` sólido, texto branco, `radius-md` e altura
  mínima de 44px. Recebeu keyline de 1px em `primary-strong`, padding
  horizontal de 20px, rótulo 600 e crosshair de 18px.
- O primitivo `Button` não foi alterado; a keyline pertence somente ao
  `LocateButton`, evitando ampliar o contrato de outras variantes.
- Estados `idle`, `prompting`, `granted`, `denied` e `unavailable`, privacidade,
  ressalva territorial, `aria-live` e `data-testid` permaneceram intactos.

## Testes atualizados

- `e2e/smoke.spec.ts` deixou de exigir 44px na caixa visual das cápsulas e
  agora mede 31–33px visuais mais pelo menos 44px no pseudo-elemento.
- O contrato cobre dois ícones de telefone, `currentColor`, 14px, bordas de
  1px, números em 700/tabulares, SAMU preenchida, Bombeiros transparente com
  `border-white/80` e divisor apenas em `sm+`.
- A matriz dos seis viewports continua verificando overflow, encaixe no dock,
  cápsulas e reserva de espaço inferior.
- `e2e/nearby.spec.ts` preserva os testes dos estados de geolocalização e
  acrescenta o contrato da faixa aberta e da keyline do botão.
- A busca por contratos antigos não encontrou teste unitário visual a
  reescrever; a cobertura unitária existente foi mantida integralmente.

## Responsividade e acessibilidade

- Mobile: rótulo acima, cápsulas abaixo, divisor oculto; o Localizar segue
  abaixo e alinhado ao início da explicação.
- `sm+`: dock em uma linha com régua contextual à esquerda e ações à direita.
- Desktop do Localizar: explicação à esquerda e botão à direita, sem
  contêiner colorido.
- Alvos de toque permanecem ≥44px; foco e ordem de teclado continuam no link
  e no botão reais.
- Os SVGs são `aria-hidden` e os nomes acessíveis completos continuam nos
  links.
- Cor não é o único sinal: preenchimento × contorno, ícone, texto, número,
  divisores e alinhamento sustentam a hierarquia.
- Não foram adicionados gradiente, sombra, blur, glow, transformação ou
  animação. `prefers-reduced-motion` permanece intacto.

## Resultados reais

- Formatação: Prettier executado nos arquivos tocados.
- `npm run lint`: **verde**.
- `npm test`: **62/62 testes verdes** em 10 arquivos.
- `npm run build`: **verde**; Vite transformou 110 módulos.
- `npm run test:e2e -- --project=mobile-chromium --workers=1`: **33/33 casos
  verdes** em 18,4s.
- Preflight focal final de `smoke.spec.ts` + `nearby.spec.ts`: **9/9 casos
  verdes** em 4,6s.

## Inspeção visual

A direção desta etapa veio de mockups já aprovados e da inspeção direta do
usuário. Esta execução verificou o resultado por CSS computado e geometria real
no Chromium nos viewports de 320, 360, 390, 768, 1024 e 1440px. Não se registra
uma nova aprovação perceptiva humana depois da implementação.

## Arquivos alterados

- Componentes: `src/components/EmergencyBar.tsx`, `QuickLocateBand.tsx` e
  `LocateButton.tsx`.
- E2E: `e2e/smoke.spec.ts` e `e2e/nearby.spec.ts`.
- Documentação: `docs/kit-visual-navegador-sus.md` e este resumo.

## Checklist final

| Critério | Resultado |
|---|---|
| Cápsulas menores com toque de 44px | ✅ 32px visuais / 44px interativos |
| Bombeiros sem fundo translúcido | ✅ transparente + `border-white/80` |
| Telefone nas duas cápsulas | ✅ SVG inline de 14px |
| Números 700 e tabulares | ✅ contrato E2E |
| Divisor vertical somente em `sm+` | ✅ contrato responsivo E2E |
| QuickLocateBand sem fundo, card ou régua lateral | ✅ faixa aberta com divisores horizontais |
| Localizar com keyline `primary-strong` | ✅ 1px, rótulo 600 e ícone de 18px |
| Estados e textos de geolocalização preservados | ✅ |
| Dados, rotas e políticas preservados | ✅ diff auditado |
| Sem cor literal nova ou efeito proibido | ✅ |
| Lint, unitários, build e E2E mobile verdes | ✅ |

## Pendências permanentes

- Verificação telefônica dos dados: continua adiada pelo usuário.
- `X-Robots-Tag: noindex`: permanece até a verificação dos dados e a
  decisão explícita de indexar o site.
