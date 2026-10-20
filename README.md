# SantoDS v1

Design system do Santo em paridade verificada com o Figma
[SantoDS v1](https://www.figma.com/design/O0xV7p3taNff97XGjNjTMl/SantoDS-v1).

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
biblioteca Font Awesome colada lá) **não** faz parte dos tokens, mas é a **única
fonte de ícones** do SantoDS — veja [Ícones](#ícones).

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
npm run tokens              # regenera a lib a partir do snapshot
npm run tokens:check        # valida a consistência interna do snapshot
npm run tokens:fingerprint  # hashes para comparar com o Figma
```

Para checar ou sincronizar com o Figma, use o agente **`figma-parity`**
(`.claude/agents/figma-parity.md`). Ele roda `scripts/figma-fingerprint.js`
dentro do Figma via MCP, compara os hashes com `npm run tokens:fingerprint` e só
puxa o dump completo se algo divergir. A checagem barata cabe em uma chamada.

## Ícones

Os ícones saem **só** da página `Icones` do Figma, e **só os que estão em uso**
entram no git: `lib/icons/` (um componente React por ícone, `svg/`, `index.ts`,
`manifest.json`), gerado por `scripts/figma-icons.mjs` a partir de
`lib/icons/needed.txt` — o único arquivo de lá editado à mão.

O inventário da página inteira (≈5,4 mil ícones, 1 MB) é **cache local**
regenerável em `tokens/.cache/santods.icons.json`, ignorado pelo git.

Ícone novo:

1. adicione o slug em `lib/icons/needed.txt` (`slug` ou `slug:solid|light|duotone`);
2. se `tokens/.cache/santods.icons.json` não existir, gere o inventário: rode
   `scripts/figma-icons.js` via MCP `use_figma` (só leitura) e depois
   `node scripts/figma-icons.mjs inventory <dir>`;
3. `node scripts/figma-icons.mjs plan` mostra o nodeId; baixe o SVG (MCP
   `download_assets`) e rode `node scripts/figma-icons.mjs build <dir-dos-svgs>`.

Sem o cache, `plan` e `build` ainda funcionam para os ícones já exportados (leem o
`manifest.json`); só um slug novo pede o inventário, e o erro explica como.

### Alternativa ao MCP: API REST do Figma

Quando o OAuth do MCP não está disponível, o passo 3 pode usar um token pessoal da API
REST do Figma. O token fica no `.env.local` como `FIGMA_TOKEN` e `FIGMA_FILE_KEY`; esse
arquivo é ignorado pelo git, e o token **nunca** é impresso, colado em nota ou commitado.

```sh
node --env-file=.env.local scripts/figma-icons-rest.mjs <dir-dos-svgs> --build
```

O script roda o `plan` e copia para `<dir>` os SVGs já versionados em `lib/icons/svg/`.
Só as variantes novas são baixadas, por `GET /v1/images/:key?ids=…&format=svg`, e salvas
como `<nodeId>.svg`. Com `--build`, ele já roda o `figma-icons.mjs build`. Ele só lê o
Figma.

- Em 2026-10-19 o REST deu os mesmos paths que o MCP nos 56 ícones de set.
- Nos 3 ícones de marca (`github`, `google`, `figma`), o REST exporta outra geometria, com
  `clip-path` e outras coordenadas. Por isso o padrão não rebaixa o que já existe. Não use
  `--all` para ícones de marca sem conferir.
- O REST não lê o inventário da página: para um slug que não está no cache, o
  `tokens/.cache/santods.icons.json` continua vindo do MCP (`scripts/figma-icons.js`).

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

## Tipografia

Vem do **Google Fonts**, resolvida pelo nome real da família — que é o valor dos
tokens `brand/family/sans` e `brand/family/mono`.

Isso é deliberado. O `next/font` gera um nome de família hasheado
(`__Albert_Sans_8304b7`) que nunca casaria com o nome guardado no token; com ele,
trocar o token não mudaria nada e o token viraria decoração. Com o nome real,
trocar o token troca a fonte.

O catálogo (`lib/fonts/catalog.ts`) traz 32 famílias com os eixos de peso
conferidos contra a API do Google. As famílias em uso entram no HTML inicial pelo
layout, para não haver troca de fonte na frente do usuário.

## Estrutura

```
tokens/santods.figma.json   espelho canônico do Figma (fonte da verdade)
lib/tokens/emit.mjs         emissores puros — rodam no Node e no browser
lib/tokens/*.css, index.ts  GERADOS
lib/ui/                     biblioteca de componentes
scripts/figma-*.js          scripts read-only para colar no MCP use_figma
scripts/check-parity.mjs    diff Figma × código
scripts/check-design.mjs    caça valor solto em app/ e lib/ui/
app/_screens/               foundations + telas de exemplo da home
```
