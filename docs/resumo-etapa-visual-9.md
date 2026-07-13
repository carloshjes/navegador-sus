# Resumo — Etapa Visual 9: profundidade tonal (`navegador-sus`)

> Executada em **13/07/2026**. Etapa exclusivamente de apresentação:
> nenhum dado canônico, conteúdo, rota ou política de exibição foi alterado.
> Contraste AA e `prefers-reduced-motion` permaneceram inegociáveis.

## O que mudou

- `src/index.css` agora documenta a regra **“profundidade tonal”** junto aos
  tokens de marca.
- O gradiente tonal fica reservado a ações primárias e superfícies de marca
  raras e importantes. Ele usa somente `primary → primary-strong`, no eixo
  vertical; fills de apoio, semânticos, de categoria e de status continuam
  sólidos.
- A elevação ganhou dois passos reutilizáveis, ambos tingidos com `ink`:
  `shadow-resting` para repouso e `shadow-raised` para hover/active de
  elementos interativos.
- O `Card` base recebeu a sombra sutil de repouso. Todo consumidor do
  primitivo passa a compartilhar a mesma profundidade sem repetir valores.
- O `UnitCard` sobe para `shadow-raised` no hover. O antigo reforço simultâneo
  de borda foi removido para que exista uma única pista de elevação.
- O variant `primary` de `Button` trocou o fill sólido pelo token
  `bg-primary-tonal`. `LocateButton` continua delegando seu visual ao
  `Button`, portanto recebe exatamente o mesmo gradiente sem duplicação.

## Decisões e porquês

### Um gradiente, nenhuma matiz nova

`--background-image-primary-tonal` é um único `linear-gradient(to bottom, …)`
entre `--color-primary` (`#0e5e4c`) e `--color-primary-strong` (`#0a4a3b`). Não
há stop intermediário, transparência, cor literal ou outro matiz.

Branco sobre as duas pontas já havia sido auditado em **7,71:1** e
**10,22:1**. Como o trajeto permanece somente entre essas duas cores, o texto
branco continua em AA/AAA em toda a ação primária. As cores de categoria, a
regra categoria=retângulo/status=pílula e todos os fills semânticos ficaram
intactos.

### Elevação como escala do sistema

As duas sombras seguem o precedente de `.bottom-sheet`: os canais RGB
`22, 48, 42` correspondem a `--color-ink`, em vez de preto genérico.

- repouso: duas camadas curtas e leves, para separar o card do fundo creme;
- hover/active: maior deslocamento, difusão e opacidade, reservado a uma
  superfície interativa.

O `UnitCard` não acumulou `hover:border-border-strong` com a nova sombra. Essa
remoção mantém o estado mais calmo e evita que polimento decorativo passe a
competir com a hierarquia de conteúdo.

### Movimento reduzido permanece centralizado

`transition-card` agora transiciona somente `box-shadow` em 180 ms. Nenhum
`@keyframes` foi criado. A regra global de `prefers-reduced-motion: reduce`
continua reduzindo toda duração de transição a `0.01ms !important`.

### Passagem anti-genérica

Na rubrica de seis itens, o recorte partiu de **1/12** pelo CTA primário com
tratamento padrão e terminou em **0/12**. O gradiente não passou a carregar a
hierarquia: localização, filtros, resultados e selos continuam organizados por
posição, tipografia e conteúdo. A contenção veio de duas decisões: preservar
todos os fills informativos sólidos e substituir — não empilhar — a antiga
borda de hover do card.

## Testes

- `npm test`: **62 testes verdes** em 10 arquivos.
- `npm run test:e2e`: **57 testes verdes e 1 skip esperado** em 58 execuções.
  O skip continua sendo o teste de Tab do skip-link no WebKit, condicionado no
  projeto porque o Safari não inclui links na ordem de Tab padrão.
- `npm run build`: verde; o CSS de produção contém `bg-primary-tonal`,
  `shadow-resting`, `hover:shadow-raised` e a media query global de movimento
  reduzido.
- `npm run lint`: verde.
- Prettier nos cinco arquivos de implementação tocados: verde. O check global
  ainda aponta três arquivos preexistentes fora deste escopo
  (`e2e/v5.spec.ts`, `scripts/verify-coordinates.mjs` e `tsconfig.json`).

Nenhum teste novo foi necessário: a etapa não altera comportamento, contrato
de componente, dados ou fluxo. As duas suítes completas cobriram os
consumidores existentes dos primitivos.

## Lighthouse

Medição da build de produção com perfil mobile do Lighthouse **13.4.0**, em
13/07/2026:

| Categoria | Referência solicitada | Etapa Visual 9 | Resultado |
|---|---:|---:|---|
| Performance | 97 | **98** | acima (+1) |
| Acessibilidade | 100 | **100** | igual |
| Boas práticas | 100 | **100** | igual |
| SEO | 63 | **63** | igual |

Métricas auxiliares: FCP 2,0s; LCP 2,0s; TBT 10ms; CLS 0,01; Speed Index
2,0s. O SEO permanece em 63 pelo `noindex` intencional enquanto os dados não
passam pela verificação telefônica.

O relatório JSON completo foi gravado antes de o CLI encerrar. Depois da
coleta, o sandbox negou ao `chrome-launcher` a remoção do perfil temporário e o
processo retornou código 1 nessa limpeza posterior; as categorias, o
`fetchTime` e as métricas acima já estavam presentes no relatório válido.

## Inspeção visual

A inspeção direta da build no navegador conectado não pôde ser concluída: uma
preferência de segurança ativa bloqueou `http://127.0.0.1:4173` e proibiu usar
outra superfície de navegador como contorno. A sessão foi encerrada e a
preferência foi respeitada.

A verificação estrutural da build confirma um gradiente linear contínuo, sem
stop intermediário, entre as duas pontas auditadas, além das sombras de repouso
e hover compiladas. Isso elimina saltos introduzidos por CSS, mas **não é
registrado como aprovação visual direta**. Essa conferência permanece pendente
até o preview local poder ser aberto por Carlos.

## Pendências

- **Inspeção visual direta:** abrir a home em viewport mobile e confirmar o
  gradiente e os dois níveis de sombra; bloqueada nesta sessão pela preferência
  de segurança do navegador conectado.
- **Verificação telefônica dos dados:** continua adiada; campos confirmados
  ainda dependerão de `confidence: "verified-local"` e da data da ligação.
- **`X-Robots-Tag: noindex`:** permanece até a verificação dos dados e a
  decisão explícita de indexar o site.

## Critérios de conclusão — checagem

| Critério | Status |
|---|---|
| Regra “profundidade tonal” documentada nos tokens | ✅ |
| Gradiente restrito a `primary → primary-strong` | ✅ |
| `Card` com sombra `ink` de repouso | ✅ |
| `UnitCard` com elevação maior no hover | ✅ |
| `Button` primary e `LocateButton` com a mesma linguagem tonal | ✅ herança pelo primitivo |
| Categoria=retângulo, status=pílula e cores de categoria preservados | ✅ |
| Transição coberta por `prefers-reduced-motion` | ✅ sem `@keyframes` novo |
| `npm test` e `npm run test:e2e` verdes | ✅ 62 unit; 57 e2e + 1 skip esperado |
| Lighthouse mobile igual ou acima de 97/100/100/63 | ✅ 98/100/100/63 |
| Inspeção visual sem salto perceptível | ⚠️ bloqueada; verificação estrutural concluída |
| Resumo escrito | ✅ este arquivo |
