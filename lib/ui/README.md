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

- `<modulo>.meta.ts` — dado puro (`ComponentMeta`): nome, slug, camada (`tier`), categoria, frase
  de **quando usar**, arquivo de origem e par no Figma (`figma.name` + `nodeId`).
  Sem `figma` = só existe no código, divergência a resolver.
- `<modulo>.demo.tsx` — demos vivas (`DemoMap`): `playground` com controles ao
  vivo + blocos `Básico`, `Variantes`, `Tamanhos`, `Estados`…
- `registry.ts` junta os metas (serve a Server e Client Components);
  `demos.ts` junta as demos (só cliente). Tipos em `registry.types.ts`.

Componente novo: crie os dois arquivos e importe-os em `registry.ts` e `demos.ts`.

**Diretriz de demo (Pedro):** variante numerosa vira SELETOR no playground (um
exemplo por vez), não grade exaustiva. Ex.: o Avatar escolhe pessoa e tamanho.
Acervo único: `demo-people.ts` + `public/brand` (Pedro, Érica, Sena, Leo e Clara).
`portrait(pessoa, tamanho)` fornece `name`, `src`, `alt` e `avifSrc` quando
disponível; use `<Avatar {...portrait("leo", 40)} size={40} />`. Leo e Clara têm
AVIF preferido e WebP de fallback em 48/96 px, sem metadados. Esses tamanhos
cobrem os avatares de 24/32/40 px em telas 2×; os PNGs originais não vão ao repo.
Clara usa um crop de origem que centraliza seu rosto antes do redimensionamento,
igual nos dois formatos, sem ajustes de CSS espalhados pelos consumidores.
`photo()` continua compatível para quem precisa apenas da URL WebP.
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

## Aninhamento

Mecanismo único para a boa relação entre raio e recuo (Pedro, 2026-10-21), em
`lib/ui/use-nest.tsx` (hooks) e `lib/ui/nest.tsx` (componente `Nest`, página
`/componentes/nest`):

- Moldura = **um recuo** (`inset`, token de espaço) nos quatro lados **e entre as
  faixas** (cabeçalho, painel, rodapé). Com fio (`santo-edge`), `edge` soma o fio.
- Raio do filho = `nestInner(externo, recuo)` (`lib/ui/radius.ts`), **externo sempre
  maior** (Pedro; decisão do maestro, 2026-10-21): em moldura justa (recuo < externo),
  concêntrico, `max(externo − recuo, radius/xs)`; em moldura folgada, `min(controle,
  degrau abaixo do externo)` — 12 → 8, 8 → 4, 4 → 0. Moldura que nasce do filho
  (`child`/`contentRadius`, `sunken`) também não passa do que a moldura de cima oferece.
- `useNest({ inset, radius?, child?, edge? })` devolve `outer`, `inner` e o
  `style` (`borderRadius` + `--santo-inner-radius`); `NestScope` passa o `inner`
  aos componentes de dentro; `useNestRadius()` lê o que a moldura de cima oferece.
  `child` faz a moldura nascer do filho (externo = filho + recuo).
- Elemento solto dentro da moldura: classe `santo-nested`. Molduras CSS sem
  componente: `santo-nest` + `--santo-nest-inset`.
- Profundidade por contexto React: cada nível recalcula com `calc()` literal.
- Já usam: Card (o `padding` é o recuo e o gap entre faixas é o mesmo token;
  dentro de `sunken` vira `lg`, a moldura `sunken` nasce dele; `contentRadius`),
  Card double (cabeçalho e rodapé no recuo do painel), CommandPalette, Select,
  FontPicker, Segmented/TabBar, EditorFrame, LinkCard com `media`, ThumbFrame,
  gaveta do menu e molduras do Estúdio.
- `--santo-card-inner-radius` virou `--santo-inner-radius`; `santo-card-scope` e
  `--santo-card-nested` saíram (o contexto substitui).
- Cobrança: `scripts/check-nest.mjs` (etapa `nest` do `npm run check`) e
  `npm run nest:probe` no navegador.

## Realce de linha

Hover/seleção de linha segue o raio aninhado (`surface.css`): `santo-row` (padrão,
INSET: pastilha suave com raio `min(radius-sm, --santo-inner-radius)`) em Table,
ListRow `interactive`, opções de Select e ⌘K; `santo-row-flush` (Table `flush`) para
lista que ocupa o Card inteiro. Nunca `hover:bg-*` reto numa linha dentro de card.

## Tema

O padrão do DS é o **tema claro**. Sem escolha salva, o `<html>` nasce com
`data-theme="light"` (`THEME_SCRIPT` no `<head>`, antes da primeira pintura), e o
alternador (`app/_components/theme-toggle.tsx`) mostra **Claro | Auto | Escuro** com Claro
selecionado. `santo-theme` no `localStorage` guarda `light`, `dark` ou `system`. Só o
Auto escolhido tira o atributo; aí o escuro segue `prefers-color-scheme`, porque o
`tokens.css` aplica o escuro na media query com a guarda `:root:not([data-theme='light'])`
e em `:root[data-theme='dark']`. O preview do Estúdio é claro por padrão (`?tema=light`).

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

A camada fica no campo obrigatório `tier` de cada `<modulo>.meta.ts`:

- **Primitivos** (`primitivo`): blocos atômicos e genéricos, sem papel de produto. Não importam outro componente da lib além de Icon; conteúdo externo entra por slot.
- **Semânticos** (`semantico`): navegação, dados, listas, documentação e composições com significado de produto ou aplicação.
- **Marketing** (`marketing`): peças cujo uso principal é landing, conversão, materiais ou apresentação comercial.

Sidebar, índice e contexto leem essa mesma classificação. O inventário abaixo é
reagrupado automaticamente pelo `scripts/build-contexto.mjs` (`npm run contexto`,
`predev` e `prebuild`); as notas de uso são preservadas. Novos componentes recebem
a descrição do meta. Categorias continuam sendo um segundo eixo dentro da camada.

<!-- ui-inventory:start -->

## Primitivos

32 componentes.

