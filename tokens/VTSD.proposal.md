# Modo de marca VTSD — Venda Todo Santo Dia

**Status: APROVADA e APLICADA AO SNAPSHOT, À FRENTE DO FIGMA.** Autor: Compasso, 2026-10-19.

- O Pedro aprovou a spec em 2026-10-19, sem mudança na Color (ver a dívida D1 abaixo).
- Como o OAuth do Figma estava indisponível, o modo foi aplicado ao snapshot por
  `scripts/apply-brand-mode.mjs`. Foi exceção autorizada, uma vez, e ficou registrada em
  `meta.aheadOfFigma`.
- O script lê a mesma spec (MODE, SPEC, DESCRIPTIONS) de `scripts/figma-brand-mode.js`. Num
  Figma simulado, a escrita seguida do `figma-dump.js` produz Palette e Brand byte a byte
  iguais ao snapshot.
- Falta a reconciliação com o Figma real; o procedimento está em
  `.claude/agents/figma-parity.md`.

## Arquitetura

| coleção | o que acontece |
|---|---|
| Palette | ganha o modo `VTSD` ao lado de `Santo` (79 valores) |
| Brand | ganha o modo `VTSD` ao lado de `Santo` (5 valores) |
| Color, Primitives, Semantic | **compartilhadas**, sem modo de marca. A Color continua com Light/Dark e aponta para `palette/*`, então muda de marca sozinha |

