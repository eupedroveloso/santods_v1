# Estúdio — contrato de dados (Compasso, 2026-10-21)

> **Status:** níveis A e B APROVADOS pelo maestro em 2026-10-21, só no andar `estudio`. Cópia da nota `estudio-contrato`; o Compasso atualiza este arquivo conforme implementa (seção "Implementação" no fim).

Um sistema salvo no Estúdio É um modo de marca, no mesmo formato da VTSD
(`MODE` + `SPEC` de `scripts/figma-brand-mode.js`). O `emit.mjs` o consome sem adaptação.
Prefixo CSS: `santo`. Variável = `--santo-` + caminho com `/` trocado por `-`.

## 0. Leia antes: o que o núcleo aceita HOJE e o que exige mudança

| nível | o que varia por marca | mudança no núcleo |
|---|---|---|
| **A, pronto** | Palette (79: as rampas `brand` e `neutral`), Brand (5: id, name, family/sans, family/mono, shape/radius-base). Por alias, varia também `radius/md` e as 100 variáveis da Color | nenhuma |
| **B, proposta** | escala de raio inteira, espaço, tamanhos e entrelinhas de texto, família de título, sombra, altura de controle | novas variáveis na coleção Brand, no Figma e no snapshot (fluxo de paridade e aprovação do Pedro); 2 ajustes no `emit.mjs` (§2.4 e §2.5) e 1 no `lib/ui` (§2.6) |

**O Estúdio v1 deve sair com o nível A.** Os controles do nível B podem existir na interface, marcados como
"em breve", gravando só em `draft`. Hoje espaço, tipografia e sombra são **globais**: os aliases
semânticos apontam para primitivas sem modo (`space/md → dimension/space/16`, text styles →
`type/size/72`, effect styles com valor literal), então nenhum modo de marca consegue alterá-los.

## 1. Formato salvo (uma linha no banco por sistema)

```jsonc
{
  "schema": "santods.brand-mode/1",
  "base": {                          // contra qual núcleo a spec foi derivada
    "fileKey": "O0xV7p3taNff97XGjNjTMl",
    "hashes": { "Palette": "<fnv1a>", "Brand": "<fnv1a>", "Color": "<fnv1a>" }  // scripts/parity-hash.mjs
  },
  "mode": "Acme",                    // nome do modo (coluna no Figma); único; sem "Santo", "VTSD" nem "Rascunho"
  "draft": { /* §2: os VALORES BASE que o usuário editou; reabrem o editor */ },
  "spec": {                          // DERIVADO do draft; congelado no save; é isto que o emit consome
    "Palette": { "palette/brand/50": "#rrggbb", "...": "79 chaves, TODAS as variáveis de Palette" },
    "Brand": {
      "brand/id": "acme",            // slug ^[a-z][a-z0-9-]*$, único; vira data-brand="acme"
      "brand/name": "Acme",
      "brand/family/sans": "Inter",  // tem que existir em lib/fonts/catalog.ts cobrindo os pesos 300–800
      "brand/family/mono": "JetBrains Mono",
      "brand/shape/radius-base": "{dimension/radius/8}"   // alias para um degrau existente, nunca número cru
    }
  },
  "descriptions": {}                 // opcional, igual ao DESCRIPTIONS do figma-brand-mode.js
}
```

Regras de validação: são as mesmas que `apply-brand-mode.mjs` e `check-parity` já cobram, e o save deve recusar sem gravar nada se alguma falhar.
- `spec` cobre exatamente todas as variáveis de Palette e Brand, nem mais nem menos.
- hex em `#rrggbb` minúsculo.
- alias aponta para variável existente.
- `brand/id` é único entre as marcas do snapshot e as salvas.
- Se `base.hashes` não bater com o snapshot atual, o sistema está **desatualizado**: rederive a partir do `draft` e mostre o diff antes de salvar.

