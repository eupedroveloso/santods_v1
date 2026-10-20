---
name: santo-ui-craft
description: Estratégia de criação de UI do SantoDS (regra ANTI-GENÉRICO do Pedro). Use SEMPRE antes de criar, recriar ou revisar componente, card, tela, nav, lista, campo, dashboard ou qualquer superfície visual; quando alguém disser "está com cara de Tailwind", "genérico", "sem graça", "padrão"; e como rubrica de aprovação do Exorcista. Define superfícies tonais, raio por nível, vocabulário de pílula, hierarquia número+unidade, micro-visualização, nav em trilho, listas, campo-poço, FAB, processo e checklist.
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
- Pendência de token (Escriba): falta uma sombra **ambiente grande e suave**
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
cartão folgado, mínimo = raio de controle; filho colado herda o raio do pai. O Exorcista mede no DOM.

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
- **Doc enxuta (Pedro, 2026-10-19: "não usar excesso de subheads e textos de
  descrição"):** bloco = Overline + título (ou só Overline) e o conteúdo. Sem
  subhead e sem parágrafo de apoio por bloco, salvo quando o conteúdo exige
  (ex.: um aviso que muda o que a pessoa faz). Em lista, cada linha mostra
  título + identificador + meta; descrição, se ficar, é UMA linha de caption
  (`line-clamp-1`) — texto longo mora na página de destino, não na lista.
- **Texto denso = medida de leitura (Pedro, 2026-10-19):** tela de leitura
  (documento, guia) não corre o texto na largura inteira. Use
  `DocPage layout="reading"`: coluna centrada em `container/sm` (~70 caracteres
  em body), margens laterais `space/2xl` a partir de md, "Nesta página" à
  direita; corpo em `MarkdownView` (body 16 com `type/leading/28`, blocos a
  `space/lg`). Só em tela de leitura — painel, índice e catálogo seguem com a
  largura toda.

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

## 12. Checklist de aprovação (rubrica do Exorcista)

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
        **Exceção de navegação:** cartão de índice (LinkCard numa fileira com
        `CardGrid stretch`) tem altura mínima = a do maior irmão; a linha de
        link tem altura FIXA (size/40) e gap constante em todos os cartões —
        nunca cresce nem encolhe para preencher. A sobra fica no fim do cartão.
12. [ ] Motion com tokens e reduced-motion; sem blur em lista longa.
