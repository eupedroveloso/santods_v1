# Modo de marca SPP — Seu Produto Pronto

**Status: APLICADO AO SNAPSHOT, À FRENTE DO FIGMA** (dívida de paridade). Autor: Compasso, 2026-10-21.
3º modo de marca do DS, ao lado de Santo (padrão) e VTSD, no mesmo mecanismo da VTSD:
`MODE` + `SPEC` em `scripts/figma-brand-mode-spp.js`, aplicado por
`node scripts/apply-brand-mode.mjs --spec scripts/figma-brand-mode-spp.js`. O rastro fica em
`meta.aheadOfFigma.also`, com a tag `brand-mode-spp`. O emit consome o modo sem adaptação.

| | valor |
|---|---|
| modo (coluna no Figma) | `SPP` |
| `brand/id` / `data-brand` | **`spp`** |
| `brand/name` | `Seu Produto Pronto` |
| rascunho do Estúdio | `tokens/SPP.rascunho.json` (formato `RascunhoLivre`) |
| logos | `public/brand/spp-logo.svg` (claro) e `public/brand/spp-logo-dark.svg` (escuro), vetoriais |

**Por que `spp` e não `seu-produto-pronto`:**
- Segue a convenção da VTSD, cuja sigla vira o id (`vtsd` = Venda Todo Santo Dia).
- O id aparece em todo `[data-brand='…']` do CSS, no `index.ts` (`BrandId`) e no seletor de marca.
- Uma sigla curta e estável é melhor nesses lugares do que um nome que pode mudar de redação.
- O nome por extenso fica em `brand/name`.

## 1. O que foi lido do Figma

Arquivo `npntxOrWtAEi5mRQcwRxl8` ("Seu Produto Pronto"), nó **`1938:4758` "Captura"**: uma landing page de 1920 × 11727 px com 742 nós.

**Como foi lido:** pelo MCP, só leitura.
- `get_metadata` deu a estrutura.
- `get_variable_defs` deu as variáveis ligadas: `space/0..44`, `typography/*` e a família `Albert Sans`.
- `get_design_context` no hero `1938:4761`.
- `get_screenshot` da página inteira.
- Um script de contagem via `use_figma`, que conta cores, raios, efeitos, fontes, espaços e strokes em todos os nós visíveis.

Seções:
- `1938:4761` Primeira Dobra (claro);
- `1938:4900` e `1938:4963` (escuras, com brilho azul radial);
- `1938:5074` (clara, prova social);
- `1938:5338`, `1938:5384` e `1938:5394` (escuras, FAQ);
- `1938:5473` rodapé.

| aspecto | o que o arquivo usa (contagem nos nós visíveis) |
|---|---|
| azul de marca | `#46abec` (28 textos; tintas de 4/16/32% nas seções escuras; borda a 12%). Ícones e destaques no claro: `#0b5cff` (hero `1938:4814`, "no zoom" `1938:4819`), `#286efd` (preço), `#3e76c1` |
| gradientes | título `#49c2ff → #331e79` (6×), logo `#2fb4f7 → #331e79`, selo laranja `#ff9500 → #ce5601`, CTA verde `#06c05d ↔ #089f4e` (6×), barra `#09944a → #06c05d → #edd62a → #ed2a2a` |
| neutros | texto `#100a0d` (100%, 88%, 80%, 48%); superfícies `#ffffff`, `#eeeeee`; fundo escuro quase preto quente; branco a 80/90% no escuro |
| tipografia | **Montserrat** Regular (69), SemiBold (33), Bold (16), ExtraBold (12), Medium (4). A variável `typography/font-family/primary` do arquivo diz Albert Sans, mas o texto real é Montserrat. Também aparecem Inter Medium (prints de depoimento) e Exo (sobreposto por Montserrat) |
| tamanhos | 24 (64×), 18 (32×), 32 (25×), 20, 25,6, 60 (11×, H1), 36, 22, 14/15, 48, 64, 96 |
| entrelinha | 160% (62×), 150% (51×), 125% (títulos, 15×) |
| tracking | **−3%** (108 segmentos, títulos e parágrafos grandes), 0% (83), −2% (5) |
| raio | **16** (52×, cards), **8** (20×, botões, selos e tooltips), 10, 20, 24 |
| espaço | gap 8 (68×), 16 (49×), 24 (46×), 12, 32, 20, 4, 40, 48; padding 16/24, 24/32, 88 nas seções |
| stroke | 2 e 2,22 px (57×), 1,5 px (botões e cards do hero), cor `#100a0d` a 16% ou branco a 12% |
| sombra | cards `0 24 48 −24 #100a0d @16%` (9×); CTA `0 16 32 −24 @64%`; `0 32 48 −32 @48%` |
| efeitos | **BACKGROUND_BLUR r16** (10×, vidro; o Dev Mode exporta `backdrop-blur(8px)`). Card de vidro do hero `1938:4808`: fundo `#dbdbdb @24%`, borda 1,5 px `#100a0d @6%`, raio 8. LAYER_BLUR 10 e gigantes (424–575, brilhos decorativos) |
| controles | CTA `1938:4824`: altura 76, padding 16/24, borda 1,5 branca, raio 8, ícone e rótulo em Montserrat Bold 24, gap 12. Botões menores com padding 12/16 e 16/24 |
| superfície | claro: página branca com cards brancos de borda fina (`#eeeeee`) e sombra longa. Escuro: chão quase preto quente com cards tintados de azul a 4% e borda branca a 12% |
| logo | grupo `1938:4764` no header: "SEU PRODUTO" em vetor preto e selos "PRONTO" (gradiente azul) e "com IA" (gradiente laranja). A instância de logo `1938:5258`, numa seção oculta, mostra "Seu produto" em **branco** para fundo escuro e em `#100A0D` para fundo claro |