**Consumo sem adaptação:**
`withBrandMode(doc, mode, spec)` gera um doc com um modo a mais, e `emitTokensCss(doc)` devolve o
bloco `[data-brand='acme']`. Levar ao Figma é colar `MODE`/`SPEC` em `figma-brand-mode.js`.
O Figma Professional aceita **4 modos por coleção** (hoje há 2). Por isso, sistema do Estúdio vive no banco e é emitido em
runtime; só vira modo no Figma por decisão do Pedro.

## 2. Valores base editáveis e derivação

### 2.1 Cor (nível A)

| valor base | tipo | deriva |
|---|---|---|
| `brandHex` | `#rrggbb` | `palette/brand/50..950` (11) |
| `anchor` | `"500"\|"600"\|"700"`, padrão `"600"` | degrau onde `brandHex` entra exato |
| `neutralTint` | `{ hue: number, chroma: number \| "santo" }`, padrão `{0,0}` | `palette/neutral/0..1000` (13) |

Fórmula: é a de `scripts/brand-ramp.mjs`, documentada em `tokens/VTSD.proposal.md` ("Método das rampas").
- Cada degrau tem a **mesma luminância WCAG (Y)** do degrau do Santo.
- O matiz vem de `brandHex`.
- O croma é o do degrau do Santo × `C(brandHex)/C(Santo brand/anchor)`, cortado no sRGB.
- Neutros: mesma Y por degrau. Com croma 0, o resultado é cinza puro `#vvvvvv`; `neutral/0` é sempre `#ffffff`.

Por casar Y, todo contraste que a Color garante no Santo vale para a nova marca.
`palette/accent|success|warning|danger|info/*` (55) são **copiados do Santo, travados**.

Papéis semânticos (`color/bg/brand/solid/default` → `palette/brand/600` etc.) **não se editam**:
a Color é compartilhada e muda de marca sozinha. A dívida D1 (`text/on-brand` sobre `brand/600`
abaixo de AA) vale para toda marca. O Estúdio mostra a auditoria e não esconde o problema.

**O que falta extrair** para rodar no browser (módulos puros, sem `node:fs`, ao lado do emit):
- `lib/tokens/color.mjs`: `hexToOklch`, `oklchToHex`, `luminance(hex)`, `contrast(a,b)`.
  Hoje esse código está duplicado dentro de `scripts/brand-ramp.mjs`.
- `lib/tokens/brand-ramp.mjs`:
  `brandRamps(doc, brandHex, { anchor = "600", neutralHue = 0, neutralChroma = 0 /* ou "santo": croma por degrau do Santo — opção nova */ }) → { values: Record<string,string>, audit: {name,hex,Y,baseY,vsWhite}[] }`.
  O `scripts/brand-ramp.mjs` passa a ser só o leitor do snapshot e o CLI.
- `lib/tokens/brand-mode.mjs`:
  `withBrandMode(doc, mode, spec, descriptions = {}) → doc` (cópia, sem mutar) e `validateBrandSpec(doc, spec) → string[]`.
  Hoje esse núcleo está dentro de `scripts/apply-brand-mode.mjs`, que passa a importá-lo.
- `lib/tokens/contrast-audit.mjs`:
  `auditContrast(doc, brandMode, themeMode) → { pair, fg, bg, ratio, min, pass }[]`, com os 49 pares da VTSD.proposal.
- `emit.mjs` já é puro e já roda no browser (cabeçalho do arquivo).
  Falta só **exportar** um bloco por marca: `brandBlockCss(doc, modeName, { selector = ':root', scope })`.
  Hoje esse código está em `brandBlocksCss`, que é interno. Com uma marca a saída continua idêntica.
  **Isso mexe no emit.mjs, portanto no build inteiro**, e precisa de `npm run tokens:check` com diff zero.

### 2.2 Tipografia (nível A: famílias; nível B: escala)

