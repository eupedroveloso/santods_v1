# SantoDS — leia-me

> Contexto em prosa do SantoDS v1, escrito a partir do próprio repositório em 2026-10-19
> (HEAD `406f2cf`). Os caminhos são relativos à raiz do repo. Este arquivo abre a série:
> `01-arquitetura.md`, `02-tokens.md`, `03-componentes.md`, `04-site-de-documentacao.md`,
> `05-regras-e-rubricas.md` e `06-figma.md`. O 02, o 03 e o 06 são gerados por
> `scripts/build-contexto.mjs`; `santods-contexto-completo.txt` reúne todos.

## O que é

O SantoDS é o **Design System da Ready To Go**. A empresa tem vários produtos, cada um com
identidade própria (tipografia, cores, raio, espaço, efeitos), e todos precisam das mesmas
três entregas: **Landing page**, **Materiais complementares** e **Slides**.

A arquitetura responde a isso em três camadas:

- **Um núcleo.** O contrato de nomes (os tokens e o que cada um significa), os componentes e
  as grades. É igual para todo produto.
- **N marcas.** Os valores que mudam por produto. Cada marca é um **modo** nas coleções
  `Palette` e `Brand` do Figma, e no código vira um bloco `[data-brand='<id>']` no CSS. Hoje
  existem duas: **Santo** (`santo`, a padrão) e **Venda Todo Santo Dia** (`vtsd`).
- **Kits de entrega.** Landing, Materiais complementares e Slides, montados só com o núcleo
  e pintados pela marca do produto.

O repositório é ao mesmo tempo a biblioteca (`lib/`) e o site de documentação dela (`app/`,
Next.js 16.2 + Tailwind v4). A fonte de design é o arquivo Figma **SantoDS v1**:
https://www.figma.com/design/O0xV7p3taNff97XGjNjTMl/SantoDS-v1 (345 variáveis, 68 text
styles, 7 effect styles; a página `Icones` fica fora da paridade de tokens, mas é a única
fonte de ícones).

## Para quem serve

- **Quem constrói produto da Ready To Go** (landing, painel, material): importa de
  `@/lib/ui`, usa os utilitários Tailwind gerados dos tokens e escolhe a marca com
  `data-brand`. Não inventa cor, espaço nem raio.
- **Quem desenha no Figma:** tudo o que existe no Figma existe no código e vice-versa. Mudou
  um token no Figma, ele chega ao código por sincronização, nunca por edição à mão.
- **Agentes de IA que trabalham no repo:** as regras estão em `AGENTS.md`, nos manuais
  `.claude/agents/*.md` e nas skills `.claude/skills/*/SKILL.md` (reunidos em
  `05-regras-e-rubricas.md`).

## Os princípios do Pedro

Todos foram definidos por Pedro Veloso em **2026-10-19** e valem acima de qualquer outra
regra:

1. **Tudo documentado, componentizado e auditado.** Nada avulso em nenhum projeto: sempre
   os tokens, componentes, temas e estilos deste repositório.
2. **Figma e repositório caminham juntos.** Componente, token ou estilo que existe aqui
   existe lá, e vice-versa. A paridade cobre tokens, componentes e estilos.
3. **UI com cara padrão de Tailwind está reprovada.** O que é "cara de Tailwind" e o que
   usar no lugar está na skill `santo-ui-craft` (regra ANTI-GENÉRICO).
4. **Sem margem morta.** O cartão tem a altura do seu conteúdo. Nada de esticar um irmão para
   igualar a fileira. Daí nasceu o `CardGrid`, que alinha ao topo.
5. **Identidade do Santo sem borda 100% arredondada.** `radius/full` só para círculo
   geométrico (avatar, punho de switch, ring, ponto). Os raios por família de peça moram
   num lugar só, `lib/ui/radius.ts`. Exceção posterior do Pedro: Tag/Badge, Count e Marker
   podem ser cápsula.
6. **Regra dura: tudo componentizado, tokenizado e documentado na estrutura de doc do DS**
   (meta + demo + README + `/componentes`). Nada montado inline em `app/exemplos`, que só
   compõe blocos da lib. O `npm run lib:check` cobra isso (regra D).

Consequência prática: **nenhuma tarefa está pronta** sem doc em `/componentes`, registro em
`lib/ui/README.md`, par no Figma (ou dívida registrada) e os checks rodados com saída real.

## O time e o fluxo de trabalho

O trabalho acontece num canvas do Maestri, com agentes em terminais separados. Cada um tem
um dono de área bem definido:

| Quem | Papel | Dono de |
|---|---|---|
| **Chefe** (maestro) | Planeja, delega, acompanha e consolida para o Pedro | Nada no repo. Nunca executa: nem código, build, git, servidor, portal ou doc. Seus `maestri ask` vão em segundo plano |
| **Compasso** | Guardião de Tokens | `tokens/`, `lib/tokens/`, `scripts/figma-*`, `check-parity`, sincronização com o Figma |
| **Ateliê** | Construtor de Interface | `lib/ui/`, `app/`, `lib/fonts/`, `lib/thumbs/`, documentação viva em `/componentes` |
| **Traço** | Construtor de Gráficos (andar "Gráficos") | Biblioteca de gráficos, hover e teclado, blocos de exemplo. O andar já foi juntado ao térreo |
| **Vigia** | Revisor e QA | Só lê e roda checks. Revisa **somente quando o Pedro pede** |

