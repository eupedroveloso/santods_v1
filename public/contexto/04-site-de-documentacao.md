# SantoDS — o site de documentação

> Como o site de docs é feito e como subir uma cópia idêntica do zero. Os caminhos são
> relativos à raiz do repo. Estado de 2026-10-19 (HEAD `406f2cf`).

## Pilha

- **Next.js 16.2** (App Router, Turbopack) com **React 19.2** e **TypeScript** estrito.
  Esta versão do Next tem mudanças que quebram o que se sabia antes. Leia
  `node_modules/next/dist/docs/` antes de escrever código de framework. Exemplo dessas
  mudanças: as páginas dinâmicas recebem `params` como Promise
  (`PageProps<"/componentes/[nome]">`, `await params`).
- **Tailwind CSS v4** via `@tailwindcss/postcss` (`postcss.config.mjs`). Não há
  `tailwind.config`: o tema entra pelo `@theme inline` gerado em `lib/tokens/theme.css`.
- **ESLint 9** com `eslint-config-next`.
- **Nenhuma dependência de UI de terceiros.** Todo componente é de `lib/ui`, todo ícone é de
  `lib/icons` e toda fonte é do Google Fonts pelo nome real.
- `next.config.ts` faz duas coisas:
  - fixa `turbopack.root`, porque existe um `package-lock.json` numa pasta acima do repo;
  - só em desenvolvimento, manda `Cache-Control: no-store` em tudo, para o preview nunca
    mostrar CSS velho.
- `@/*` aponta para a raiz do repo (`tsconfig.json`).

## Como a página é montada

### `app/layout.tsx`

O layout raiz faz quatro coisas:

1. **Injeta no `<head>` o `THEME_SCRIPT` e o `BRAND_SCRIPT`** (`app/_components/theme-script.ts`).
   Eles leem `localStorage` (`santo-theme`, `santo-brand`) e aplicam `data-theme` e
   `data-brand` no `<html>` **antes da primeira pintura**, sem piscar. O `<html>` leva
   `suppressHydrationWarning` por isso. Em desenvolvimento entra também o `DEV_CSS_REFRESH`,
   que contorna o WebKit reaproveitando a folha de CSS antiga.
2. **Coloca uma folha do Google Fonts por família** de `familiesInUse()`, somando todas as
   marcas, com `preconnect`.
3. **Monta a lista de marcas** a partir de `listIdentities()`: um item por modo da coleção
   Brand, na ordem do Figma, e a primeira é a padrão.
4. **Envolve tudo em `DocsShell`**, passando `docsNav()` e `docsSearch()` (`app/_docs/site.ts`).

O `app/globals.css` importa o Tailwind, os três CSS gerados (`tokens.css`, `typography.css`,
`theme.css`) e os CSS da lib (`controls.css`, `motion.css`, `surface.css`). Ele também define
o fundo, a cor e a família do `body` por token, o anel de foco global em `@layer base` e a
cor de seleção.

### `DocsShell` (`app/_docs/shell.tsx`)

É a moldura do site, e tudo nela segue o mesmo tema:

- **Topbar sticky.** A altura é `size/56` com a borda incluída. À esquerda, só dois links
  (`TOP_LINKS`: Documentação, ativo em todo o site fora do Estúdio, e Estúdio). À direita,
  num grupo de ícones: a **busca** (IconButton com a lupa; abre o mesmo modal do ⌘K), o
  link para o Figma, o **seletor de marca** (dropdown `BrandControl`) e o **alternador de
  tema** (`ThemeToggle`, Claro | Auto | Escuro). No celular entra o botão de menu.
- **Sidebar fixa à esquerda.** Largura `space/256` (`LAYOUT.sidebar` em
  `app/_docs/links.ts`), sticky, com rolagem própria. Ela é o componente **`AppSidebar`** da
  lib, em coluna única, com item ativo calculado pela rota e pela hash. A faixa fixa do
  topo leva a **logo** (link para a home), recolher/expandir todas as pastas e
  **compactar a sidebar** em trilho de ícones (`LAYOUT.rail`, `space/72`; logo reduzida no
  topo; estado em `localStorage` `santo-sidebar`; a largura anima pelos tokens de motion).
- **Gaveta (`MenuDrawer`) no celular.** É um modal de verdade: fecha com Esc, prende o foco e
  devolve o foco ao fechar.
