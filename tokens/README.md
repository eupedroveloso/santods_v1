# tokens/

| arquivo | o que é |
|---|---|
| `santods.figma.json` | Fonte da verdade no repo: espelho das Variables e Styles do Figma SantoDS v1. **Não se edita à mão.** |
| `santods.components.json` | Inventário dos componentes do Figma (gerado). |
| `VTSD.proposal.md` | Spec do modo de marca VTSD: método das rampas, contraste e ordem de execução. |
| `ESTUDIO.contrato.md` | Contrato do Estúdio: formato salvo, valores base, fórmulas, presets, preview e o que é travado. Nível B aplicado ao snapshot no andar `estudio`. |

O fluxo de sincronização, os hashes de referência e a reconciliação estão em
`.claude/agents/figma-parity.md`. Depois de mexer em token, rode
`npm run tokens && npm run tokens:check`.

## Marcas

O DS é um núcleo com N marcas. Cada marca é um **modo** nas coleções Palette e Brand do
Figma. Color, Primitives e Semantic são compartilhadas. No CSS, `data-brand="<brand/id>"`
escolhe a marca em qualquer elemento; sem o atributo vale a padrão.

| marca | modo | `data-brand` | estado |
|---|---|---|---|
| Santo | `Santo` (padrão) | `santo` | sincronizada |
| Venda Todo Santo Dia | `VTSD` | `vtsd` | **snapshot à frente do Figma**: aplicada por `scripts/apply-brand-mode.mjs` em 2026-10-19 (exceção autorizada pelo Pedro). Reconciliação pendente |

**Nível B (andar `estudio`, 2026-10-21):** a Brand passou a carregar, por marca, a família de
título, a escala de raio, o espaço, tamanho e entrelinha dos 11 papéis de texto, as alturas de
controle e a cor de cada camada de sombra (56 variáveis). Santo e VTSD receberam os valores de
antes: o render é idêntico (2.140 medidas por tema no Chrome, zero diferença). Aplicado por
`scripts/figma-nivel-b-apply.mjs`, **à frente do Figma** (`meta.aheadOfFigma.also`).

**Superfícies (andar `estudio`, 2026-10-21):** `surface/*` e `border/*` da Color passam a apontar
para `brand/surface/*` e `brand/border/*` (degraus por marca e tema). A borda dupla vira escolha:
`brand/frame/{inset,enabled,border/*}` → `--santo-frame-inset`, `--santo-frame-enabled`,
`--santo-frame-surface`, `--santo-frame-border`. Santo e VTSD idênticos. Mesmo rastro `nivel-b`.

**Controles e efeitos (andar `estudio`, 2026-10-21):** `control/*/<tamanho>` (padding, raio,
borda, fonte, ícone, gap), `radius/control`, tracking por papel, geometria de sombra por marca,
e os efeitos `effect/*`, `glass/*`, `gradient/brand/*` com os effect styles `glass/*`, `blur/*` e
`glow/*`. Santo e VTSD idênticos. Mesmo rastro `nivel-b`.

**Família livre (andar `estudio`, 2026-10-21):** no Estúdio, `brand/family/{sans,heading,mono}`
aceitam qualquer família do Google Fonts (`lib/fonts/google-index.json`, gerado por
`scripts/google-fonts.mjs`; mono só monoespaçada). As descriptions novas vão pelo mesmo rastro
`nivel-b` (`scripts/figma-nivel-b.js`), à frente do Figma.

## Dívidas conhecidas

### D1 — `text/on-brand` reprova AA sobre o fundo de marca (2026-10-19)

Decisão do Pedro em 2026-10-19: **manter o azul do Santo e o verde da VTSD como estão** e
não mexer na coleção Color agora. A dívida fica registrada para revisão.

| par (WCAG 2.x) | Santo claro | Santo escuro | VTSD claro | VTSD escuro | mínimo |
|---|---|---|---|---|---|
| `text/on-brand` / `bg/brand/solid/default` | 3,05 | 4,81 | 2,93 | 4,82 | 4,5 |
| `text/on-brand` / `bg/brand/solid/hover` | 4,81 | 3,05 | 4,82 | 2,93 | 4,5 |
| `text/on-brand` / `bg/brand/solid/active` | 7,43 | 2,56 | 7,36 | 2,56 | 4,5 |
| `border/brand` / `surface/page` | 2,92 | 7,52 | 2,81 | 7,85 | 3 |
| `border/default` / `surface/page` | 1,41 | 1,92 | 1,42 | 1,91 | 3 (só se for o único contorno de um controle) |

- **Impacto:** texto branco do botão primário (e de tudo em `bg/brand/solid`) fica abaixo
  de AA no tema claro; no escuro, hover e active também ficam abaixo.
- **Origem:** commit `0ca5a94` (rampa do Santo de roxo `#6a2fe3` para azul `#4693ff`). A
  VTSD herda o mesmo perfil porque a rampa dela casa a luminância do Santo degrau a degrau.
- **Correção já estudada** (em `VTSD.proposal.md`, seção Contraste): passar
  `bg/brand/solid/*` para 700/800/900 e `border/brand` claro para 700, ou trocar
  `text/on-brand` para `neutral/950`. As duas opções mudam a Color, que é compartilhada,
  e mudam a cara do botão nas duas marcas.
- **Achado da auditoria automática (2026-10-21, `lib/tokens/contrast-audit.mjs`):**
  `border/strong` sobre `surface/page` no tema escuro dá 2,70 (Santo) e 2,69 (VTSD), abaixo de 3.
  Vem da troca de stroke (`border/strong` escuro → neutral/600). Não está registrado como
  dívida aceita; decisão pendente do Pedro. Medido também nas superfícies novas: 2,46 sobre
  `surface/raised` e `panel`, 2,84 sobre `sunken` e `well` (Santo escuro).
- **Mitigação até lá:** não pôr texto pequeno sobre `bg/brand/solid` fora de botões; input
  usa `border/strong`, não `border/default`.
