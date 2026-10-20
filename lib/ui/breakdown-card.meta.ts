import type { ComponentMeta } from "./registry.types";

export const breakdownCardMeta: ComponentMeta[] = [
  {
    name: "BreakdownCard",
    slug: "breakdown-card",
    category: "blocos",
    tier: "semantico",
    source: "breakdown-card.tsx",
    description:
      "Partes de um total num cartão: barras horizontais por categoria (gastos) ou donut (distribuição, até 5 fatias), com hover e teclado. Alimentado por dado.",
    related: ["chart-card", "bar-chart", "donut-chart"],
  },
];