| valor base | nível | deriva |
|---|---|---|
| `family.body` | A | `brand/family/sans` → `--santo-font-sans` (todos os 11 papéis menos `code`) |
| `family.mono` | A | `brand/family/mono` → `--santo-font-mono` (`code`) |
| `family.heading` | B | nova `brand/family/heading` → `--santo-font-heading` (heading-1..6) |
| `typeScale` | B | `{ base: 14\|16\|18, ratio: 1.2\|1.25\|1.333 }` ou preset |

No nível A, título e corpo usam a mesma família, como hoje.

**Para `family.heading` no nível B, faltam três coisas:**
- os text styles `heading-*` passam a ligar `fontFamily` em `brand/family/heading` no Figma;
- `emit.mjs` → `fontStacks` e `textStyleCss` ganham a pilha `heading`. Hoje a escolha é binária, `mono ? 'mono' : 'sans'`;
- `theme.css` ganha `--font-heading`.

**Escala no nível B.** Brand ganha `brand/type/<papel>/size` e `brand/type/<papel>/leading`, que são 22 FLOAT para 11 papéis, e os
text styles religam `fontSize` e `lineHeight` nelas. O `textStyleCss` do emit já usa `boundVariables`
genericamente, então **não muda**. O mesmo vale para `--text-<papel>` do theme.css.

Fórmula para a escala livre:
- Se `s < 0`: `size(papel) = snap2(base × 1.15^s)`. Se não: `size(papel) = snap2(base × ratio^s)`.
- `s` por papel: caption-small −3, caption −2, body-small −1, body 0, body-large 1, heading-6 2 … heading-1 7.
- Teto de 96 e piso de 10.
- `leading = snap2(size × clamp(1.5 − (size−16)×0.008, 1.1, 1.5))`.

Tracking e pesos **não** são editáveis: `type/tracking/*` e `type/weight/*` ficam travados.
A família escolhida precisa constar em `lib/fonts/catalog.ts` cobrindo 300–800. O preview carrega a fonte
do Google Fonts pelo nome real, como já faz o `lib/fonts`.

### 2.3 Raio (nível A: base; nível B: escala)

| valor base | nível | deriva |
|---|---|---|
| `radiusBase` | A | `brand/shape/radius-base` = `{dimension/radius/0\|4\|8\|12\|16}` → **só** `radius/md` (`--santo-radius-md`) |
| escala inteira | B | novas `brand/shape/radius-<xs\|sm\|lg\|xl\|2xl\|3xl>`; os `radius/*` da Semantic passam a apontar para elas |

- Fórmula: `r(nível) = round(base × m)`, com `m = { xs .5, sm 1, md 1, lg 1.5, xl 2, 2xl 3, 3xl 4 }`.
  `none = 0` e `full = 9999` ficam fixos. Com base 8 a fórmula reproduz o Santo exato (4/8/8/12/16/24/32).
- Guarda: `radius/md ≤ 8` enquanto houver controle de 24px. Com 12, o controle vira pílula, como diz a VTSD.proposal.
  Raio interno = externo − padding, regra do raio aninhado.
- Nível B não exige mudança no emit: `brandDependents` já redeclara as semânticas que dependem de Brand.

### 2.4 Espaço (nível B)

`spaceUnit: 3 | 4 | 5`, padrão 4. Brand ganha `brand/space/<nível>` (14) e `space/*` da Semantic
passa a apontar para elas.
- Fórmula: `space(nível) = max(2, round(unit × m / 2) × 2)`.
- `m = { 3xs .5, 2xs 1, xs 2, sm 3, md 4, lg 6, xl 8, 2xl 10, 3xl 12, 4xl 16, 5xl 20, 6xl 24, 7xl 32, 8xl 48 }`.
- `none = 0`. Com unit 4 reproduz o Santo exato.

Primitivas `dimension/space/*` **não mudam**: continuam a régua absoluta. Emit sem mudança.

### 2.5 Sombra (nível B)

