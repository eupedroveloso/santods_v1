# SantoDS — arquitetura

> Como o repositório é montado, de onde vem cada valor e o que cada check cobra. Os
> caminhos são relativos à raiz do repo. Estado de 2026-10-19 (HEAD `406f2cf`).

## Estrutura de pastas

```
tokens/
  santods.figma.json        FONTE DA VERDADE: espelho das Variables e Styles do Figma
  santods.components.json   inventário de componentes Figma × código (gerado)
  VTSD.proposal.md          spec do modo de marca VTSD (rampas, contraste, ordem)
  README.md                 arquivos, marcas e dívidas conhecidas (D1)
  .cache/                   inventário da página Icones (cache local, fora do git)

lib/tokens/
  emit.mjs                  emissores puros: ÚNICO caminho de renderização (código-fonte)
  emit.d.ts, types.ts       tipos (código-fonte)
  tokens.css                GERADO: variáveis --santo-* (Light, Dark, um bloco por marca)
  typography.css            GERADO: as 68 classes .santo-<papel>-<peso>
  theme.css                 GERADO: @theme inline do Tailwind v4
  index.ts                  GERADO: tokens tipados (token, colorValue, textStyles, shadows…)

lib/ui/                     biblioteca de componentes (README.md = inventário e critério)
  <modulo>.tsx              o componente
  <modulo>.meta.ts          metadado (dado puro): nome, slug, categoria, tier, par no Figma
  <modulo>.demo.tsx         demos vivas e playground
  registry.ts / demos.ts    juntam os metas / as demos
  index.ts                  barril: import { … } from "@/lib/ui"
  radius.ts                 raio por família de peça (princípio 5)
  controls.css, motion.css, surface.css   o que precisa de pseudo-elemento, motion e superfície
  icons.tsx                 apelidos semânticos dos ícones gerados (Search, Close, More…)

lib/thumbs/                 miniaturas em esqueleto do índice /componentes (<slug>.thumb.tsx)
lib/icons/                  ícones exportados do Figma (gerado, exceto needed.txt)
lib/fonts/
  catalog.ts                32 famílias do Google Fonts, eixos de peso conferidos na API
  used.ts                   famílias que o app pode renderizar (todas as marcas)
lib/docs/
  build-catalog.ts          núcleo puro do catálogo da doc (tokens → estruturas de página)
  catalog.ts                lê o snapshot no servidor e expõe list*/get*/searchIndex

app/                        site de documentação (ver 04-site-de-documentacao.md)
  _docs/                    shell, cabeçalho de página, demos, índice, links, site.ts
  _components/              tema, marca e o script que roda no <head>
  componentes/, tokens/, estilos/, identidades/, exemplos/   rotas
  globals.css               importa Tailwind, os tokens gerados e os CSS da lib

scripts/                    build de tokens, checks e scripts do Figma
public/brand/               logos (Santo, VTSD) e fotos de demo (WebP 48/96/192)
.claude/agents/, .claude/skills/   manuais dos agentes e skills (ver 05-regras-e-rubricas.md)
AGENTS.md (CLAUDE.md aponta para ele)   regras inegociáveis do repo
```

## Fonte da verdade e caminho de renderização

Tudo começa em `tokens/santods.figma.json`, um espelho fiel do Figma: 5 coleções de
Variables, 68 text styles e 7 effect styles. Os aliases são escritos como
`{caminho/da/variavel}`.

| Coleção | Variáveis | Modos | Papel |
|---|---|---|---|
| `Palette` | 79 | um por marca (`Santo`, `VTSD`) | rampas cruas: brand, accent, neutral, success, warning, danger, info |
| `Color` | 102 | `Light` / `Dark` | camada semântica: superfície, texto, borda, ícone, `bg/<intenção>/solid|subtle/*` |
| `Primitives` | 129 | `Value` | a física do sistema: `dimension/*`, `type/*`, `motion/*`, `layer/*` |
| `Brand` | 5 | um por marca | `brand/id`, `brand/name`, `brand/family/sans|mono`, `brand/shape/radius-base` |
| `Semantic` | 30 | `Value` | apelidos de camiseta: `space/*`, `radius/*`, borda, foco |

O fluxo é sempre num sentido só:

```
Figma ──(scripts/figma-dump.js via MCP)──▶ tokens/santods.figma.json
       ──(npm run tokens = scripts/build-tokens.mjs → lib/tokens/emit.mjs)──▶ lib/tokens/*.css, index.ts
       ──(app/globals.css importa)──▶ utilitários Tailwind + classes .santo-*
```

- **Nada em `lib/tokens/` é editado à mão.** Valor errado no CSS significa snapshot
  desatualizado (sincronize com o Figma) ou emissor com bug (corrija `emit.mjs`). Nunca é
  remendo no gerado. As exceções, que são código-fonte de verdade, são `emit.mjs`,
  `types.ts` e os `.d.ts`.
