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

## Realce de linha

Hover/seleção de linha segue o raio aninhado (`surface.css`): `santo-row` (padrão,
INSET: pílula suave com raio `min(radius-sm, --santo-card-inner-radius)`) em Table,
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
| `Button` | `primary` para a ação principal da tela (uma por região), `secondary` para apoio (pílula elevada: raised + hairline + shadow-xs), `subtle` para preenchimento suave, `ghost` em barra de ferramentas, `danger` para destruir. Pílula por padrão; `pill={false}` = retângulo `radius/md` (botão colado em campo, grade densa). Tamanhos `sm`/`md`/`lg` casam com `dimension/size/32\|40\|48`. **`block` só para botão sozinho** — dois `block` na mesma linha flex se empurram e transbordam; use `className="flex-1"`. |
| `IconButton` | Botão só com ícone, círculo por padrão (`pill={false}` = quadrado). `label` é obrigatório — vira `aria-label` e `title`. |
| `buttonClass` | As classes do botão, para `<Link>`/`<a>` com cara de botão (`<button>` dentro de `<a>` é HTML inválido). Mora em `button-class.ts`, sem `"use client"`, para rodar em Server Component. |

### Entrada
| | quando usar |
|---|---|
| `Input` | Campo de uma linha. `variant` `well` (padrão: poço sunken em pílula, sem contorno — campo dentro de cartão) ou `outline` (contorno, raio md — formulário longo sobre o chão). `Select` e `Textarea` seguem o mesmo `variant`. `mono` para hex, medida e nome de token. `invalid` pinta a borda e liga `aria-invalid`. |
| `Textarea` | Texto longo. |
| `Select` | **Nunca o nativo.** O `<select>` do sistema abre o menu do SO, que ignora tema, tipografia e densidade — e não consegue mostrar cada opção com aparência própria, que é justamente o que faz um seletor de fontes ser útil. Aceita grupos, dica por opção, marcador à esquerda e `labelStyle`. Ganha campo de busca a partir de 12 opções. Painel em `position: fixed` para não ser recortado por ancestral com `overflow`. Teclado completo: setas, Home/End, Enter, Esc, Tab. |
| `Checkbox` / `Radio` / `Switch` | Chave quando o efeito é imediato; caixa quando existe um Salvar. Switch desabilitado continua mostrando o estado (ligado = brand/subtle). |

### Cor
| | quando usar |
|---|---|
| `Swatch` | Amostra estática, com xadrez atrás para alfa parcial. `round` para as bolinhas de resumo de marca. |
| `Color` | Módulo de conversão: `hexToRgb`, `rgbToHsv`, `contrastRatio`… Use `contrastRatio` para conferir par duvidoso. |