Hoje os effect styles são literais e globais. A cor `#100d16` é o neutral/950 antigo, uma dívida de paridade.

| valor base | deriva |
|---|---|
| `shadowTone` | `{ intensity: number, tint: "neutral" }`; a cor é `palette/neutral/950` da marca |

Nível B, no Figma:
- os effect styles ligam `color` a `color/shadow/key` e `color/shadow/ambient`;
- Brand ganha `brand/elevation/intensity`.

Fórmula: `alpha(camada) = alphaSanto(camada) × intensity`, cortado em 1. Geometria (x, y, blur, spread) **travada**.

**Falta no emit:** `shadowCss` resolver o `boundVariables` dos effects para `var(--santo-color-shadow-*)`.
Hoje ele escreve `e.color` literal. **Isso mexe no build inteiro.**

### 2.6 Controles (nível B)

`controlScale: "compacto" | "padrão" | "amplo"`.
- Hoje `lib/ui/button-class.ts` usa a primitiva direto: `h-(--santo-dimension-size-32|40|48)`.
- Nível B: a Semantic ganha `control/height/sm|md|lg` → `brand/control/height/*`, e o Ateliê troca as classes para `h-(--santo-control-height-*)`.
- `brand/shape/radius-control` já foi proposto na VTSD.proposal e entra aqui.

## 3. Presets

**Raio (`radiusBase`):**

| preset | base | xs/sm/md/lg/xl/2xl/3xl (nível B) |
|---|---|---|
| Reto | 0 | 0/0/0/0/0/0/0 |
| Suave | 4 | 2/4/4/6/8/12/16 |
| Padrão (Santo, VTSD) | 8 | 4/8/8/12/16/24/32 |
| Arredondado | 12 | 6/12/12/18/24/36/48 (avisar: controle de 24px vira pílula) |

**Densidade (`spaceUnit`, nível B):**

| preset | unit | 3xs 2xs xs sm md lg xl 2xl 3xl 4xl 5xl 6xl 7xl 8xl |
|---|---|---|
| Compacta | 3 | 2 4 6 10 12 18 24 30 36 48 60 72 96 144 |
| Padrão | 4 | 2 4 8 12 16 24 32 40 48 64 80 96 128 192 |
| Confortável | 5 | 2 6 10 16 20 30 40 50 60 80 100 120 160 240 |

**Tipografia (size/leading em px, de caption-small a heading-1):**

| preset | escala |
|---|---|
| Compacta (base 14) | 10/14 11/16 12/18 14/20 16/24 20/28 24/32 30/38 36/44 44/52 54/60 |
| Padrão (Santo, literal do snapshot) | 10/16 12/16 14/20 16/24 18/28 24/32 30/38 36/44 48/56 60/72 72/80 |
| Editorial (base 18) | 12/16 14/20 16/24 18/28 20/30 26/34 32/40 40/48 52/60 64/72 80/88 |

Os pares de família ficam nos nível A; todos já estão no catálogo:
- Albert Sans + JetBrains Mono (Santo);
- Sora + JetBrains Mono (VTSD);
- Inter + JetBrains Mono;
- Manrope + JetBrains Mono.

**Sombra (`intensity`, nível B):** Suave 0.6 · Padrão 1 · Marcada 1.6.
O alpha base por camada sai do snapshot: xs 0x14, sm 0x14/0x0f, md 0x14/0x0f, lg 0x17/0x0f, xl 0x1a/0x0f, 2xl 0x1f.

**Cor:**
- Presets de `neutralTint`: Cinza puro `{0,0}`, Tingido `{hue: H(brandHex), chroma: "santo"}` (croma do degrau do Santo, 0,01–0,035, no matiz da marca: é como o Santo é feito, H 257), Quente `{hue: 60, chroma: 0.01}`.
- Presets de `anchor`: 600 é o padrão; use 700 quando a cor oficial for clara demais para botão.

## 4. Preview ao vivo