- **Busca ⌘K (Ctrl K fora do Mac).** É o `CommandPalette` da lib, aberto por atalho global
  ou pelo campo da sidebar.
- **`<main>`** com `px-md lg:px-3xl py-2xl` e altura mínima igual à viewport menos a topbar,
  para o rodapé de página curta encostar embaixo.

### `DocPage` e `DocHeader` (`app/_docs/page-header.tsx`)

- **`DocPage`** é a coluna de conteúdo.
  - `layout="doc"` (padrão): coluna com `gap-3xl` entre seções, ocupando a largura toda (o
    limite de leitura fica só no parágrafo).
  - `layout="full"`: para telas de exemplo rodando como app. Anula o padding da `<main>`
    com margens negativas dos mesmos tokens e não mostra cabeçalho nem índice.
- **`DocHeader`** é o topo da página. Tem uma trilha (breadcrumb) numa barra sticky logo
  abaixo da topbar, o título grande, `description`, `actions` à direita, `divided` para
  colocar um divisor depois e `children` para a linha de tags. Na camada de profundidade,
  fica acima do conteúdo e abaixo da topbar, da gaveta e do ⌘K.
- **`SectionLabel`** é o rótulo cinza de grupo. **`SectionTitle`** é o título de seção com
  âncora (`scroll-mt-6xl`, para não sumir sob a topbar).

### Navegação e busca, geradas do dado

Nada da sidebar nem da busca é escrito à mão além das páginas fixas.

- **`docsNav()`** monta, nesta ordem:
  1. Docs home;
  2. Exemplos, um item por visualização de `app/exemplos/_views.ts`;
  3. Fundamentos: Cor, Tipografia, Raio, Sombra, Espaçamento, Movimento, Todos os tokens,
     Ícones e Marca;
  4. Primitivos e Semânticos, cada grupo de A a Z, a partir do registry de componentes.
- **`docsSearch()`** junta tudo o que a busca encontra:
  - as páginas;
  - cada coleção de tokens;
  - cada componente, com o tier como selo;
  - cada token, text style e effect style, via `searchIndex()` do catálogo, com palavras pt-BR
    nas dicas ("sombra md" acha o effect style `md`).

## Rotas e o que cada página mostra

Todas são estáticas. As dinâmicas usam `generateStaticParams` com `dynamicParams = false`,
então um slug fora da lista dá 404.

| Rota | Arquivo | Mostra |
|---|---|---|
| `/` | `app/page.tsx` | "Documentação". Uma `CardGrid` de `LinkCard`s: Tokens (uma linha por coleção, com contagem), Estilos, Componentes (por tier), Identidades (por marca), Exemplos (Dashboard e Landing Page, de `VIEWS`) e Figma. |
| `/tokens` | `app/tokens/page.tsx` | As 5 coleções com contagem. |
| `/tokens/[slug]` | `app/tokens/[slug]/page.tsx` | Uma coleção (palette, color, primitives, brand, semantic), agrupada pelo prefixo do nome. Cada grupo tem uma âncora `#grupo-<prefixo>` e uma tabela com amostra viva (`TokenSample`), nome do Figma, valor **por modo** (com a amostra de cor daquele modo e o ícone de alias mostrando a origem), var CSS e classe Tailwind. A tabela é desenhada no cliente a partir de linhas enxutas, porque desenhar no servidor dobrava o peso da página. |
| `/estilos` | `app/estilos/page.tsx` | Entrada para Tipografia, Efeitos e Movimento. |
| `/estilos/tipografia` | `.../tipografia/page.tsx` | Os 68 text styles por papel, cada um com família, peso, tamanho/leading e tracking (com o token de cada valor no `title`). |
| `/estilos/efeitos` | `.../efeitos/page.tsx` | Os 7 effect styles com as camadas (inclusive as ocultas no Figma). |
| `/estilos/movimento` | `.../movimento/page.tsx` | Durações e curvas com var e classe, receitas de motion vivas e um switch que simula `prefers-reduced-motion` (`data-reduced-motion` na raiz). |
| `/identidades` | `app/identidades/page.tsx` | Uma ficha (`BrandCard`) por modo de marca: logo, cor, família, raio e superfície em claro e escuro, lidos do catálogo. |
| `/componentes` | `app/componentes/page.tsx` + `app/_docs/component-index.tsx` | O índice. Abas por tier (Primitivos/Semânticos), busca por nome, índice lateral por categoria e um cartão por componente com a miniatura em esqueleto de `lib/thumbs`. O nível ativo vive na hash (`#primitivo`, `#semantico-dado`), então o link direto e o "voltar" funcionam. |
| `/componentes/[nome]` | `app/componentes/[nome]/page.tsx` | A página de um componente (veja abaixo). |
| `/exemplos` | `app/exemplos/page.tsx` + `views-nav.tsx` | O DS em uso real, em `DocPage layout="full"`. As únicas visualizações vêm de `VIEWS`: **Dashboard** (`#dashboard`) e **Landing Page** (`#landing`, `bleed`, sem padding), que apresenta o produto fictício Compasso. As duas seguem a marca ativa. A visualização e suas seções vivem na hash; `_anchors.ts` centraliza os destinos e converte links antigos `#compasso`/`#compasso-*` e as âncoras conhecidas da landing VSL, preservando histórico, rolagem e item ativo único da sidebar. Home, sidebar e busca consomem `VIEWS`. A landing VSL antiga foi removida de `app/exemplos`; os componentes da lib e suas demos continuam em `/componentes`. A tela **só compõe blocos** da lib (regra D do `lib:check`). |