- **`emit.mjs` é o único caminho de renderização.** É um módulo puro, sem disco, que roda
  igual no Node e no browser. O catálogo da documentação (`lib/docs/build-catalog.ts`)
  também tira dele os nomes de var CSS e de classe, então o que a doc mostra é o que o CSS
  declara.
- O nome da variável CSS é `--santo-` + o caminho do Figma, com `/` virando `-`. Isso vem do
  `codeSyntax.WEB` configurado nas 345 variáveis. Um alias vira `var(--santo-alvo)` e
  preserva a cadeia do Figma (`radius/md` → `brand/shape/radius-base` →
  `dimension/radius/8` → `dimension/space/8` → `8px`).
- As unidades são: px em `dimension/*`, `type/size/*` e `type/leading/*`; em em
  `type/tracking/*` (valor/100); ms em `motion/duration/*`; sem unidade em `type/weight/*` e
  `layer/*`; e `motion/easing/*` sai cru.
- Temas: o modo Light vai no `:root`. O Dark vai em `@media (prefers-color-scheme: dark)`
  com a guarda `:root:not([data-theme='light'])` e também em `:root[data-theme='dark']`.
  Sem atributo, o site segue o sistema.

### Como os tokens viram classe

- `color/bg/*` perde o segmento `bg`: `bg-brand-solid-default`, `bg-surface-page`. As
  outras famílias mantêm o prefixo: `text-text-primary`, `border-border-subtle`,
  `fill-icon-primary`.
- O espaçamento e o raio entram pelos nomes semânticos (`p-md`, `gap-lg`, `rounded-xl`). A
  escala numérica do Tailwind fica intacta de propósito (`p-4` continua 1rem). Não se
  mapeia `dimension/space/N` para `--spacing-N`.
- `dimension/container/*` não entra no `@theme`, para não redefinir `max-w-sm`/`max-w-lg`.
  Escreva `max-w-(--santo-dimension-container-lg)`. É uma armadilha conhecida: `max-w-4xl`
  resolve pela escala de **espaçamento** e virou 64px num modal. O `design:check` cobra.
- Tipografia: uma classe por papel, `santo-heading-1-bold` … `santo-caption-small-regular`
  e `santo-code-md`.
- Sombra: `shadow-xs` … `shadow-2xl`, a partir dos effect styles.

## Marcas e `data-brand`

Uma marca é um modo nas coleções `Palette` e `Brand`. `Color`, `Primitives` e `Semantic` são
compartilhadas por todas as marcas. Como `Color` aponta para degraus da `Palette`, trocar a
marca troca a cor de tudo sem que nenhum componente saiba disso.

No CSS gerado, cada marca ganha um bloco `[data-brand='<brand/id>']`, com a variante Dark
correspondente (`:root[data-theme='dark'] [data-brand='vtsd']`). O atributo vale em
**qualquer elemento**. Na raiz, muda o site inteiro; num contêiner, pinta só aquela área. Uma
prévia de outra marca dentro da doc funciona assim. Sem o atributo, vale a marca
padrão, que é a primeira do Figma (Santo).

| Marca | `brand/id` | Família sans | Mono | Raio base | Cor de marca |
|---|---|---|---|---|---|
| Santo | `santo` | Albert Sans | JetBrains Mono | `dimension/radius/8` | azul (`brand/600` = `#4693ff`) |
| Venda Todo Santo Dia | `vtsd` | Sora | JetBrains Mono | `dimension/radius/8` | verde (`#00A99D`) |

**Para criar uma marca nova:**

1. Gere as rampas a partir da cor oficial com `node scripts/brand-ramp.mjs '<hex>'`. Ele
   copia a curva de luminância da marca padrão, então todo contraste garantido pela `Color`
   vale na marca nova.
2. Escreva a spec, no modelo de `tokens/VTSD.proposal.md`.
3. Crie o modo no Figma com `scripts/figma-brand-mode.js` (primeiro com `DRY_RUN`). Depois
   faça o dump, rode `check-parity --write` e `npm run tokens`.

`scripts/apply-brand-mode.mjs` aplica o mesmo modo direto no snapshot. Foi uma exceção
autorizada, e deixa `meta.aheadOfFigma` marcado até a reconciliação.

No site, o seletor de marca grava `data-brand` na raiz e o `localStorage` (`santo-brand`).
`lib/ui/use-active-brand.ts` permite que um componente leia a marca ativa.

## Fontes do Google

A tipografia vem do **Google Fonts**, resolvida pelo **nome real da família**, que é o valor
de `brand/family/sans` e `brand/family/mono`. Isso é deliberado: o `next/font` gera um nome
hasheado (`__Albert_Sans_8304b7`) que nunca casaria com o token, e trocar o token deixaria
de trocar a fonte.