1. Rascunho → `spec = deriveSpec(baseDoc, draft)`, a função nova do §2, que chama `brandRamps` e monta Brand.
   `mode = "Rascunho"` e `brand/id = "rascunho"`.
2. `doc2 = withBrandMode(baseDoc, "Rascunho", spec)`, e então `css = brandBlockCss(doc2, "Rascunho", { scope: "[data-brand='rascunho']" })`.
3. Injete em um único `<style id="estudio-rascunho">` e reescreva o conteúdo a cada mudança.
   O preview fica dentro de `<div data-brand="rascunho">`, e o `data-theme` da página continua valendo.
   Para comparar claro e escuro lado a lado, use `<div data-theme="dark"><div data-brand="rascunho">`.
   Atenção: o escuro do emit sai em `:root[data-theme='dark'] [data-brand]`. **Falta** aceitar `data-theme` num contêiner,
   ou o preview duplo exige iframe. Recomendo iframe com `<html data-theme>`, que não muda o emit.
4. Fonte: carregar `family.body` e `family.mono` do Google Fonts por `<link>` antes de trocar a variável.

**Variáveis que o bloco sobrescreve, todas `--santo-*`:**

Nível A (187):
- `--santo-palette-brand-{50,100,…,950}` (11)
- `--santo-palette-neutral-{0,50,…,950,1000}` (13)
- `--santo-palette-{accent,success,warning,danger,info}-*` (55, com valor igual ao Santo)
- `--santo-brand-id`, `--santo-brand-name`, `--santo-brand-family-sans`, `--santo-brand-family-mono`, `--santo-brand-shape-radius-base`
- `--santo-radius-md` (dependente)
- `--santo-color-*` (as 100 da Color que apontam para palette; Light no bloco, Dark nos 2 blocos de tema)
- `--santo-font-sans`, `--santo-font-mono`

Nível B acrescenta:
- `--santo-radius-{xs,sm,lg,xl,2xl,3xl}`
- `--santo-space-{3xs…8xl}`
- `--santo-brand-type-<papel>-{size,leading}`
- `--santo-font-heading`
- `--santo-color-shadow-{key,ambient}` (os `--santo-shadow-*` resolvem por var)
- `--santo-control-height-{sm,md,lg}`

Não use `style=""` inline nem gere CSS à mão: o único caminho de renderização é o emit.

## 5. O que NÃO pode ser alterado (contrato de nomes do núcleo)

- Prefixo `santo`, a regra `varNameOf(path) = --santo-<path com ->`, e as classes `.santo-<papel>-<peso>`.
- Nomes, modos e valores das coleções **Color** (Light/Dark, 102 variáveis, aliases para palette), **Primitives** (129) e **Semantic** (30).
  O sistema muda os VALORES de Palette e Brand, nunca para onde a Color aponta.
- As chaves de Palette: famílias `brand/accent/neutral/success/warning/danger/info` e degraus 50..950 (neutral também 0 e 1000).
  Nenhum degrau novo; nenhum removido.
- Valores de `accent` e dos status: travados, iguais ao Santo.
- Os 11 papéis de texto, os 6 pesos, `type/weight/*`, `type/tracking/*`; os 7 effect styles `none … 2xl`.
- `layer/*`, `motion/*`, `dimension/icon|container|border|size/*`, `focus/*` e `border/*`.
- Os `brand/id` reservados: `santo`, `vtsd`, `rascunho`. Os nomes de modo `Santo` e `VTSD`.
- Ninguém edita `lib/tokens/*` à mão.
  O Estúdio só lê o snapshot e as funções puras e grava no banco. Escrever no snapshot ou no Figma passa pelo fluxo de paridade (Compasso) com aprovação do Pedro.

## Implementação (Compasso, 2026-10-21, andar `estudio`)

O que está feito e **vale acima das seções 1 a 5** quando houver diferença.

### API para o Estúdio: `lib/tokens/estudio.mjs` (tipos em `estudio.d.mts`)