Como uma tarefa anda:

1. O Pedro pede ao Chefe. O Chefe registra a tarefa na nota compartilhada `santo-contexto`
   ("Tarefas em andamento") e a quebra por dono.
2. Token vai para o Compasso; tela e componente, para o Ateliê. Tarefa mista roda em
   paralelo. Quando há dependência, o token vem antes da UI.
3. O dono implementa, roda os próprios checks e reporta ao Chefe **com a saída real** de
   `design:check`, `build` e `tokens:check`. Sem saída, a tarefa não está pronta.
4. O Vigia entra só quando o Pedro pede revisão. O parecer é APROVADO ou REPROVADO, com
   arquivo:linha.
5. Commit só quando o Pedro pede. Quem commita é o dono dos arquivos. Não há push sem pedido.

Trabalho grande e isolado pode ir para um **andar** (floor) do Maestri: uma cópia do repo
num branch próprio, juntada ao térreo (`main`) quando o Pedro pedir. Foi o caso da Fase C
(gráficos), juntada em `a22dde5`.

## Roadmap

As fases do produto são **F0 marca → F1 layout → F2 landing → F3 página → F4 preview**.

Estado em 2026-10-19:

- **F0, marca:** a segunda marca, VTSD (verde `#00A99D`, Sora, raio 8), existe nos tokens.
  As rampas foram geradas por luminância casada com o Santo (`tokens/VTSD.proposal.md`,
  `scripts/brand-ramp.mjs`). O modo foi aplicado ao snapshot por script, por exceção
  autorizada, e por isso **o snapshot está à frente do Figma** em Palette/Brand até a
  reconciliação. O lado visível está pronto: `BrandLogo`, o seletor de marca no header,
  as fichas em `/identidades` e a persistência em `localStorage`.
- **F1, layout:** a Fase A (sem margem morta, `CardGrid`, `AppSidebar`) e a Fase B (raio por
  família, `lib/ui/radius.ts`, régua de equilíbrio) estão concluídas.
- **F2, landing:** concluída. `/exemplos#landing` segue a marca ativa e, em VTSD, monta a
  página de venda da VTSD só com
  blocos de `lib/ui`: `LandingPage`, `HeroCard`, `YouTubeEmbed`, `LandingOffer`,
  `CtaButton`, `Rating`, `SocialProofToast`, `LogoStrip`, `BentoGrid`…
- **Fase C, gráficos (andar Gráficos):** concluída e juntada. `LineChart`, `AreaChart`,
  `BarChart` e `DonutChart` com hover e teclado, mais 19 blocos de cartão (`StatCard`,
  `ChartCard`, `TransactionsCard`…).
- **Em andamento:** a 2ª passada do Dashboard (`/exemplos#dashboard`) e este pacote de
  contexto para download.
- **F3 página e F4 preview:** ainda não começaram.

## Estado do repositório

- `main` em `406f2cf` ("Inventário de componentes após a junção"). Não houve push.
- Cerca de 121 componentes registrados (41 primitivos, 80 semânticos no HEAD), cada um com
  página própria em `/componentes/<slug>`. O build pré-renderiza cerca de 138 páginas
  estáticas.
- Os checks (`tokens:check`, `design:check`, `lib:check`, `tier:check`, `lint`, `build`)
  estavam verdes na junção.

**Dívidas abertas que quem chega precisa conhecer:**

- **Paridade de componentes.** Só 8 componentes existem no Figma, e 6 têm par no código.
  A maior parte da lib é `codeOnly`: tem a tag "Sem par no Figma" na própria página. O
  inventário está em `tokens/santods.components.json`.
- **Paridade de tokens em dois sentidos.** O snapshot está à frente do Figma no modo VTSD.
  Já o Figma está à frente nos styles: os 68 text styles foram renomeados para
  `Text/<papel>/<peso>` e os effect styles foram religados a variáveis. A reconciliação
  depende do MCP do Figma autenticado. O procedimento está em `.claude/agents/figma-parity.md`.
- **D1, contraste.** `text/on-brand` sobre `bg/brand/solid/default` reprova AA no tema claro
  nas duas marcas (3,05 no Santo, 2,93 na VTSD). O Pedro decidiu manter as cores por
  enquanto. Detalhes e correções estudadas em `tokens/README.md`.
- **Tokens que faltam no Figma:** paleta categórica de gráficos (`data/series/*`),
  `opacity/*`, uma sombra ambiente grande e `radius/control`. Até existirem, cada lugar
  que precisa deles tem um `PENDENCIA`/`TODO` anotado.