- `lib/fonts/catalog.ts` tem 32 famílias com os eixos de peso conferidos contra a API do
  Google e monta a URL da folha (`googleFontUrl`). Para usar uma família nova, inclua-a
  aqui primeiro.
- `lib/fonts/used.ts` (`familiesInUse`) soma as famílias de **todos** os modos de marca. O
  layout coloca as folhas no `<head>` do HTML inicial, então o seletor de marca troca a
  família sem recarregar e sem trocar a fonte na frente de quem lê.

## Ícones

Os ícones saem **só** da página `Icones` do Figma, uma biblioteca Font Awesome com cerca de
5,4 mil ícones e as variantes Light/Regular/Solid/Duotone. **Só os que estão em uso** entram
no git:

- `lib/icons/needed.txt` é o único arquivo editado à mão: uma linha por slug, com peso
  opcional (`slug:solid`) e apelidos pt-BR para a busca (`magnifying-glass | lupa, buscar`).
- `lib/icons/` (um componente React por ícone, `svg/`, `index.ts`, `manifest.json`) é gerado
  por `node scripts/figma-icons.mjs build`.
- O inventário da página inteira fica em `tokens/.cache/santods.icons.json`, um cache local
  regenerável e ignorado pelo git.
- `lib/ui/icons.tsx` reexporta os ícones com nomes de **papel** (`Icon.Search`,
  `Icon.Close`, `Icon.More`). Trocar o desenho é trocar o apelido, não cada uso.
- **Para baixar um ícone novo:** o caminho padrão é o MCP `download_assets`. Sem OAuth do
  MCP, use `node --env-file=.env.local scripts/figma-icons-rest.mjs <dir> --build`, que lê
  `FIGMA_TOKEN` e `FIGMA_FILE_KEY` do ambiente. **O token nunca é impresso, colado em nota
  nem commitado.** O `.env*` é ignorado pelo git.

## `lib/ui` e os tiers

Todo componente vive em `lib/ui/` e é importado de `@/lib/ui`. Antes de criar um, confira
se ele já existe no `lib/ui/README.md`, que é o inventário com a frase de **quando usar**.

Cada módulo tem três arquivos: o componente, o `.meta.ts` e o `.demo.tsx`. O `registry.ts`
junta os metas (dado puro, serve a Server e Client Components). O `demos.ts` junta as demos
(só cliente). **Componente fora do registro não existe para a documentação.**

Os componentes se dividem em dois **tiers**, e o critério é objetivo:

- **Primitivo:** bloco genérico, sem significado de produto, que **não importa outro
  componente de `lib/ui` além de `Icon`**. Se precisar do conteúdo de outro componente,
  recebe um slot (`ReactNode`), nunca um import.
- **Semântico:** carrega um papel de produto (navegação, conversa, dado, formulário, feed,
  gráfico, bloco de landing ou dashboard), componha algo ou não. Um semântico se monta
  **só** com primitivos da lib: markup cru que imita um primitivo é dívida.

As categorias são: Ação, Entrada, Cor, Estrutura, Navegação, Dado, Aplicação, Código,
Blocos e Ícones. A categoria **Blocos** (`StatCard`, `ChartCard`, `TransactionsCard`,
`HeroCard`…) é o que as telas de exemplo podem compor.

Outras peças de apoio da lib:

- `radius.ts` concentra o raio por família de peça: `RADIUS_CONTROL` = `rounded-md`, trilho,
  `RADIUS_BADGE`, `RADIUS_BAR` = `rounded-xs`.
- `text-class.ts` concentra as classes de texto.
- `button-class.ts` deixa um link ter cara de botão sem replicar o markup.
- `motion.ts` e `motion.css` têm as entradas `santo-animate-*` e as transições
  `santo-transition-*`, que respeitam o `prefers-reduced-motion`.
- `use-modal.ts`, `use-mod-key.ts` e `use-active-brand.ts` são hooks.
- `demo-kit.ts` e `demo-people.ts` são o apoio às demos.

O par no Figma é declarado no meta (`figma: { name, nodeId }`). Sem ele, a página do
componente mostra a tag "Sem par no Figma". `node scripts/figma-components.mjs` cruza o
Figma com o código e grava `tokens/santods.components.json`.

## Miniaturas da vitrine (`lib/thumbs`)

O índice `/componentes` mostra cada componente como uma miniatura em **esqueleto**:
`ThumbFrame` (um poço 16:10 com grade sutil e cartão no centro) mais `Skeleton`, sem texto,
ícone ou cor de marca. A gramática completa (proporções, um protagonista, tons) está na
skill `santo-vitrine`. Todo slug novo no registry pede um `lib/thumbs/<slug>.thumb.tsx`
registrado em `lib/thumbs/index.ts`, e o `tier:check` confere que existe uma miniatura para
cada componente.

