---
name: santo-vitrine
description: Gramática visual das ilustrações de componente do SantoDS (miniaturas em estilo esqueleto do índice /componentes, em lib/thumbs). Use SEMPRE que for criar, ajustar ou revisar uma ilustração de componente, quando entrar slug novo no registry, ou quando alguém mencionar thumb, miniatura, preview do card, vitrine, esqueleto/skeleton ou ThumbFrame.
---

# Vitrine — ilustração de componente em esqueleto

Cada card do índice `/componentes` mostra uma miniatura do componente: um poço
cinza com grade sutil e, no centro, um cartão branco pequeno onde formas cinza
arredondadas sugerem a anatomia. Referência: a vitrine de blocos do
shadcndesign. **A consistência entre as ilustrações é o produto** — uma
miniatura bonita fora da gramática é pior que uma simples dentro dela.

Peças (só estas): `ThumbFrame` (`lib/ui/thumb-frame.tsx`) e `Skeleton`
(`lib/ui/skeleton.tsx`). Uma ilustração por slug em
`lib/thumbs/<slug>.thumb.tsx`, registrada em `lib/thumbs/index.ts`.

A anatomia segue a skill **santo-ui-craft** (regra ANTI-GENÉRICO do Pedro):
profundidade por **tom**, não por contorno; controle compacto em **pílula**;
campo é **poço**; ativo é **pílula elevada sobre trilho**; nav em **trilho**;
micro-viz (anel, sparkline, barrinhas). A miniatura de um componente mostra a
anatomia que o componente tem — quando ele muda, a thumb muda junto.

## Moldura e proporção (regra do Pedro)

- **Poço**: `ThumbFrame` — **16:10** (`aspect-16/10`), fundo `surface/sunken`,
  grade `border/subtle` a cada `space/md` apagando para as bordas. Ocupa a
  largura do card, sem raio próprio: o card do índice (LinkCard `media`)
  encosta a moldura no topo e o raio dele recorta.
- **Prancheta**: o desenho é feito em px de prancheta, **320 × 200**, dentro
  de um SVG com `viewBox` — a ilustração inteira (cartão e formas) escala
  junto com a moldura. Num card de 192 ou de 400, a proporção é a mesma.
- **Cartão interno**: **176 × 112 fixos em toda miniatura** (55% da largura,
  56% da altura — nunca mais que ~60% × ~55%), centrado, com **respiro mínimo
  de `space/lg`** até a borda da moldura em todos os lados (sobra 72 × 44).
  Conteúdo centrado na vertical. Mesmo tamanho em todas = a fileira lê como
  conjunto. Não existe variante de largura.
- **Raio do cartão — exceção consciente** (decisão do maestro): a ilustração
  é um desenho em escala, não um elemento aninhado de verdade, então o cartão
  **não** sai da fórmula a partir do card do índice. Ele usa **`radius-sm`**,
  que é a leitura de um card `2xl` em miniatura. **Dali para dentro vale a
  fórmula** (santo-ui-craft §3; o Vigia mede no DOM): raio interno = raio do
  pai − respiro, mínimo `radius/xs`. Com `sm` (8) e respiro 12/16, tudo dentro
  do cartão cai no piso, **`xs`**: bloco, poço multilinha, item `selected`.
  Controle compacto, pílula e círculo: `full`. Não existe `none`.
- **Visual**: nível 1 tonal — `surface/raised` + `shadow/sm`, `radius-sm`, **sem borda**
  (o tom separa do poço nos dois temas). Coluna flex com `gap-xs`.
- **Respiro** (`pad`): `md` para peça isolada; `sm` para conteúdo denso (vale
  também para primitivo denso: Card, Select aberto, TabBar, Disclosure, Color).
- **Área útil**: 152 × 88 com `pad="sm"`, 144 × 80 com `pad="md"`. Some as
  larguras de uma linha e as alturas da coluna antes de escrever. `Bar`
  encolhe em linha apertada (põe `min-w-0 flex-1` na coluna que a contém);
  as outras formas não.
