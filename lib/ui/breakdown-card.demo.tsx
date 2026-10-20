"use client";

import { BreakdownCard } from "./breakdown-card";
import type { DemoMap } from "./registry.types";

const ITEMS = [
  { name: "Moradia", value: 2400 },
  { name: "Alimentação", value: 1310 },
  { name: "Transporte", value: 620 },
  { name: "Lazer", value: 480 },
];
const brl = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

export const breakdownCardDemos: DemoMap = {
  "breakdown-card": {
    playground: {
      controls: [{ kind: "select", prop: "kind", label: "Gráfico", options: ["bars", "donut"], initial: "bars" }],
      layout: "stretch",
      Preview: ({ values: v }) => (
        <div className="mx-auto w-full max-w-(--santo-dimension-container-sm)">
          <BreakdownCard title="Gastos por categoria" meta="R$ 4,8 mil" kind={v.kind as "bars" | "donut"} items={ITEMS} format={brl} centerLabel="Total" />
        </div>
      ),
      code: (v) => `<BreakdownCard title="Gastos por categoria" meta="R$ 4,8 mil" kind="${v.kind}" items={itens} format={brl} />`,
    },
    demos: [],
  },
};