## Scripts e checks

| Comando | Script | O que cobra |
|---|---|---|
| `npm run tokens` | `scripts/build-tokens.mjs` | Gera `lib/tokens/*` a partir do snapshot (`--out <dir>` ensaia fora do repo). |
| `npm run tokens:check` | `scripts/check-parity.mjs` | Sem argumento: consistência interna do snapshot (aliases apontam para variáveis existentes, sem ciclo) e o aviso de `aheadOfFigma`. Com `<dump.json>`: diff contra o Figma, saindo com 1 se divergir; `--write` grava o dump como snapshot. |
| `npm run tokens:fingerprint` | `check-parity.mjs --fingerprint` | Um hash por coleção e por grupo de styles, para comparar com `scripts/figma-fingerprint.js` rodado no Figma. |
| `npm run design:check` | `scripts/check-design.mjs` | Varre `app/`, `lib/ui/` e `lib/thumbs/` atrás de: (1) hex cru; (2) valor arbitrário em classe (dentro de colchete só vale `var(--santo-*)`); (3) classe de token que não existe, que o Tailwind ignoraria calado; (4) `max-w-<nome-de-escala>`. As isenções são declaradas com motivo (`color-picker.tsx`, `color.ts`). |
| `npm run lib:check` | `scripts/check-lib-first.mjs` | Tela compõe a partir de `lib/ui`. **A:** markup cru que replica componente (`<button>`, `<input>`, `<table>`…, link com cara de botão, div com cara de cartão, pílula com cara de Tag, item de nav à mão). **B:** `className` de aparência passado a componente da lib (vira variante). **C:** grade inline (`grid` + `grid-cols-*`/`gridTemplateColumns`), que deve ser `CardGrid`. **D:** em `app/exemplos`, a tela só compõe blocos da categoria `blocos`. A exceção exige o comentário `lib-first-ok: <motivo>`. |
| `npm run tier:check` | `scripts/check-tier.mjs` | Todo meta tem `tier`, nenhum primitivo importa outro componente e cada slug tem miniatura. |
| `npm run lint` | `eslint` | ESLint com `eslint-config-next`. |
| `npm run check` | `scripts/check.mjs` | Roda lint, design, lib-first, tier e tokens até o fim, mesmo com falha, e resume. O build fica de fora de propósito. |
| `npm run build` | `next build` | TypeScript e pré-renderização estática de todas as rotas. |

Quando rodar o quê:

- Depois de mexer em token: `npm run tokens && npm run tokens:check`.
- Depois de mexer em interface: `npm run design:check && npm run build`.
- Antes de entregar: `npm run check`, mais o build.

**Scripts do Figma.** Os `.js` são colados inteiros no `use_figma` do MCP. Os `.mjs` rodam no
Node.

| Script | Faz |
|---|---|
| `figma-fingerprint.js` | Hashes, só leitura. As funções são cópia literal de `parity-hash.mjs`; mexeu num, mexa no outro. |
| `figma-dump.js` | Dump completo no formato do snapshot, só leitura. |
| `figma-components.js` / `figma-components-rest.mjs` / `figma-components.mjs` | Inventário de componentes por MCP ou REST, depois o pareamento com `lib/ui`. |
| `figma-icons.js` / `figma-icons.mjs` / `figma-icons-rest.mjs` | Inventário da página Icones, plano de exportação e build de `lib/icons`. |
| `figma-brand-mode.js` | **Escreve** um modo de marca no Figma (idempotente, com `DRY_RUN`). É a fonte única da spec que o `apply-brand-mode.mjs` também lê. |
| `brand-ramp.mjs` | Gera as rampas de uma marca nova. Não escreve nada. |

A API REST do Figma funciona com o plano Pro para styles, componentes, nós e exportação de
imagens. Os endpoints de Variables são Enterprise e retornam 403, então tokens só pelo MCP.

## Paridade com o Figma

O agente `figma-parity` (`.claude/agents/figma-parity.md`) é o dono do processo.

1. **Checagem barata:** rode o fingerprint no Figma e `npm run tokens:fingerprint` aqui, e
   compare hash por hash.
2. **Algum hash diferente:** faça o dump, rode `check-parity <dump>` e mostre as
   divergências ao Pedro antes de gravar. Um token removido ou renomeado quebra consumidor.
3. **Com o ok:** `--write`, `npm run tokens`, `tsc`, build, e atualize a tabela de hashes de
   referência no manual.

A paridade cobre também componentes e estilos (princípio 2). Componente sem par aparece na
própria página como "Sem par no Figma", e a dívida fica listada no relatório de quem o
criou.
