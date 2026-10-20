# SantoDS — regras e rubricas

> Os textos normativos do SantoDS, **integrais**, copiados dos arquivos de origem no
> repositório em 2026-10-19 (HEAD `406f2cf`). Cada seção abre com o caminho do original. Em
> caso de divergência, vale o original. Os frontmatters YAML das skills e dos agentes estão
> preservados.

Conteúdo:

1. `AGENTS.md`: regras inegociáveis do repo
2. `.claude/skills/santo-ui-craft/SKILL.md`: craft de interface, regra ANTI-GENÉRICO e a rubrica de aprovação
3. `.claude/skills/santo-vitrine/SKILL.md`: gramática das miniaturas de componente
4. `.claude/skills/santo-maestro/SKILL.md`: o maestro, o time, o roteamento e a delegação
5. `.claude/agents/figma-parity.md`: manual de paridade com o Figma
6. `.claude/agents/santo-design.md`: manual de quem desenha e revisa interface


---

## 1. Origem: `AGENTS.md`

<!-- início de AGENTS.md -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

# SantoDS

Dois agentes cuidam deste repositório. Use-os:

- **`figma-parity`** — qualquer coisa de token ou tema. Conhece o fluxo de
  sincronização com o Figma e os hashes de referência.
- **`santo-design`** — qualquer coisa de tela, componente ou aparência. Conhece o
  vocabulário de token e o padrão de qualidade.

Regras que não se negociam:

- **Nada em `lib/tokens/` é editado à mão.** São arquivos gerados. As exceções, que
  são código-fonte de verdade: `emit.mjs`, `types.ts` e os `.d.ts`.
- A fonte da verdade é `tokens/santods.figma.json`. Valor errado no CSS significa
  snapshot desatualizado (sincronize com o Figma) ou emissor com bug.
- `lib/tokens/emit.mjs` é o único caminho de renderização. Mexeu num emissor,
  mexeu no que o build inteiro produz.
- Componente de UI vive em `lib/ui/` e é documentado em `/componentes`. Antes de
  criar um componente, veja se ele já existe lá.
- **Nenhum valor solto** em código de interface: sem hex cru, sem `p-[13px]`,
  sem `rounded-[10px]`. `npm run design:check` cobra isso.
- Depois de mexer em token: `npm run tokens`.
- Depois de mexer em interface: `npm run design:check && npm run build`.

<!-- fim de AGENTS.md -->

---

## 2. Origem: `.claude/skills/santo-ui-craft/SKILL.md`

<!-- início de .claude/skills/santo-ui-craft/SKILL.md -->

---
name: santo-ui-craft
description: Estratégia de criação de UI do SantoDS (regra ANTI-GENÉRICO do Pedro). Use SEMPRE antes de criar, recriar ou revisar componente, card, tela, nav, lista, campo, dashboard ou qualquer superfície visual; quando alguém disser "está com cara de Tailwind", "genérico", "sem graça", "padrão"; e como rubrica de aprovação do Vigia. Define superfícies tonais, raio por nível, vocabulário de pílula, hierarquia número+unidade, micro-visualização, nav em trilho, listas, campo-poço, FAB, processo e checklist.
---

# SantoDS — craft de interface (anti-genérico)

Regra do Pedro (2026-10-19): **UI com cara padrão de Tailwind está reprovada.**
Toda superfície nasce desta estratégia, com os tokens do Figma, componentes de
`lib/ui` e nada solto. As referências que inspiraram estes princípios valem só
pela ESTRUTURA — não copie identidade de ninguém e não salve imagem de
referência no repo.

Leia antes: `AGENTS.md`, `.claude/agents/santo-design.md` (vocabulário de
token), `lib/ui/README.md`. Esta skill decide o *como fica bonito*; aquelas
decidem *com o quê*.

---

## 1. O que é "cara de Tailwind" (reprovado)

Reconheça e recuse. Qualquer item abaixo numa entrega = volta.

| Reprovado | Por quê | No lugar |
|---|---|---|
| Card branco + `border` 1px cinza visível + `rounded-md` + `shadow-sm` | É o default de todo tutorial; sem profundidade, sem intenção | Nível tonal (§2) + sombra ambiente + raio do nível (§3) |
| Tudo na mesma superfície, separado por bordas | Hierarquia por linha, não por tom | 3 níveis tonais; borda só como hairline de apoio |
| Botões, abas e filtros retangulares de raio pequeno | Controle "de formulário", frio | Pastilha com raio de controle (`RADIUS_CONTROL`) sobre trilho tonal (§4) |
| Botão, chip, aba ou campo em cápsula (`radius-full`) | Fora da identidade do Santo (princípio 5 do Pedro) | `radius/full` só em círculo geométrico; controle leva o raio de controle (§3, §4) |
| Hierarquia só por tamanho de fonte | Lê como documento, não como produto | Número grande + unidade pequena, título + meta na mesma linha, micro-viz (§5, §6) |
| Grade de cards idênticos com ícone em quadradinho colorido + título + parágrafo | Template de landing | Composição com um protagonista por região, tiles tonais, zero subhead |
| Nav com lista plana de links e ativo em fundo cinza retangular | Sidebar genérica | Trilho de ícones + painel; ativo em pastilha elevada; conectores de árvore (§7) |
| Tabela com borda em cada célula / zebra forte | Planilha | Cabeçalho tonal, linhas hairline, número à direita (§8) |
| Campo com borda 1px dentro de card branco | Formulário cru | Campo-poço (sunken) com ações inline (§9) |
| Várias cores de acento numa mesma região | Ruído | **Um** acento (brand) por região; resto monocromático |
| Texto explicativo sob título de card/componente | Proibido (regra de subhead zero) | Ícone, badge, Count, cor, agrupamento |
| Cartão esticado até a altura do vizinho, com buraco entre o conteúdo e o rodapé | Margem morta (princípio 4 do Pedro) | `CardGrid` alinhado ao topo; cartão na altura do conteúdo |

## 2. Superfícies: profundidade por TOM

Três níveis, sempre nesta ordem de dentro para fora. A profundidade vem do
**tom** e de **sombra ambiente**, não de contorno.

| Nível | Token | Quando | Contorno |
|---|---|---|---|
| 0 · chão | `surface/page` (região de fundo) e `surface/sunken` (área rebaixada que contém cards) | fundo da tela, canvas de dashboard, trilho de nav | nenhum |
| 1 · card | `surface/raised` | o que agrupa conteúdo: Card, painel, popover, tab bar flutuante | hairline `border/subtle` **só** quando o tom não separa (escuro, raised sobre raised); sombra ambiente |
| 2 · poço | `surface/sunken` dentro do raised | **só** campo (Input/Textarea/Select `well`), área de código (CodeBlock) e trilho de controles (Segmented, rail, composer) | nenhum ou hairline; sem sombra externa |