```ts
import doc from "@/tokens/santods.figma.json";
import type { TokenDoc } from "@/lib/tokens/types";
import { criarEstudio, RASCUNHO_PADRAO, PRESETS, type Rascunho } from "@/lib/tokens/estudio.mjs";
import { FONT_CATALOG } from "@/lib/fonts/catalog";

const estudio = criarEstudio(doc as TokenDoc, { fonts: FONT_CATALOG.map((f) => f.family) });
const r = estudio.derivar({ ...RASCUNHO_PADRAO, raio: PRESETS.raio.suave });
if (r.ok) {
  r.css;        // <style id="estudio-rascunho">; escopo [data-brand='<id>'] (ou opts.scope)
  r.familias;   // carregar do Google Fonts antes de aplicar
  r.auditoria;  // { Light, Dark }: 49 pares cada, com pass e knownDebt
  r.salvo;      // o JSON do banco (schema santods.brand-mode/1)
} else r.problems; // string[] — nada lança por validação
```

- `derivar` não lança em problema de validação: devolve `ok: false`. Lança só em
  rascunho malformado, como um preset inexistente.
- Custa cerca de 8 ms, o que basta para recalcular a cada mudança.
- `salvoAtual(doc, salvo)` diz se um sistema salvo ainda bate com o núcleo.

**Rascunho** (os valores base; o que o editor mostra e o que vai em `draft`):

| campo | tipo | padrão (= Santo) |
|---|---|---|
| `modo`, `id`, `nome` | string | `Rascunho`, `rascunho`, `Rascunho` |
| `cor.origem` | `'base'` (copia a Palette do Santo) \| `'marca'` (gera pela cor) | `'base'` |
| `cor.marca` / `cor.ancora` | `#rrggbb` / `'500'\|'600'\|'700'` | `#4693ff` / `'600'` |
| `cor.neutros` | `'cinza'\|'tingido'\|'quente'` ou `{hue, chroma}` | `'cinza'` |
| `tipografia.corpo/titulo/mono` | família do catálogo | Albert Sans / Albert Sans / JetBrains Mono |
| `tipografia.escala` | `'compacta'\|'santo'\|'editorial'`, tabela, ou `{base, razao}` | `'santo'` |
| `raio` | número (base = radius/md) | 8 |
| `espaco` | número (unidade) | 4 |
| `sombra` | `{ intensidade, tinta: 'atual'\|'marca' }` | `{1, 'atual'}` |
| `controles` | `'compacto'\|'padrao'\|'amplo'` ou `[sm, md, lg]` | `'padrao'` (32/40/48) |
| `passos` (opcional) | `{ raio?: {xs,sm,lg,xl,2xl,3xl}, espaco?: {3xs…8xl}, sombra?: {xs,sm,md,lg,xl,2xl} }`. Em `sombra`, cada valor é a intensidade do nível (número ≥ 0), que multiplica o alfa das camadas daquele nível no lugar da global, com a geometria travada. Em raio e espaço, cada valor um px inteiro ≥ 0. Sobrescreve a fórmula nível a nível. Se o valor cair num degrau primitivo vira alias; senão, número. Raio md = `raio` | — |

**Garantia testada:**
- o rascunho padrão gera exatamente a spec do Santo;
- o rascunho `{ cor: { origem: 'marca', marca: '#00a99d' }, tipografia: Sora }` gera exatamente a da VTSD.

`node --test lib/tokens/estudio.test.mjs` cobre isso em 12 testes.

### Nível B no snapshot (à frente do Figma)

**O Figma não faz conta.** Por isso unidade, base+razão e intensidade **não viram variável**: são campos do
`draft`. O que vai para a coleção Brand é o valor **por nível**, já derivado.

