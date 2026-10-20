import type { ComponentMeta } from "./registry.types";

export const sparklineMeta: ComponentMeta[] = [
  {
    name: "Sparkline",
    slug: "sparkline",
    category: "dado",
    tier: "semantico",
    source: "sparkline.tsx",
    description:
      "Tendência sem eixo colada num número (Stat, linha de tabela). Cor herdada do pai; area para volume, dot para o valor atual. Gráfico com eixo é LineChart.",
    related: ["stat", "ring", "mini-bars", "line-chart"],
  },
];