- **Rótulo** (`label`): mono minúsculo no canto. Existe, mas o padrão é
  **não usar** — o título do card já nomeia.

## Tokens permitidos

| Papel | Token |
| --- | --- |
| Formas | `bg/neutral/subtle/default` (soft) · `/hover` (base) · `/active` (strong) |
| Nível 2 (poço, trilho) | `surface/sunken` (tom `sunken`): campo, trilho de Segmented/abas/nav/rail, trilha de progresso. Mais fundo que o cartão nos dois temas — **não** use soft como trilho (no escuro soft é mais claro que o cartão e a pílula “elevada” afunda) |
| Nível 1 sobre trilho | `surface/raised` + `shadow/xs` (`elevated` / `Row active` / `Chip elevated`) |
| Ênfase (ação primária) | `icon/tertiary` (tom `emphasis`): neutral/400 no claro, neutral/500 no escuro — um degrau acima de `strong`. **Nunca preto nem neutro quase preto** (neutral/900+, `surface/inverse`, `bg/neutral/solid`): regra do Pedro, a ênfase é por tom, não por contraste duro |
| Forma clara sobre a ênfase | `surface/raised` (tom `raised`): punho de switch, aba ativa |
| Contorno | **só** em amostra de cor (`outline`, `border/subtle`) e na caixa desligada do `Check` (`border/default`). Nada de botão, chip, campo ou painel contornado. `border/strong` nunca |
| Raio | `xs` (piso) em cartão, bloco, poço multilinha, célula · `full` em todo controle compacto (botão, chip, tag, count, segmented, aba, item ativo, trilho, FAB, campo em barra), barra e avatar. Nada entre os dois |
| Tamanho | só a escala de espaço (`w-md`…`w-8xl`, `h-2xs`…`h-5xl`, `size-xs`…`size-xl`) e `--santo-dimension-space-*` |

Nada de hex, de colchete com número, de `bg-brand-*`/`success`/`danger`, de
`text-*` (não há texto). Sombra: `sm` no cartão, `xs` em pílula/painel
elevado, `lg` só no FAB.

## Formas canônicas (`Skeleton.*`)

| Forma | Uso | Padrão |
| --- | --- | --- |
| `Bar` | linha de texto | `size` lg título/número (strong), md corpo (base), sm metadado/unidade; largura `2xs`…`2xl`/`full`/`fill` |
| `Block` | imagem, painel, bolha, célula, tile, poço, trilho | tom soft, raio xs (ou `full`); aceita filhos; `elevated` = nível 1 sobre trilho; `outline` só em amostra; largura `fit` abraça o conteúdo |
| `Circle` | avatar, ponto de status, ícone abstrato | `xs`…`xl`, tom strong; `ring` separa avatares sobrepostos |
| `Button` | botão em pílula | `primary` (ênfase), `soft` (secundário tonal); `square` = botão de ícone redondo; `float` = FAB |
| `Field` | campo-poço | `sunken`, sem contorno; ações em `leading`/`trailing` dentro do poço; uma linha é **pílula por padrão** (como o Input `well` da lib; `pill={false}` = retângulo); `multiline` fica `xs`; `caret` = cursor em ênfase (protagonista) |
| `Chip` | tag, filtro, contador, tecla, trilho de switch | pílula `h-md`; `elevated` = selecionado sobre trilho; `align` posiciona o punho |
| `Check` | checkbox (`square`) e radio (`round`) | desligado = contorno default; `on` = ênfase |
| `Row` | linha de lista/tabela/nav | hairline embaixo; `divider={false}` na última; `selected` = opção realçada (tom, xs); `active` = item de nav ativo (pílula elevada) |
| `Rule` | hairline / conector de árvore | horizontal ou `vertical`; `emphasis` só quando o divisor é o protagonista |
| `Bars` | gráfico de barras (com eixo) | valores 1–8; `highlight` = uma barra em ênfase |
| `Line` | gráfico de linha/área; `spark` = Sparkline | pontos 0–10; `area`; `second` = segunda série; `spark` baixo e sem eixo |
| `MiniBars` | micro-viz de barrinhas | valores 1–4; pílulas finas; `highlight` em ênfase |
| `Ring` | micro-viz de progresso | `value` 0–100; trilha base, arco em ênfase; `sm`/`md`/`lg` |

