# SantoDS v1

Design system do Santo em paridade verificada com o Figma
[SantoDS v1](https://www.figma.com/design/O0xV7p3taNff97XGjNjTMl/SantoDS-v1),
mais um Studio para derivar novos design systems a partir dele.

## O que veio do Figma

Tudo que o arquivo tem de token e style, sem exceção:

| | quantidade | |
|---|---|---|
| **Palette** | 79 | rampas cruas: brand, accent, neutral, success, warning, danger, info |
| **Color** | 102 | camada semântica, em modos Light e Dark |
| **Primitives** | 129 | espaço, raio, borda, tamanho, container, ícone, tipo, movimento, camadas |
| **Brand** | 5 | id, nome, famílias tipográficas, raio base |
| **Semantic** | 30 | espaçamento, raio, borda e foco em nomes de camiseta |
| **Text styles** | 68 | 11 papéis × 6 pesos, mais 2 de código |
| **Effect styles** | 7 | none, xs, sm, md, lg, xl, 2xl |

345 variáveis no total. A página `Icones` do Figma (≈24,5 mil nós de uma
biblioteca Font Awesome colada lá) **não** faz parte dos tokens e ficou de fora.

## Como usar

```tsx
// Utilitários Tailwind gerados a partir dos tokens
<div className="bg-surface-raised text-text-primary rounded-lg p-md gap-sm shadow-md">
  <h2 className="santo-heading-5-semibold">Título</h2>
  <p className="santo-body-regular text-text-secondary">Corpo</p>
</div>
```

```ts
// Ou os tokens tipados, quando precisar do valor em JS
import { token, colorValue, textStyles, shadows } from "@/lib/tokens";

token["color/bg/brand/solid/default"];  // "var(--santo-color-bg-brand-solid-default)"
colorValue("color/text/primary", "Dark"); // "#faf9fb"
```

Convenções dos utilitários:

- `color/bg/*` perde o segmento `bg` → `bg-brand-solid-default`, `bg-surface-page`
- as demais famílias mantêm o prefixo → `text-text-primary`, `border-border-subtle`, `fill-icon-primary`
- espaçamento e raio por nome semântico → `p-md`, `gap-lg`, `rounded-xl`
  (a escala numérica do Tailwind fica intacta: `p-4` continua 1rem)
- tipografia pelas classes do Figma → `santo-heading-3-bold`, `santo-body-small-medium`, `santo-code-sm`

Modo escuro sai de graça: `data-theme="dark"` / `"light"` na raiz, ou nada para
seguir o sistema.

## Paridade com o Figma

`tokens/santods.figma.json` é o espelho canônico do arquivo. Tudo em
`lib/tokens/` é gerado a partir dele — **nunca edite os arquivos gerados**.

```bash
npm run tokens              # regenera a lib a partir do snapshot e das marcas
npm run tokens:check        # valida a consistência interna do snapshot
npm run tokens:fingerprint  # hashes para comparar com o Figma
npm run brands:check        # integridade das marcas derivadas
```

Para checar ou sincronizar com o Figma, use o agente **`figma-parity`**
(`.claude/agents/figma-parity.md`). Ele roda `scripts/figma-fingerprint.js`
dentro do Figma via MCP, compara os hashes com `npm run tokens:fingerprint` e só
puxa o dump completo se algo divergir. A checagem barata cabe em uma chamada.

## Componentes

`lib/ui/` — peças construídas só com tokens: ação, entrada, cor, estrutura, dado,
aplicação e ícones. Documentação viva em **`/componentes`**, onde cada bloco monta
o componente de verdade no tema atual.

```tsx
import { Button, Card, CardHeader, Field, Input, Icon } from "@/lib/ui";
```

Inventário e critério de uso em [`lib/ui/README.md`](lib/ui/README.md).

`npm run design:check` varre `app/` e `lib/ui/` atrás de valor solto — hex cru ou
valor arbitrário em classe Tailwind. As isenções (o arco-íris do seletor de cor,
por exemplo) ficam declaradas com o motivo em `scripts/check-design.mjs`.

Para desenhar ou revisar tela, use o agente **`santo-design`**
(`.claude/agents/santo-design.md`).

## Studio

`npm run studio` e abra `/studio`.

Editor visual dos 345 tokens, dos 68 text styles e das 7 sombras, com preview ao
vivo em Foundations, Cards, Dashboard e Aplicação — em claro e escuro.

Cor abre um seletor completo (saturação × brilho, matiz, alfa, conta-gotas, campos
HEX/RGB/HSL). Todo token numérico tem slider **e** campo: arrasta quem está
explorando, digita quem sabe o número. Vincular/desvincular preserva a cadeia de
aliases do Figma.

## Tipografia

Vem do **Google Fonts**, resolvida pelo nome real da família — que é o valor dos
tokens `brand/family/sans` e `brand/family/mono`.

Isso é deliberado. O `next/font` gera um nome de família hasheado
(`__Albert_Sans_8304b7`) que nunca casaria com o nome guardado no token; com ele,
uma marca trocar a fonte não mudava nada e o token virava decoração. Com o nome
real, trocar o token troca a fonte.

O catálogo (`lib/fonts/catalog.ts`) traz 32 famílias com os eixos de peso
conferidos contra a API do Google. As famílias em uso — base mais as das marcas —
entram no HTML inicial pelo layout; o Studio carrega sob demanda o que você
escolher no seletor.

O preview usa **as mesmas funções de emissão que o build** (`lib/tokens/emit.mjs`),
só que escopadas em `#santo-preview`. Não existe um segundo caminho de
renderização: o que você vê é o que sai no arquivo.

### As camadas, e quem pode mexer em quê

O modelo mental é: **o Santo é a base; um produto novo ganha cara própria
re-apontando a camada semântica, não reescrevendo a fundação.**

| camada | o que é | personalizável |
|---|---|---|
| **Primitives** (129) | a física do sistema: a escala de 4px, a rampa de tamanhos, as durações | **não** |
| **Palette** (79) | as rampas de cor | sim |
| **Brand** (5) | famílias tipográficas, raio base | sim |
| **Semantic** (30) | os apelidos: `space/md`, `radius/lg`, `border/thin` | sim |
| **Color** (102) | a camada semântica de cor, Light e Dark | sim |

Primitives é o que todos os produtos derivados têm em comum. Mexer lá não cria um
produto novo — cria um sistema incompatível. Por isso o editor mostra esses tokens
como somente leitura, apontando qual apelido semântico os controla, e
`npm run brands:check` **reprova** uma marca que sobrescreva Primitives.

A consequência é concreta: cantos retos + espaçamento compacto + bordas marcadas
custam **14 overrides**, todos em Brand e Semantic. Tudo que não foi tocado
continua herdando do Figma.

### Aba Marca — uma base, o resto acompanha

Toda escala tem uma proporção interna: `space/lg` é 1,5× o `space/md`;
`heading-1` é 4,5× o corpo. Essa proporção é o que faz a escala parecer uma
escala, e ela não muda de produto para produto. O que muda é **onde a base
está** — então cada dimensão tem um controle só.

- **Cor** — uma semente por família, incluindo **Neutro**, que é a base de
  superfície e fundo. Puxar o cinza para o azul ou para o quente muda a
  temperatura do produto inteiro de uma vez. A semente define matiz e saturação;
  a curva de luminosidade continua sendo a do Santo.
- **Tipografia** — famílias do Google Fonts e um slider de tamanho base. Os 12
  papéis acompanham pela proporção, e **a entrelinha sai do tamanho final**, para
  a folga acompanhar o que se vê. No ajuste por papel, só o tamanho é editável —
  a entrelinha segue junto.
- **Espaçamento**, **Forma**, **Bordas** — mesma lógica: um slider de base, e um
  "Ajuste fino" recolhido para a exceção.

Tudo é slider com edição livre. Os valores derivados **não são encaixados** nos
degraus da fundação: encaixar parecia mais puro, mas colapsa — com base 18 o
Título 1 e o Título 2 caem os dois em 72, porque no topo da escala os degraus são
esparsos (48, 60, 72, 96). Valor livre mantém a proporção em qualquer base.

O emissor degrada com elegância: quando o valor escolhido existe como degrau, o
CSS sai como `var(--santo-type-size-18)`; quando não existe, sai `81px`. Fica
tokenizado quando dá, livre quando precisa — e o override continua sendo na
camada semântica, nunca na fundação.

### Derivar um design system novo

Uma marca guarda **só o que muda** em relação à base. `brands/aurora.json` é um
exemplo: 18 overrides viram um sistema completo de 345 tokens, e tudo que ela não
tocou continua herdando do Figma — inclusive mudanças futuras.

```jsonc
{
  "id": "aurora",
  "name": "Aurora",
  "overrides": {
    "variables": {
      "palette/brand/500": { "value": "#119c8b" },
      "brand/shape/radius-base": { "value": "{dimension/radius/0}" },
      "color/text/primary": { "values": { "Light": "{palette/neutral/800}" } }
    },
    "textStyles": {},
    "effectStyles": {}
  }
}
```

`npm run tokens` gera `lib/tokens/brands/aurora.css` como um escopo
`[data-brand='aurora']`. Aplique com `data-brand="aurora"` na raiz.

Salvar pelo Studio grava o JSON em `brands/` (só em desenvolvimento — em produção
o botão Exportar continua disponível). Exportar copia ou baixa `tokens.css`,
`typography.css`, o bloco `@theme` do Tailwind, ou o JSON da marca.

## Estrutura

```
tokens/santods.figma.json   espelho canônico do Figma (fonte da verdade)
brands/<id>.json            marcas derivadas: só os overrides
lib/tokens/emit.mjs         emissores puros — rodam no Node e no browser
lib/tokens/brand.mjs        applyBrand / diffToOverrides
lib/tokens/*.css, index.ts  GERADOS
lib/tokens/brands/          GERADOS: um escopo por marca
scripts/figma-*.js          scripts read-only para colar no MCP use_figma
scripts/check-parity.mjs    diff Figma × código
scripts/check-brands.mjs    integridade das marcas
app/studio/                 o Studio
app/_screens/               foundations + telas de exemplo (home e preview)
```
