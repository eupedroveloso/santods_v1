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
| Botões, abas e filtros retangulares de raio pequeno | Controle "de formulário", frio | Pílula (`radius-full`) para controle compacto (§4) |
| Hierarquia só por tamanho de fonte | Lê como documento, não como produto | Número grande + unidade pequena, título + meta na mesma linha, micro-viz (§5, §6) |
| Grade de cards idênticos com ícone em quadradinho colorido + título + parágrafo | Template de landing | Composição com um protagonista por região, tiles tonais, zero subhead |
| Nav com lista plana de links e ativo em fundo cinza retangular | Sidebar genérica | Trilho de ícones + painel; ativo em pílula elevada; conectores de árvore (§7) |
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
| 2 · poço | `surface/sunken` dentro do raised (Card `inset`/`sunken`, "well") | campo, área de código, lista embutida, trilho de Segmented, slot de micro-viz | nenhum ou hairline; sem sombra externa |

Regras:
- **Nunca** mais que 3 níveis empilhados. Poço dentro de poço = errado.
- Pílula ativa (Segmented, NavItem, Tab) é um "nível 1 dentro do nível 2":
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

## 3. Raio por nível (aninhado)

| Peça | Raio |
|---|---|
| Card e superfícies equivalentes (Card raised/well/double, painel, modal, DemoCard, Playground, janela de código, EmptyState, TokenSample, LinkCard, bolha de chat) | `radius-xl` (16) **no máximo** (Pedro, 2026-10-19: 2xl/3xl ficou grande demais) |
| Painel/poço interno | **externo − padding** (`--santo-card-inner-radius`): xl − 8 → `sm`; xl − 12/16/24 → `xs` |
| Controles compactos (botão, chip, tag, count, segmented, tab, nav ativo, campo de 1 linha, FAB, trilho) | `radius-full` (pílula / cápsula) |
| Thumbs da vitrine | moldura própria (skill santo-vitrine), não muda |
| Code inline (`CopyCode`, `Kbd`, `<code>` em texto) | `radius-xs` — **não é pílula**; vive em célula/linha sem padding, então leva o menor degrau |
| Campo de texto | pílula se 1 linha em barra (busca, composer); `radius-lg`/`inner` se multilinha |
| Tile de ícone, thumb, avatar quadrado | inner do pai; avatar sempre círculo |

Fórmula inegociável: **interno = externo − padding**, mínimo `radius-xs`; filho
colado herda o raio do pai. O Vigia mede no DOM.

## 4. Vocabulário de pílula

Pílula é a gramática de controle do SantoDS (e SÓ dele — code inline e Kbd
ficam em `radius-xs`): `Segmented`, `Chip`, `Tag`,
`Count`, `Button`/`IconButton` (pílula é o padrão; `pill={false}` = retângulo md), FAB, `TabBar` flutuante, NavItem
ativo. Regras:
- Trilho em `surface/sunken`, pastilha ativa em `surface/raised` + `shadow-xs`.
- Count sempre em pílula à direita do rótulo, `tabular-nums`.
- Altura por token de tamanho (`size-24/28/32/36/40`), nunca por padding solto.
- Selecionado ≠ hover: selecionado eleva (raised+sombra); hover só tonaliza
  (`bg/neutral/subtle/hover`).

## 5. Tipografia: hierarquia por papel

- **Número + unidade:** número grande (`santo-heading-*`), `tabular-nums`;
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

- **Trilho de ícones** (nível 0, compacto, `IconButton` em pílula) + **painel**
  expandido (nível 1) com as seções.
- Ativo = **pílula elevada** (raised + `shadow-xs`), ícone `icon/primary`.
- Subitens com **conectores de árvore** (linha `border/subtle` vertical + curva
  ao item), recuados.
- Contagem em `Count` pílula à direita.
- Mobile: `TabBar` flutuante no rodapé (pílula, `shadow-lg`, blur de fundo).

## 8. Listas e tabelas

- Linha: tile/avatar (leading) + nome (`body-small-semibold`) / meta
  (caption, tertiary) + ação **ghost** (IconButton) à direita.
- Divisória **hairline** `border/subtle` entre linhas; nada de card por linha.
- Tabela: cabeçalho tonal (`surface/sunken`, caption semibold), linhas hairline,
  número à direita com `tabular-nums`, hover tonal.

### Realce de linha (hover/seleção) com raio aninhado

Vale para linha de Table, ListRow, opção de Select/⌘K, SettingRow, célula
clicável. Nunca um retângulo reto encostando na borda arredondada do card.
- **(a) INSET — padrão** (`santo-row`): o realce é uma pílula suave dentro do
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
  primário em pílula, à direita; raio do botão = raio do poço − respiro.
- Ação principal flutuante (FAB): pílula ou círculo, brand solid, `shadow-lg`,
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
   são naturalmente iguais (quatro `Stat` do mesmo molde). Palco, poço e
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
4. [ ] Raios: card/superfície ≤ xl (16), interno = externo − padding (medido), controles
       compactos em pílula.
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