## Registry, meta, demo e thumb: como uma página de componente nasce

O pipeline inteiro é dirigido por dado. Para criar um componente e ganhar a página dele:

1. **O componente:** `lib/ui/<modulo>.tsx`, com JSDoc dizendo **quando** usar (não o que
   faz), props tipadas e tokens em tudo. Exporte no barril `lib/ui/index.ts`.
2. **O meta:** `lib/ui/<modulo>.meta.ts` exporta `ComponentMeta[]`:
   ```ts
   {
     name: "CardGrid",          // nome exportado por @/lib/ui
     slug: "card-grid",         // rota /componentes/card-grid
     category: "estrutura",     // acao | entrada | cor | estrutura | navegacao | dado | aplicacao | codigo | blocos | icones
     tier: "primitivo",         // primitivo | semantico (critério objetivo, cobrado pelo tier:check)
     source: "card-grid.tsx",   // arquivo em lib/ui
     description: "…",          // QUANDO usar — a mesma frase do lib/ui/README.md
     related: ["card", "stat"], // slugs que andam junto
     figma: { name: "…", nodeId: "12:34" }, // par no Figma; ausente = "Sem par no Figma"
   }
   ```
   Importe-o em `lib/ui/registry.ts` e espalhe no array `ALL`.
3. **As demos:** `lib/ui/<modulo>.demo.tsx` exporta um `DemoMap` (`{ [slug]: { playground?, demos } }`):
   - **`playground`**: `controls` do tipo `select`, `boolean` ou `text`, cada um com `prop`,
     `label` e `initial`. Tem também um `Preview({ values })` e um `code(values)` que gera o
     snippet daquele estado. **Variante numerosa vira seletor no playground** (um exemplo
     por vez), nunca uma grade exaustiva.
   - **`demos`**: blocos `{ title, code, Preview, layout?: "center" | "stretch" }`. O título
     é um rótulo curto (Básico, Variantes, Tamanhos, Estados), **nunca um parágrafo
     explicativo**.
   Importe-o em `lib/ui/demos.ts`.
4. **A miniatura:** `lib/thumbs/<slug>.thumb.tsx` (`ThumbFrame` + `Skeleton`, gramática da
   skill `santo-vitrine`), registrada em `lib/thumbs/index.ts`.
5. **O README:** uma linha em `lib/ui/README.md`, na seção do tier e da categoria, com a frase
   de quando usar.

A partir daí, **a página `/componentes/<slug>` aparece sozinha**:

- `generateStaticParams` lê o registry.
- O `DocHeader` mostra as tags de tier, categoria, par no Figma (com link para o nó, ou o
  aviso "Sem par no Figma") e `lib/ui/<source>`.
- Depois vem o `ComponentDemos`: primeiro o **playground**, num `Card variant="double"` com
  o rótulo na moldura, o preview e os controles ao lado (painel de `space/256` a partir de
  `md`, com `Select`, `Switch` e `Input` da lib) e o `CodeBlock` vivo no rodapé. Em seguida,
  as **demos** numa `CardGrid` automática (`minItem="container-sm"`), cada uma num
  `DemoCard`: borda dupla, rótulo na moldura, componente vivo no painel e código recolhido
  atrás de um botão só de ícone.