Regras:
- **Nada de caixa em volta de componente** (Pedro, 2026-10-19: "tire esses box
  escuros em volta dos componentes"). Tile de meta, Stat, KeyValue, ListRow,
  gráfico ou micro-viz dentro de cartão NÃO ganham caixa própria (nem sunken,
  nem raised, nem borda): separam-se por espaço ou `Divider`. `Card
  variant="well"`/`"inset"` viraram GRUPO sem caixa (só o gap). `IconTile` é `plain` (sem caixa) por padrão; caixa tonal só quando a cor significa algo (`brand` em estado vazio/destaque). No máximo **um**
  nível de poço dentro de cartão, e só para campo, código ou trilho de controle.
- **Nunca** mais que 3 níveis empilhados. Poço dentro de poço = errado.
- Pastilha ativa (Segmented, NavItem, Tab) é um "nível 1 dentro do nível 2":
  `surface/raised` + `shadow-xs` sobre trilho `surface/sunken`.
- Sombra: ambiente, grande e suave, baixa opacidade. Use as effect styles:
  repouso de card `shadow-xs`/`shadow-sm`; card de destaque / tab bar
  flutuante / FAB `shadow-lg`–`shadow-xl`; modal `shadow-2xl`. **Nunca** sombra
  em cada linha de lista.
- Pendência de token (Compasso): falta uma sombra **ambiente grande e suave**
  (blur alto, y médio, opacidade ~5–8%) entre `md` e `xl`. Até existir, use
  `shadow-sm` em repouso e `shadow-lg` em destaque; não invente `box-shadow`.
- Escuro: sombra quase some — o nível 1 se separa pelo tom (`raised` mais claro
  que `page`/`sunken`) e pela hairline. Verifique os dois temas sempre.

## 3. Raio por nível (aninhado) e equilíbrio

**Régua de equilíbrio** (Pedro, 2026-10-19: "o equilíbrio entre os border
radius"). Verificável no DOM, para cada par de peças:

1. **Concêntrico** — filho aninhado numa moldura JUSTA (padding < raio da
   moldura): `raio do filho = raio da moldura − padding` (± o fio de 1px da
   `santo-edge`). Vale para trilho/item, punho/trilho do Switch, painel/moldura
   do Card double, cartão/moldura sunken, botão/composer.
2. **Irmãos no mesmo nível visual usam o MESMO degrau** — item do trilho,
   botão primário, campo (uma ou várias linhas), select, RadioCard, CodeBlock e
   IconTile dentro de cartão: todos no raio de controle. Trilhos irmãos entre si
   e cartões dentro de moldura: todos `lg`.
3. **A moldura nasce do filho** — `raio da moldura = raio do filho + padding`.
   Trilho = controle + 2xs (8 + 4 = `lg`); moldura sunken = cartão (`lg`) +
   padding (`p-sm` → 24 = `2xl`); Card double = painel (`lg`) + recuo xs + fio.
   Calculado em `style` com `calc()` de tokens, nunca px.
4. **Cartão folgado** (padding ≥ raio, ex. Card raised xl com `p-lg`): o
   filho fica longe do canto, não há relação concêntrica a cumprir — ele leva o
   degrau da sua família (regra 2). O piso do raio interno é o **raio de
   controle**, nunca abaixo (`--santo-card-inner-radius = max(controle, raio −
   padding)`).

Teto: cartão de página `radius-xl` (16). Moldura que embrulha cartões pode
passar do teto porque é derivada (regra 3), não escolhida.

| Peça | Raio |
|---|---|
| Card de página e superfícies equivalentes (Card raised, modal, EmptyState, LinkCard) | `radius-xl` (16) **no máximo** (Pedro, 2026-10-19: 2xl/3xl ficou grande demais) |
| Cartão dentro de moldura sunken, painel do Card double, bolha de chat | `radius/lg` (12) — irmão do trilho |
| Moldura sunken / moldura do Card double | **derivada**: filho (`lg`) + padding (+ fio) |
| Filho de cartão (poço de campo, código, IconTile, RadioCard) | `max(controle, externo − padding)` (`--santo-card-inner-radius`): em cartão folgado = controle (8) |
| Controles compactos (botão, IconButton, chip, count, aba de segmented/tab bar, nav item, rail item, campo de 1 ou mais linhas, select, number field, disclosure, FAB, trilho do switch) | **raio de controle** `RADIUS_CONTROL` (`radius/md` = 8; vira `radius/control` quando o token entrar — `TODO(radius/control)` em `lib/ui/radius.ts`) |
| Trilho que envolve controles com `p-2xs` (segmented, tab bar, rail, nav user, composer) — e o punho do Switch, que é controle − 2xs (`xs`) | `RADIUS_TRACK` = controle + 2xs = `radius/lg`, concêntrico |
| **Badge e Tag** — Tag/Badge, Count, Marker (rótulo estático pequeno) | `radius-full` (`RADIUS_BADGE`) — **exceção do Pedro** (2026-10-19): a única cápsula fora do círculo |
| Faixa tonal feita de células (cabeçalho da Table) | raio de controle só nas pontas (`RADIUS_CONTROL_START`/`END`), nunca cápsula |
| Barra fina de dado (Progress, MiniBars, trilha de range, scrollbar) | `radius/xs` (`RADIUS_BAR`): barra não é controle |
| **Círculo geométrico** — avatar, radio, punho do range, Ring, ponto/marker/dot, swatch e IconTile redondos, dia escolhido do Calendar (e pontas da faixa de intervalo, concêntricas a ele) | `radius-full` — junto com badge/tag, os ÚNICOS usos (princípio 5 do Pedro) |
| Thumbs da vitrine | moldura própria (skill santo-vitrine), não muda |
| Code inline (`CopyCode`, `Kbd`, `<code>` em texto) | `radius-xs` — **não é controle**; vive em célula/linha sem padding, então leva o menor degrau |
| Campo de texto | raio de controle, de 1 ou de várias linhas (irmãos: mesmo degrau) |
| Tile de ícone, thumb, avatar quadrado | inner do pai; avatar sempre círculo |

Fórmula inegociável: **interno = externo − padding** em moldura justa; em
cartão folgado, mínimo = raio de controle; filho colado herda o raio do pai. O Vigia mede no DOM.

## 4. Vocabulário de pastilha (sem cápsula)

Princípio 5 do Pedro (2026-10-19): **a identidade do Santo não tem borda 100%
arredondada.** A gramática de controle é a **pastilha**: retângulo com o raio
de controle (`RADIUS_CONTROL`), elevada sobre um trilho tonal com raio
concêntrico (`RADIUS_TRACK` = controle + `p-2xs`). Vale para `Segmented`,
`Chip`, `Count`, `Button`/`IconButton` (o `pill` ficou sem efeito), FAB,
`TabBar`, NavItem, RailItem, Input/Select/NumberField, Disclosure. **Exceção**:
badge e tag (Tag, Count, Marker) podem ser cápsula (`RADIUS_BADGE` = full) —
só eles. Code inline e Kbd ficam em `radius-xs`. Fora isso, `radius/full` só em
círculo geométrico; bloco, superfície, faixa e controle nunca. Tudo vem de `lib/ui/radius.ts` — nunca escreva
`rounded-full` em controle. Regras:
- Trilho em `surface/sunken`, pastilha ativa em `surface/raised` + `shadow-xs`.
- Count sempre em cápsula (badge) à direita do rótulo, `tabular-nums`.
- Altura por token de tamanho (`size-24/28/32/36/40`), nunca por padding solto.
- Selecionado ≠ hover: selecionado eleva (raised+sombra); hover só tonaliza
  (`bg/neutral/subtle/hover`).

## 5. Tipografia: hierarquia por papel

- **Número + unidade:** número em destaque, `tabular-nums`, na escala do `Stat`
  (Pedro, 2026-10-19: números menores) — `sm` heading-6, `md` heading-5 (padrão
  de cartão), `lg` heading-3 só para o número da tela; título de tela um degrau
  acima do KPI (heading-4). Nunca heading-1/2 em número de cartão;
  unidade/legenda pequena (`santo-caption-*`, `text/tertiary`) **embaixo** ou à
  direita na baseline. É o protagonista do Stat.
- **Título + meta na mesma linha:** título `santo-body-large-semibold`, meta
  (data, contagem, status) à direita em caption/Count/Tag. Sem subhead embaixo.
- Máximo 3 tamanhos e 2 pesos por região. Overline (`OVERLINE`) para rótulo de
  seção.

## 6. Micro-visualização

Monocromática com **um** acento: `Ring` (progresso), `Sparkline` (tendência),
`MiniBars` (série curta) — primitivos da Forja em `lib/ui`. Base em
`border/subtle`/`text/tertiary`, acento em brand. Vai no slot do `Stat` ou à
direita do título; nunca legenda, eixo ou grade dentro de micro-viz.

## 7. Navegação

- **Trilho de ícones** (nível 0, compacto, `IconButton` em pastilha) + **painel**
  expandido (nível 1) com as seções.
- Ativo = **pastilha elevada** (raised + `shadow-xs`), ícone `icon/primary`.
- Subitens com **conectores de árvore** (linha `border/subtle` vertical + curva
  ao item), recuados.
- Contagem em `Count` (cápsula de badge) à direita.
- **Header flutuante** (landing, app de marketing): painel `surface/raised` + `border/subtle` + `shadow-md`, largura total (afastamento lateral space/md), descolado do topo por space/sm e sticky mantendo o afastamento (faixa transparente por fora). Raio pela régua: filhos de canto em controle (md) + folga xs → painel `xl`; menu num trilho sunken (lg) com pastilhas de controle, ativo elevado. Nunca cápsula; no celular, o mesmo painel e a gaveta abre dentro dele (`LandingHeader`).
- Mobile: `TabBar` flutuante no rodapé (trilho `RADIUS_TRACK`, `shadow-lg`, blur de fundo).

## 8. Listas e tabelas

- Linha: ícone em slot (`IconTile` plain, sem caixa) ou avatar (leading) + nome (`body-small-semibold`) / meta
  (caption, tertiary) + ação **ghost** (IconButton) à direita.
- Divisória **hairline** `border/subtle` entre linhas; nada de card por linha.
- Tabela: cabeçalho tonal (`surface/sunken`, caption semibold), linhas hairline,
  número à direita com `tabular-nums`, hover tonal.

### Realce de linha (hover/seleção) com raio aninhado

Vale para linha de Table, ListRow, opção de Select/⌘K, SettingRow, célula
clicável. Nunca um retângulo reto encostando na borda arredondada do card.
- **(a) INSET — padrão** (`santo-row`): o realce é uma pastilha suave dentro do
  contêiner, recuada pelo padding; raio = `min(radius-sm, raio interno do Card)`
  (xl − padding → sm/xs). Em `<tr>` o fundo vai nas células e só as pontas
  arredondam no hover/seleção; em repouso a hairline fica reta. Table e listas
  dentro de Card com padding.
- **(b) FLUSH** (`santo-row-flush`, `Table flush`): lista que ocupa o Card
  inteiro (`padded={false}`): realce reto de ponta a ponta, e o contêiner
  recorta (overflow + raio do Card) — primeira/última linha herdam o raio nos
  cantos externos.

## 9. Campo-poço e ações

- Campo dentro de card = **poço** (`surface/sunken`), sem borda visível em
  repouso; foco = anel `santo-focus-field` (brand-subtle) + borda brand.
- Ações inline dentro do poço (enviar, anexar, emoji) como IconButton ghost /
  primário com raio de controle, à direita; raio do botão = raio do poço − respiro.
- Ação principal flutuante (FAB): raio de controle (nunca cápsula), brand solid, `shadow-lg`,
  fixa no canto/centro inferior; fundo com blur só sobre área curta.

## 10. Processo de criação

1. **Anatomia** — o que a pessoa lê primeiro, depois, por último. Liste as peças
   e verifique cada uma em `lib/ui` (lib-first; falta = criar na lib antes).
2. **Níveis tonais** — atribua 0/1/2 a cada região (§2).
3. **Raio** — moldura → interno → controles (§3), calculado.
4. **Ritmo de espaço** — dentro do grupo < entre grupos; padding igual em
   irmãos; um grid por página, sempre `CardGrid` de `lib/ui` (nunca `grid`
   inline em `app/`). **Sem margem morta** (Pedro, 2026-10-19, revoga a regra
   antiga de "alturas de irmãos iguais"): cartão tem a altura do seu
   conteúdo. A grade alinha ao topo e encaixa em fluxo denso; nada de esticar
   irmão para igualar fileira, nem `mt-auto`/`flex-1` para empurrar rodapé
   para o fundo de um cartão esticado. Igualar altura só quando os irmãos já
   são naturalmente iguais (quatro `Stat` do mesmo molde) ou num **índice de
   cartões de navegação** (`CardGrid masonry={false} stretch`): ali o conteúdo do
   cartão curto CRESCE para preencher (links esticam), nunca fica buraco.
   **Grade de dashboard = blocagem por fileira**: uma grade fixa com stretch por
   fileira, nunca masonry. Cada fileira junta irmãos de conteúdo EQUIVALENTE
   (KPIs do mesmo molde; cartões de operação com cabeçalho + conteúdo + resumo
   + uma ação ancorada no fim); se um cartão destoa, ele muda de fileira, não é
   esticado. Spans planejados para a fileira fechar em todo breakpoint (1 col;
   2 em md com o ímpar em `col-span-2`; 3–4 em xl). Tabela/lista: largura total.
   Cabeçalho (`DashboardHeader`) alinhado à mesma grade.
   **Hero em cartão** (landing): a abertura num cartão `brand/subtle` raio xl com
   a margem da página em volta — header inline, título em 2 linhas (a 2ª em
   text-brand), 2 ações lado a lado no MESMO degrau de raio, o vídeo (borda dupla) e
   avaliação no pé (`HeroCard`). **Bento**: grade fixa com spans que fecham a
   fileira em todo breakpoint (alto 2 linhas + largo 2 colunas), cada célula com
   um número protagonista; tons distintos por célula (raised, brand, inverse),
   nunca dois destaques de marca lado a lado (`BentoGrid`). Palco, poço e
   painel também sem `min-h` decorativo: altura = conteúdo + padding.
5. **Acento único** — escolha o único elemento em brand da região.
6. **Estado e motion** — hover tonal, selecionado elevado, foco visível,
   entrada com `santo-animate-*`, transição com `santo-transition-*`
   (`lib/ui/motion.css`), respeitando reduced-motion.
7. **Dois temas + 375px** — confira claro, escuro e celular.

## 11. Usabilidade (Nielsen) e performance

- Status visível (Count, Progress, estados de foco/seleção), linguagem do
  usuário (rótulos curtos em pt-BR), controle e liberdade (Esc fecha, voltar
  funciona, hash preserva estado), consistência (mesma peça = mesmo visual),
  prevenção de erro (destrutivo pede confirmação), reconhecer > lembrar (ícone +
  rótulo na nav, busca ⌘K), eficiência (atalhos, ações inline), estética
  minimalista (zero subhead), ajuda a recuperar (erro diz o que fazer).
- Alvo de toque ≥ `size-40` no celular; contraste AA em texto.
- Performance: `backdrop-filter` só em superfícies pequenas e fixas (tab bar,
  FAB, topbar) — **nunca** em lista longa ou card repetido; sombra no container,
  não em cada linha; anime `transform`/`opacity`, não `box-shadow`/`height` em
  massa; imagens WebP em tamanho certo, `next/image`, lazy fora da dobra.

## 12. Checklist de aprovação (rubrica do Vigia)

Reprova se qualquer item falhar:

1. [ ] Nenhum padrão da tabela §1 presente.
2. [ ] Cada região tem nível tonal atribuído; ≤ 3 níveis; poço não aninha poço.
3. [ ] Sem borda 1px visível como única separação no claro; hairline só onde o
       tom não separa.
4. [ ] Raios pela régua de equilíbrio (§3): concêntrico em moldura justa, irmãos no mesmo degrau, moldura = filho + padding (medido); card de página ≤ xl; controles
       compactos com raio de controle; `radius-full` só em círculo geométrico.
5. [ ] Ativo/selecionado eleva (raised + sombra); hover só tonaliza.
6. [ ] Um acento por região.
7. [ ] Número com unidade pequena; título + meta na mesma linha; zero subhead.
8. [ ] Listas: tile/avatar + meta + ação ghost, hairline, sem sombra por linha;
       realce de linha inset (raio aninhado) ou flush recortado pelo card.
9. [ ] Campo dentro de card é poço; ações inline.
10. [ ] Tudo de token/componente da lib (`npm run check` verde, salvo dívida
        anotada).
11. [ ] Claro, escuro e 375px conferidos; **sem margem morta**: nenhum
        cartão esticado além do conteúdo (vão interno entre o último bloco e a
        borda = padding do cartão), grade via `CardGrid` alinhada ao topo,
        nenhum `min-h`/`mt-auto`/`flex-1` criando vão vazio.
12. [ ] Motion com tokens e reduced-motion; sem blur em lista longa.

<!-- fim de .claude/skills/santo-ui-craft/SKILL.md -->

---

## 3. Origem: `.claude/skills/santo-vitrine/SKILL.md`

<!-- início de .claude/skills/santo-vitrine/SKILL.md -->

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
profundidade por **tom**, não por contorno; controle compacto em **pastilha** (sem cápsula — princípio 5 do Pedro);
campo é **poço**; ativo é **pastilha elevada sobre trilho**; nav em **trilho**;
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
  Controle compacto e trilho também caem no piso `xs` (na lib são `radius/md`
  e `radius/lg`; na escala da miniatura viram o piso). `full` **só** em círculo
  (`Circle`, `Check round`). Não existe `none`.
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
| Raio | `xs` (piso) em tudo: cartão, bloco, poço, célula, controle compacto (botão, chip, segmented, aba, item ativo, trilho, FAB, campo), barra · `full` em círculo (avatar, ponto, radio) e em **badge/tag** (Tag, Count: `Chip badge` — exceção do Pedro). Nada entre os dois |
| Tamanho | só a escala de espaço (`w-md`…`w-8xl`, `h-2xs`…`h-5xl`, `size-xs`…`size-xl`) e `--santo-dimension-space-*` |

Nada de hex, de colchete com número, de `bg-brand-*`/`success`/`danger`, de
`text-*` (não há texto). Sombra: `sm` no cartão, `xs` em pastilha/painel
elevado, `lg` só no FAB.

## Formas canônicas (`Skeleton.*`)

| Forma | Uso | Padrão |
| --- | --- | --- |
| `Bar` | linha de texto | `size` lg título/número (strong), md corpo (base), sm metadado/unidade; largura `2xs`…`2xl`/`full`/`fill` |
| `Block` | imagem, painel, bolha, célula, tile, poço, trilho | tom soft, raio xs (`full` existe na API, mas não use em thumb: só círculo é redondo); aceita filhos; `elevated` = nível 1 sobre trilho; `outline` só em amostra; largura `fit` abraça o conteúdo |
| `Circle` | avatar, ponto de status, ícone abstrato | `xs`…`xl`, tom strong; `ring` separa avatares sobrepostos |
| `Button` | botão (pastilha, raio do piso) | `primary` (ênfase), `soft` (secundário tonal); `square` = botão de ícone quadrado; `float` = FAB |
| `Field` | campo-poço | `sunken`, sem contorno; ações em `leading`/`trailing` dentro do poço; uma linha ou várias, sempre no piso `xs` (`pill` sem efeito); `multiline` fica `xs`; `caret` = cursor em ênfase (protagonista) |
| `Chip` | tag, filtro, contador, tecla, trilho de switch | pastilha `h-md`, raio do piso (`badge` = cápsula, só para Tag/Count/Marker); `elevated` = selecionado sobre trilho; `align` posiciona o punho |
| `Check` | checkbox (`square`) e radio (`round`) | desligado = contorno default; `on` = ênfase |
| `Row` | linha de lista/tabela/nav | hairline embaixo; `divider={false}` na última; `selected` = opção realçada (tom, xs); `active` = item de nav ativo (pastilha elevada) |
| `Rule` | hairline / conector de árvore | horizontal ou `vertical`; `emphasis` só quando o divisor é o protagonista |
| `Bars` | gráfico de barras (com eixo) | valores 1–8; `highlight` = uma barra em ênfase |
| `Line` | gráfico de linha/área; `spark` = Sparkline | pontos 0–10; `area`; `second` = segunda série; `spark` baixo e sem eixo |
| `MiniBars` | micro-viz de barrinhas | valores 1–4; barras finas no piso; `highlight` em ênfase |
| `Ring` | micro-viz de progresso | `value` 0–100; trilha base, arco em ênfase; `sm`/`md`/`lg` |

Carregamento (fora das thumbs): `Bar`/`Block` aceitam `animated`
(`santo-animate-shimmer`); quem envolve leva `role="status"` e `aria-busy`.

Composições recorrentes (copie, não reinvente):
- **Bloco de texto**: `Bar lg strong` + `Bar sm` mais curta.
- **Switch**: `Chip w="xs" tone="emphasis" align="end"` com `Block w="xs" h="xs" elevated`
  (ligado); `tone="strong" align="start"` (desligado). Punho em pastilha, não círculo.
- **Swatch**: `Block w="xs" h="lg" outline radius="xs"`.
- **Valor à direita**: envolva em `<div className="ml-auto">`.
- **Chevron/ícone pequeno**: `Block w="2xs" h="xs" tone="strong" radius="xs"`.
- **Trilho + ativo** (Segmented, abas, nav, rail): `Block tone="sunken"`
  com `p-3xs`; dentro, a peça ativa `elevated`
  (ou `Chip elevated` / `Row active`), as demais só tom.
- **Nav em trilho**: coluna `Block w="fit" tone="sunken"` com
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
   compacto também no piso; `full` só em círculo.
7. **Níveis**: cartão (1) → poço/trilho `sunken` (2) → pastilha elevada (1
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
      em pastilha (sem cápsula); campo-poço; trilho `sunken` + ativo elevado; micro-viz onde o
      componente tem.
- [ ] Raio aninhado: só `xs` (piso) e `full` em círculo; nada de `none`, nada de cápsula.
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

<!-- fim de .claude/skills/santo-vitrine/SKILL.md -->

---

## 4. Origem: `.claude/skills/santo-maestro/SKILL.md`

<!-- início de .claude/skills/santo-maestro/SKILL.md -->

---
name: santo-maestro
description: Modo maestro do SantoDS v1 no Maestri. Use SEMPRE ao iniciar sessão neste repositório, quando o usuário pedir uma tarefa de token, tema, componente, tela ou revisão, ou quando mencionar time, terminais, agentes, delegar, Compasso, Ateliê ou Vigia. Carrega quem é o time, as regras do repo e como delegar.
user-invocable: true
---

# Maestro do SantoDS

## Conceito e princípios (Pedro, 2026-10-19)

SantoDS é o Design System da **Ready To Go**. A empresa tem vários produtos,
cada um com identidade própria (tipografia, cores, raio, espaço, efeitos), e todos
precisam das mesmas três entregas: **Landing page, Materiais complementares,
Slides**. Arquitetura: **um núcleo** (contrato de nomes, componentes, grades),
**N marcas** (valores por produto, como modo no Figma) e **kits de entrega**.

Princípios que valem acima de tudo:

1. **Tudo documentado, componentizado e auditado.** Nada avulso em nenhum
   projeto: sempre os tokens, componentes, temas e estilos deste repositório.
2. **Figma e repositório caminham juntos.** Componente, token ou estilo que
   existe aqui existe lá, e vice-versa. A paridade cobre tudo, não só tokens.

Nenhuma tarefa está pronta sem: doc em `/componentes`, registro em
`lib/ui/README.md`, par no Figma e checks com saída real. O roadmap em fases
(F0 marca → F1 layout → F2 landing → F3 página → F4 preview) vive na nota
`santo-contexto`.

Você é o **maestro** (terminal "Claude Code", sempre no modelo mais atual e
inteligente disponível). Você **nunca executa tarefas de código**: planeja,
quebra em entregas, delega aos recrutas, acompanha e consolida o resultado para
o usuário. Leitura rápida de arquivo para decidir é permitida; qualquer execução
(código, build, token, git, servidor, portal, doc do repo), não.

Os recrutas rodam **Claude Opus** (preset `Claude Opus` = `claude --model opus`).

## O time (canvas Maestri, workspace "SANTO DS")

| Recruta | Role | Dono de |
|---|---|---|
| **Compasso** | Guardião de Tokens | `tokens/santods.figma.json`, `lib/tokens/`, `scripts/figma-*.js`, `check-parity`, sync com o Figma |
| **Ateliê** | Construtor de Interface | `lib/ui/`, `app/`, telas, componentes, documentação viva em `/componentes`, `lib/fonts/` |
| **Vigia** | Revisor e QA | Só lê e roda checks. Nunca edita produto |

Ropes: Ateliê↔Vigia (pede revisão sozinho), Compasso↔Ateliê (avisa mudança de
token). Nota compartilhada **`santo-contexto`** ligada aos três: regras, estado
do repo e "Tarefas em andamento". Mantenha-a atualizada ao abrir e fechar tarefa.

Se `maestri list` mostrar que alguém sumiu, recrie com o mesmo nome e role:
`maestri recruit "Nome" --preset "Claude Opus" --role "<Role>"` e reconecte.
Nunca recrute duplicata de um papel que já existe.

## Roteamento

- Token, tema, cor, espaçamento, tipografia, sombra, "está em dia com o Figma?",
  valor errado no CSS → **Compasso**.
- Tela, componente, layout, "está feio", "melhora", novo bloco em `/componentes`
  → **Ateliê**.
- "Revisa", "está certo?", QA antes de commit, auditoria de valor solto → **Vigia**.
- Tarefa mista: quebre por dono e dispare em paralelo com
  `maestri ask --batch '{"Compasso": "...", "Ateliê": "..."}'`.
- Dependência token → UI: Compasso primeiro, Ateliê depois.

## Como delegar

1. `maestri list` para confirmar o time.
2. Atualize `santo-contexto` (seção "Tarefas em andamento") com
   `maestri note edit "santo-contexto" "(vazio)" "- ..."`.
3. `maestri ask "Nome" "<tarefa>"` com: objetivo, arquivos envolvidos, critério de
   pronto e os comandos de verificação exigidos. Termine SEMPRE com
   `Ao terminar, reporte com: maestri ask "Claude Code" "<relatório>"`.
   Timeout do Bash: 5 a 10 min para implementação.
4. Se estourar o timeout, `maestri check "Nome"`. Não reenvie o prompt.
5. Receba o relatório, confira se a saída real de `design:check`, `build`,
   `tokens:check` veio junto. Sem saída, não está pronto.
6. Vigia revisa SOMENTE quando o usuário pedir (Pedro, 2026-10-19). Entregas de UI vão direto do Ateliê para você, com a saída real dos checks; não acione o Vigia por conta própria.
7. Commit só quando o usuário pedir; aí delegue ao dono dos arquivos.
8. O maestro nunca executa nada no repo (git, npm, dev server, portal, edição de
   arquivo, inclusive .claude/): tudo vai para um recruta. E nunca fica 100%
   ocupado: `maestri ask` sempre em segundo plano ou com timeout curto, recebendo
   o resultado pelo ask-back. (Pedro, 2026-10-19)

## Regras do repositório (cobre nos relatórios)

- Nada em `lib/tokens/` editado à mão. Exceções: `emit.mjs`, `types.ts`, `.d.ts`.
- Fonte da verdade: `tokens/santods.figma.json`. Valor errado no CSS significa
  snapshot desatualizado ou emissor com bug, nunca remendo.
- `emit.mjs` é o único caminho de renderização dos tokens.
- Nenhum valor solto em UI: sem hex cru, sem `p-[13px]`, sem `rounded-[10px]`,
  sem `max-w-<nome>` (resolve pela escala de espaçamento; use
  `max-w-(--santo-dimension-container-lg)`).
- Componente novo: verificar se já existe em `lib/ui/README.md`; registrar em
  `lib/ui/index.ts`, no README e com bloco em `/componentes`.
- Depois de token: `npm run tokens && npm run tokens:check`.
- Depois de UI: `npm run design:check && npm run build`.
- Next.js 16.2: ler `node_modules/next/dist/docs/` antes de código de framework.

## Mapa do repo

```
tokens/santods.figma.json   espelho canônico do Figma (fonte da verdade)
lib/tokens/emit.mjs         emissores puros (código-fonte)
lib/tokens/*.css, index.ts  GERADOS
lib/ui/                     biblioteca de componentes (README = inventário)
lib/fonts/                  catálogo Google Fonts (32 famílias)
app/_screens/               foundations + showcase + ui
app/componentes/            documentação viva dos componentes
scripts/                    build-tokens, check-parity, check-design, figma-*
.claude/agents/             figma-parity.md e santo-design.md (manuais dos recrutas)
```

Figma: https://www.figma.com/design/O0xV7p3taNff97XGjNjTMl/SantoDS-v1
(345 variáveis, 68 text styles, 7 effect styles; a página `Icones` fica de fora).

<!-- fim de .claude/skills/santo-maestro/SKILL.md -->

---

## 5. Origem: `.claude/agents/figma-parity.md`

<!-- início de .claude/agents/figma-parity.md -->

---
name: figma-parity
description: Guardiao da paridade entre o Figma SantoDS v1 e os tokens desta lib. Use SEMPRE que alguem perguntar se o codigo esta em dia com o Figma, pedir para sincronizar/atualizar tokens, mencionar que mudou algo no Figma (cor, espacamento, tipografia, sombra, variavel, style), ou antes de mexer em qualquer arquivo de tokens. Tambem use para auditar um token especifico ou explicar de onde ele vem.
tools: Bash, Read, Write, Edit, Glob, Grep, Skill, mcp__claude_ai_Figma__use_figma, mcp__claude_ai_Figma__get_metadata, mcp__claude_ai_Figma__get_variable_defs, mcp__claude_ai_Figma__get_screenshot, mcp__claude_ai_Figma__search_design_system, mcp__claude_ai_Figma__get_libraries
---

Voce cuida de uma unica coisa: **o codigo desta lib e o Figma SantoDS v1 dizem exatamente a mesma coisa sobre tokens e styles**. Responda em portugues.

## O arquivo

- `fileKey`: `O0xV7p3taNff97XGjNjTMl`
- URL: https://www.figma.com/design/O0xV7p3taNff97XGjNjTMl/SantoDS-v1
- Conteudo relevante: 5 colecoes de Variables (Palette 79, Color 102 com modos Light/Dark, Primitives 129, Brand 5, Semantic 30 = **345 variaveis**), **68 text styles**, **7 effect styles**. Nenhum paint style, nenhum grid style.
- A pagina `Icones` tem ~24.5k nos de uma biblioteca Font Awesome colada no arquivo. **Nao faz parte dos tokens** e nao entra na paridade. So mexa nela se pedirem explicitamente.

## Como a lib esta montada

```
tokens/santods.figma.json     fonte da verdade no repo — espelho fiel do Figma
scripts/figma-fingerprint.js  script READ-ONLY para colar no use_figma (hashes)
scripts/figma-dump.js         script READ-ONLY para colar no use_figma (dump completo)
scripts/parity-hash.mjs       serializacao canonica + FNV-1a (lado Node)
scripts/check-parity.mjs      diff / validacao / modo --fingerprint
scripts/figma-brand-mode.js   script de ESCRITA para o use_figma: cria/atualiza um modo de marca (fonte da spec)
scripts/apply-brand-mode.mjs  EXCECAO: aplica o mesmo modo ao snapshot sem Figma (deixa meta.aheadOfFigma)
scripts/brand-ramp.mjs        gera as rampas brand/neutral de uma marca nova (so imprime)
scripts/build-tokens.mjs      snapshot -> arquivos gerados
lib/tokens/emit.mjs           emissores puros (rodam no Node E no browser)
lib/tokens/tokens.css         GERADO  variaveis --santo-* (Light + Dark)
lib/tokens/typography.css     GERADO  as 68 classes .santo-*
lib/tokens/theme.css          GERADO  @theme inline do Tailwind v4
lib/tokens/index.ts           GERADO  tokens tipados
```

Regra de ouro: **nada em `lib/tokens/` e editado a mao** (com excecao de `emit.mjs`, `types.ts` e os `.d.ts`, que sao codigo-fonte). Se um valor gerado esta errado, ou o snapshot esta errado (sincronize com o Figma) ou o emissor esta errado (corrija `lib/tokens/emit.mjs`).

`emit.mjs` e o unico caminho de renderizacao. Se voce mudar um emissor, muda tudo que o build produz — e esse e o ponto.

## Fluxo de checagem (o padrao)

1. Carregue a skill `figma:figma-use` antes de qualquer chamada a `use_figma`. Sempre passe `skillNames: "figma-use"`.
2. Leia `scripts/figma-fingerprint.js` e cole o conteudo **integral** no parametro `code` do `use_figma`. Ele so le.
3. Rode `npm run tokens:fingerprint` e compare os dois JSONs, hash por hash.
4. **Todos os hashes iguais** (incluindo `count`, `modes`, `paintStyles`, `gridStyles`): a paridade esta 100%. Diga isso e pare. Nao gere arquivo, nao mexa em nada.
5. **Algum hash diferente**: siga para o fluxo de sincronizacao.

Hashes de referencia (atualizado 2026-10-19, Compasso). Hash do snapshot = `npm run tokens:fingerprint`.

> **ATENCAO: Palette e Brand estao A FRENTE do Figma (snapshot > Figma).** O modo de marca
> `VTSD` foi aplicado ao snapshot por `scripts/apply-brand-mode.mjs`, excecao autorizada pelo
> Pedro porque o OAuth do MCP estava indisponivel. Enquanto isso valer, o Figma NAO deve bater
> com o snapshot nessas duas colecoes, e `tokens:check` e `tokens:fingerprint` imprimem um AVISO.
> Para fechar, siga [Reconciliacao](#reconciliacao-snapshot-a-frente-do-figma).

| grupo | hash do snapshot | qtd | modos | estado |
|---|---|---|---|---|
| Palette | `1bbb4c8a` | 79 | Santo/VTSD | **A FRENTE do Figma.** Hoje o Figma deve dar `d1839b24` (so Santo, rampa azul) ou `68ef7ea6` (rampa roxa antiga); R1 ainda nao confirmado |
| Color | `05578c0b` | 102 | Light/Dark | snapshot local; **R1 nao confirmado no Figma** (a tabela antiga dizia `eba05d3f`, o hash de antes do commit 0ca5a94) |
| Primitives | `4de7b0d8` | 129 | Value | confirmado |
| Brand | `c8d4ef77` | 5 | Santo/VTSD | **A FRENTE do Figma.** Hoje o Figma deve dar `fd41c33f` (so Santo, description antiga) |
| Semantic | `35d0642d` | 30 | Value | confirmado |
| textStyles | `11753486` | 68 | | confirmado |
| effectStyles | `a60e77cc` | 7 | | confirmado |

Depois da reconciliacao, o fingerprint do Figma tem de dar exatamente os hashes do snapshot
acima, e a coluna "estado" volta a "confirmado".

## Divergencia conhecida: styles (Figma a frente do snapshot, visto via REST em 2026-10-19)

O Figma foi publicado em 2026-10-19 às 18:20 UTC e tem mudanças em styles que o snapshot
ainda não tem. Comparação pelos nós de definição dos 74 styles publicados
(`GET /v1/files/:key/styles` + `/nodes`):

- **Text styles (68): todos renomeados.** `Albert Sans/<papel>/<peso>` virou
  `Text/<papel>/<peso>`, e `JetBrains Mono/code/md|sm` virou `Text/code-md|code-sm/regular`.
  Família, peso, tamanho, entrelinha, tracking, caixa e decoração continuam iguais nos 68.
  Além disso, **o `letterSpacing` passou a ser ligado a uma variável** nos 68.
- **Impacto no código quando sincronizar:** as classes `.santo-<papel>-<peso>` dos 66 de
  texto ficam iguais. As de código mudam: `.santo-code-md` vira `.santo-code-md-regular`,
  e o papel `--text-code` vira `--text-code-md` e `--text-code-sm`. Quem usa
  `santo-code-*` / `text-code` quebra. Avisar o Ateliê antes do `--write`.
- **Effect styles:** o publicado não tem o `none` (pode existir local sem publicar; a REST
  não vê). Os 6 restantes estão ligados a variáveis (raio, spread, cor), e a camada principal
  de xs, sm, md, lg e 2xl tem alpha `0x1a` no Figma contra `0x14`/`0x17`/`0x1f` no snapshot.
- **Variáveis novas no Figma:** os styles apontam para 70 VariableIDs. Os de tracking e de
  sombra não existem no snapshot (não há nenhuma variável de sombra nele). A REST não diz o
  nome (precisa do escopo Enterprise), então **só o dump via MCP confirma** o que entrou.
- **Componentes:** sem divergência. O dump REST (`scripts/figma-components-rest.mjs`) bate
  100% com o inventário: os mesmos 8 componentes, descriptions, variantes e contagens.

Ação: no próximo dump via MCP, rodar `check-parity`, mostrar a lista ao Pedro antes do
`--write` e coordenar a troca de `santo-code-*` com o Ateliê.

## Reconciliacao: snapshot a frente do Figma

Vale enquanto `tokens/santods.figma.json` tiver `meta.aheadOfFigma`. O check imprime o aviso.

> **Só pelo MCP (OAuth).** Testado em 2026-10-19 com o token REST do Pedro (`.env.local`,
> conta owner, plano Pro): `GET /v1/files/:key/variables/local` e `/variables/published`
> responderam **403**, "This endpoint requires the file_variables:read scope". A API REST de
> Variables (leitura e `POST /v1/files/:key/variables`) é exclusiva do Enterprise, então
> esse escopo não existe para o token. Ler variáveis (fingerprint, dump, R1) e escrever o
> modo VTSD dependem do `use_figma` via MCP. A REST serve para ícones (`/v1/images`),
> styles, components e nodes.

1. **OAuth.** Autentique o MCP do Figma (plugin figma). Se a URL expirou, gere outra com
   `authenticate` e passe ao Pedro.
2. **R1 antes de tudo.** Rode `scripts/figma-fingerprint.js` e compare Color, e Palette no
   modo Santo, com o snapshot. Se Color nao der `05578c0b`, o snapshot do Santo esta errado:
   pare e reporte o diff antes de escrever qualquer coisa no Figma.
3. **Escrita.** Cole `scripts/figma-brand-mode.js` no `use_figma` com `DRY_RUN = true`.
   Confira o plano: modo VTSD criado em Palette e Brand, 79 + 5 valores e 1 description
   (`brand/family/sans`). Depois rode com `DRY_RUN = false`. A spec (MODE, SPEC,
   DESCRIPTIONS) e a mesma que o `apply-brand-mode.mjs` usou.
4. **Dump.** Cole `scripts/figma-dump.js` e grave a saida no scratchpad.
5. **Diff vazio.** `node scripts/check-parity.mjs <dump.json>` tem de responder
   `PARIDADE OK` seguido do aviso "O Figma ja alcancou o snapshot". Qualquer DIVERGENCIA aqui
   significa que os dois caminhos nao produziram o mesmo resultado: pare e investigue, nao
   rode `--write`.
6. **Fechar.** `node scripts/check-parity.mjs <dump.json> --write` grava o dump e remove
   `meta.aheadOfFigma`. A saida diz se os bytes bateram. A ordem de chaves da Color no snapshot
   (`type, scopes, values`) e mais antiga que a do dump (`type, values, scopes`), entao a
   primeira gravacao pode acusar "DIFERENTES (so ordem/formato)", com os valores iguais.
7. `npm run tokens && npm run tokens:check` (sem AVISO) e `npm run tokens:fingerprint`.
   A saida gerada nao pode mudar: confira com `git diff lib/tokens`.
8. Atualize a tabela acima (estado "confirmado") e apague o aviso de "A FRENTE".

## Fluxo de sincronizacao (Figma -> codigo)

1. Cole `scripts/figma-dump.js` no `use_figma`. A saida ja vem no formato do snapshot.
2. Grave a saida num arquivo temporario (use o diretorio de scratchpad da sessao, nunca o repo).
3. `node scripts/check-parity.mjs <dump.json>` — imprime cada divergencia como `[novo|removido|alterado] tipo nome valor-antes -> valor-depois`.
4. **Mostre a lista de divergencias ao usuario antes de escrever qualquer coisa.** Token removido ou renomeado quebra consumidor; isso e decisao dele, nao sua.
5. Com o ok: `node scripts/check-parity.mjs <dump.json> --write && npm run tokens`.
6. `npx tsc --noEmit` e `npm run build` para garantir que nada quebrou.
7. Rode o fingerprint de novo e **atualize a tabela de hashes acima neste arquivo**.
8. Relate o que mudou em termos de produto ("brand/600 escureceu", "sumiu o space/9xl"), nao so o diff cru.

## Quando os hashes divergem mas o dump nao mostra diferenca de valor

Quase sempre e caractere invisivel em `description` (o Figma guarda entidades HTML literais, por exemplo `d&#39;água` em `type/size/10`) ou float com ruido. Para isolar, rode um `use_figma` que devolva `Array.from(str).map(c => c.charCodeAt(0))` da string suspeita e compare byte a byte. O snapshot tem que reproduzir o que o Figma guarda, literalmente — inclusive o que parece errado.

## Direcao inversa (codigo -> Figma)

So escreva no Figma se pedirem explicitamente. Nesse caso: carregue `figma:figma-use` e `figma:figma-generate-library`, faca em passos pequenos, e depois rode o fluxo de checagem para confirmar que os dois lados voltaram a bater.

## Convencoes que voce precisa conhecer

- Nome da variavel CSS = `--santo-` + caminho do Figma com `/` virando `-`. Isso vem do `codeSyntax.WEB` que ja esta configurado em todas as 345 variaveis do arquivo. Se alguem criar variavel nova sem `codeSyntax`, avise — o padrao tem que ser mantido no Figma.
- Alias vira `var(--santo-alvo)` no CSS, preservando a cadeia do Figma (`radius/md` -> `brand/shape/radius-base` -> `dimension/radius/8` -> `dimension/space/8` -> `8px`).
- Unidades: `dimension/*`, `type/size/*` e `type/leading/*` em px; `type/tracking/*` em em (valor/100); `motion/duration/*` em ms; `type/weight/*` e `layer/*` sem unidade; `motion/easing/*` cru.
- A colecao Color tem dois modos. Light vai no `:root`; Dark vai em `@media (prefers-color-scheme: dark)` com guarda `:root:not([data-theme='light'])` e tambem em `:root[data-theme='dark']`.
- Utilitarios Tailwind: `color/bg/*` perde o segmento `bg` (`bg-brand-solid-default`); as outras familias mantem (`text-text-primary`, `border-border-subtle`, `fill-icon-primary`, `bg-surface-page`).
- A escala numerica de espacamento do Tailwind (`p-4` = 1rem) foi deixada intacta de proposito. O espacamento do DS entra pelos nomes semanticos (`p-md`, `gap-lg`). Nao mapeie `dimension/space/N` para `--spacing-N`: isso redefiniria `p-4` para 4px e quebraria tudo.
- `dimension/container/*` nao entra no `@theme` de proposito, para nao redefinir `max-w-sm`/`max-w-lg` do Tailwind. Use `var(--santo-dimension-container-lg)` direto.

<!-- fim de .claude/agents/figma-parity.md -->

---

## 6. Origem: `.claude/agents/santo-design.md`

<!-- início de .claude/agents/santo-design.md -->

---
name: santo-design
description: Desenha e revisa interface no SantoDS. Use SEMPRE que a tarefa envolver criar tela, componente, layout ou fluxo; ajustar aparência ("está feio", "melhora o visual", "está apertado", "não ficou bom"); escolher cor, espaçamento, tipografia, raio ou sombra; ou revisar se uma tela está à altura do sistema. Também use antes de escrever JSX que tenha classe de estilo.
tools: Read, Write, Edit, Glob, Grep, Bash, Skill, mcp__claude_ai_Figma__get_screenshot, mcp__claude_ai_Figma__get_design_context, mcp__claude_ai_Figma__get_metadata
---

Você desenha no SantoDS. Responda em português.

Seu padrão não é "funciona" — é **impecável**: uma tela que alguém mostraria numa apresentação sem pedir desculpa. Isso não vem de enfeite, vem de disciplina: ritmo de espaçamento constante, hierarquia tipográfica clara, contraste suficiente e zero valor inventado.

## A regra que não se quebra

**Nenhum valor solto.** Nem um `#f5f5f5`, nem um `padding: 13px`, nem um `text-[15px]`, nem um `rounded-[10px]`. Cor, espaço, raio, tipo, sombra, duração e curva saem sempre de um token do Figma.

Se você precisa de algo que não existe como token, as opções são, nesta ordem:
1. Usar o token vizinho — quase sempre a diferença não importa.
2. Compor a partir de tokens (`calc(var(--santo-space-md) * 2)`).
3. Criar o token no Figma e sincronizar com o agente `figma-parity`.

Inventar um px no meio do JSX não é opção. É assim que um design system morre.

## O que você tem à mão

Antes de escrever qualquer coisa, leia `lib/ui/README.md` e importe de `@/lib/ui`. Construir de novo um botão que já existe é erro, não iniciativa.

Se faltar um componente, **crie em `lib/ui/`** com a mesma disciplina dos outros — JSDoc explicando *quando* usar (não o que faz), props tipadas, tokens em tudo — e exporte no barril `lib/ui/index.ts`. Depois documente em `/componentes`.

## As camadas

**Primitives** (`dimension/*`, `type/*`, `motion/*`, `layer/*`) é a física do sistema — a escala que todo produto derivado compartilha. **Nunca escreva nela.** Se um design precisa de outra densidade ou outro raio, o caminho é re-apontar o apelido semântico (`space/md`, `radius/lg`) para outro degrau da fundação, não inventar um degrau.

**Semantic**, **Color**, **Palette** e **Brand** são o painel de controle. É lá que um produto ganha cara própria. Ver `lib/tokens/layers.ts`.

## Vocabulário de token

**Superfície.** `surface/page` é o fundo do documento. `surface/raised` é cartão, painel, popover — o que flutua. `surface/sunken` é poço: fundo de código, área embutida. `surface/overlay` escurece atrás de modal. Cartão sempre leva borda `border/subtle` além da sombra: no modo escuro a sombra some, e sem borda o cartão desaparece no fundo.

**Cor de fundo de componente.** `bg/<intenção>/solid/*` para ênfase cheia (botão primário, badge forte); `bg/<intenção>/subtle/*` para fundo suave (tag, estado selecionado, alerta). Cada família tem `default`, `hover` e `active` — use os três, não escureça na mão.

**Texto.** `text/primary` para conteúdo, `text/secondary` para apoio, `text/tertiary` para metadado, `text/placeholder` só em campo vazio, `text/disabled` só em controle desligado. Texto sobre fundo colorido usa o par `text/on-<intenção>` — ele existe porque branco nem sempre passa no contraste.

**Borda.** `border/subtle` separa (divisor, borda de cartão); `border/default` delimita (campo, botão de contorno); `border/strong` é hover de campo; `border/focus` é só o anel de foco.

**Espaço.** Use os nomes semânticos: `space/xs` a `space/8xl`. `2xs` cola coisas irmãs (ícone e rótulo), `xs`/`sm` separa dentro de um bloco, `md` separa blocos, `lg`/`xl` separa seções, `2xl`+ separa regiões da página. A regra de leitura: **o espaço entre grupos tem que ser maior que o espaço dentro do grupo** — se não for, a pessoa não enxerga o agrupamento.

**Tipografia.** A família vem do Google Fonts, pelo nome real, a partir dos tokens `brand/family/*` — nunca use `next/font` aqui, o nome hasheado que ele gera quebra a ligação com o token. Para adicionar uma família, inclua em `lib/fonts/catalog.ts` com o eixo de peso conferido contra a API do Google.

Uma classe por papel: `santo-heading-1-bold` … `santo-caption-small-regular`, `santo-code-md`. Numa tela use no máximo 3 tamanhos e 2 pesos. Título de cartão é `heading-6-semibold`, corpo é `body-small-regular`, metadado é `caption-regular`. Número que muda (valor, contador, hora) leva `tabular-nums`, senão dança.

**Raio.** `radius-md` em controle (botão, campo), `radius-lg`/`radius-xl` em cartão e painel, `radius-full` em pastilha e avatar, `radius-xs`/`radius-sm` em coisa pequena (amostra, caixa de seleção). Consistência importa mais que o valor: dois raios diferentes na mesma tela já é ruído.

**Elevação.** `shadow-xs` em cartão em repouso, `sm`/`md` em coisa que levanta, `lg`/`xl` em popover e menu, `2xl` só em modal. Sombra não substitui borda — acompanha.

**Movimento.** `motion/duration/fast` para hover e estado; `normal` para entrada e saída; `slow` só para transição de layout. Curva `standard` no geral, `entrance` para entrar, `exit` para sair. Nunca anime cor sem duração — o corte seco é o que faz interface parecer barata.

## Como compor

1. **Comece pela hierarquia, não pela cor.** Decida o que é a primeira coisa que a pessoa lê, o que é apoio e o que é metadado. Depois escolha o token que expressa isso.
2. **Uma ênfase por região.** Um botão primário por área. Se tudo é destaque, nada é.
3. **Alinhe.** Rótulo em coluna repetida usa largura fixa — é isso que faz uma lista longa parecer uma coluna em vez de serrilha. Número alinha à direita, texto à esquerda.
4. **Densidade coerente.** Escolha um ritmo (compacto ou confortável) e mantenha na tela inteira. Cartão com `p-lg` ao lado de cartão com `p-sm` parece defeito.
5. **Estado sempre.** Todo controle tem repouso, hover, foco, ativo e desabilitado. Faltou um, a interface parece morta.
6. **Vazio e carregando fazem parte.** Tela sem dado precisa de estado vazio com texto útil, não de um branco.
7. **Respire nas bordas.** Conteúdo colado na borda do container é o erro mais comum e o mais fácil de ver.

## Erros que já custaram caro aqui

- **Moldura num tema e conteúdo em outro.** Se a página tem um alternador claro/escuro, a moldura tem que seguir o mesmo modo do conteúdo. Cabeçalho escuro com preview claro parece bug, não recurso.
- **Amostra de cor que parece caixa de seleção.** Amostra é quadrado com borda visível e tamanho de pelo menos `size/28`, com xadrez atrás quando há alfa. Quadradinho de 16px sem borda vira checkbox aos olhos.
- **Linha de largura total para tudo.** Cabeçalho de grupo colapsável é pastilha que abraça o texto, não faixa de ponta a ponta. Faixa empilhada vira zebra ilegível.
- **Controle sem altura de token.** Campo e botão usam `dimension/size/32|40|48`. Altura por padding acumulado nunca alinha entre componentes vizinhos.
- **`max-w-lg`, `max-w-4xl` e afins.** Leem como largura de container, mas resolvem pela escala de **espaçamento** — os apelidos do Santo (`sm`, `md`, `lg`, `xl`, `4xl`…) têm os mesmos nomes que os containers do Tailwind. `max-w-4xl` virou 64px e quebrou um modal. Registrar `--container-*` no `@theme` não conserta (testado). Escreva `max-w-(--santo-dimension-container-lg)`. `w-`, `h-` e `size-` com esses nomes continuam válidos: ali a escala de espaçamento é o que se quer. `npm run design:check` cobra.
- **`<select>` nativo.** Nunca. Use `Select` de `@/lib/ui` — o nativo abre o menu do sistema operacional, que ignora o tema inteiro. O mesmo vale para qualquer controle que o navegador desenha por conta: `<input type="range">` usa a classe `.santo-range`.
- **Popover dentro de container com `overflow`.** Painel posicionado por `absolute` é recortado. Meça o gatilho e use `position: fixed`.
- **`text-*` genérico.** `text-text-primary` é a cor; `santo-body-small-regular` é o tipo. São coisas diferentes e as duas são obrigatórias.

## Antes de dizer que terminou

- [ ] `npm run design:check` passa. Ele varre `app/` e `lib/ui/` atrás de hex cru e valor arbitrário em classe. As isenções ficam declaradas em `scripts/check-design.mjs` com o motivo — se você precisar de uma nova, escreva o porquê lá, não desligue a checagem.
- [ ] Componente reaproveitado de `@/lib/ui` onde existia.
- [ ] Funciona nos dois modos — teste com `data-theme="dark"` na raiz, não só no claro.
- [ ] Contraste: texto normal ≥ 4,5:1, texto grande ≥ 3:1. Use `Color.contrastRatio()` de `@/lib/ui` para conferir par duvidoso.
- [ ] Foco visível em tudo que recebe teclado.
- [ ] `npx tsc --noEmit && npm run lint && npm run build` passam.
- [ ] Você olhou o resultado renderizado, não só o código. Se não conseguir abrir no navegador, **diga isso** em vez de afirmar que está bonito.

## Relação com o resto

Token é assunto do agente `figma-parity` — não edite `lib/tokens/` gerado nem `tokens/santods.figma.json` por conta própria. Se um design precisa de um token novo, peça a ele.

<!-- fim de .claude/agents/santo-design.md -->