### Estrutura
| | quando usar |
|---|---|
| `Card` | Superfície com um assunto só, **profundidade por tom** (skill santo-ui-craft). `variant`: `raised` (padrão, nível 1, sombra ambiente `sm`, raio xl — o máximo de card no DS), `well` (poço nível 2 dentro de cartão, sunken, raio interno do pai), `inset` (bloco no tom do chão, raio do pai), `sunken` (chão que contém cartões), `outlined`, `dashed` (lugar vazio), `double` (moldura sunken raio xl + painel raised raio xl − recuo com `header`/`footer`). Sem borda 1px visível: contorno `santo-edge` (invisível no claro, hairline no escuro). Expõe `--santo-card-inner-radius` aos filhos. `padding` sm/md/lg; `padded={false}` quando o conteúdo encosta na borda. |
| `Divider` | Divisor de 1px no token de borda. `orientation="vertical"` entre itens de uma linha; `label` para o rótulo no meio ("ou continue com"). |
| `Disclosure` | Grupo colapsável. O gatilho é pastilha que abraça o texto, não faixa de ponta a ponta. Contador ou selo vão no slot `trailing` (ex.: `<Count>`). |
| `Segmented` | Escolha única entre 2 e 4 opções visíveis. Prefira a `Select` quando a comparação entre elas importa. |
| `TabBar` | Abas em pastilha. |
| `Chip` | Pílula clicável (filtro, aba de editor): tonal em repouso, brand/subtle ativa, size/32. |
| `Tag` / `Count` | Rótulo estático em pílula (size/24) / contador em pílula (size/20, `tone` neutral\|brand) à direita de rótulo, aba, nav, título. `dot` põe o ponto da cor da intenção (estado ao vivo). (No Figma, `Tag` é `Badge`.) |
| `Skeleton` | Formas neutras (`Bar`, `Block`, `Circle`, `Button`, `Field`, `Chip`, `Check`, `Row`, `Rule`, `Bars`, `Line`) para ilustrar a anatomia de um componente ou segurar o lugar enquanto carrega. Sem texto, ícone nem cor de marca. |
| `ThumbFrame` | Moldura de miniatura: poço 16:10 com grade sutil e cartão no centro, onde o `Skeleton` desenha. Só para a vitrine do índice de `/componentes` (ilustrações em `lib/thumbs`). |
| `Overline` | Rótulo em caixa alta acima de um número ou bloco. Um rótulo, não uma frase. **Dívida de token**: falta o text style overline no Figma (hoje caption-small + tracking/wide, em `text-class.ts`). |
| `Ring` | Anel de progresso (`value` 0–100, `size` sm/md/lg, `tone`, centro opcional; trilha em `neutral/subtle/active`). Ao lado de número grande, em tile, em linha de lista. |
| `Sparkline` | Linha de tendência sem eixo, cor do pai (`text-icon-brand`). Largura padrão por `size` (space/64·96·128) — cabe no slot `viz` do `Stat` sem embrulho; `fluid` ocupa a largura do pai. `area`, `dot`; `surface` (raised\|sunken\|page) é a cor do anel do ponto final — use `sunken` dentro de poço. **Dívida de token**: stopOpacity 0,24→0 do degradê é literal até o sync de opacity/* do Figma (PENDENCIA em sparkline.tsx). |
| `MiniBars` | Barrinhas compactas, sem transição de altura; `highlight` pinta uma na cor do pai, base em `neutral/subtle/active`. |
| `Fab` | Ação flutuante única da tela: círculo ou `extended`, `tone` brand/raised, `position` end/center/start (o bottom soma a safe-area do aparelho). |
| `RailNav` / `RailItem` | Trilho vertical de ícones (chão em cápsula, ativo em pílula elevada); o painel ao lado é `SidebarNav`. |
| `IconTile` | Ícone numa caixa tonal, sem contorno (quadrado: raio limitado ao raio interno do Card pai): `tone` subtle (poço, padrão) / outline (pílula elevada, sobre chão) / brand (acento, um por região); `shape` square/round; `size` md/lg. Marcador de lista, estado vazio, anexo, cabeçalho de cartão. |

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
| `NumberField` | Slider **e** campo numérico para o mesmo valor: arrasta quem está explorando, digita quem sabe o número. |
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
| `CardHeader` | Título + ação no canto. Título em `body-large-semibold` (18px): abaixo do título de seção (`heading-6`) e bem abaixo do número de KPI (`Stat`, `heading-4`). Não trunca, quebra linha. |
| `CardFooter` | Ações do cartão alinhadas à direita: no fim de um `Card`, ou no `footer` da moldura do `Card variant="double"`. |
| `Stat` | Número grande com rótulo e variação. |

### Navegação
| | quando usar |
|---|---|
| `Breadcrumb` | Trilha no topo de página que mora numa hierarquia. Último item é a página atual. Em página de primeiro nível, não use. |
| `LinkCard` | Cartão de entrada para uma seção: ícone (IconTile), título + `meta` na mesma linha (Count, Tag), atalhos com chevron. Para página índice. |
| `CommandPalette` | Busca por cima da página (⌘K) quando há destino demais para um menu. Ignora acento; teclado completo. Quem escuta o atalho é a página. |

### Dado
| | quando usar |
|---|---|
| `Table` | Tabela compacta: cabeçalho tonal em faixa pílula, linhas hairline, número à direita. Realce de linha INSET com raio aninhado (`santo-row`, padrão) ou `flush` para tabela que ocupa o Card inteiro (`padded={false}`: realce reto, contêiner recorta). `layout="fixed"` + `Column.width` (degrau de dimension/space) trava as colunas — tabelas empilhadas alinham e texto longo quebra. `selected` liga a coluna de seleção, `rowAction` a de ações. Coluna sem `render` lê a célula pronta em `row[key]` (`CellRow`) — assim a tabela monta num Server Component; seleção e ações exigem cliente. |
| `Pagination` | Contagem à esquerda, navegação à direita. |
| `Calendar` | Mês interativo: `mode` single\|range, `onSelect(dias, {month, year})`, setas pílula tonal, hoje com anel brand/subtle, escolhido em brand/solid, intervalo em faixa brand/subtle com pontas arredondadas, dias vizinhos em text/disabled. Teclado de grade (setas, Home/End, PageUp/PageDown) e aria-grid. `startWeekday`/`days` aceitos por compatibilidade (o mês sai de `month`/`year`). |
| `LineChart` / `AreaChart` / `BarChart` / `StackedAreaChart` | SVG puro, pintado por token. Sem biblioteca. |
| `AxisLabels` | Rótulos de eixo abaixo de um gráfico. |
| `KeyValue` | Linha rótulo × valor (resumo de pedido, detalhe de transação). Valor tabular à direita; `emphasis` no total. |

### Aplicação
| | quando usar |
|---|---|
| `SidebarNav` / `NavSection` / `NavItem` / `NavSub` / `NavUser` | Painel de navegação (ao lado do `RailNav`). Itens em pílula (size/36); ativo = pílula elevada (raised + shadow-xs) sobre o chão do painel (use num `Card variant="well"` ou região sunken); `emphasis` = acento brand. `count` à direita (número vira `Count`). Subitens em `NavSub` com `sub`: conectores de árvore. `NavUser` em pílula elevada. `href` vira link. |
| `ChatHeader` / `ChatBubble` / `ChatAttachment` / `ChatComposer` / `TypingIndicator` | Conversa. Bolha recebida em poço (`surface/sunken`), enviada em `brand/solid` + `text/on-brand`, raio xl com cauda xs; reações em pílula elevada. `ChatComposer`: campo-poço em pílula com anexar (ghost) e enviar (primary, círculo) inline, anel no conjunto. `avatarSrc` em ChatHeader. |
| `ActivityItem` / `Marker` | Feed "quem / o quê / quando", com pastilha de contexto. |
| `Ticker` | Faixa de cotações. |

### Código
| | quando usar |
|---|---|
| `CodeBlock` | Trecho para copiar (import, JSX, classe). Fundo `surface/sunken`: código é conteúdo embutido, não cartão. |
| `CopyButton` | Copia texto que a pessoa vai colar em outro lugar. O ícone vira um visto por um instante. |
| `CopyCode` | Nome curto em mono + copiar (var CSS, classe, token) em linha de tabela ou ficha. Sem valor, travessão. Raio `radius/xs` (code inline não é pílula). `truncate` corta com reticências em coluna estreita (title com o valor inteiro; copia o inteiro; botão não encolhe). |

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