No CSS, a marca é escolhida pelo atributo `data-brand="<brand/id>"`, que vale em qualquer
elemento. Sem o atributo vale a marca padrão (Santo). Os detalhes estão em
[Renderização](#renderização).

## Brand (modo VTSD)

| variável | valor | observação |
|---|---|---|
| `brand/id` | `vtsd` | valor do `data-brand`; precisa ser slug único (o `check-parity` cobra) |
| `brand/name` | `Venda Todo Santo Dia` | nome curto de uso: VTSD |
| `brand/family/sans` | `Sora` | já está em `lib/fonts/catalog.ts` (100–800). Cobre os 6 pesos dos text styles: Light, Regular, Medium, SemiBold, Bold e ExtraBold |
| `brand/family/mono` | `JetBrains Mono` | igual ao Santo |
| `brand/shape/radius-base` | `{dimension/radius/8}` | igual ao Santo, ver justificativa abaixo |

**Raio, por que 8.** A VTSD se diferencia por cor e tipo. 12px transformaria em pílula
qualquer controle de 24px que use `radius/md` (12 = h/2), o que viola o princípio 5. 4px
brigaria com as formas redondas da Sora e do logo. Se a proposta `radius/control` for
aprovada, `brand/shape/radius-control` da VTSD também fica em `{dimension/radius/8}`.

**Description compartilhada.** A description de `brand/family/sans` diz "Albert Sans — a voz
do Santo", e no Figma a description é por variável, não por modo. Com duas marcas ela passa
a mentir na VTSD. Nova description: "Família sans da marca. Cobre os 11 papéis de texto, do
heading-1 ao caption-small." Ela fica em `DESCRIPTIONS` no `figma-brand-mode.js`, que a
grava no Figma, e o `apply-brand-mode.mjs` já a aplicou ao snapshot. Faz parte do hash de
Brand.

## Método das rampas

Reproduzível com `node scripts/brand-ramp.mjs '#00A99D'`. O script não escreve nada.

> **Desde 2026-10-21** a matemática de cor (`lib/tokens/color.mjs`) é determinística entre
> motores JS: só usa `+ - * /` e `Math.sqrt`, e dá o mesmo resultado no Node e no Safari. Com
> isso, `brand/100`, `200`, `400` e `500` saem a 1/255 de um canal da tabela abaixo, que foi gerada
> com o `Math.cbrt`/`**` do V8. **A tabela, o snapshot e o Figma continuam valendo como estão**:
> a spec da VTSD é literal e aprovada. O teste `lib/tokens/estudio.test.mjs` trava esse desvio.

1. **Luminância casada degrau a degrau.** Cada degrau da VTSD tem a mesma luminância
   relativa WCAG (Y) do degrau Santo correspondente. Por isso todo contraste que a coleção
   Color garante no Santo vale igual na VTSD, já que a Color é compartilhada. Casar o L do
   OKLCH não basta: no mesmo L, o verde-azulado tem Y maior que o azul, e o `brand/700` da
   VTSD caía para 4,33:1 como link. Por isso o critério é Y.
2. **Matiz:** o da cor oficial (OKLCH H = 185,9°) em todos os degraus.
3. **Croma:** o croma do degrau Santo × `C(#00A99D) / C(Santo brand/600)` = × 0,6537,
   cortado no limite do sRGB. Isso mantém o desenho da rampa (tints claros quase neutros,
   pico no meio) sem os cianos neon que aparecem quando se copia a saturação relativa.
4. **Âncora:** `#00A99D` entra exata no `brand/600`, o degrau de luminância mais próxima
   (Y 0,3081 contra 0,2939 do Santo). É o único degrau que não casa Y exatamente.
5. **Neutros:** mesma Y por degrau, croma 0, ou seja, cinza puro `#vvvvvv` sem o tom frio do
   Santo. `neutral/0` = `#ffffff`. `neutral/1000` sai `#070707` (Y do Santo). Se o Pedro
   quiser preto absoluto, `#000000` também funciona: o contraste sobe e nada reprova.

### palette/brand e palette/neutral

| degrau | VTSD | Santo | Y VTSD | Y Santo | branco sobre |
|---|---|---|---|---|---|
| `brand/50` | `#edf4f3` | `#edf3fb` | 0.8918 | 0.8907 | 1.11 |
| `brand/100` | `#e0f0ed` | `#e2edfe` | 0.8428 | 0.8389 | 1.18 |
| `brand/200` | `#cae6e1` | `#cde2fe` | 0.7459 | 0.7453 | 1.32 |
| `brand/300` | `#aad6d0` | `#b1d0fe` | 0.6119 | 0.6161 | 1.59 |
| `brand/400` | `#7dc4bc` | `#8bbaff` | 0.4747 | 0.4783 | 2.00 |
| `brand/500` | `#4ab2a7` | `#64a3fe` | 0.3609 | 0.3606 | 2.56 |
| `brand/600` | `#00a99d` | `#4693ff` | 0.3081 | 0.2939 | 2.93 |
| `brand/700` | `#008077` | `#2c71cf` | 0.1677 | 0.1685 | 4.82 |
| `brand/800` | `#006159` | `#1c54a0` | 0.0927 | 0.0913 | 7.36 |
| `brand/900` | `#004944` | `#14407c` | 0.0518 | 0.0527 | 10.31 |
| `brand/950` | `#002421` | `#021e45` | 0.0137 | 0.0137 | 16.48 |
| `neutral/0` | `#ffffff` | `#ffffff` | 1.0000 | 1.0000 | 1.00 |
| `neutral/50` | `#fafafa` | `#f8fafb` | 0.9560 | 0.9529 | 1.04 |
| `neutral/100` | `#f3f3f3` | `#f0f3f8` | 0.8963 | 0.8940 | 1.11 |
| `neutral/200` | `#e7e7e7` | `#e3e8ef` | 0.7991 | 0.8028 | 1.24 |
| `neutral/300` | `#d4d4d4` | `#ced5df` | 0.6584 | 0.6604 | 1.48 |
| `neutral/400` | `#8b8b8b` | `#7d8ca0` | 0.2582 | 0.2565 | 3.41 |
| `neutral/500` | `#6e6e6e` | `#636f7f` | 0.1559 | 0.1555 | 5.10 |
| `neutral/600` | `#585858` | `#4d596a` | 0.0976 | 0.0976 | 7.11 |
| `neutral/700` | `#424242` | `#394352` | 0.0545 | 0.0549 | 10.05 |
| `neutral/800` | `#2c2c2c` | `#242d39` | 0.0252 | 0.0255 | 13.97 |
| `neutral/900` | `#1a1a1a` | `#131a25` | 0.0103 | 0.0101 | 17.40 |
| `neutral/950` | `#0f0f0f` | `#090f17` | 0.0048 | 0.0046 | 19.17 |
| `neutral/1000` | `#070707` | `#08060b` | 0.0021 | 0.0021 | 20.14 |

### accent, success, warning, danger, info: herdadas sem mudança

- **Status (success, warning, danger, info)** é semântica, não marca. "Deu certo" e "deu
  erro" têm que ter a mesma cor em todos os produtos da Ready To Go, e as rampas já passam
  em contraste nos dois temas.
- **Risco medido: brand × success na VTSD.** São dois verdes: ΔE OKLab 0,163 e ΔH 29° entre
  `bg/brand/solid/default` (#00a99d) e `bg/success/solid/default` (#027a48). Hoje o Santo
  convive com um par mais próximo, brand × info: ΔE 0,101 e ΔH 1° (os dois azuis). O par
  da VTSD é aceitável, com a mesma regra que já vale para o Santo: status nunca se comunica
  só por cor, sempre com ícone ou rótulo.
- **accent** (âmbar) complementa o verde-azulado (ΔH 104°) melhor do que complementa o azul
  do Santo, então fica.

## Contraste (WCAG 2.x)

Auditado nas 4 combinações marca × tema, resolvendo a cadeia de alias com o tema na Color e
a marca em Palette/Brand: 49 pares de texto (≥ 4,5) e de UI (≥ 3).

**Pergunta direta: `text/on-brand` sobre `brand/600` em AA? NÃO.** Branco sobre `#00A99D`
dá **2,93:1**, e AA pede 4,5. O Santo também reprova: branco sobre `#4693ff` dá **3,05:1**.
Isso começou no commit `0ca5a94`; o roxo anterior `#6a2fe3` passava. A causa não é a rampa
da VTSD, e sim o mapeamento da Color, que é compartilhada:

| par | Santo L | Santo D | VTSD L | VTSD D |
|---|---|---|---|---|
| on-brand / bg/brand/solid/default | **3.05** | 4.81 | **2.93** | 4.82 |
| on-brand / bg/brand/solid/hover | 4.81 | **3.05** | 4.82 | **2.93** |
| on-brand / bg/brand/solid/active | 7.43 | **2.56** | 7.36 | **2.56** |
| border/brand / surface/page (UI ≥ 3) | **2.92** | 7.52 | **2.81** | 7.85 |
| border/default / surface/page (UI ≥ 3) | **1.41** | **1.92** | **1.42** | **1.91** |

Todo o resto passa nas 4 combinações. Exemplos, na ordem Santo / VTSD com tema claro: link 4,59 / 4,62, text/brand 7,10 / 7,05,
text/tertiary 4,88 / 4,89, e todos os on-status.

> **DÍVIDA CONHECIDA D1 (decisão do Pedro, 2026-10-19):** manter o azul do Santo e o verde
> da VTSD como estão, **sem alterar a coleção Color** por contraste agora. As reprovações
> acima ficam registradas para revisão, também em `tokens/README.md` (Dívidas conhecidas).
> A correção abaixo está estudada, mas NÃO foi aplicada.

**Correção estudada, na coleção Color (afeta as duas marcas):**

| variável | hoje | proposta | resultado (Santo / VTSD) |
|---|---|---|---|
| `bg/brand/solid/default` | L 600, D 700 | L **700**, D 700 | 4,81 / 4,82 |
| `bg/brand/solid/hover` | L 700, D 600 | L **800**, D **800** | 7,43 / 7,36 |
| `bg/brand/solid/active` | L 800, D 500 | L **900**, D **900** | 10,22 / 10,31 |
| `border/brand` | L 600, D 500 | L **700**, D 500 | 4,59 / 4,62 |

O preço disso: o botão primário deixa de mostrar a cor oficial "pura" (`#00A99D` /
`#4693ff`), que passa a aparecer em superfícies sem texto (ilustração, gráfico, foco). A
alternativa é texto escuro sobre o 600, ou seja, `text/on-brand` → `neutral/950`, com
contraste de 6,30:1 no Santo e 6,54:1 na VTSD. Essa troca muda a cara do botão nas duas marcas.

`border/default` em 1,4:1 é borda decorativa de cartão e lista. Ela só reprova se for o
único contorno de um controle, que é o caso do input outline. Fica anotado para o Ateliê:
input usa `border/strong`.

## Renderização

Implementado em `lib/tokens/emit.mjs`. Com uma marca só, a saída gerada é idêntica byte a
byte à de antes. Com o modo VTSD aplicado, o `tokens.css` antigo (32.502 bytes) é prefixo
exato do novo, ou seja, o Santo não muda fora dos blocos. `typography.css` e `theme.css`
ficam idênticos. O `index.ts` só ganha os modos nas `collections` e o export `brands`.
Com mais de um modo de marca, `tokens.css` ganha um bloco por marca:

```css
[data-brand='vtsd'] {
  /* Palette e Brand no modo VTSD */
  /* dependentes redeclarados: radius/md */
  /* as 100 variáveis da Color que apontam para palette, modo Light */
  /* --santo-font-sans / --santo-font-mono */
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme='light']) [data-brand='vtsd'] { /* Color Dark */ }
}
:root[data-theme='dark'] [data-brand='vtsd'] { /* Color Dark */ }
```

- A marca padrão também ganha o bloco `[data-brand='santo']`, para aninhar Santo dentro
  de VTSD.
- **Por que redeclarar dependentes:** custom property com `var()` é resolvida no elemento
  onde foi declarada, e o filho herda o valor já resolvido. Sem a redeclaração, um
  contêiner `data-brand` dentro de uma página Santo trocaria `--santo-palette-*`, mas
  `--santo-color-*` continuaria Santo.
- Com `data-brand` no próprio `:root`, as regras de tema que já existem resolvem
  (`:root[data-theme='dark']` tem especificidade maior que `[data-brand]`).
- `index.ts` ganha `brands` (id → modo, nome, padrão, valores resolvidos de
  Palette/Brand) e o tipo `BrandId`. `typography.css` e `theme.css` não mudam: os
  utilitários já apontam para `var(--santo-*)`.
- `check-parity` valida a cadeia de alias em todas as marcas (não só na primeira), exige
  valor em todo modo, os mesmos modos em Palette e Brand, e `brand/id` slug e único.
- `build-tokens` aceita `<snapshot> --out <dir>` para ensaio fora do repo.

Ensaio verificado no Chrome headless com um snapshot de teste (no scratchpad, fora do repo):

| situação | resultado |
|---|---|
| Santo e VTSD na mesma página, tema claro | `#4693ff` / `#00a99d` |
| tema escuro fixado | `#2c71cf` / `#008077` |
| escuro do sistema, sem `data-theme` | `#2c71cf` / `#008077` |
| `data-brand` no próprio `:root`, escuro | `#008077` |
| Santo aninhado dentro de VTSD | volta para Albert Sans e azul |

Em todos os casos, VTSD sai em Sora com raio de 8px.

## Figma: `scripts/figma-brand-mode.js`

Script de escrita para colar no `use_figma`, com `DRY_RUN = true` por padrão. Ele valida
antes de escrever: a spec precisa cobrir todas as variáveis de Palette e Brand, os aliases
precisam existir, os hex precisam ser válidos e a Sora precisa estar no Figma com os 6
estilos dos text styles. Ele é idempotente e, num modo recém-criado, grava todos os
valores. Ensaiado contra um Figma simulado a partir do snapshot:

- dry run: 85 mudanças (84 valores + 1 description), nada escrito;
- escrita: as mesmas 85;
- segunda rodada: 0 mudanças;
- `figma-dump.js` em seguida: Palette e Brand byte a byte iguais ao snapshot aplicado por
  `apply-brand-mode.mjs`.

**Plano:** Professional permite até 4 modos por coleção; Free, só 1. Se o arquivo estiver
num plano Free, o `addMode` falha.

A description de `brand/family/sans` também é gravada por este script (`DESCRIPTIONS`).

## Ordem de execução

Feito em 2026-10-19:

- [x] Aprovação do Pedro, com a Color mantida (dívida D1).
- [x] `node scripts/apply-brand-mode.mjs`: snapshot com o modo VTSD e `meta.aheadOfFigma`.
- [x] `npm run tokens && npm run tokens:check`, fingerprint novo (Palette `1bbb4c8a`,
  Brand `c8d4ef77`) e a tabela em `figma-parity.md` marcada "A FRENTE do Figma".
- [x] Ateliê: `lib/fonts/used.ts` já lê `values` de todos os modos.

Pendente: a reconciliação, quando o OAuth sair. O passo a passo está em
`.claude/agents/figma-parity.md`, seção "Reconciliacao: snapshot a frente do Figma":
R1 → `figma-brand-mode.js` (dry, depois real) → dump → `check-parity` com diff vazio →
`--write` → tabela confirmada.