| Componente | Quando usar |
|---|---|
| `Avatar` | Pessoa em círculo: foto (`src`, `alt`), AVIF opcional (`avifSrc`) com fallback WebP e iniciais se ambas falharem. Tamanhos 24/32/40; `portrait()` fornece dados do acervo. |
| `AvatarGroup` | Avatares sobrepostos com anel da cor da superfície. |
| `Button` | `primary` para a ação principal da tela (uma por região), `secondary` para apoio (pastilha elevada: raised + hairline + shadow-xs), `subtle` para preenchimento suave, `ghost` em barra de ferramentas, `danger` para destruir. Raio de controle (`RADIUS_CONTROL`, radius/md); `pill` sem efeito. Tamanhos `sm`/`md`/`lg` casam com `dimension/size/32\|40\|48`. **`block` só para botão sozinho** — dois `block` na mesma linha flex se empurram e transbordam; use `className="flex-1"`. |
| `Card` | Superfície com um assunto só, **profundidade por tom** (skill santo-ui-craft). `variant`: `raised` (padrão, nível 1, sombra ambiente `sm`, raio xl — o máximo de card no DS), `sunken` (moldura que contém cartões: o cartão filho vira `lg` e a moldura = `lg` + padding), `well`/`inset` (**grupo sem caixa** — princípio do Pedro, nada de box em volta de tile, Stat, KeyValue ou gráfico: só empilha com o gap; poço de verdade só em campo e código), `outlined`, `dashed` (lugar vazio), `double` (painel raised `lg` + moldura sunken = painel + recuo + fio, com `header`/`footer`; `footerFlush` põe o rodapé na largura e no raio do painel — bloco de código sob preview, como nos demos de /componentes). Sem borda 1px visível: contorno `santo-edge` (invisível no claro, hairline no escuro). Expõe `--santo-inner-radius` = max(controle, raio − padding) aos filhos. `padding` sm/md/lg; `padded={false}` quando o conteúdo encosta na borda. |
| `CardFooter` | Ações do cartão alinhadas à direita: no fim de um `Card`, ou no `footer` da moldura do `Card variant="double"`. |
| `CardGrid` | **Toda** fileira de cartões ou peças irmãs — tela de `app/` não monta `grid` inline (`lib:check`, regra C). **Masonry por padrão** (princípio 4 do Pedro, sem margem morta): linhas de `space/3xs` e cada filho ocupa as linhas da sua altura medida (ResizeObserver) — cartões empilham por coluna, sem vão, na ordem do DOM (esquerda → direita, como o foco anda); `col-span-*` no filho continua valendo. **Limitação**: precisa de JS — antes de hidratar a grade é a comum, alinhada ao topo; filho que ocupa todas as colunas espera a coluna mais alta. `masonry={false}` = **grade fixa**: colunas iguais, uma calha só, topos alinhados por fileira e `col-span-*` previsível — use em composição com spans (painel de app, preview de marca) e em peças de altura igual (miniaturas, amostras, demos); masonry com span misturado desalinha. `stretch` (só com a grade fixa) = fileira na **mesma altura**, para índice de cartões de navegação (`LinkCard`): a lista de links do cartão curto cresce e preenche, sem buraco. Regra: **índice/navegação → grade fixa + stretch; conteúdo heterogêneo → masonry**. **Grade de dashboard** (blocagem por fileira): uma `CardGrid masonry={false} stretch` POR FILEIRA, irmãos de conteúdo equivalente — KPIs `{ sm: 2, xl: 4 }` (Stat do mesmo molde), operação `{ md: 2, xl: 3 }` (o terceiro com `md:col-span-2`, para a fileira de 2 fechar), tabela/lista sempre em largura total; cada cartão da fileira com a ação ancorada no fim. Exemplo vivo: /exemplos#dashboard. `columns` por breakpoint (`{ md: 2, "2xl": 3 }`, base 1) ou `minItem` (auto-fill/`autoFit` com largura mínima de token); `gap` sm\|md\|lg\|2xl. **Dívida de paridade**: sem par no Figma — lá vira auto-layout wrap alinhado ao topo. |
| `CardHeader` | Título + ação no canto. Título em `body-large-semibold` (18px): abaixo do título de seção (`heading-6`) e abaixo do número de KPI (`Stat` md, `heading-5`). Não trunca, quebra linha. |
| `Checkbox` | Chave quando o efeito é imediato; caixa quando existe um Salvar. Switch desabilitado continua mostrando o estado (ligado = brand/subtle). Switch concêntrico: trilho 24 × 40 no raio de controle com folga `space/2xs` nos quatro lados; punho 16 em pastilha (controle − 2xs = `radius/xs`); curso 16 = largura do punho. |
| `Chip` | Pastilha clicável com raio de controle (filtro, aba de editor): tonal em repouso, brand/subtle ativa, size/32. |
| `Color` | Módulo de conversão: `hexToRgb`, `rgbToHsv`, `contrastRatio`… Use `contrastRatio` para conferir par duvidoso. |
| `Count` | Rótulo estático em cápsula (size/24) / contador em cápsula (size/20 — badge e tag são a exceção que pode ser 100% arredondada; `tone` neutral\|brand) à direita de rótulo, aba, nav, título. `dot` põe o ponto da cor da intenção (estado ao vivo). (No Figma, `Tag` é `Badge`.) |
| `Disclosure` | Grupo colapsável. O padrão `pill` abraça o texto. `nav` compartilha a linha de destino de `NavItem`, com ícone ou chevron no slot de 16, `leading` para ícone e contador em `trailing` dentro do botão. Usa-se em pastas de AppSidebar. Contador/selo chega por slot (ex.: `<Count>`). |
| `Divider` | Divisor de 1px no token de borda. `orientation="vertical"` entre itens de uma linha; `label` para o rótulo no meio ("ou continue com"). |
| `Fab` | Ação flutuante única da tela: círculo ou `extended`, `tone` brand/raised, `position` end/center/start (o bottom soma a safe-area do aparelho). |
| `Icon` | Só da página Icones do Figma (Font Awesome, exportada para lib/icons). Cor por currentColor; tamanho de dimension/icon/*. Ícone novo: slug em lib/icons/needed.txt, nunca desenho à mão. |
| `IconButton` | Botão só com ícone, círculo por padrão (`pill={false}` = quadrado). `label` é obrigatório — vira `aria-label` e `title`. |
| `IconTile` | Ícone num **slot** de tamanho de token (size/40 `md`, size/48 `lg`) que alinha com Avatar e texto: marcador de linha de lista, estado vazio, anexo, cabeçalho de cartão. **Padrão `plain`: sem caixa** (regra do Pedro: nada de caixa em volta de componente dentro de cartão). Caixa tonal só quando a cor carrega significado: `success`/`danger` (entrada/saída, ok/erro — `TransactionRow`), `brand` (acento, um por região: estado vazio, destaque), `subtle` (poço: grade de ícones, alvo visual), `outline` (pastilha elevada sobre chão/poço: anexo). Com caixa: raio interno do Card pai (raio de controle) ou `shape="round"`. |
| `Input` | Campo de uma linha. `variant` `well` (padrão: poço sunken com raio de controle, sem contorno — campo dentro de cartão) ou `outline` (contorno, mesmo raio de controle — formulário longo sobre o chão). `Select` e `Textarea` seguem o mesmo `variant`. `mono` para hex, medida e nome de token. `invalid` pinta a borda e liga `aria-invalid`. |
| `Kbd` | Tecla de atalho, ao lado de onde o atalho age. |
| `Nest` | Moldura aninhada: UM recuo (token de espaço) igual nos quatro lados e entre as faixas, e o raio do filho calculado sozinho — externo − recuo (piso radius/xs; em moldura folgada, o de controle). Um Nest dentro de outro recalcula no próprio nível. Card, painéis do Select e da paleta, trilho do Segmented, EditorFrame e as miniaturas usam o mesmo mecanismo (useNest). |
| `Overline` | Rótulo em caixa alta acima de um número ou bloco. Um rótulo, não uma frase. **Dívida de token**: falta o text style overline no Figma (hoje caption-small + tracking/wide, em `text-class.ts`). |
| `Progress` | Quanto de uma meta já foi cumprido. Sem teto, use `Stat`. `intent` muda o preenchimento. |
| `Radio` | Chave quando o efeito é imediato; caixa quando existe um Salvar. Switch desabilitado continua mostrando o estado (ligado = brand/subtle). Switch concêntrico: trilho 24 × 40 no raio de controle com folga `space/2xs` nos quatro lados; punho 16 em pastilha (controle − 2xs = `radius/xs`); curso 16 = largura do punho. |
| `Ring` | Anel de progresso (`value` 0–100, `size` sm/md/lg, `tone`, centro opcional; trilha em `neutral/subtle/active`). Ao lado de número grande, em tile, em linha de lista. **Interativo por padrão**: hover/foco (uma parada de Tab) engrossa o arco um degrau (`border/thick`) e abre tooltip com rótulo e valor (`detail` troca o "72%"); `interactive={false}` em anel decorativo. |
| `SaveIndicator` | Estado do salvamento automático no cabeçalho de um editor: ícone + micro-texto (`salvo`, `salvando` com pulso, `erro` em text/danger), caption medium, aria-live polite. Sem botão nem explicação: o detalhe do erro mora onde a pessoa corrige. **Dívida de paridade**: sem par no Figma. |
| `Segmented` | Escolha única entre 2 e 4 opções visíveis. Prefira a `Select` quando a comparação entre elas importa. Trilho com padding uniforme `space/2xs` e raio calculado como `radius/md + space/2xs`; os itens usam `RADIUS_CONTROL`, inclusive só ícones, em sm/md e `block`. Não depende de `radius/lg` fixo. `block` = largura do pai com abas iguais (irmão de campo/botão de largura total); nunca passa da largura do pai. |
| `Select` | **Nunca o nativo.** O `<select>` do sistema abre o menu do SO, que ignora tema, tipografia e densidade — e não consegue mostrar cada opção com aparência própria, que é justamente o que faz um seletor de fontes ser útil. Aceita grupos, dica por opção, marcador à esquerda e `labelStyle`. Ganha campo de busca a partir de 12 opções. Painel em `position: fixed` para não ser recortado por ancestral com `overflow`. Teclado completo: setas, Home/End, Enter, Esc, Tab.  `variant="compact"` (com `size="sm"`): gatilho de topbar em pastilha sunken (raio de controle); painel com largura mínima `space/192`, alinhado pela direita quando faltaria tela; abaixo de `sm` vira quadrado de controle só com o `leading` (rótulo sr-only, chevron oculto), para caber na topbar do celular. |
| `Skeleton` | Formas neutras (`Bar`, `Block`, `Circle`, `Button`, `Field`, `Chip`, `Check`, `Row`, `Rule`, `Bars`, `Line`) para ilustrar a anatomia de um componente ou segurar o lugar enquanto carrega. Sem texto, ícone nem cor de marca. `Block track` é opt-in para trilhos de miniatura: padding `space/3xs` uniforme e raio `radius/xs + space/3xs`, concêntrico ao filho `xs`. |
| `Swatch` | Amostra estática, com xadrez atrás para alfa parcial. `round` para as bolinhas de resumo de marca. `size` xs/sm/md e `lg` (size/48, amostra de destaque da BrandCard). |
| `Switch` | Chave quando o efeito é imediato; caixa quando existe um Salvar. Switch desabilitado continua mostrando o estado (ligado = brand/subtle). Switch concêntrico: trilho 24 × 40 no raio de controle com folga `space/2xs` nos quatro lados; punho 16 em pastilha (controle − 2xs = `radius/xs`); curso 16 = largura do punho.  **Dois lados** (`offLabel` + `onLabel`, `offTone`/`onTone`: `neutral`, `brand`, `accent`). Com `offIcon` + `onIcon`, **só ícones e redondo** (exceção do Pedro, 2026-10-21: trilho em cápsula e punho circular): trilho neutro (`surface/sunken`) com um ícone fixo em cada ponta, em tom neutro; o punho circular desliza para o lado ativo **na cor do lado** e leva o ícone em on-color (`text/on-brand`, `text/on-accent`); os nomes ficam no `aria-label` e no `title` (topbar: Documentação = book em brand, Estúdio = sliders em accent). Com `offHref` + `onHref` (trocar de área), vira `<nav>` com dois links — mesmo visual, `aria-current` no ativo, Cmd/Ctrl+clique abre em nova aba. Foco: `santo-focus-solid` (folga na cor da página + anel `border/focus`), porque o trilho não tem borda para acender. Sem ícones, rótulo de texto de cada lado com o trilho na cor do lado (`compact`: rótulos só para leitor de tela abaixo de `sm`). |
| `Tag` | Rótulo estático em cápsula (size/24) / contador em cápsula (size/20 — badge e tag são a exceção que pode ser 100% arredondada; `tone` neutral\|brand) à direita de rótulo, aba, nav, título. `dot` põe o ponto da cor da intenção (estado ao vivo). (No Figma, `Tag` é `Badge`.) |
| `Textarea` | Texto longo. |

## Semânticos

83 componentes.

| Componente | Quando usar |
|---|---|
| `ActivityCard` | Feed com abas que filtram por `kind`, itens quem/o quê/quando com pastilha, ação em FAB. |
| `ActivityItem` | Feed "quem / o quê / quando", com marcador de contexto (Marker = tag em cápsula com contorno leve). |
| `AppFrame` | Tela de app dentro de página: chão rebaixado, trilho de ícones, painel de navegação em árvore opcional, conteúdo `stack` ou `split`. |
| `AppSidebar` | Navegação de app ou documentação com `SearchTrigger` opcional e grupos/subgrupos recolhíveis (`Disclosure` + `NavItem`), abertos por padrão. `groups` é recursivo, sem limite fixo de profundidade: cada pasta usa `Disclosure variant="nav"`, filhos em `NavSub branches`, com haste/curva no centro do ícone ou chevron. Linhas de pasta/destino compartilham altura `size/36`, ícone `icon/16`, padding `space/sm` e recuo `space/xl`; os cotovelos não dependem da altura da subárvore. `icon` e `count` são opcionais em pastas; itens também aceitam `count`. As três camadas e seus contadores vêm do registry. Grupo sem título mantém itens soltos; título é um botão com chevron, `aria-expanded`, `aria-controls` e teclado nativo. A rota reabre o subgrupo ativo e seus ancestrais; seu item permanece visível mesmo ao recolher qualquer ancestral. Estado local por instância, preservado durante a navegação. Na raiz, pastas recolhidas e Docs home têm `space/xs` (8 px) entre linhas; após uma árvore visível, `xs + xs` (16 px) antes da próxima raiz. Os ramos internos mantêm `space/3xs`. `showRail` é `true` por padrão: `RailNav` com expandir todos e atalhos para grupos com `railIcon`; **`showRail={false}`** mostra só o painel, sem espaço reservado ao trilho, e é usado no site inteiro, inclusive na gaveta móvel. Quem rola é o pai (aside sticky, gaveta); o pai também decide a rota e o item ativo. **`brand`** põe a marca (logo com link para a home) na faixa do topo, no lugar da busca (o site de docs levou a busca para a topbar). **`collapsed` + `onCollapsedChange`** ligam o botão de compactar a sidebar inteira (`angles-left`/`angles-right` do Figma): compactada, vira trilho de ícones (`RailNav`, um `RailItem` por raiz com ícone; a pasta expande e abre o grupo), com `brandMark` (logo reduzida) no topo; o pai persiste (no site, `localStorage` `santo-sidebar`) e anima a largura com os tokens de motion. **`foldAll`** põe ao lado da busca um `IconButton` ghost (mesma altura `size/40` da busca em `size="md"`) que recolhe todas as pastas quando alguma está aberta e expande todas quando todas estão fechadas (`CollapseAll`/`ExpandAll`, ícones `arrows-to-line`/`arrows-from-line` do Figma; rótulo "Recolher todas as pastas"/"Expandir todas as pastas"). **`pinned`** fixa essa linha no topo do pai que rola (`santo-pinned-head`): fundo = `surface` do pai (`page` padrão, `sunken`, `raised`) e degradê de tom por `space/sm` embaixo, sem linha; ela assume o respiro de cima (`space/sm`), então o pai não leva padding no topo. Playground e blocos **Árvore aninhada / Recolher e expandir tudo / Com trilho / Sem trilho** em `/componentes/app-sidebar`. **Dívida de paridade**: sem par no Figma. |
| `AreaChart` | Volume ao longo do tempo com lavagem `bg/<tom>/subtle/default` (sem opacidade solta); `stacked` = partes de um total. Eixo em zero. |
| `AxisLabels` | Eixo `x` (`edge` linha/área, `band` barra) ou `y` (ticks de cima para baixo). Cada rótulo centrado no seu ponto, pontas inclusive; eixo longo amostrado com passo uniforme (`max`, sem forçar o último); `active` acende o x em foco e esconde os vizinhos a menos de um passo. |
| `BarChart` | `vertical` (períodos) ou `horizontal` (categorias, valor na ponta); várias séries `grouped` ou `stacked`; `highlight` acende uma e recua o resto. Espessura ≤ space/24, ponta xs, base reta, vão space/3xs. A faixa é o alvo. |
| `BrandCard` | Ficha de identidade (bloco) em **uma linha compacta**: `BrandLogo` reduzida (`variant="mark"`, 28) + Tag Padrão (o nome não se repete: vai no `aria-label`; a logo tem alt) e, separadas por `Divider` vertical, as células Tipografia ("Aa" heading-6 + família), Cor de marca (Swatch md + hex), Neutros (claro e escuro lado a lado + hex) e Raio (amostra size/28 + valor). Respiro lateral space/sm além do padding do cartão (a logo não encosta na borda; simétrico à direita). Overline em cada célula, centro vertical, gap constante, sem caixa. **Grade fixa** a partir de md: logo (variante `mark` em 24 quando a marca tem; senão a completa em 20 — mesmo peso visual) space/224 | tipografia space/160 | cor space/128 | neutros space/192 | raio space/96 — iguais em toda ficha, então divisores e rótulos alinham entre fichas empilhadas; texto longo trunca com reticências e `title`. Abaixo de md: grade de 2 por linha, sem divisores. `data-brand` no cartão. **Sistema do Estúdio** (sem `brand`): `mark` no lugar da logo (o nome na fonte de título dele), `meta` embaixo (slug · data), `fontStack` no "Aa", amostras pelo `value` (sem `cssVar`), `href` vira link esticado e `actions` (IconButtons) por cima: somem até hover/foco a partir de md, sempre à vista no toque e abaixo de md; `actionsVisible` segura durante confirmação. Com ações o gap cai para sm (cabe sem roubar a coluna da marca). Toda linha de conteúdo tem altura mínima de controle md. |
| `BrandLogo` | Logo oficial de uma marca do DS pelo id (santo, vtsd): topo de app e ficha da identidade. Variante completa ou reduzida (mark); troca a versão clara/escura pelo tema, sem JS. |
| `BrandSwitch` | Seletor de marca ao lado do seletor de tema, em **dropdown compacto** (`Select variant="compact" size="sm"`, altura `control/height/sm`): gatilho em pastilha com o ponto na cor da marca ativa (`Swatch` dentro de `data-brand`), nome e chevron; painel com uma linha por marca (ponto, nome, check na ativa), teclado e ARIA do `Select`. Abaixo de `sm`, o gatilho fica só com o ponto (quadrado de controle) e o Auto do alternador de tema vira ícone, para a topbar caber em 375. O valor vai para `data-brand` (mesmas vars `--santo-*`, valores da marca — tokens.css do Compasso). Controlado; quem persiste é o pai (na doc: `app/_components/brand-control.tsx` + `BRAND_SCRIPT` no `<head>`, chave `santo-brand`, sem atributo = marca padrão). Com uma marca só, não aparece. `data-brand` vale em qualquer contêiner (preview de identidade); `data-theme` só na raiz. |
| `Breadcrumb` | Trilha no topo de página que mora numa hierarquia. Último item é a página atual. Em página de primeiro nível, não use. |
| `BreakdownCard` | Partes de um total: `kind="bars"` (barras horizontais por categoria, valor na ponta) ou `kind="donut"` (até 5 fatias, total no centro, legenda com a parte). Alimentado por dado (`BreakdownItem`), hover e teclado do gráfico. |
| `Calendar` | Mês interativo: `mode` single\|range, `onSelect(dias, {month, year})`, setas pastilha tonal, hoje com anel brand/subtle, escolhido em brand/solid, intervalo em faixa brand/subtle com pontas arredondadas, dias vizinhos em text/disabled. Teclado de grade (setas, Home/End, PageUp/PageDown) e aria-grid. `startWeekday`/`days` aceitos por compatibilidade (o mês sai de `month`/`year`). |
| `CalendarCard` | Mês como bloco de painel; `mode="range"` para intervalo. |
| `ChartCard` | Série principal do painel: título + total + períodos e o gráfico (`kind` area/line/bar, `stacked`) direto no cartão, sem poço. `range`/`onRangeChange` = período **controlado** de fora (filtro do `DashboardHeader`): o cartão segue o valor e não mostra o próprio Segmented. |
| `ChartGrid` | Grade atrás da plotagem: hairline `border/subtle` igualmente espaçada (justify-between, casa com os ticks), zero em `border/default`, nunca tracejada. |
| `ChartLegend` | Qual cor é qual série: obrigatória com 2+ séries, nunca com uma. `row` acima do gráfico; `column` ao lado do donut com valores; `onActiveChange` destaca a série (as outras recuam para `muted`). |
| `ChartTooltip` | Leitura do x em foco com **todas** as séries: valor em destaque, nome depois, chave (traço ou quadradinho) na cor; `x`/`y` em % posicionam; no alto da plotagem a bolha fica ao lado da guia com folga `space/sm` (nunca cobre o ponto ativo), acima de micro-viz fica centrada. Bolha raised + `shadow-lg` + `santo-edge`. |
| `ChatAttachment` | Conversa. Bolha recebida em poço (`surface/sunken`), enviada em `brand/solid` + `text/on-brand`, raio xl com cauda xs; reações em pastilha elevada. `ChatComposer`: campo-poço em pastilha com anexar (ghost) e enviar (primary, círculo) inline, anel no conjunto. `avatarSrc` em ChatHeader. |
| `ChatBubble` | Conversa. Bolha recebida em poço (`surface/sunken`), enviada em `brand/solid` + `text/on-brand`, raio xl com cauda xs; reações em pastilha elevada. `ChatComposer`: campo-poço em pastilha com anexar (ghost) e enviar (primary, círculo) inline, anel no conjunto. `avatarSrc` em ChatHeader. |
| `ChatCard` | Conversa: pessoa e status, ações ghost, bolhas (texto ou anexo), digitando, composer que acrescenta à lista. |
| `ChatComposer` | Conversa. Bolha recebida em poço (`surface/sunken`), enviada em `brand/solid` + `text/on-brand`, raio xl com cauda xs; reações em pastilha elevada. `ChatComposer`: campo-poço em pastilha com anexar (ghost) e enviar (primary, círculo) inline, anel no conjunto. `avatarSrc` em ChatHeader. |
| `ChatHeader` | Conversa. Bolha recebida em poço (`surface/sunken`), enviada em `brand/solid` + `text/on-brand`, raio xl com cauda xs; reações em pastilha elevada. `ChatComposer`: campo-poço em pastilha com anexar (ghost) e enviar (primary, círculo) inline, anel no conjunto. `avatarSrc` em ChatHeader. |
| `CodeBlock` | Trecho para copiar (import, JSX, classe). Fundo `surface/sunken`: código é conteúdo embutido, não cartão. |
| `ColorPicker` | Seletor completo: área saturação × brilho, matiz, alfa, conta-gotas e campos que alternam HEX / RGB / HSL. Setas ajustam a área 2D. |
| `ColorRow` | A linha do editor: amostra, rótulo de largura fixa, campo e ações. A largura fixa é o que alinha uma coluna longa. |
| `CommandPalette` | Busca por cima da página (⌘K) quando há destino demais para um menu. Ignora acento; teclado completo. Quem escuta o atalho é a página. |
| `CopyButton` | Copia texto que a pessoa vai colar em outro lugar. O ícone vira um visto por um instante. |
| `CopyCode` | Nome curto em mono + copiar (var CSS, classe, token) em linha de tabela ou ficha. Sem valor, travessão. Raio `radius/xs` (code inline não é pastilha). `truncate` corta com reticências em coluna estreita (title com o valor inteiro; copia o inteiro; botão não encolhe). |
| `DailyGoalCard` | Alvo curto em degraus: menos · anel com valor · mais, teto em overline, ação. |
| `DashboardHeader` | Cabeçalho de dashboard (bloco): título heading-4 + meta, filtro de período e ação primária à direita, alinhado à grade. **Por dado** (a tela de exemplo só compõe): `periods`/`period`/`onPeriodChange` desenham o Segmented; `primaryAction` (`{ label, icon, onClick }`) desenha o Button primário. Slots `filter`/`action` para outra peça. Abaixo de md, os controles descem. |
| `DonutChart` | Partes de um todo (≤ 5 fatias): total no meio (escala de número do DS: sm body, md heading-6, lg heading-5 — use formato compacto, ex. "24,3 mil") (em foco, a fatia), legenda `column` com a parte de cada uma; `pie` = disco cheio. Fatia em foco engorda `border/heavy`; todas mantêm o tom (ordem `CHART_TONES`); ponteiro no furo volta o centro ao total; legenda `w-fit`. |
| `DownloadList` | Arquivos para baixar (contexto do sistema, materiais): item `featured` (o pacote completo) no topo com IconTile brand e Button primário "Baixar"; depois um arquivo por linha — ícone de documento, título + nome do arquivo em mono, tamanho (`formatBytes`) e IconButton ghost de download (`<a download>`). Lista enxuta: `description`, se houver, é uma linha de caption. Com `viewHref` a linha inteira abre a página de leitura e o botão continua baixando. Hairline entre linhas, sem caixa. Alimentada por dado. |
| `EditorFrame` | Bancada de edição em três painéis: navegação no chão sunken à esquerda, documento vivo no centro e ajustes à direita (space/384), cada um rolando por conta própria. Abaixo de lg a navegação vira `mobileNav` no topo do centro; abaixo de xl os ajustes descem para baixo do documento. O pai dá a altura. Usada pelo Estúdio. **Dívida de paridade**: sem par no Figma. |
| `EmptyState` | Lugar vazio com caminho: ícone, título, ação. Sem texto de apoio. |
| `Field` | Rótulo + campo + apoio, com o espaçamento certo. `hint` some quando há `error`. |
| `FontPicker` | Seletor de família para catálogo grande (índice do Google Fonts, ~1.800 famílias): busca, filtro por categoria em Chips, Curadoria no topo e lista VIRTUAL (só as linhas visíveis no DOM; a altura da linha é medida do token size/36). Cada opção aparece na própria fonte, carregada sob demanda por `previewHref` (só o peso regular, cache por página). Gatilho = poço do Select, altura control-height. Teclado completo; painel em position: fixed. Use no lugar do Select quando a pessoa escolhe pelo desenho da letra. **Dívida de paridade**: sem par no Figma. |
| `GoalsCard` | Metas com teto (reserva, viagem): anel, nome em overline, guardado e alvo; metas separadas por Divider; `onAdd` liga "Nova meta". |
| `InvestCard` | Ordem com valor e modalidade: campo-poço, tipo em Segmented, resumo, ação primária. |
| `KeyValue` | Linha rótulo × valor (resumo de pedido, detalhe de transação). Valor tabular à direita; `emphasis` no total. |
| `LimitCard` | Teto configurável: número grande, NumberField, moeda em Segmented, nota opcional. |
| `LineChart` | Tendência ao longo do tempo, 1 a 4 séries (`values` ou `series` com `tone`). Guia vertical encaixa no ponto mais próximo + tooltip com todas as séries; ponto final na série principal; `surface` para o anel do ponto. |
| `LinkCard` | Cartão de entrada para uma seção: ícone sem caixa alinhado ao título, título + `meta` na mesma linha (Count, Tag), atalhos com chevron. Para página índice. |
| `ListRow` | Linha de lista: marcador (`IconTile`/`Avatar`), título, metadado curto, algo à direita; `divider` separa. |
| `MarkdownView` | Documento em Markdown (contexto do sistema, guias) desenhado com a lib: títulos `santo-*` com âncora (`markdownHeadings` alimenta o `TableOfContents`), parágrafo body-small, listas aninhadas, `Table`, código cercado em `CodeBlock`, citação em poço (`surface/sunken`) e `Divider`. Server component sem dependência; não é CommonMark completo (HTML cru não passa, comentário some). |
| `Marker` | Feed "quem / o quê / quando", com marcador de contexto (Marker = tag em cápsula com contorno leve). |
| `MemberRow` | Pessoa com papel (Select) / equipe com avatares no canto / link para copiar + quem tem acesso. |
| `MiniBars` | Barrinhas compactas, sem transição de altura; `highlight` pinta uma na cor do pai, base em `neutral/subtle/active`. Com `label` vira interativa: a barra sob o ponteiro/setas acende, tooltip com valor + `labels[i]`. |
| `NavItem` | Painel de navegação (ao lado do `RailNav`). Itens com raio de controle (size/36); ativo = pastilha elevada (raised + shadow-xs) sobre o chão do painel (use num `Card variant="well"` ou região sunken); `emphasis` = acento brand. `count` à direita (número vira `Count`). Subitens em `NavSub` com `sub`: conectores de árvore. `NavSub branches` desenha os mesmos ramos para folhas e pastas recursivas; nesse modo não use também `NavItem sub`. `NavUser` em pastilha elevada. `href` vira link. |
| `NavSection` | Painel de navegação (ao lado do `RailNav`). Itens com raio de controle (size/36); ativo = pastilha elevada (raised + shadow-xs) sobre o chão do painel (use num `Card variant="well"` ou região sunken); `emphasis` = acento brand. `count` à direita (número vira `Count`). Subitens em `NavSub` com `sub`: conectores de árvore. `NavSub branches` desenha os mesmos ramos para folhas e pastas recursivas; nesse modo não use também `NavItem sub`. `NavUser` em pastilha elevada. `href` vira link. |
| `NavSub` | Painel de navegação (ao lado do `RailNav`). Itens com raio de controle (size/36); ativo = pastilha elevada (raised + shadow-xs) sobre o chão do painel (use num `Card variant="well"` ou região sunken); `emphasis` = acento brand. `count` à direita (número vira `Count`). Subitens em `NavSub` com `sub`: conectores de árvore. `NavSub branches` desenha os mesmos ramos para folhas e pastas recursivas; nesse modo não use também `NavItem sub`. `NavUser` em pastilha elevada. `href` vira link. |
| `NavUser` | Painel de navegação (ao lado do `RailNav`). Itens com raio de controle (size/36); ativo = pastilha elevada (raised + shadow-xs) sobre o chão do painel (use num `Card variant="well"` ou região sunken); `emphasis` = acento brand. `count` à direita (número vira `Count`). Subitens em `NavSub` com `sub`: conectores de árvore. `NavSub branches` desenha os mesmos ramos para folhas e pastas recursivas; nesse modo não use também `NavItem sub`. `NavUser` em pastilha elevada. `href` vira link. |
| `NumberField` | Slider de **largura total** para um número: a trilha não divide a linha com o valor. `valueLabel` `above` (padrão: rótulo flutuante acima do punho, acompanha a posição e nunca vaza nas pontas), `below` (mín | valor | máx abaixo da trilha) ou `none`. `field` liga o campo para digitar o valor exato, numa linha própria abaixo. Teclado no range nativo; `aria-valuetext` com a unidade. `layout="inline"`: UMA linha alinhada ao grid do painel — rótulo à esquerda, trilha no meio, campo compacto com a unidade à direita (painel de ajustes). |
| `Pagination` | Contagem à esquerda, navegação à direita. |
| `PaymentsCard` | Tabela com seleção, status em Tag de intenção, ações por linha e paginação com contagem. |
| `PreferencesCard` | Liga/desliga com salvar (cookies, notificações): SettingRow + Switch por hairline, contagem ligada. |
| `RadioCard` | Escolha única em cartões (plano, modo). Setas movem e escolhem; tabindex itinerante; Home/End. O cartão inteiro é o alvo; o marcador é o do Radio. Não selecionado = poço; selecionado ELEVA (raised + shadow-xs + hairline) — brand só no marcador. |
| `RadioGroup` | Escolha única em cartões (plano, modo). Setas movem e escolhem; tabindex itinerante; Home/End. O cartão inteiro é o alvo; o marcador é o do Radio. Não selecionado = poço; selecionado ELEVA (raised + shadow-xs + hairline) — brand só no marcador. |
| `RailItem` | Trilho vertical de ícones (chão sunken com `RADIUS_TRACK`, itens quadrados com raio de controle, ativo em pastilha elevada); o painel ao lado é `SidebarNav`. |
| `RailNav` | Trilho vertical de ícones (chão sunken com `RADIUS_TRACK`, itens quadrados com raio de controle, ativo em pastilha elevada); o painel ao lado é `SidebarNav`. |
| `SearchInput` | Input com lupa embutida e forma de comprimido. |
| `SearchTrigger` | Parece campo de busca e abre o ⌘K; atalho pela plataforma. Sem `size`, altura da linha de navegação (`size/36`); `size` (`sm`/`md`/`lg`) segue a escala de Input e IconButton para dividir a linha com eles. |
| `SettingRow` | Título, apoio e controle à direita — a linha de tela de configuração. |
| `ShareCard` | Pessoa com papel (Select) / equipe com avatares no canto / link para copiar + quem tem acesso. |
| `SidebarNav` | Painel de navegação (ao lado do `RailNav`). Itens com raio de controle (size/36); ativo = pastilha elevada (raised + shadow-xs) sobre o chão do painel (use num `Card variant="well"` ou região sunken); `emphasis` = acento brand. `count` à direita (número vira `Count`). Subitens em `NavSub` com `sub`: conectores de árvore. `NavSub branches` desenha os mesmos ramos para folhas e pastas recursivas; nesse modo não use também `NavItem sub`. `NavUser` em pastilha elevada. `href` vira link. |
| `SignUpCard` | Criar conta ou entrar: provedores, "ou continue com", e-mail e senha, ação primária. |
| `Sparkline` | Linha de tendência sem eixo, cor do pai (`text-icon-brand`). Largura padrão por `size` (space/64·96·128) — cabe no slot `viz` do `Stat` sem embrulho; `fluid` ocupa a largura do pai. `area`, `dot`; `surface` (raised\|sunken\|page) é a cor do anel do ponto final — use `sunken` dentro de poço. Com `label` vira interativa: ponteiro/setas andam pelos pontos, o ponto acompanha e um tooltip mostra valor + `labels[i]` (`format` formata); aria-live anuncia. **Dívida de token**: stopOpacity 0,24→0 do degradê é literal até o sync de opacity/* do Figma (PENDENCIA em sparkline.tsx). |
| `StackedAreaChart` | Compatibilidade: `AreaChart stacked` com séries por cor crua. |
| `Stat` | Número grande com rótulo e variação. Escala do número: `sm` heading-6 (24), `md` heading-5 (30, padrão de cartão), `lg` heading-3 (48, só o número da tela). |
| `StatCard` | Métrica num cartão: número + unidade, `delta` em Tag, `trend` (spark, bars ou ring) no acento; `title` com `meta`/`badge` e `ranges` (Segmented); `details` chave × valor após Divider; `action` em bloco. KPI, saldo, cotação. |
| `StepRow` | Passo editável de uma escala derivada (raio, espaço, tamanho de texto): amostra viva, nome do token em mono com largura fixa (space/96, a coluna alinha), campos do valor + unidade e o reset ao derivado. `overridden` acende o nome em brand e libera o reset; sem override o reset ocupa o lugar invisível. Hairline entre linhas, sem caixa. **Dívida de paridade**: sem par no Figma. |
| `SwatchPicker` | Amostra que abre o `ColorPicker`. |
| `TabBar` | Abas em pastilha. Trilho deriva `radius/md + space/2xs`; `floating` soma também `border/thin` do contorno. Padding uniforme nos quatro lados. |
| `Table` | Tabela compacta: cabeçalho tonal em faixa (pontas no raio de controle, nunca cápsula), linhas hairline, número à direita. Realce de linha INSET com raio aninhado (`santo-row`, padrão) ou `flush` para tabela que ocupa o Card inteiro (`padded={false}`: realce reto, contêiner recorta). `layout="fixed"` + `Column.width` (degrau de dimension/space) trava as colunas — tabelas empilhadas alinham e texto longo quebra. `selected` liga a coluna de seleção, `rowAction` a de ações. Coluna sem `render` lê a célula pronta em `row[key]` (`CellRow`) — assim a tabela monta num Server Component; seleção e ações exigem cliente. |
| `TableOfContents` | Índice da página na coluna direita, grupos > itens, ativo com linha de brand; acompanha a rolagem. |
| `TeamCard` | Pessoa com papel (Select) / equipe com avatares no canto / link para copiar + quem tem acesso. |
| `ThumbFrame` | Moldura de miniatura: poço 16:10 com grade sutil e cartão no centro, onde o `Skeleton` desenha. Só para a vitrine do índice de `/componentes` (ilustrações em `lib/thumbs`). |
| `Ticker` | Faixa de cotações. Quebra em linhas (célula de largura mínima `space/240`) em vez de rolar: sem barra horizontal nem item cortado. |
| `TokenSample` | Amostra viva de token pela var CSS: `swatch`, `shadow`, `radius`, `corner` (um canto ampliado; `scale` aumenta o raio na mesma proporção — miniatura de preset de raio), `bar`, `line`, `text`, `easing` (curva + bolinha), `duration`. |
| `TransactionRow` | Linha de extrato (bloco): seta de entrada (valor ≥ 0) em `IconTile tone="success"` ou de saída em `tone="danger"` — a cor carrega o significado, então a caixa tonal é permitida —, título, categoria · data e valor à direita na mesma cor (text/success ou text/danger), com sinal e tabular-nums; `onAction` liga o IconButton ghost de ações. |
| `TransactionsCard` | Extrato curto: contagem, "Ver todas" e uma `TransactionRow` (acima) por linha; `onAction(transação)` liga as ações de cada linha. |
| `TypingIndicator` | Conversa. Bolha recebida em poço (`surface/sunken`), enviada em `brand/solid` + `text/on-brand`, raio xl com cauda xs; reações em pastilha elevada. `ChatComposer`: campo-poço em pastilha com anexar (ghost) e enviar (primary, círculo) inline, anel no conjunto. `avatarSrc` em ChatHeader. |
| `UpgradePlanCard` | Checkout de plano: dados em poço, RadioGroup de plano, cupom, aceite (habilita a ação), resumo que muda com o plano. |

## Marketing

21 componentes.

| Componente | Quando usar |
|---|---|
| `BentoGrid` | **Bento**: grade fixa com spans planejados e fileiras que fecham (1 col; 2 em md; 3 em xl): `illustration` (ilustração de componente do DS em esqueleto — `ThumbFrame` + `Skeleton`, vetorial, sem imagem raster — com o número e a legenda abaixo; 2 linhas), `quote` (número + avatares + citação), `brand` (destaque brand/solid, número grande — texto grande por D1), `inverse` (surface/inverse, largo). Alimentada por dado (`BentoItem`). |
| `CtaButton` | `size` lg (padrão, largo, size/64) ou md (size/48, raio de controle, pastilha md − 2xs: ao lado de um Button lg). CTA principal de venda: largo, heading-6, `intent` success (padrão) ou brand, pastilha `surface/inverse` com a seta na ponta. Raio concêntrico: botão `RADIUS_TRACK` (lg), pastilha lg − xs, folga xs igual em cima, embaixo e na ponta (nada de disco redondo em moldura reta). Sombra md, altura size/64 = pastilha size/48 + 2 × xs. |
| `HeroCard` | **Hero em cartão**: a abertura inteira dentro de um cartão `brand/subtle` (raio xl, teto de cartão), com a margem da página em volta. Slots: `header` opcional (`LandingHeader variant="inline"`; o padrão da landing é o header **flutuante fixo** no slot da `LandingPage`, e sem header o cartão começa no título com respiro no topo), conteúdo (`LandingHero`, `YouTubeEmbed` em borda dupla) e `rating` no pé. Superfície subtle, e não solid, por contraste (D1). |
| `LandingClosing` | Encerramento de landing com prova social, chamada tonal, CTA e rodapé de produto com marca ativa e navegação por dados. |
| `LandingHeader` | `variant` `floating` (padrão da landing: fixo na rolagem, sticky com afastamento, `layer/sticky`) ou `inline` (dentro de um cartão, sem painel nem sticky). Topo da landing em **painel flutuante** (logo da marca ativa, ou `brand` fixa): descolado do topo por space/sm, largura total (só o afastamento lateral space/md), surface/raised + border/subtle + shadow/md, raio xl (= controle md + folga xs, concêntrico, sem cápsula). `BrandLogo` à esquerda; menu central num trilho sunken (raio lg = md + 2xs) com itens em pastilha de controle (ativo eleva); à direita Login (ícone `User`) e CTA de acesso (Button primário, cor de marca). Sticky mantendo o afastamento (faixa transparente). Abaixo de md: mesmo painel com logo + menu; a gaveta abre dentro dele. `offset` gruda abaixo da topbar da doc. Slot `header` da LandingPage. |
| `LandingHero` | `secondLine` (2ª linha do título em text-brand) e `actions` (Button secundário lg + `CtaButton size="md"` com seta, lado a lado, mesmo raio de controle). Abertura em 3 grupos com ritmo constante: (1) logo (`brand`) + prova social `proof` (`SocialProofRow`), gap sm; (2) headline (heading-4; heading-6 abaixo de md; tracking-tight, balance; `highlight` em text-brand sem quebrar) + subheadline (body-large, text-secondary, medida container/sm, pretty), gap sm; (3) `lead` (body-large semibold, `leadHighlight` em text-brand) + legenda (body-small, tertiary), gap xs, com space/lg + sm antes. Sem overline e sem tarja. Limitado a container/md. |
| `LandingOffer` | Abaixo do vídeo: até 3 avatares (fotos) + contagem em Overline, o `CtaButton` e o `Rating`. Um CTA por página. |
| `LandingPage` | Moldura de página de venda: `header` (LandingHeader) de ponta a ponta, fundo = superfície de página (sem decoração) e coluna central container/lg — o vídeo vai largo; hero e oferta se limitam a md/sm por dentro. `brand` (opcional, para uso fora da doc) grava `data-brand` (cor, fonte, raio da marca na página inteira); sem ele a página segue a marca ativa — é assim em /exemplos; `framed` desenha a moldura (raio xl); `fullBleed` tira o limite container/lg da coluna (o vídeo vai de margem a margem, só com o padding de página: md, xl a partir de md; hero e oferta seguem estreitos); `overlay` recebe o `SocialProofToast`. `overflow-clip` (não hidden) para o toast sticky funcionar. |
| `LogoStrip` | Faixa de logos em cinza (text/tertiary) entre hairlines, com rótulo em Overline; placeholders em texto até haver logos reais. Rolável no celular. |
| `ProductHero` | Abertura de produto com LandingHeader, LandingHero, gradiente da marca ativa, formas difusas, funções flutuantes e slot de preview recortado na base. |
| `Rating` | Estrelas (icon/warning, meia estrela) + nota "4,9/5". Ícones `Star`/`StarHalf` (Figma). |
| `SectionIntro` | Abertura de seção: ponto + Overline e título centrado em linhas (`IntroPart[][]`), a última em text/secondary; ícones inline numa pastilha brand/subtle (raio de controle). heading-4 (heading-6 no celular). |
| `ShowcaseStrip` | Bloco disponível (fora da landing por decisão do Pedro). Vitrine de produto para um hero: 5 a 7 cartões pequenos de app (`ShowcaseItem`: stat com tendência, bars, ring, chat, photo) em arco leve (translate por token: as pontas descem). Abaixo de md, faixa rolável com snap. |
| `SocialProofRow` | Linha de prova social: até 3 avatares com foto (`AvatarGroup`) + texto curto, centrados. `tone` `text` (frase em body-small, acima da headline: "+ de 20 mil alunos já vendem todo dia") ou `overline` (rótulo junto do CTA: "+90 MIL ALUNOS"). Usada pelo `LandingHero` (`proof`) e pelo `LandingOffer`. |
| `SocialProofToast` | Aviso de prova social no canto inferior esquerdo: `Avatar` da lib com foto (`avatarSrc`; sem foto, a inicial), frase, "compra verificada" com visto success, fechar. Entra com `santo-animate-slide-in-up`. `placement` viewport (fixo) ou frame (absoluto no pai). |
| `TaskAppPreview` | Demonstre um produto de tarefas com quatro colunas, pessoas, prazos e progresso. Busca, quadro/lista, criação e conclusão funcionam localmente; sidebar inclui a navegação do app. |
| `TaskFeatureBento` | Cinco recursos em duas linhas: barra segmentada de estados, atribuição automática, conversa com arquivo, progresso e tabela Projeto/Time. `states`, `projects` e `initialMessages` personalizam os dados; envio de mensagem e ativação da atribuição funcionam localmente. |
| `TaskMetrics` | Quatro cartões de marketing com alturas alternadas, gradiente sutil nos altos, números no topo e legendas na base. `items` recebe valor, rótulo e detalhe; o ícone de direção acompanha o número, com a legenda na base. |
| `TaskOnboarding` | App com sidebar recortado numa janela de altura de token à esquerda, três etapas recolhíveis à direita e duas miniinterfaces de entrada no primeiro passo. A cena recortada é decorativa e inert; o cadastro por e-mail confirma localmente. `productName` e `steps` personalizam nome e conteúdo. |
| `TestimonialGrid` | Histórias de uso em três cartões com resultado, avaliação, citação original e autoria com avatar; uma coluna no celular. |
| `YouTubeEmbed` | Vídeo do YouTube (youtube-nocookie, 16:9, raio `RADIUS_TRACK`) por id ou URL (`parseYouTubeId`). iframe com `title`, `loading=lazy`, tela cheia. Padrão: o player puro (iframe direto). `resumeAt` é a variante opcional que liga a camada "retomar" da VSL (brand/solid, "Continuar assistindo?" / "Assistir do início?"): ao escolher, carrega tocando do ponto certo. Sem CSP no next.config; nada a liberar. `frame="double"`: borda dupla (como o Card double) — moldura sunken com recuo space/xs + fio, painel lg com sombra curta, moldura = lg + xs + fio (concêntrico). |

<!-- ui-inventory:end -->

## Composição e utilitários

O exemplo **Landing Page**, em `/exemplos#landing`, apresenta o produto fictício
**Compasso** e compõe sete regiões:
header, hero com quadro, parceiros, bento, resultados, três passos e histórias,
seguidas de CTA e rodapé. Exemplos oferece apenas Dashboard e Landing Page;
a navegação, a home e a sidebar vêm de `_views.ts`. Links antigos `#compasso`
e `#compasso-*` são normalizados para `#landing` e `#landing-*`, preservando
a seção e o histórico. A landing VSL antiga saiu dos exemplos; `HeroCard`,
`BentoGrid`, `LandingOffer`, `SocialProofToast` e `YouTubeEmbed` continuam
documentados com demos próprias em `/componentes`.
`LandingPage rhythm="product"` entrega o ritmo às seções; `LandingHeader`
aceita `productName`, `homeHref` e `ctaVariant="contrast"`; `LogoStrip`
oferece `variant="partners"`, e `SectionIntro` aceita `description`.
`ProductHero` recorta o preview e apresenta suas formas como ilustração sem
controles focáveis fora do enquadramento. Use `TaskAppPreview` diretamente
para uma demonstração interativa de busca, quadro/lista e criação/conclusão.
Todos os blocos seguem a marca ativa, sem fixar identidade ou paleta na página.

Semânticos e peças de marketing reutilizam a lib. Em `app/exemplos`, a tela apenas
compõe blocos alimentados por dados (`lib:check`); listas, métricas e gráficos dentro
de cartão separam-se por espaço ou Divider. Poço só em campo, código ou trilho.
Os blocos de marketing seguem a marca ativa ou a prop `brand` do LandingPage.

| Utilitário | Quando usar |
|---|---|
| `buttonClass` | As classes do botão, para `<Link>`/`<a>` com cara de botão (`<button>` dentro de `<a>` é HTML inválido). Mora em `button-class.ts`, sem `"use client"`, para rodar em Server Component. |

**Contrato dos gráficos** (skill dataviz): um eixo de valor só, ticks redondos e compactos; grade e eixo recessivos; hover por padrão (crosshair em linha/área, a marca em barra/fatia), teclado no mesmo cursor (uma parada de Tab: setas, Home/End, Esc), aria-live do ponto em foco e tabela `sr-only`; legenda com 2+ séries; texto sempre em token de texto. Tons em ordem fixa `CHART_TONES` (brand, neutral, accent, info…). Kit compartilhado em `chart-kit.ts` (escala, ticks, tons, `useChartCursor`, classe do tooltip) — helper, não componente, então o primitivo pode usar. **Dívida de token**: falta no Figma uma paleta categórica de dado (`data/series/*`) validada para daltonismo; até lá, `color/icon/*` + `bg/*/subtle`.

`EmptyState` também aceita `action` por dado (`{ label, onClick }` vira Button).

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
