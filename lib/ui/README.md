# Componentes do SantoDS

Peças de interface construídas **só com tokens do Figma**. Documentação visual em
[`/componentes`](../../app/componentes/page.tsx) — rode `npm run dev` e abra a rota.

```tsx
import { Button, Card, CardHeader, Field, Input, Icon } from "@/lib/ui";
```

## A regra

Nenhum componente daqui usa valor solto. Cor, espaço, raio, tipo, sombra, duração
e curva saem sempre de um token. Se precisar de algo que não existe, crie o token
no Figma e sincronize com o agente `figma-parity` — não invente um px no JSX.

Ao criar um componente novo aqui: JSDoc explicando **quando** usar (não o que faz),
props tipadas, tokens em tudo, exporte no barril `index.ts` e registre (abaixo).

## Registro

Todo componente tem metadado e demo, e é daí que sai a documentação — índice,
página, sidebar e busca:

- `<modulo>.meta.ts` — dado puro (`ComponentMeta`): nome, slug, categoria, frase
  de **quando usar**, arquivo de origem e par no Figma (`figma.name` + `nodeId`).
  Sem `figma` = só existe no código, divergência a resolver.
- `<modulo>.demo.tsx` — demos vivas (`DemoMap`): `playground` com controles ao
  vivo + blocos `Básico`, `Variantes`, `Tamanhos`, `Estados`…
- `registry.ts` junta os metas (serve a Server e Client Components);
  `demos.ts` junta as demos (só cliente). Tipos em `registry.types.ts`.

Componente novo: crie os dois arquivos e importe-os em `registry.ts` e `demos.ts`.

**Diretriz de demo (Pedro):** variante numerosa vira SELETOR no playground (um
exemplo por vez), não grade exaustiva. Ex.: o Avatar escolhe pessoa e tamanho.
Fotos de exemplo: `demo-people.ts` (Pedro, Érica, Sena; WebP 48/96/192).
A página `/componentes/<slug>` aparece sozinha. Depois rode
`node scripts/figma-components.mjs` para atualizar o inventário Figma × código.

## Raio (princípio 5 do Pedro)

A identidade do Santo não tem borda 100% arredondada. `radius/full` só em
**círculo geométrico**: avatar, radio, punho do range, Ring,
ponto/marker/dot, swatch e IconTile redondos, dia escolhido do Calendar (e as
pontas da faixa de intervalo, concêntricas a ele). O resto sai de
`lib/ui/radius.ts`, um lugar só:

- `RADIUS_CONTROL` (`rounded-md`, 8) — controle interativo e campo de uma linha:
  Button, IconButton, Chip, aba de Segmented/TabBar, NavItem, RailItem,
  Input, SearchInput, Select, NumberField, Disclosure, Fab, reação de chat,
  trilho do Switch. **Pendente**: vira `rounded-control` quando o token Semantic
  `radius/control` (→ `brand/shape/radius-control` → `dimension/radius/8`)
  entrar — `TODO(radius/control)` em `radius.ts`.
- `RADIUS_TRACK` (`rounded-lg`, 12) — trilho que envolve controles com `p-2xs`
  (controle + 2xs, concêntrico): Segmented, TabBar flutuante, RailNav,
  NavUser, ChatComposer.
- `RADIUS_BADGE` (`rounded-full`) — **exceção do Pedro**: badge e tag podem ser cápsula. Tag (Badge no Figma), Count e Marker; nada mais.
- `RADIUS_CONTROL_START`/`END` — pontas de faixa feita de células (cabeçalho tonal da Table): raio de controle, nunca cápsula.
- `RADIUS_BAR` (`rounded-xs`) — barra fina de dado: Progress, MiniBars,
  trilhas de range e do ColorPicker, TokenSample `easing`.

**Equilíbrio** (skill santo-ui-craft §3): concêntrico em moldura justa (filho =
moldura − padding), irmãos no mesmo degrau (item de trilho = botão = campo =
controle), moldura = filho + padding (`calc()` de tokens). Cartão dentro de
moldura `sunken` vira `lg` sozinho e a moldura deriva (`lg` + padding); o painel
do Card double é `lg` e a moldura dele, `lg` + recuo + fio. Bolha de chat em
`lg`, irmã do composer. Punho do Switch em pastilha `controle − 2xs`.

`pill` de Button/IconButton/Select/Skeleton.Field ficou **sem efeito**
(`@deprecated`, só compatibilidade). A variante `pill` do Segmented/Disclosure
mantém o nome por API, mas não é mais cápsula.

## Realce de linha

