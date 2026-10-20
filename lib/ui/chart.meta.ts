import type { ComponentMeta } from "./registry.types";

const SVG = "SVG e HTML puros, pintados por token, sem biblioteca. Hover, foco e setas por padrão; tabela sr-only para leitor de tela.";

/*
 * Sem `figma`: os gráficos e suas peças só existem no código (codeOnly). Par
 * no Figma pendente — ver relatório da Fase C.
 */
export const chartMeta: ComponentMeta[] = [
  {
    name: "LineChart",
    slug: "line-chart",
    category: "dado",
    tier: "semantico",
    source: "chart.tsx",
    description: `Tendência de um ou mais valores ao longo do tempo (até 4 séries): guia vertical e tooltip com todas as séries. ${SVG}`,
    related: ["area-chart", "bar-chart", "chart-tooltip", "chart-legend"],
  },
  {
    name: "AreaChart",
    slug: "area-chart",
    category: "dado",
    tier: "semantico",
    source: "chart.tsx",
    description: `Volume ao longo do tempo, com lavagem do tom embaixo da linha; stacked para partes de um total. Eixo sempre em zero. ${SVG}`,
    related: ["line-chart", "stacked-area-chart", "chart-legend"],
  },
  {
    name: "BarChart",
    slug: "bar-chart",
    category: "dado",
    tier: "semantico",
    source: "chart.tsx",
    description: `Comparação entre períodos (vertical) ou categorias de nome longo (horizontal); várias séries agrupadas ou empilhadas; highlight acende uma barra. ${SVG}`,
    related: ["line-chart", "donut-chart", "mini-bars"],
  },
  {
    name: "DonutChart",
    slug: "donut-chart",
    category: "dado",
    tier: "semantico",
    source: "chart.tsx",
    description: `Partes de um todo, até 5 fatias, cada uma no seu tom (também em foco), total no meio (fatia em foco no hover) e legenda compacta com a parte de cada uma; pie para o disco cheio. Mais fatias vira BarChart horizontal. ${SVG}`,
    related: ["bar-chart", "chart-legend", "ring"],
  },
  {
    name: "StackedAreaChart",
    slug: "stacked-area-chart",
    category: "dado",
    tier: "semantico",
    source: "chart.tsx",
    description: "Compatibilidade: o mesmo que AreaChart stacked com a assinatura antiga (séries por cor crua). Código novo usa AreaChart.",
    related: ["area-chart"],
  },
  {
    name: "AxisLabels",
    slug: "axis-labels",
    category: "dado",
    tier: "semantico",
    source: "chart-axis.tsx",
    description: "Rótulos de eixo: x abaixo (edge para linha, band para barra) ou y à esquerda; cada rótulo centrado no seu ponto, pontas inclusive; eixo longo amostrado com passo uniforme (max), o x em foco aparece e esconde os vizinhos.",
    related: ["chart-grid", "line-chart", "bar-chart"],
  },
  {
    name: "ChartGrid",
    slug: "chart-grid",
    category: "dado",
    tier: "semantico",
    source: "chart-grid.tsx",
    description: "Grade de fundo atrás da área de plotagem: hairline border/subtle igualmente espaçada, linha do zero em border/default. Nunca tracejada.",
    related: ["axis-labels", "line-chart"],
  },
  {
    name: "ChartLegend",
    slug: "chart-legend",
    category: "dado",
    tier: "semantico",
    source: "chart-legend.tsx",
    description: "Qual cor é qual série: obrigatória com 2+ séries, nunca com uma. Acima do gráfico (row) ou ao lado do donut com valores (column); hover/foco destaca a série.",
    related: ["chart-tooltip", "line-chart", "donut-chart"],
  },
  {
    name: "ChartTooltip",
    slug: "chart-tooltip",
    category: "dado",
    tier: "semantico",
    source: "chart-tooltip.tsx",
    description: "Leitura do x em foco com todas as séries: valor em destaque, nome depois, chave da cor ao lado. No alto da plotagem fica ao lado da guia com folga space/sm (nunca cobre o ponto ativo); acima de micro-viz, centrada.",
    related: ["chart-legend", "line-chart", "bar-chart"],
  },
];