Carregamento (fora das thumbs): `Bar`/`Block` aceitam `animated`
(`santo-animate-shimmer`); quem envolve leva `role="status"` e `aria-busy`.

Composições recorrentes (copie, não reinvente):
- **Bloco de texto**: `Bar lg strong` + `Bar sm` mais curta.
- **Switch**: `Chip w="xs" tone="emphasis" align="end"` com `Circle xs raised`
  (ligado); `tone="strong" align="start"` (desligado).
- **Swatch**: `Block w="xs" h="lg" outline radius="xs"`.
- **Valor à direita**: envolva em `<div className="ml-auto">`.
- **Chevron/ícone pequeno**: `Block w="2xs" h="xs" tone="strong" radius="xs"`.
- **Trilho + ativo** (Segmented, abas, nav, rail): `Block tone="sunken"
  radius="full"` com `p-3xs`; dentro, a peça ativa `elevated radius="full"`
  (ou `Chip elevated` / `Row active`), as demais só tom.
- **Nav em trilho**: coluna `Block w="fit" tone="sunken" radius="full"` com
  círculos (um elevado) + painel ao lado; subitens com `Rule vertical` como
  conector de árvore e recuo `pl-2xs`.
- **Stat**: metadado `Bar sm` + número `Bar lg strong` com unidade `Bar xs sm`
  na baseline + micro-viz à direita (`Ring`, `MiniBars` ou `Line spark`).
- **Lista**: tile (`Block w="xs" h="lg"`, tom soft) + nome/meta + ação ghost
  (`Button variant="soft" size="sm" square`), hairline entre linhas.
- **Tabela**: cabeçalho tonal (`Block tone="soft"` com barras strong) +
  linhas hairline, valor à direita.

## Composição por tier

- **Primitivo**: o componente **sozinho** no centro do cartão,
  `pad="md"` (`sm` se for denso). Variantes lado a lado só quando a peça
  sozinha não diz nada, e no máximo **duas** (checkbox on/off, switch
  on/off) — três já vira lista. Sem contexto em volta.
- **Semântico**: **anatomia mínima** — as partes que o definem e nada mais
  (CardHeader = título + apoio + botão + início do corpo; Table = cabeçalho +
  3 linhas). Duas a quatro linhas de conteúdo; mais vira ruído.
- **Gráficos**: barra-título strong em cima, gráfico embaixo.

## Regras de composição

1. **Um protagonista por cartão, sempre** (decisão do maestro, por
   contraste): **exatamente um** elemento em `emphasis` — nem zero, nem dois.
   No claro, os tons soft/base/strong ficam abaixo de 1.5:1 contra o cartão;
   sem protagonista a miniatura some. O protagonista é o que a pessoa procura
   primeiro no componente:
   | Componente | Protagonista |
   | --- | --- |
   | campo (Input, Textarea, Field, NumberField, SearchInput) | `Field caret` |
   | botão, ação (Button, CopyButton, CardHeader, FAB) | `Button` primary |
   | seleção (Checkbox, Radio, Switch, Chip, Select, Segmented, TabBar) | o marcado / a opção ativa |
   | nav (NavItem, NavSub, Rail, SidebarNav, NavSection) | o ícone ou rótulo do item ativo |
   | valor (Count, KeyValue, Stat, Ticker, Kbd) | o valor / a tecla |
   | gráfico e micro-viz | a série principal / o arco / a barra destacada |
   | lista, tabela, feed, avatar | o primeiro avatar/tile |
   | Divider | `Rule emphasis` |
   Ilustração leve e aérea: o resto em soft/base, strong só em título.