Hover/seleção de linha segue o raio aninhado (`surface.css`): `santo-row` (padrão,
INSET: pastilha suave com raio `min(radius-sm, --santo-card-inner-radius)`) em Table,
ListRow `interactive`, opções de Select e ⌘K; `santo-row-flush` (Table `flush`) para
lista que ocupa o Card inteiro. Nunca `hover:bg-*` reto numa linha dentro de card.

## Movimento

`motion.css` é o único lugar com `@keyframes`; duração e curva vêm de
`motion/duration/*` e `motion/easing/*`. Classes:

- `santo-transition-colors | opacity | transform | elevation | all` — troca de estado.
- `santo-press` — aperto com mola (Button, IconButton, Chip).
- `santo-animate-fade-in/out`, `scale-in/out`, `slide-in-up/down/left/right`,
  `slide-out-left/right`, `pop`, `pulse`, `shimmer` — entrada, saída, contínuo.
- `santo-collapse` + `data-open` — abre/fecha altura (Disclosure).

`motion.ts`: `usePresence(open, exit)` mantém montado durante a saída;
`readDuration(nome)` lê a duração em ms; `DURATION` nomeia as vars.
Movimento reduzido (sistema ou `[data-reduced-motion]`) zera tudo.

## Inventário

Dois níveis, pelo `tier` de cada `<modulo>.meta.ts`:

- **Primitivo** — bloco genérico, sem significado de produto, usável em qualquer contexto, e que **não importa outro componente de `lib/ui` além de `Icon`**. Precisa mostrar outro componente? Recebe por slot (`ReactNode`), não importa.
- **Semântico** — carrega um papel ou padrão de produto (navegação, conversa, dado, formulário, feed, gráfico), mesmo que hoje não componha nada da lib.

Composição não é o critério de semântico; é restrição do primitivo. Um semântico se monta só com primitivos da lib — markup cru que imita um primitivo é dívida.

## Primitivos

Átomos: `Button`, `Input`, `Tag`, `Card`…


### Ação
| | quando usar |
|---|---|
| `Button` | `primary` para a ação principal da tela (uma por região), `secondary` para apoio (pastilha elevada: raised + hairline + shadow-xs), `subtle` para preenchimento suave, `ghost` em barra de ferramentas, `danger` para destruir. Raio de controle (`RADIUS_CONTROL`, radius/md); `pill` sem efeito. Tamanhos `sm`/`md`/`lg` casam com `dimension/size/32\|40\|48`. **`block` só para botão sozinho** — dois `block` na mesma linha flex se empurram e transbordam; use `className="flex-1"`. |
| `IconButton` | Botão só com ícone, círculo por padrão (`pill={false}` = quadrado). `label` é obrigatório — vira `aria-label` e `title`. |
| `buttonClass` | As classes do botão, para `<Link>`/`<a>` com cara de botão (`<button>` dentro de `<a>` é HTML inválido). Mora em `button-class.ts`, sem `"use client"`, para rodar em Server Component. |

### Entrada
| | quando usar |
|---|---|
| `Input` | Campo de uma linha. `variant` `well` (padrão: poço sunken com raio de controle, sem contorno — campo dentro de cartão) ou `outline` (contorno, mesmo raio de controle — formulário longo sobre o chão). `Select` e `Textarea` seguem o mesmo `variant`. `mono` para hex, medida e nome de token. `invalid` pinta a borda e liga `aria-invalid`. |
| `Textarea` | Texto longo. |
| `Select` | **Nunca o nativo.** O `<select>` do sistema abre o menu do SO, que ignora tema, tipografia e densidade — e não consegue mostrar cada opção com aparência própria, que é justamente o que faz um seletor de fontes ser útil. Aceita grupos, dica por opção, marcador à esquerda e `labelStyle`. Ganha campo de busca a partir de 12 opções. Painel em `position: fixed` para não ser recortado por ancestral com `overflow`. Teclado completo: setas, Home/End, Enter, Esc, Tab. |
| `Checkbox` / `Radio` / `Switch` | Chave quando o efeito é imediato; caixa quando existe um Salvar. Switch desabilitado continua mostrando o estado (ligado = brand/subtle). Switch concêntrico: trilho 24 × 40 no raio de controle com folga `space/2xs` nos quatro lados; punho 16 em pastilha (controle − 2xs = `radius/xs`); curso 16 = largura do punho. |

### Cor
| | quando usar |
|---|---|
| `Swatch` | Amostra estática, com xadrez atrás para alfa parcial. `round` para as bolinhas de resumo de marca. `size` xs/sm/md e `lg` (size/48, amostra de destaque da BrandCard). |
| `Color` | Módulo de conversão: `hexToRgb`, `rgbToHsv`, `contrastRatio`… Use `contrastRatio` para conferir par duvidoso. |

