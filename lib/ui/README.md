# Componentes do SantoDS

Peças de interface construídas **só com tokens do Figma**. Documentação visual em
[`/componentes`](../../app/componentes/page.tsx) — rode `npm run dev` e abra a rota.

```tsx
import { Button, Card, CardHeader, Field, Input, Icon } from "@/lib/ui";
```

## A regra

Nenhum componente daqui usa valor solto. Cor, espaço, raio, tipo, sombra, duração
e curva saem sempre de um token. Se precisar de algo que não existe, crie o token
no Figma e sincronize com o agente `figma-parity` — não invente um px no JSX.

Ao criar um componente novo aqui: JSDoc explicando **quando** usar (não o que faz),
props tipadas, tokens em tudo, e exporte no barril `index.ts`.

## Inventário

### Ação
| | quando usar |
|---|---|
| `Button` | `primary` para a ação principal da tela (uma por região), `secondary` para apoio com contorno, `subtle` para preenchimento suave, `ghost` em barra de ferramentas, `danger` para destruir. Tamanhos `sm`/`md`/`lg` casam com `dimension/size/32\|40\|48`. **`block` só para botão sozinho** — dois `block` na mesma linha flex se empurram e transbordam; use `className="flex-1"`. |
| `IconButton` | Botão quadrado só com ícone. `label` é obrigatório — vira `aria-label` e `title`. |

### Entrada
| | quando usar |
|---|---|
| `Input` | Campo de uma linha. `mono` para hex, medida e nome de token. `invalid` pinta a borda e liga `aria-invalid`. |
| `Textarea` | Texto longo. |
| `SearchInput` | Input com lupa embutida e forma de comprimido. |
| `Select` | **Nunca o nativo.** O `<select>` do sistema abre o menu do SO, que ignora tema, tipografia e densidade — e não consegue mostrar cada opção com aparência própria, que é justamente o que faz um seletor de fontes ser útil. Aceita grupos, dica por opção, marcador à esquerda e `labelStyle`. Ganha campo de busca a partir de 12 opções. Painel em `position: fixed` para não ser recortado por ancestral com `overflow`. Teclado completo: setas, Home/End, Enter, Esc, Tab. |
| `Field` | Rótulo + campo + apoio, com o espaçamento certo. `hint` some quando há `error`. |
| `NumberField` | Slider **e** campo numérico para o mesmo valor: arrasta quem está explorando, digita quem sabe o número. |
| `Checkbox` / `Radio` / `Switch` | Chave quando o efeito é imediato; caixa quando existe um Salvar. |
| `SettingRow` | Título, apoio e controle à direita — a linha de tela de configuração. |

### Cor
| | quando usar |
|---|---|
| `Swatch` | Amostra estática, com xadrez atrás para alfa parcial. `round` para as bolinhas de resumo de marca. |
| `SwatchPicker` | Amostra que abre o `ColorPicker`. |
| `ColorPicker` | Seletor completo: área saturação × brilho, matiz, alfa, conta-gotas e campos que alternam HEX / RGB / HSL. Setas ajustam a área 2D. |
| `ColorRow` | A linha do editor: amostra, rótulo de largura fixa, campo e ações. A largura fixa é o que alinha uma coluna longa. |
| `Color` | Módulo de conversão: `hexToRgb`, `rgbToHsv`, `contrastRatio`… Use `contrastRatio` para conferir par duvidoso. |

### Estrutura
| | quando usar |
|---|---|
| `Card` | Superfície elevada com um assunto só. Sempre com borda além da sombra — no escuro a sombra some. `padded={false}` quando o conteúdo encosta na borda (tabela). |
| `CardHeader` | Título + descrição + ação no canto. |
| `Stat` | Número grande com rótulo e variação. |
| `Divider` | Divisor de 1px no token de borda. |
| `Disclosure` | Grupo colapsável. O gatilho é pastilha que abraça o texto, não faixa de ponta a ponta. |
| `Segmented` | Escolha única entre 2 e 4 opções visíveis. Prefira a `Select` quando a comparação entre elas importa. |
| `TabBar` | Abas em pastilha. |
| `Chip` | Pastilha clicável (filtro, aba de editor). |
| `Tag` / `Count` | Rótulo estático de estado ou categoria / contador discreto. |

### Dado
| | quando usar |
|---|---|
| `Table` | Tabela compacta. `selected` liga a coluna de seleção, `rowAction` a de ações. |
| `Pagination` | Contagem à esquerda, navegação à direita. |
| `Avatar` | Iniciais em círculo. |
| `Calendar` | Grade de um mês, estática — existe para o preview mostrar densidade de texto pequeno. |
| `LineChart` / `AreaChart` / `BarChart` / `StackedAreaChart` | SVG puro, pintado por token. Sem biblioteca. |
| `AxisLabels` | Rótulos de eixo abaixo de um gráfico. |

### Aplicação
| | quando usar |
|---|---|
| `SidebarNav` / `NavSection` / `NavItem` / `NavUser` | Navegação lateral. Item ativo usa `bg/neutral/solid` — sólido, porque num painel claro o sutil some. |
| `ChatHeader` / `ChatBubble` / `ChatAttachment` / `TypingIndicator` | Conversa. Bolha recebida em `neutral/subtle`, enviada em `brand/solid` + `text/on-brand`. |
| `ActivityItem` / `Marker` | Feed "quem / o quê / quando", com pastilha de contexto. |
| `Ticker` | Faixa de cotações. |

### Armadilha: `max-w-<nome>`

Os apelidos de espaçamento do Santo (`sm`, `md`, `lg`, `xl`, `2xl`…) têm os mesmos
nomes que os containers do Tailwind. `max-w-lg` **resolve pela escala de
espaçamento** e vira 24px, não 32rem. Use `max-w-(--santo-dimension-container-lg)`.

`w-`, `h-` e `size-` com esses nomes são legítimos — ali a escala de espaçamento é
exatamente o que se quer (`size-2xl` = 40px para uma célula de calendário).

`npm run design:check` bloqueia a forma nomeada.

### Estilos que precisam de pseudo-elemento

`listbox.tsx` também traz o tipo `SelectOption`, que descreve as opções passadas
à `Select`.

`controls.css` — o navegador não expõe o miolo de `<input type="range">` por
classe utilitária. A classe `.santo-range` estiliza trilha e punho, tudo em token.
Importada por `app/globals.css`.

### Ícones
`Icon.*` — grade de 24, traço 1.5, `currentColor`, tamanho vindo de
`dimension/icon/*`. A biblioteca Font Awesome que existe na página `Icones` do
Figma **não** faz parte dos tokens e não é usada aqui.

```tsx
import { Icon } from "@/lib/ui";
<Icon.Search size={16} />
```
