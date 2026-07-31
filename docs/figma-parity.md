# Paridade com o Figma

O Santo trata o código como fonte da verdade e o arquivo do Figma como um
espelho dele. Este documento descreve como esse espelho é mantido, o que é
verificado automaticamente e o que não é.

**Arquivo:** [SantoDS-v1](https://www.figma.com/design/O0xV7p3taNff97XGjNjTMl/SantoDS-v1)
(`O0xV7p3taNff97XGjNjTMl`). A chave mora em `FIGMA_FILE_KEY`, no `.env` da raiz —
que não é versionado. É neste arquivo que os protótipos são feitos e é ele que
anda em paralelo com o código.

> **Estado desta conta (medido em 30/07/2026):** o PAT atual autentica e lê o
> arquivo (`/v1/me` e `/v1/files/{key}` respondem 200), mas o endpoint de
> Variables responde **403 por falta do escopo `file_variables:read`**. O
> bloqueio observado é de **escopo**, não de plano — são causas distintas e o
> erro de escopo acontece antes de qualquer verificação de plano. Se o plano
> Pro permite ou não a API de Variables ainda **não está determinado**: para
> saber, gere um PAT com Variables→Read e rode `pnpm figma:check` de novo. Até
> lá, o caminho garantido é o **2 (MCP/plugin)**.

## Os dois caminhos de sincronia

Existem dois, e qual deles você usa depende do plano da sua organização no
Figma — não de preferência.

### 1. API REST (exige Enterprise + escopo no token)

Duas barreiras independentes guardam este caminho, e o mesmo `403` cobre as
duas — confundi-las custa tempo:

**Escopo.** O Personal Access Token precisa de `file_variables:read` (e
`file_variables:write` para o push). O escopo se escolhe na **criação** do token
e não dá para editar depois: é preciso gerar outro. Quando é esta a causa, o
Figma nomeia o escopo que falta na resposta.

**Plano.** A API de Variables é exclusiva de organizações Enterprise. Quando é
esta a causa, a resposta **não menciona escopo**.

`scripts/lib/figma/api.mjs` distingue os dois casos e dá a instrução certa para
cada um, em vez de mandar você conferir as duas coisas toda vez.

```bash
pnpm figma:check    # o arquivo bate com o código? (read-only, usado em CI)
pnpm figma:pull     # baixa o estado atual para dist/figma/remote/ (read-only)
pnpm figma:push     # calcula o plano de escrita e IMPRIME — não envia nada

pnpm figma:push -- --confirm    # envia
pnpm figma:push -- --prune --confirm   # envia, incluindo remoções
```

Credenciais em `.env` na raiz (copie de `.env.example`). Os scripts leem esse
arquivo sozinhos; valor já presente no ambiente sempre vence, para que em CI
quem mande seja o secret.

### 2. MCP e plugin (qualquer plano) — o caminho em uso

O **MCP do Figma** (autenticado por OAuth, não por PAT) lê o arquivo em qualquer
plano. É por ele que a verificação de paridade acontece hoje, através do
subagente `paridade-figma` (`.claude/agents/paridade-figma.md`):

```
Use o agente paridade-figma para conferir o arquivo
```

O agente compara valor a valor — hex quantizado em 8 bits, nome byte a byte, e
alias contra alias — e é obrigado a reportar **cobertura em números**. Isso
importa porque o MCP não oferece "liste todas as Variables do arquivo": só
`get_variable_defs(fileKey, nodeId)`, que devolve as variáveis usadas por um nó.
A verificação portanto caminha a árvore e é sempre parcial, e o agente nunca
pode concluir "100% em paridade" a partir de amostragem — o veredito máximo é
"sem divergência no que foi verificado (N de M)".

Além da comparação de valores, o agente aplica três regras que a igualdade de
hex não pega:

- **Color Style é sempre divergência.** O build não emite nenhum, de propósito:
  cor mora em Variable porque só Variable tem modo e alias. Um Color Style com
  o hex "certo" é uma segunda fonte de verdade que fica para trás na próxima
  troca de marca.
- **Vínculo conta como valor.** Um Text Style com `fontSize` 96 digitado à mão
  não é igual a um vinculado a `type/size/96`, ainda que a tela seja idêntica —
  o campo `boundVariables` de `dist/figma/text-styles.json` é parte do que se
  confere.
- **Valor solto em protótipo é divergência.** Cor ou espaçamento digitado à mão
  num protótipo não existe para o design system: ninguém o implementa sem
  adivinhar, e o `check-contrast` nunca chega perto dele.

> **Estado do arquivo em 31/07/2026:** semeado pela Plugin API com quatro das
> cinco coleções — `Palette` (modo `Santo`, 79 variáveis), `Color`
> (`Light`/`Dark`, 102), `Primitives` (`Value`, 122) e `Brand` (`Santo`, 5) —
> mais os **68 Text Styles**. São 308 variáveis e 68 estilos, conferidos um a um
> contra `dist/figma/`: **zero divergência, zero extra, zero Color Style.**
>
> Ainda **não** semeados: a coleção `Semantic` (30 variáveis) e os 7 Effect
> Styles.

### Text Styles são agrupados por família

O nome no Figma leva a família resolvida como primeiro segmento —
`Albert Sans/heading-1/bold` — porque é assim que o painel de Text Styles
agrupa: uma pasta por fonte. Hoje são duas pastas, `Albert Sans` (66) e
`JetBrains Mono` (2).

O **caminho do token não tem a família**: continua `typography.heading-1.bold`, e
é isso que mantém CSS e TypeScript neutros de marca — `--santo-typography-heading-1-bold`
não menciona Albert Sans em lugar nenhum. Cada entrada de `text-styles.json`
carrega os três: `name` (com pasta), `token` (sem) e `figmaFamily` (a pasta),
para que ninguém precise adivinhar onde o nome da fonte termina — fonte tem
espaço e pode ter barra.

**O custo, declarado:** trocar a marca renomeia as 66 pastas. Nome não acompanha
modo de variável; só valor acompanha. Um arquivo cuja marca mudou fica com a
pasta `Albert Sans` renderizando outra fonte até alguém re-semear. O conserto é
**renomear**, nunca recriar — recriar perde os vínculos e desconecta todo layer
que já usa o estilo.

### `letterSpacing`: o único eixo que não pode ser vinculado

Um Text Style do Santo vincula cinco eixos a Variables. Quatro funcionam.
`letterSpacing` não, e a razão é da plataforma: **o binding de `letterSpacing` no
Figma só fala PIXELS.** Vincular converte a unidade de `PERCENT` para `PIXELS`
em silêncio — `type/tracking/wide` (+2%) vira +2px, que num `caption-small` de
10px é dez vezes o espaçamento pretendido.

Medido no arquivo em 31/07/2026, e os dois estados são mutuamente exclusivos:

| ação                             | resultado                          |
| -------------------------------- | ---------------------------------- |
| setar `letterSpacing` em PERCENT | o vínculo é **removido**            |
| vincular por cima do PERCENT     | a unidade vira **PIXELS**           |

A escolha do Santo é o valor literal em PERCENT, sem vínculo. Tracking errado é
visível em toda tela do produto; o ganho do vínculo aqui é teórico, porque a
escala de tracking praticamente não muda. Para que isso não vire dívida
invisível, `emitTextStyles` separa os dois casos: o que dá para vincular sai em
`boundVariables`, o que não dá sai em **`unbound`**, com o alvo que teria. O
subagente `paridade-figma` lê esse campo e inverte o critério — `letterSpacing`
**com** vínculo é que é divergência.

**Escopos aplicados no seed.** `palette/*` recebeu `scopes: []` — some de todo
seletor de propriedade do Figma. Isso torna executável a regra que a coleção já
declarava em texto ("nunca usar direto em um layer"): o designer não consegue
pintar um retângulo com `palette/brand/600` nem por engano, só com
`color/bg/brand/solid/default`. Aliasar continua funcionando, porque escopo só
governa a UI. As semânticas recebem o escopo do seu papel — `FRAME_FILL`/
`SHAPE_FILL` para `surface` e `bg`, `TEXT_FILL` para `text`, `STROKE_COLOR` para
`border`, `SHAPE_FILL` para `icon`.

Cada variável também carrega `codeSyntax.WEB` apontando para a CSS var real
(`palette/brand/600` → `var(--santo-palette-brand-600)`), então o designer lê no
painel do Figma o nome que o dev vai escrever.

**A escrita também sai por aqui.** O `use_figma` do MCP executa a Plugin API
dentro do arquivo, e a Plugin API cria coleções, modos, variáveis e styles **sem
exigir Enterprise** — é o caminho que substitui o `figma:push` enquanto o PAT
não tiver escopo de Variables. Quem faz isso é o subagente `criacao-figma`
(`.claude/agents/criacao-figma.md`), transcrevendo `dist/figma/*.json`
literalmente, alias como alias e nunca como hex resolvido.

Os três subagentes dividem o trabalho por direção, e a divisão é o que impede
valor solto de entrar no sistema:

| agente             | faz                                            | nunca faz                        |
| ------------------ | ---------------------------------------------- | -------------------------------- |
| `arquiteto-tokens` | cria e evolui token no código                  | escreve no Figma                 |
| `criacao-figma`    | semeia e desenha no Figma com o que existe     | inventa valor ou cria token      |
| `paridade-figma`   | confere os dois lados e reporta divergência    | corrige o que encontra           |

O `criacao-figma` trava em vez de improvisar: se o desenho pede um valor que não
existe no código, ele para e devolve o pedido para o `arquiteto-tokens`. Um
valor provisório num protótipo nunca volta a ser revisto — ele vira o valor.

Tanto a escrita por Plugin API quanto um plugin próprio consomem os mesmos
arquivos que o build já emite:

```
dist/figma/manifest.json       índice: coleções, modos, contagens
dist/figma/palette.json        \
dist/figma/brand.json           |
dist/figma/primitives.json      |  uma por coleção de Variables
dist/figma/color.json           |
dist/figma/semantic.json       /
dist/figma/text-styles.json    Text Styles, com boundVariables
dist/figma/effect-styles.json  Effect Styles
```

Esses arquivos existem sempre, independente do caminho escolhido: eles são o
formato de troca, não um detalhe interno do push.

## O que o `figma:push` se recusa a fazer

**Remover.** Uma variável que existe no arquivo e não no código pode ser resto
de um rename — ou trabalho de design que ainda não virou token. O push lista
essas variáveis e para; só remove com `--prune` explícito.

**Trocar o tipo de uma variável.** `resolvedType` é imutável na API do Figma.
Uma variável que virou de `FLOAT` para `STRING` no código precisaria ser apagada
e recriada, o que quebra toda ligação já feita num layer. O push detecta o caso,
lista como _bloqueada_ e deixa a decisão com quem sabe o custo.

**Escrever sem você ver antes.** Sem `--confirm`, o push calcula o plano,
imprime e sai. A escrita via API não tem desfazer e o arquivo é compartilhado.

## O que é verificado automaticamente

`pnpm test` no pacote roda três verificadores:

| verificador        | o que garante                                                         |
| ------------------ | --------------------------------------------------------------------- |
| `check-structure`  | nomes, paridade entre temas, aliases que resolvem, camadas, cobertura |
| `check-figma-plan` | o plano de escrita é coerente, sem rede e sem credencial              |
| `check-contrast`   | os pares de cor declarados atingem o mínimo da WCAG 2.2 AA            |

O `check-figma-plan` cobre dois cenários construindo o documento remoto a partir
do local, sem falar com o Figma:

- **espelho** — um arquivo idêntico ao código produz zero divergência e zero
  operação. Se isso quebrar, o push passaria a reescrever o arquivo inteiro toda
  vez e o check acusaria divergência permanente.
- **vazio** — um arquivo em branco produz um plano completo: toda variável
  criada, todo valor com destino, e todo alias apontando para algo que o próprio
  lote cria.

## O que **não** é verificado

**Se o Figma aceita o corpo da requisição.** Isso exige um arquivo Enterprise
real. A montagem do payload segue a API documentada e é exercitada offline, mas
não houve execução contra um arquivo de verdade. O primeiro push num arquivo
novo deve ser feito com o plano na tela e alguém olhando.

**As propriedades dos Text Styles e Effect Styles.** A API REST lê metadados de
estilo (nome, descrição), mas não o tamanho de fonte ou o raio de uma sombra.
Um check que comparasse só os nomes daria verde com um estilo inteiramente
errado — uma garantia falsa é pior que nenhuma. Esses estilos vão pelo plugin.

**Tokens sem equivalente no Figma.** Alguns não têm como ser representados
(`72ch` não tem unidade correspondente). Eles não somem em silêncio: aparecem na
lista `unsupported` de `dist/figma/manifest.json`, com o motivo.

## Modos: marca e tema

No Figma "modo" é usado para duas coisas diferentes aqui, e a distinção está em
`packages/tokens/figma.config.mjs`:

- em `Palette` e `Brand`, cada modo é uma **marca** (Santo, Produto A, …);
- em `Color`, cada modo é um **tema** (Light, Dark).

Um frame herda os dois. Trocar a marca no painel re-tematiza tudo, porque a
camada semântica só faz alias para `palette/*` e nunca carrega hex — invariante
que o `check-structure` verifica.

Limite de plano: Starter permite 1 modo por coleção, Professional 4 e
Organization/Enterprise 40. Com mais de 4 marcas em Professional, separe as
marcas em arquivos de biblioteca em vez de modos.