- Por fim vêm "Uso" (a linha de import num `CodeBlock`), "Relacionados" e a navegação para o
  componente anterior e o próximo.

O componente também entra sozinho na sidebar, na busca e no índice. Depois, rode
`node scripts/figma-components.mjs` para atualizar o inventário Figma × código.

## Seletores de tema e de marca

- **Tema** (`app/_components/theme-toggle.tsx`): o modo mora no `localStorage`
  (`santo-theme`: `light`, `dark` ou `system`) e no `data-theme` da raiz, não em estado
  React. O padrão é o **claro**: sem escolha salva, a raiz nasce com `data-theme="light"`.
  A ordem é Claro | Auto | Escuro; Auto tira o atributo e passa a seguir o sistema. O script do `<head>` aplica antes da pintura, e o alternador só lê e escreve.
- **Marca** (`app/_components/brand-control.tsx`, sobre o `BrandSwitch` da lib) segue o
  mesmo desenho, com `santo-brand` e `data-brand`. A marca padrão não grava atributo. A
  troca vale na doc inteira, persiste e já tem as famílias carregadas.

## Bloco de código

- **`CodeBlock`** é a janela de código com título (nome do arquivo) e botão de copiar
  (`CopyButton`).
- **`CopyCode`** é o código inline copiável. **`Kbd`** é a tecla.
- O código do playground é gerado a cada mudança de controle pela função `code(values)` da
  demo. O que se vê é exatamente o que o preview está renderizando.

## Build estático

`npm run build` roda o TypeScript e pré-renderiza tudo: as páginas fixas, cada
`/componentes/[nome]` e cada `/tokens/[slug]`. Na junção de 2026-10-19 eram cerca de 138
páginas. O catálogo lê `tokens/santods.figma.json` uma vez no build. Em `next dev`, ele relê
quando o arquivo muda (mtime), então a doc acompanha `npm run tokens` sem reiniciar. Para
servir: `npm run start` (`next start`).

## Passo a passo: subir um clone do zero

1. **Pré-requisitos:** Node 22 (o repo foi validado com 22.20; o
   `scripts/figma-components.mjs` usa o TypeScript nativo do Node), npm e git.
2. **Clonar e instalar:**
   ```bash
   git clone <url-do-repo> santods_v1
   cd santods_v1
   npm install
   ```
   No macOS, o `npm install` pode tirar as linhas `libc: glibc` do `package-lock.json`. É
   ruído: não commite junto com trabalho de produto.
3. **Conferir os tokens** (os gerados já vêm versionados):
   ```bash
   npm run tokens:check     # "Snapshot consistente: 345 variaveis, 68 text styles, 7 effect styles."
   npm run tokens           # opcional: regenera lib/tokens/ — o resultado deve ser idêntico ao versionado
   git status               # nada mudou em lib/tokens/ = clone saudável
   ```
4. **Subir a doc:**
   ```bash
   npm run dev              # http://localhost:3000 (use -p 3001 se a porta estiver ocupada)
   ```
5. **Rodar os checks e o build:**
   ```bash
   npm run check            # lint, design, lib-first, tier, tokens
   npm run build            # TypeScript + páginas estáticas
   npm run start            # serve o build
   ```
6. **Figma (opcional, só para sincronizar):**
   - Os tokens vêm pelo MCP do Figma (`use_figma`), com os scripts `figma-fingerprint.js` e
     `figma-dump.js`, seguindo `.claude/agents/figma-parity.md`.
   - Ícones e o inventário de componentes também podem vir pela API REST, com um
     `.env.local` local contendo `FIGMA_TOKEN` e `FIGMA_FILE_KEY`. Esse arquivo é ignorado
     pelo git, e **o token nunca é impresso, colado ou commitado**.

Se quiser replicar a doc para **outro** design system com a mesma estrutura, os pontos de
troca são estes:

- o snapshot `tokens/<ds>.figma.json`, com o mesmo formato do `figma-dump.js`;
- o `cssPrefix` em `meta`;
- o catálogo de fontes;
- os componentes de `lib/ui` com os seus metas e demos.

O resto (`emit.mjs`, `build-catalog.ts`, o shell, as rotas e os checks) é genérico e lê
tudo do dado.