| variável (Brand, por marca) | qtd | consumida por |
|---|---|---|
| `brand/family/heading` | 1 | text styles heading-1..6 → `--santo-font-heading` (Tailwind `font-heading`) |
| `brand/shape/radius-{xs,sm,lg,xl,2xl,3xl}` | 6 | `radius/*` da Semantic (md segue em `radius-base`) |
| `brand/space/{3xs…8xl}` | 14 | `space/*` da Semantic |
| `brand/type/<papel>/{size,leading}` | 22 | os 66 text styles dos 11 papéis e `--text-<papel>` |
| `brand/control/height/{sm,md,lg}` | 3 | nova `control/height/*` da Semantic → `--santo-control-height-*` |
| `brand/shadow/<estilo>/<camada>` | 10 | cor das camadas dos effect styles → `--santo-shadow-*` |

- O snapshot tem agora **404 variáveis**: Brand 61 e Semantic 33.
- Santo e VTSD receberam os valores de antes. A prova foi no Chrome headless: 2.140 medidas por tema,
  em raiz, Santo, VTSD e os dois aninhamentos, com **zero diferença**.
- Fonte da spec: `scripts/figma-nivel-b.js`. Aplicador: `scripts/figma-nivel-b-apply.mjs`.
- Rastro: `meta.aheadOfFigma.also`, com a tag `nivel-b`.

**Controles:** botão, input, listbox e search-trigger trocaram `h-(--santo-dimension-size-32|40|48)` por
`h-(--santo-control-height-sm|md|lg)`. O render é o mesmo. Qualquer controle novo **tem de usar
`control-height`**, ou não acompanha a escala do Estúdio.

### Preview

O bloco do rascunho redeclara **273 variáveis**:
- Palette 79 e Brand 61;
- 14 de espaço, 7 de raio e 3 de `control-height`;
- 100 da Color;
- 6 sombras;
- 3 pilhas de fonte.

A lista exata é a saída de `r.css`. Não monte nomes à mão.

Para claro e escuro lado a lado continua valendo o iframe com `<html data-theme>`.

### Módulos puros (todos importáveis no browser)

- `color.mjs`: `contrast`, `luminance`, `hexToOklch`, `fitGamut`, `matchLuminance`…
- `brand-ramp.mjs`: `brandRamps(doc, hex, { anchor, neutralHue, neutralChroma: number | 'santo' })`.
- `brand-mode.mjs`: `applyBrandMode`, `withBrandMode`, `validateBrandSpec(doc, spec, { mode, fonts })`, `specOfMode`.
- `contrast-audit.mjs`: `auditContrast(doc, modo, 'Light'|'Dark')` e `AUDIT_PAIRS`.
- `emit.mjs`: `brandBlockCss(doc, modo, { selector, scope })` (novo export), `stackOf`, e `shadowCss(effects, prefix)` lendo `boundVariables`.

### Achado

`border/strong` sobre `surface/page` no escuro dá **2,70**, abaixo de 3.
- Não é uma das dívidas registradas.
- A auditoria do Estúdio vai mostrá-lo como reprovação real em toda marca.
- Decisão do Pedro.

### Determinismo entre navegadores (2026-10-21)

O `color.mjs` não usa mais `Math.cbrt`, `cos`, `sin`, `atan2`, `hypot` nem `**`. Essas funções
não são corretamente arredondadas pela especificação, e o V8 e o JSC divergiam no último bit.
As buscas binárias da rampa levavam isso a 1/255 em 32 de 240 degraus de teste.

- Agora o código usa só `+ - * /` e `Math.sqrt`: raízes por Newton, seno e cosseno por série, atan por redução e série.
- Resultado: Node e Safari dão o mesmo hex bit a bit. O teste roda a rampa no JavaScriptCore e compara.
- O preview e o salvo batem em qualquer navegador, e a derivação inicial pode voltar a ser feita no cliente.
- Custo: o `derivar` com rampa leva cerca de 3 ms.
- A Palette da VTSD gerada fica a 1/255 do snapshot em 4 degraus. O snapshot não muda: a spec da VTSD é literal.
