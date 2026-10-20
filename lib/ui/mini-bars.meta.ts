import type { ComponentMeta } from "./registry.types";

export const miniBarsMeta: ComponentMeta[] = [
  {
    name: "MiniBars",
    slug: "mini-bars",
    category: "dado",
    tier: "semantico",
    source: "mini-bars.tsx",
    description:
      "Volume por período em barrinhas, ao lado de um número. Barras em neutral/subtle/active, só a destacada (hoje, pico) na cor do pai. Gráfico com eixo é BarChart.",
    related: ["stat", "sparkline", "ring", "bar-chart"],
  },
];
