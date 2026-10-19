import type { ComponentMeta } from "./registry.types";

const SVG = "SVG puro, pintado por token, sem biblioteca.";

export const chartMeta: ComponentMeta[] = [
  {
    name: "LineChart",
    slug: "line-chart",
    category: "dado",
    tier: "semantico",
    source: "chart.tsx",
    description: `Tendência de um valor ao longo do tempo. ${SVG}`,
    related: ["area-chart", "axis-labels"],
  },
  {
    name: "AreaChart",
    slug: "area-chart",
    category: "dado",
    tier: "semantico",
    source: "chart.tsx",
    description: `Volume acumulado ao longo do tempo. ${SVG}`,
    related: ["line-chart", "stacked-area-chart"],
  },
  {
    name: "BarChart",
    slug: "bar-chart",
    category: "dado",
    tier: "semantico",
    source: "chart.tsx",
    description: `Comparação entre períodos discretos. ${SVG}`,
    related: ["line-chart"],
  },
  {
    name: "StackedAreaChart",
    slug: "stacked-area-chart",
    category: "dado",
    tier: "semantico",
    source: "chart.tsx",
    description: `Duas ou mais séries que somam um total, com grade e eixo — o gráfico grande do painel. ${SVG}`,
    related: ["area-chart", "axis-labels"],
  },
  {
    name: "AxisLabels",
    slug: "axis-labels",
    category: "dado",
    tier: "semantico",
    source: "chart.tsx",
    description: "Rótulos de eixo abaixo de um gráfico.",
    related: ["line-chart", "stacked-area-chart"],
  },
];