2. **Hierarquia por tom**: título strong, corpo base, metadado sm/base.
3. **Nada encosta nem vaza**: tudo cabe na área útil do cartão (152 × 88 /
   144 × 80). Lista: no máximo 3 linhas; tabela: cabeçalho + 3.
4. **Layout é `div` com flex/grid/gap/padding/`ml-auto`** — só layout. Borda,
   fundo, raio e sombra vêm **sempre** de `Skeleton`/`ThumbFrame`. Precisa de
   uma aparência que não existe? Vira prop do `Skeleton` (lib-first), nunca
   classe solta no thumb.
5. **Ritmo**: `gap-xs` dentro do cartão, `gap-2xs` dentro de um grupo,
   `gap-3xs` entre peças coladas (botões de stepper, células).
6. **Raio aninhado**: ver “Moldura e proporção”. Piso `xs`; controle
   compacto em pílula (`full`).
7. **Níveis**: cartão (1) → poço/trilho `sunken` (2) → pílula elevada (1
   sobre 2). Nunca poço dentro de poço; nunca mais que 3 níveis.

## Proibições

- Texto real, número, letra, emoji — nem em `label`, salvo exceção combinada.
- Ícone real (`lib/icons`, `lib/ui/icons`) — ícone é `Circle` ou `Block` pequeno.
- Cor de marca ou de intenção (brand, accent, success, warning, danger, info).
- Explicação, legenda, subhead.
- Valor solto: hex, `p-[13px]`, `w-[150px]`, `rounded-[10px]`; `style` inline
  no thumb (a grade da moldura e o traço do `Line` moram nos primitivos, só com tokens).
- Componente real da lib dentro da miniatura (é ilustração, não demo).
- Padrão genérico da santo-ui-craft §1: contorno como separação, botão/aba
  retangular, campo contornado, ativo em fundo cinza retangular, sombra por
  linha.

## Checklist de revisão

- [ ] Usa só `ThumbFrame` + `Skeleton` + `div` de layout.
- [ ] Proporção 16:10; cartão 176 × 112, `radius-sm` (exceção consciente), respiro ≥ `space/lg`.
- [ ] Primitivo sozinho; semântico com anatomia mínima reconhecível.
- [ ] Exatamente um protagonista em `emphasis` (`tone`, `Button` primary, `Check on`, `highlight`, `Line`, `Ring`, `caret`, `Rule emphasis`); nenhum preto ou quase preto.
- [ ] Anatomia santo-ui-craft: sem contorno fora de amostra/check; controles
      em pílula; campo-poço; trilho `sunken` + ativo elevado; micro-viz onde o
      componente tem.
- [ ] Raio aninhado: só `xs` (piso) e `full`; nada de `none`.
- [ ] Nada vaza nem passa da altura do cartão (olhar renderizado, não só o
      código; no card mais estreito, 192, e no largo).
- [ ] Claro e escuro conferidos (`data-theme="dark"`).
- [ ] Sem texto, ícone, cor de marca, valor solto.
- [ ] Equilíbrio: toda moldura é o `ThumbFrame` sem mudança de proporção —
      cartões irmãos no índice com a mesma altura de moldura e o mesmo ritmo.
- [ ] Todo slug do registry tem thumb e `lib/thumbs/index.ts` não tem sobra
      (só `node`, roda offline) → `faltam: [] sobram: []`:
      ```sh
      node -e 'const fs=require("fs");const s=fs.readdirSync("lib/ui").filter(f=>f.endsWith(".meta.ts")).flatMap(f=>[...fs.readFileSync("lib/ui/"+f,"utf8").matchAll(/slug: "([^"]+)"/g)].map(m=>m[1]));const k=[...fs.readFileSync("lib/thumbs/index.ts","utf8").matchAll(/^\s+"?([a-z-]+)"?: \w+Thumb,/gm)].map(m=>m[1]);console.log("faltam:",s.filter(x=>!k.includes(x)),"sobram:",k.filter(x=>!s.includes(x)))'
      ```
- [ ] `npm run check` (já varre `lib/thumbs`) e `npm run build` verdes.