## 2. Como foi adaptado ao contrato (e por quê)

Rascunho em `tokens/SPP.rascunho.json`, derivado por `lib/tokens/estudio.mjs` (`derivar(doc, rascunho, { indice })`).

| estilo | rascunho | por quê |
|---|---|---|
| cor | `origem 'marca'`, `marca #46abec`, `ancora '500'` | `#46abec` é o azul mais usado e o da família da logo. Sua luminância casa com o degrau 500 do Santo (Y 0,365 contra 0,361) |
| | `passos.cor.brand['700'] = #0b5cff` | o design usa `#0b5cff` para ícone e destaque sobre branco, e brand/700 é o link e o foco no tema claro (`text/link/default`, `border/focus`). Com isso o link fica idêntico ao design, com contraste 5,26 |
| | `neutros: { origem: 'manual', base: '#100a0d' }` | o preto quente da marca entra exato em `neutral/950`, e a rampa inteira herda o tom levemente magenta. Valor de neutros manuais: não depende do azul |
| tipografia | Montserrat no corpo e nos títulos; JetBrains Mono no mono | Montserrat está no índice do Google (variável 100–900), então os 6 pesos do sistema (300–800) cabem. O arquivo não tem mono |
| | escala (tabela, caption-small → H1): 12/16, 14/20, 16/24, 18/28, 20/32, 24/32, 28/36, 32/40, 36/44, 48/60, **60/76** | H1 60 com entrelinha 125% (= 75, arredondada para par), como no hero; corpo 18 a 150% e 24/32 nos títulos menores. Os 24/32 px dos parágrafos de landing ficam em body-large e heading-6 |
| | `tracking −3%` nos 6 títulos e em body-large; 0 no resto | é o −3% dominante do arquivo. Tracking negativo no texto de UI (≤ 16 px) prejudica a leitura, então body, body-small e as legendas ficam em 0 |
| raio | `{ container: 16, controle: 8, curva: 'santo' }` | 16 nos cards e 8 nos controles, exatamente os dois raios dominantes. A curva Santo dá xs 8, lg 24 e xl 32, que também aparecem no arquivo |
| espaço | `{ unidade: 4, curva: 'santo' }` | os gaps e paddings do arquivo (4, 8, 12, 16, 20, 24, 32, 40, 48) são a escala do Santo |
| sombra | `{ intensidade 1,75, tinta '#100a0d', desfoque 3, deslocamento 2 }` | a sombra dos cards (`0 24 48`, 16%) vira o nível lg: y 12 → 24, blur 16 → 48 e alfa 9% → 16% |
| controles | sm 36 / md 44 / lg 56; padding sm/md/lg; borda 2; fonte caption/body-small/body (14/16/18); ícone 16/20/20; gap xs/sm/sm; raio 'controle' | o CTA de 76 px é peça de landing, não altura de controle de DS; lg 56 é o teto razoável. A borda de 1,5 px do arquivo arredonda para 2, porque o DS só tem espessuras inteiras e 2 é o stroke dominante. Ícone 20 e gap 12 vêm do CTA. A auditoria de controles não dispara nenhum aviso |
| superfícies | tratamento **plana**. Claro: page/raised 0, sunken 50, well 100, panel 0; bordas 100/200/400. Escuro: page 1000, raised/panel 950; bordas 900/800/**500** | no claro, chão e card brancos com borda fina, como no arquivo. No escuro, o card é um degrau acima do chão. `border/strong` escuro vai para 500 para passar a 3:1 (3,95), em vez de herdar o achado do Santo (2,70) |
| | vidro: blur md, alfa 0,24/0,04, borda 0,06/0,12, tinta `neutral/200` / `brand-500`, **corBorda `1000` / `0`** | é o card de vidro do hero (`#dbdbdb` a 24% e borda escura a 6%) e os cards tintados de azul a 4% do escuro. O parâmetro `vidro.corBorda` é **novo**: antes a borda do vidro era sempre branca, o que não reproduzia a borda escura do claro |
| efeitos | blur 8/16/32/64; layer blur 10/64; glow brand/500 a 32% e neutral/950 a 16%, desfoque 48; gradiente 96°, brand/400 → brand/950; noise 0,04 | o blur 16 (raio do Figma) é o vidro do hero. O glow segue as tintas de azul a 32%. O gradiente segue o ângulo do título (~96°) |

## 3. O que ficou fora (e por quê)

- **Laranja `#ff9500 → #ce5601` e verde do CTA `#06c05d`:** `accent` e as cores de status são **travados** no contrato, iguais em todas as marcas, porque "deu certo" precisa ter a mesma cor em todos os produtos. Ficam só na logo e nas peças de landing.
- **Índigo `#331e79`, fim do gradiente do título e da logo:** não está na rampa azul. O gradiente do DS termina em `brand/950` (`#002136`, azul profundo), e o gradiente exato vive na logo.
- **Gradiente do título, barra de progresso de lote, CTA de 76 px e brilhos de LAYER_BLUR 424–575:** são peças de landing, não tokens. Ficam para um componente de landing (Ateliê), se o Pedro quiser.
- **Spread negativo das sombras** (−24/−32): a geometria de spread é travada no DS. O resto do perfil (y, blur, alfa e tinta) foi reproduzido.
- **Texto principal em `#100a0d` (950):** a Color mapeia `text/primary` para `neutral/900` em todas as marcas, então a SPP sai em `#20171c`. Mudar isso mudaria Santo e VTSD.
- **Exo, Inter e Font Awesome:** Exo está sempre sobreposta por Montserrat. Inter só aparece em prints de depoimento. Os ícones do DS vêm da página Icones do Santo.
- **Albert Sans na variável do arquivo:** contradiz o texto real, que é Montserrat. Valeu o texto.

## 4. Auditoria de contraste (WCAG 2.x, 67 pares × 2 temas)

O que reprova:
- **Claro:** `text/on-brand` sobre `bg/brand/solid/default` = **3,07** (D1); `border/default` sobre page/raised/sunken = 1,23/1,23/1,18 (exceção aceita).
- **Escuro:** `text/on-brand` sobre hover/active = **3,07 / 2,53** (D1); `border/default` = 1,45/1,41/1,45 (exceção aceita).
- Tudo marcado como dívida registrada (D1, Color compartilhada) ou exceção aceita. **Nenhuma reprovação nova.**

Destaques:
- link no claro 5,26;
- `text/brand` no claro 7,36;
- `text/primary` 17,49;
- `text/tertiary` 5,10;
- `border/strong` no escuro **3,95** (o Santo e a VTSD dão 2,70).

Vidro, no pior fundo:
- texto secundário sobre vidro em cima de `bg/brand/solid` reprova: **2,82** no claro e **3,49** no escuro;
- o texto primário passa: 6,91 e 4,52.

**Regra para a SPP:** vidro sobre fundo de marca, só com texto primário.

Controles: nenhum aviso (alvo, apertado, pílula, ícone, padding × raio).

## 5. Rampas (SPP × Santo)

| degrau | SPP | Santo | Y SPP | branco sobre |
|---|---|---|---|---|
| `brand/50` | `#ecf3f9` | `#edf3fb` | 0.8877 | 1.12 |
| `brand/100` | `#dfeffa` | `#e2edfe` | 0.8432 | 1.18 |
| `brand/200` | `#c9e3f8` | `#cde2fe` | 0.7413 | 1.33 |
| `brand/300` | `#a8d3f4` | `#b1d0fe` | 0.6145 | 1.58 |
| `brand/400` | `#7ac0f1` | `#8bbaff` | 0.4819 | 1.97 |
| `brand/500` | `#46abec` | `#64a3fe` | 0.3648 | 2.53 |
| `brand/600` | `#009be6` | `#4693ff` | 0.2916 | 3.07 |
| `brand/700` | `#0b5cff` | `#2c71cf` | 0.1495 | 5.26 |
| `brand/800` | `#005b88` | `#1c54a0` | 0.0926 | 7.36 |
| `brand/900` | `#004469` | `#14407c` | 0.0515 | 10.34 |
| `brand/950` | `#002136` | `#021e45` | 0.0135 | 16.52 |
| `neutral/0` | `#ffffff` | `#ffffff` | 1.0000 | 1.00 |
| `neutral/50` | `#fbfafa` | `#f8fafb` | 0.9578 | 1.04 |
| `neutral/100` | `#f5f2f4` | `#f0f3f8` | 0.8945 | 1.11 |
| `neutral/200` | `#ece6e9` | `#e3e8ef` | 0.8031 | 1.23 |
| `neutral/300` | `#dad3d6` | `#ced5df` | 0.6635 | 1.47 |
| `neutral/400` | `#96878e` | `#7d8ca0` | 0.2576 | 3.41 |
| `neutral/500` | `#776b70` | `#636f7f` | 0.1561 | 5.10 |
| `neutral/600` | `#62545b` | `#4d596a` | 0.0969 | 7.15 |
| `neutral/700` | `#4b4045` | `#394352` | 0.0559 | 9.91 |
| `neutral/800` | `#332a2e` | `#242d39` | 0.0256 | 13.89 |
| `neutral/900` | `#20171c` | `#131a25` | 0.0100 | 17.49 |
| `neutral/950` | `#100a0d` | `#090f17` | 0.0036 | 19.60 |
| `neutral/1000` | `#0a0608` | `#08060b` | 0.0021 | 20.14 |

## 6. Logo

- `public/brand/spp-logo.svg`, 168 × 57, para fundo claro.
  - Exportado do grupo `1938:4764` (`exportAsync` SVG e `download_assets`).
  - Removi só o fundo de canvas da exportação: `rect #1E1E1E` e o retângulo branco da página.
  - Vetorial, sem raster, com `role="img"` e `<title>`.
- `public/brand/spp-logo-dark.svg`, para fundo escuro.
  - É o mesmo arquivo, com "SEU PRODUTO" (10 caminhos) de preto para **branco**.
  - A evidência está no próprio arquivo: a instância de logo `1938:5258` traz "Seu produto" branco na versão escura.
  - Os selos com gradiente não mudam.

## 7. Mudanças de infraestrutura que vieram junto

- **Unidade do desfoque, correção no emit (mexe no build):** o raio de BACKGROUND_BLUR/LAYER_BLUR do Figma é o **dobro** do `blur()` do CSS. O Dev Mode exporta `radius / 2`: o card do hero tem r16 e sai `backdrop-blur(8px)`.
  - Os tokens `effect/blur/*` guardam o raio do Figma.
  - O emit agora gera `blur(calc(var(...) / 2))` nos effect styles e `--blur-effect-*: calc(... / 2)` no Tailwind.
  - Nenhum componente usava esses tokens, e só essas 5 variáveis mudaram.
- **Vidro:** `vidro.corBorda` (degrau neutral por tema; padrão 0 = branco, que mantém Santo e VTSD).
- **`scripts/apply-brand-mode.mjs --spec <script>`:** aplica outros modos de marca com rastro próprio em `aheadOfFigma.also`.
- **`scripts/figma-nivel-b-apply.mjs`:** um modo que a spec do nível B não lista mantém o valor do snapshot.
- **`scripts/figma-brand-mode.js`:** aceita `#rrggbbaa`, porque as cores do nível B têm alfa.

## 8. Ordem de reconciliação com o Figma (quando houver edição)

1. `figma-brand-mode.js` (VTSD).
2. `figma-nivel-b.js`.
3. **`figma-brand-mode-spp.js`**, que cobre as variáveis do nível B e por isso vem depois.
4. Dump, `check-parity` com diff vazio e `--write`.

O plano Professional aceita até 4 modos por coleção. Com Santo, VTSD e SPP são 3.