### Estrutura
| | quando usar |
|---|---|
| `Card` | Superfície com um assunto só, **profundidade por tom** (skill santo-ui-craft). `variant`: `raised` (padrão, nível 1, sombra ambiente `sm`, raio xl — o máximo de card no DS), `sunken` (moldura que contém cartões: o cartão filho vira `lg` e a moldura = `lg` + padding), `well`/`inset` (**grupo sem caixa** — princípio do Pedro, nada de box em volta de tile, Stat, KeyValue ou gráfico: só empilha com o gap; poço de verdade só em campo e código), `outlined`, `dashed` (lugar vazio), `double` (painel raised `lg` + moldura sunken = painel + recuo + fio, com `header`/`footer`; `footerFlush` põe o rodapé na largura e no raio do painel — bloco de código sob preview, como nos demos de /componentes). Sem borda 1px visível: contorno `santo-edge` (invisível no claro, hairline no escuro). Expõe `--santo-card-inner-radius` = max(controle, raio − padding) aos filhos. `padding` sm/md/lg; `padded={false}` quando o conteúdo encosta na borda. |
| `Divider` | Divisor de 1px no token de borda. `orientation="vertical"` entre itens de uma linha; `label` para o rótulo no meio ("ou continue com"). |
| `Disclosure` | Grupo colapsável. O gatilho é pastilha que abraça o texto, não faixa de ponta a ponta. Contador ou selo vão no slot `trailing` (ex.: `<Count>`). |
| `Segmented` | Escolha única entre 2 e 4 opções visíveis. Prefira a `Select` quando a comparação entre elas importa. Trilho `RADIUS_TRACK` com `p-2xs`, abas no raio de controle (concêntrico). `block` = largura do pai com abas iguais (irmão de campo/botão de largura total); nunca passa da largura do pai. |
| `TabBar` | Abas em pastilha. |
| `Chip` | Pastilha clicável com raio de controle (filtro, aba de editor): tonal em repouso, brand/subtle ativa, size/32. |
| `Tag` / `Count` | Rótulo estático em cápsula (size/24) / contador em cápsula (size/20 — badge e tag são a exceção que pode ser 100% arredondada; `tone` neutral\|brand) à direita de rótulo, aba, nav, título. `dot` põe o ponto da cor da intenção (estado ao vivo). (No Figma, `Tag` é `Badge`.) |
| `Skeleton` | Formas neutras (`Bar`, `Block`, `Circle`, `Button`, `Field`, `Chip`, `Check`, `Row`, `Rule`, `Bars`, `Line`) para ilustrar a anatomia de um componente ou segurar o lugar enquanto carrega. Sem texto, ícone nem cor de marca. |
| `ThumbFrame` | Moldura de miniatura: poço 16:10 com grade sutil e cartão no centro, onde o `Skeleton` desenha. Só para a vitrine do índice de `/componentes` (ilustrações em `lib/thumbs`). |
| `Overline` | Rótulo em caixa alta acima de um número ou bloco. Um rótulo, não uma frase. **Dívida de token**: falta o text style overline no Figma (hoje caption-small + tracking/wide, em `text-class.ts`). |
| `Ring` | Anel de progresso (`value` 0–100, `size` sm/md/lg, `tone`, centro opcional; trilha em `neutral/subtle/active`). Ao lado de número grande, em tile, em linha de lista. |
| `Sparkline` | Linha de tendência sem eixo, cor do pai (`text-icon-brand`). Largura padrão por `size` (space/64·96·128) — cabe no slot `viz` do `Stat` sem embrulho; `fluid` ocupa a largura do pai. `area`, `dot`; `surface` (raised\|sunken\|page) é a cor do anel do ponto final — use `sunken` dentro de poço. **Dívida de token**: stopOpacity 0,24→0 do degradê é literal até o sync de opacity/* do Figma (PENDENCIA em sparkline.tsx). |
| `MiniBars` | Barrinhas compactas, sem transição de altura; `highlight` pinta uma na cor do pai, base em `neutral/subtle/active`. |
| `Fab` | Ação flutuante única da tela: círculo ou `extended`, `tone` brand/raised, `position` end/center/start (o bottom soma a safe-area do aparelho). |
| `RailNav` / `RailItem` | Trilho vertical de ícones (chão sunken com `RADIUS_TRACK`, itens quadrados com raio de controle, ativo em pastilha elevada); o painel ao lado é `SidebarNav`. |
| `IconTile` | Ícone num **slot** de tamanho de token (size/40 `md`, size/48 `lg`) que alinha com Avatar e texto: marcador de linha de lista, estado vazio, anexo, cabeçalho de cartão. **Padrão `plain`: sem caixa** (regra do Pedro: nada de caixa em volta de componente dentro de cartão). Caixa tonal só quando a cor carrega significado: `success`/`danger` (entrada/saída, ok/erro — `TransactionRow`), `brand` (acento, um por região: estado vazio, destaque), `subtle` (poço: grade de ícones, alvo visual), `outline` (pastilha elevada sobre chão/poço: anexo). Com caixa: raio interno do Card pai (raio de controle) ou `shape="round"`. |

### Dado
| | quando usar |
|---|---|
| `Avatar` | Pessoa em círculo: foto (`src`, `alt`) ou iniciais, que também são o fallback se a foto falhar. Tamanhos 24/32/40. |
| `AvatarGroup` | Avatares sobrepostos com anel da cor da superfície. |
| `Progress` | Quanto de uma meta já foi cumprido. Sem teto, use `Stat`. `intent` muda o preenchimento. |

### Código
| | quando usar |
|---|---|
| `Kbd` | Tecla de atalho, ao lado de onde o atalho age. |

## Semânticos

Composições com significado de produto: navegação, conversa, dado, documentação.


### Entrada
| | quando usar |
|---|---|
| `SearchInput` | Input com lupa embutida e forma de comprimido. |
| `Field` | Rótulo + campo + apoio, com o espaçamento certo. `hint` some quando há `error`. |
| `NumberField` | Slider de **largura total** para um número: a trilha não divide a linha com o valor. `valueLabel` `above` (padrão: rótulo flutuante acima do punho, acompanha a posição e nunca vaza nas pontas), `below` (mín | valor | máx abaixo da trilha) ou `none`. `field` liga o campo para digitar o valor exato, numa linha própria abaixo. Teclado no range nativo; `aria-valuetext` com a unidade. |
| `SettingRow` | Título, apoio e controle à direita — a linha de tela de configuração. |

### Cor
| | quando usar |
|---|---|
| `SwatchPicker` | Amostra que abre o `ColorPicker`. |
| `ColorPicker` | Seletor completo: área saturação × brilho, matiz, alfa, conta-gotas e campos que alternam HEX / RGB / HSL. Setas ajustam a área 2D. |
| `ColorRow` | A linha do editor: amostra, rótulo de largura fixa, campo e ações. A largura fixa é o que alinha uma coluna longa. |

### Estrutura
| | quando usar |
|---|---|
| `CardHeader` | Título + ação no canto. Título em `body-large-semibold` (18px): abaixo do título de seção (`heading-6`) e abaixo do número de KPI (`Stat` md, `heading-5`). Não trunca, quebra linha. |
| `CardFooter` | Ações do cartão alinhadas à direita: no fim de um `Card`, ou no `footer` da moldura do `Card variant="double"`. |
| `Stat` | Número grande com rótulo e variação. Escala do número: `sm` heading-6 (24), `md` heading-5 (30, padrão de cartão), `lg` heading-3 (48, só o número da tela). |
| `CardGrid` | **Toda** fileira de cartões ou peças irmãs — tela de `app/` não monta `grid` inline (`lib:check`, regra C). **Masonry por padrão** (princípio 4 do Pedro, sem margem morta): linhas de `space/3xs` e cada filho ocupa as linhas da sua altura medida (ResizeObserver) — cartões empilham por coluna, sem vão, na ordem do DOM (esquerda → direita, como o foco anda); `col-span-*` no filho continua valendo. **Limitação**: precisa de JS — antes de hidratar a grade é a comum, alinhada ao topo; filho que ocupa todas as colunas espera a coluna mais alta. `masonry={false}` = **grade fixa**: colunas iguais, uma calha só, topos alinhados por fileira e `col-span-*` previsível — use em composição com spans (painel de app, preview de marca) e em peças de altura igual (miniaturas, amostras, demos); masonry com span misturado desalinha. `stretch` (só com a grade fixa) = fileira na **mesma altura**, para índice de cartões de navegação (`LinkCard`): a lista de links do cartão curto cresce e preenche, sem buraco. Regra: **índice/navegação → grade fixa + stretch; conteúdo heterogêneo → masonry**. **Grade de dashboard** (blocagem por fileira): uma `CardGrid masonry={false} stretch` POR FILEIRA, irmãos de conteúdo equivalente — KPIs `{ sm: 2, xl: 4 }` (Stat do mesmo molde), operação `{ md: 2, xl: 3 }` (o terceiro com `md:col-span-2`, para a fileira de 2 fechar), tabela/lista sempre em largura total; cada cartão da fileira com a ação ancorada no fim. Exemplo vivo: /exemplos#dashboard. `columns` por breakpoint (`{ md: 2, "2xl": 3 }`, base 1) ou `minItem` (auto-fill/`autoFit` com largura mínima de token); `gap` sm\|md\|lg\|2xl. **Dívida de paridade**: sem par no Figma — lá vira auto-layout wrap alinhado ao topo. |

### Navegação
| | quando usar |
|---|---|
| `Breadcrumb` | Trilha no topo de página que mora numa hierarquia. Último item é a página atual. Em página de primeiro nível, não use. |
| `LinkCard` | Cartão de entrada para uma seção: ícone sem caixa alinhado ao título, título + `meta` na mesma linha (Count, Tag), atalhos com chevron. Para página índice. |
| `CommandPalette` | Busca por cima da página (⌘K) quando há destino demais para um menu. Ignora acento; teclado completo. Quem escuta o atalho é a página. |

### Dado
| | quando usar |
|---|---|
| `Table` | Tabela compacta: cabeçalho tonal em faixa (pontas no raio de controle, nunca cápsula), linhas hairline, número à direita. Realce de linha INSET com raio aninhado (`santo-row`, padrão) ou `flush` para tabela que ocupa o Card inteiro (`padded={false}`: realce reto, contêiner recorta). `layout="fixed"` + `Column.width` (degrau de dimension/space) trava as colunas — tabelas empilhadas alinham e texto longo quebra. `selected` liga a coluna de seleção, `rowAction` a de ações. Coluna sem `render` lê a célula pronta em `row[key]` (`CellRow`) — assim a tabela monta num Server Component; seleção e ações exigem cliente. |
| `Pagination` | Contagem à esquerda, navegação à direita. |
| `Calendar` | Mês interativo: `mode` single\|range, `onSelect(dias, {month, year})`, setas pastilha tonal, hoje com anel brand/subtle, escolhido em brand/solid, intervalo em faixa brand/subtle com pontas arredondadas, dias vizinhos em text/disabled. Teclado de grade (setas, Home/End, PageUp/PageDown) e aria-grid. `startWeekday`/`days` aceitos por compatibilidade (o mês sai de `month`/`year`). |
| `LineChart` / `AreaChart` / `BarChart` / `StackedAreaChart` | SVG puro, pintado por token. Sem biblioteca. |
| `AxisLabels` | Rótulos de eixo abaixo de um gráfico. |
| `KeyValue` | Linha rótulo × valor (resumo de pedido, detalhe de transação). Valor tabular à direita; `emphasis` no total. |

### Aplicação
| | quando usar |
|---|---|
| `SidebarNav` / `NavSection` / `NavItem` / `NavSub` / `NavUser` | Painel de navegação (ao lado do `RailNav`). Itens com raio de controle (size/36); ativo = pastilha elevada (raised + shadow-xs) sobre o chão do painel (use num `Card variant="well"` ou região sunken); `emphasis` = acento brand. `count` à direita (número vira `Count`). Subitens em `NavSub` com `sub`: conectores de árvore. `NavUser` em pastilha elevada. `href` vira link. |
| `AppSidebar` | Sidebar de app ou documentação numa **coluna só** (Pedro, 2026-10-19: sem trilho de ícones): `SearchTrigger` no topo e **todos** os grupos já abertos (`SidebarNav` + `NavSection` com rótulo em Overline + `NavItem`), item ativo em pastilha elevada e trazido para a vista ao montar. Quem rola é o pai (aside sticky, gaveta); rota e item ativo são do pai — o shell de `app/_docs` só passa os grupos. `RailNav` continua como componente para apps com áreas, fora da AppSidebar. **Dívida de paridade**: sem par no Figma. |
| `BrandLogo` | Logo oficial de uma marca do DS pelo id de `brand/id` (`santo`, `vtsd`): topo de app/doc e ficha da identidade. Duas imagens por marca (fundo claro e escuro), alternadas pelo tema com `santo-show-light/dark`, sem JS. Assets em `public/brand/<marca>-logo.svg` (claro) e `<marca>-logo-dark.svg` (escuro); a cor da marca mora no SVG (asset isento), nunca em JSX. Marca sem logo registrada não renderiza. Sem `brand`, segue a marca ativa do documento (`useActiveBrand`, troca com o seletor). `size` 20/24/28/32 (dimension/size). | `variant` `full` (padrão) ou `mark` (reduzida, para espaço curto: header no celular, ficha de identidade, favicon). Marcas com mark: VTSD (`vtsd-mark.svg` / `vtsd-mark-dark.svg`); a Santo ainda não tem mark e cai na logo completa. `brandLogoFile(id, variant)` e `hasBrandMark(id)` para quem precisa do arquivo (o favicon da doc troca para a mark da marca ativa).
| `BrandSwitch` | Seletor de marca ao lado do seletor de tema: o valor vai para `data-brand` (mesmas vars `--santo-*`, valores da marca — tokens.css do Compasso). Controlado; quem persiste é o pai (na doc: `app/_components/brand-control.tsx` + `BRAND_SCRIPT` no `<head>`, chave `santo-brand`, sem atributo = marca padrão). Com uma marca só, não aparece. `data-brand` vale em qualquer contêiner (preview de identidade); `data-theme` só na raiz. |
| `BrandCard` | Ficha de identidade (bloco) em **uma linha compacta**: `BrandLogo` reduzida (`variant="mark"`, 28) + Tag Padrão (o nome não se repete: vai no `aria-label`; a logo tem alt) e, separadas por `Divider` vertical, as células Tipografia ("Aa" heading-6 + família), Cor de marca (Swatch md + hex), Neutros (claro e escuro lado a lado + hex) e Raio (amostra size/28 + valor). Respiro lateral space/sm além do padding do cartão (a logo não encosta na borda; simétrico à direita). Overline em cada célula, centro vertical, gap constante, sem caixa. **Grade fixa** a partir de md: logo (variante `mark` em 24 quando a marca tem; senão a completa em 20 — mesmo peso visual) space/224 | tipografia space/160 | cor space/128 | neutros space/192 | raio space/96 — iguais em toda ficha, então divisores e rótulos alinham entre fichas empilhadas; texto longo trunca com reticências e `title`. Abaixo de md: grade de 2 por linha, sem divisores. `data-brand` no cartão. |
| `DashboardHeader` | Cabeçalho de dashboard (bloco): título heading-4 (acima do KPI) + meta curta na linha, filtro de período (`Segmented`) e ação primária à direita, alinhado à grade (sem padding próprio). Abaixo de md os controles descem. Sem subhead. |
| `TransactionRow` | Linha de extrato (bloco): seta de entrada (valor ≥ 0) em `IconTile tone="success"` ou de saída em `tone="danger"` — a cor carrega o significado, então a caixa tonal é permitida —, título, categoria · data e valor à direita na mesma cor (text/success ou text/danger), com sinal e tabular-nums; `onAction` liga o IconButton ghost de ações. |
| `ChatHeader` / `ChatBubble` / `ChatAttachment` / `ChatComposer` / `TypingIndicator` | Conversa. Bolha recebida em poço (`surface/sunken`), enviada em `brand/solid` + `text/on-brand`, raio xl com cauda xs; reações em pastilha elevada. `ChatComposer`: campo-poço em pastilha com anexar (ghost) e enviar (primary, círculo) inline, anel no conjunto. `avatarSrc` em ChatHeader. |
| `ActivityItem` / `Marker` | Feed "quem / o quê / quando", com marcador de contexto (Marker = tag em cápsula com contorno leve). |
| `Ticker` | Faixa de cotações. |

### Código
| | quando usar |
|---|---|
| `CodeBlock` | Trecho para copiar (import, JSX, classe). Fundo `surface/sunken`: código é conteúdo embutido, não cartão. |
| `CopyButton` | Copia texto que a pessoa vai colar em outro lugar. O ícone vira um visto por um instante. |
| `CopyCode` | Nome curto em mono + copiar (var CSS, classe, token) em linha de tabela ou ficha. Sem valor, travessão. Raio `radius/xs` (code inline não é pastilha). `truncate` corta com reticências em coluna estreita (title com o valor inteiro; copia o inteiro; botão não encolhe). |

### Novos nesta rodada
| | quando usar |
|---|---|
| `RadioGroup` / `RadioCard` | Escolha única em cartões (plano, modo). Setas movem e escolhem; tabindex itinerante; Home/End. O cartão inteiro é o alvo; o marcador é o do Radio. Não selecionado = poço; selecionado ELEVA (raised + shadow-xs + hairline) — brand só no marcador. |
| `ListRow` | Linha de lista: marcador (`IconTile`/`Avatar`), título, metadado curto, algo à direita; `divider` separa. |
| `EmptyState` | Lugar vazio com caminho: ícone, título, ação. Sem texto de apoio. |
| `TokenSample` | Amostra viva de token pela var CSS: `swatch`, `shadow`, `radius`, `bar`, `line`, `text`, `easing` (curva + bolinha), `duration`. |
| `SearchTrigger` | Parece campo de busca e abre o ⌘K; atalho pela plataforma. |
| `TableOfContents` | Índice da página na coluna direita, grupos > itens, ativo com linha de brand; acompanha a rolagem. |
| `Stat` | (atualizado) `action` no canto e `size` sm/md/lg. |

### Blocos (landing)
Blocos prontos, alimentados por dado: a tela de exemplo só compõe (`lib:check`, regra D — `app/exemplos/landing.tsx` já está no escopo). Funcionam em qualquer marca; a página escolhe a marca com `LandingPage brand`.

| | quando usar |
|---|---|
| `LandingPage` | Moldura de página de venda: `header` (LandingHeader) de ponta a ponta, fundo = superfície de página (sem decoração) e coluna central container/lg — o vídeo vai largo; hero e oferta se limitam a md/sm por dentro. `brand` (opcional, para uso fora da doc) grava `data-brand` (cor, fonte, raio da marca na página inteira); sem ele a página segue a marca ativa — é assim em /exemplos; `framed` desenha a moldura (raio xl); `fullBleed` tira o limite container/lg da coluna (o vídeo vai de margem a margem, só com o padding de página: md, xl a partir de md; hero e oferta seguem estreitos); `overlay` recebe o `SocialProofToast`. `overflow-clip` (não hidden) para o toast sticky funcionar. |
| `LandingHero` | `secondLine` (2ª linha do título em text-brand) e `actions` (Button secundário lg + `CtaButton size="md"` com seta, lado a lado, mesmo raio de controle). Abertura em 3 grupos com ritmo constante: (1) logo (`brand`) + prova social `proof` (`SocialProofRow`), gap sm; (2) headline (heading-4; heading-6 abaixo de md; tracking-tight, balance; `highlight` em text-brand sem quebrar) + subheadline (body-large, text-secondary, medida container/sm, pretty), gap sm; (3) `lead` (body-large semibold, `leadHighlight` em text-brand) + legenda (body-small, tertiary), gap xs, com space/lg + sm antes. Sem overline e sem tarja. Limitado a container/md. |
| `LandingHeader` | `variant` `floating` (padrão da landing: fixo na rolagem, sticky com afastamento, `layer/sticky`) ou `inline` (dentro de um cartão, sem painel nem sticky). Topo da landing em **painel flutuante** (logo da marca ativa, ou `brand` fixa): descolado do topo por space/sm, largura total (só o afastamento lateral space/md), surface/raised + border/subtle + shadow/md, raio xl (= controle md + folga xs, concêntrico, sem cápsula). `BrandLogo` à esquerda; menu central num trilho sunken (raio lg = md + 2xs) com itens em pastilha de controle (ativo eleva); à direita Login (ícone `User`) e CTA de acesso (Button primário, cor de marca). Sticky mantendo o afastamento (faixa transparente). Abaixo de md: mesmo painel com logo + menu; a gaveta abre dentro dele. `offset` gruda abaixo da topbar da doc. Slot `header` da LandingPage. |
| `HeroCard` | **Hero em cartão**: a abertura inteira dentro de um cartão `brand/subtle` (raio xl, teto de cartão), com a margem da página em volta. Slots: `header` opcional (`LandingHeader variant="inline"`; o padrão da landing é o header **flutuante fixo** no slot da `LandingPage`, e sem header o cartão começa no título com respiro no topo), conteúdo (`LandingHero`, `YouTubeEmbed` em borda dupla) e `rating` no pé. Superfície subtle, e não solid, por contraste (D1). |
| `ShowcaseStrip` | Bloco disponível (fora da landing por decisão do Pedro). Vitrine de produto para um hero: 5 a 7 cartões pequenos de app (`ShowcaseItem`: stat com tendência, bars, ring, chat, photo) em arco leve (translate por token: as pontas descem). Abaixo de md, faixa rolável com snap. |
| `LogoStrip` | Faixa de logos em cinza (text/tertiary) entre hairlines, com rótulo em Overline; placeholders em texto até haver logos reais. Rolável no celular. |
| `SectionIntro` | Abertura de seção: ponto + Overline e título centrado em linhas (`IntroPart[][]`), a última em text/secondary; ícones inline numa pastilha brand/subtle (raio de controle). heading-4 (heading-6 no celular). |
| `BentoGrid` | **Bento**: grade fixa com spans planejados e fileiras que fecham (1 col; 2 em md; 3 em xl): `illustration` (ilustração de componente do DS em esqueleto — `ThumbFrame` + `Skeleton`, vetorial, sem imagem raster — com o número e a legenda abaixo; 2 linhas), `quote` (número + avatares + citação), `brand` (destaque brand/solid, número grande — texto grande por D1), `inverse` (surface/inverse, largo). Alimentada por dado (`BentoItem`). |
| `SocialProofRow` | Linha de prova social: até 3 avatares com foto (`AvatarGroup`) + texto curto, centrados. `tone` `text` (frase em body-small, acima da headline: "+ de 20 mil alunos já vendem todo dia") ou `overline` (rótulo junto do CTA: "+90 MIL ALUNOS"). Usada pelo `LandingHero` (`proof`) e pelo `LandingOffer`. |
| `LandingOffer` | Abaixo do vídeo: até 3 avatares (fotos) + contagem em Overline, o `CtaButton` e o `Rating`. Um CTA por página. |
| `SocialProofToast` | Aviso de prova social no canto inferior esquerdo: `Avatar` da lib com foto (`avatarSrc`; sem foto, a inicial), frase, "compra verificada" com visto success, fechar. Entra com `santo-animate-slide-in-up`. `placement` viewport (fixo) ou frame (absoluto no pai). |

| | quando usar |
|---|---|
| `YouTubeEmbed` | Vídeo do YouTube (youtube-nocookie, 16:9, raio `RADIUS_TRACK`) por id ou URL (`parseYouTubeId`). iframe com `title`, `loading=lazy`, tela cheia. Padrão: o player puro (iframe direto). `resumeAt` é a variante opcional que liga a camada "retomar" da VSL (brand/solid, "Continuar assistindo?" / "Assistir do início?"): ao escolher, carrega tocando do ponto certo. Sem CSP no next.config; nada a liberar. `frame="double"`: borda dupla (como o Card double) — moldura sunken com recuo space/xs + fio, painel lg com sombra curta, moldura = lg + xs + fio (concêntrico). |
| `CtaButton` | `size` lg (padrão, largo, size/64) ou md (size/48, raio de controle, pastilha md − 2xs: ao lado de um Button lg). CTA principal de venda: largo, heading-6, `intent` success (padrão) ou brand, pastilha `surface/inverse` com a seta na ponta. Raio concêntrico: botão `RADIUS_TRACK` (lg), pastilha lg − xs, folga xs igual em cima, embaixo e na ponta (nada de disco redondo em moldura reta). Sombra md, altura size/64 = pastilha size/48 + 2 × xs. |
| `Rating` | Estrelas (icon/warning, meia estrela) + nota "4,9/5". Ícones `Star`/`StarHalf` (Figma). |

### Hooks
| | quando usar |
|---|---|
| `useModal(ref, onClose)` | Em todo painel com `aria-modal="true"`: Esc fecha, foco entra e fica preso, scroll de trás trava, foco volta a quem abriu. `CommandPalette` e a gaveta do menu usam. |
| `useModKey()` | `"⌘"` no Mac, `"Ctrl"` no resto — para `Kbd` de atalho com modificador não ensinar errado. |

### Armadilha: `max-w-<nome>`

Os apelidos de espaçamento do Santo (`sm`, `md`, `lg`, `xl`, `2xl`…) têm os mesmos
nomes que os containers do Tailwind. `max-w-lg` **resolve pela escala de
espaçamento** e vira 24px, não 32rem. Use `max-w-(--santo-dimension-container-lg)`.

`w-`, `h-` e `size-` com esses nomes são legítimos — ali a escala de espaçamento é
exatamente o que se quer (`size-2xl` = 40px para uma célula de calendário).

`npm run design:check` bloqueia a forma nomeada.

### Estilos que precisam de pseudo-elemento

`listbox.tsx` também traz o tipo `SelectOption`, que descreve as opções passadas
à `Select`.

`controls.css` — o navegador não expõe o miolo de `<input type="range">` por
classe utilitária. A classe `.santo-range` estiliza trilha e punho, tudo em token.
Também moram lá as **barras de rolagem** do sistema (regra global em `@layer base`:
calha de `space/8` com traços de `border/subtle` nas duas bordas, polegar de ~4px em `border/default` e hover em `border/strong`; o `scrollbar-width` fica só no
`@supports` do Firefox, porque no Chrome ele desliga o `::-webkit-scrollbar`), o
xadrez de amostra `santo-checker` e o utilitário `scrollbar-stable`
(`scrollbar-gutter: stable`) para container rolável que não deve pular quando a
barra aparece. Não duplique regra de barra de rolagem em outro arquivo.
Importada por `app/globals.css`.

### Ícones
`Icon.*` — grade de 24, traço 1.5, `currentColor`, tamanho vindo de
`dimension/icon/*`. A biblioteca Font Awesome que existe na página `Icones` do
Figma **não** faz parte dos tokens e não é usada aqui.

```tsx
import { Icon } from "@/lib/ui";
<Icon.Search size={16} />
```
