"use client";

import { useState } from "react";
import { jsx } from "./demo-kit";
import type { DemoMap } from "./registry.types";
import { StatCard, type StatTrend } from "./stat-card";

const WEEK = ["seg", "ter", "qua", "qui", "sex", "sáb", "dom"];

const TRENDS: Record<string, StatTrend | undefined> = {
  spark: { kind: "spark", values: [8, 9, 8.5, 10, 9.8, 11, 12.5], labels: WEEK, label: "Receita, 7 dias" },
  bars: { kind: "bars", values: [18, 22, 15, 19, 14, 12, 21], labels: WEEK, label: "Pedidos por dia" },
  ring: { kind: "ring", value: 72, label: "Meta do mês", detail: "72 de 100" },
  nenhuma: undefined,
};

const TREND_CODE: Record<string, string | undefined> = {
  spark: `{{ kind: "spark", values: receita, labels: dias, label: "Receita, 7 dias" }}`,
  bars: `{{ kind: "bars", values: pedidos, labels: dias, label: "Pedidos por dia" }}`,
  ring: `{{ kind: "ring", value: 72, label: "Meta do mês" }}`,
  nenhuma: undefined,
};

const PERIODS = [
  { value: "1s", label: "1S" },
  { value: "1m", label: "1M" },
  { value: "1a", label: "1A" },
];

const narrow = "mx-auto w-full max-w-(--santo-dimension-space-384)";

export const statCardDemos: DemoMap = {
  "stat-card": {
    playground: {
      controls: [
        { kind: "select", prop: "trend", label: "Micro-viz", options: Object.keys(TRENDS), initial: "spark" },
        { kind: "select", prop: "size", label: "Número", options: ["sm", "md", "lg"], initial: "md" },
        { kind: "boolean", prop: "delta", label: "Variação", initial: true },
        { kind: "boolean", prop: "title", label: "Cabeçalho com período", initial: false },
        { kind: "boolean", prop: "details", label: "Detalhes", initial: true },
        { kind: "boolean", prop: "action", label: "Ação", initial: false },
      ],
      layout: "stretch",
      Preview: function Preview({ values: v }) {
        const [range, setRange] = useState("1m");
        return (
          <div className={narrow}>
            <StatCard
              title={v.title ? "Receita" : undefined}
              ranges={v.title ? PERIODS : undefined}
              range={range}
              onRangeChange={setRange}
              label="Receita total"
              value="1.250"
              unit="R$ mil · out."
              size={v.size as "sm" | "md" | "lg"}
              delta={v.delta ? { label: "+12,5%", intent: "success" } : undefined}
              trend={TRENDS[v.trend as string]}
              details={
                v.details
                  ? [
                      { label: "Recorrente", value: "R$ 980 mil" },
                      { label: "Avulsa", value: "R$ 270 mil" },
                    ]
                  : undefined
              }
              action={v.action ? { label: "Ver relatório" } : undefined}
            />
          </div>
        );
      },
      code: (v) =>
        jsx("StatCard", {
          title: v.title ? "Receita" : undefined,
          ranges: v.title ? "{periodos}" : undefined,
          range: v.title ? "{periodo}" : undefined,
          onRangeChange: v.title ? "{setPeriodo}" : undefined,
          label: "Receita total",
          value: "1.250",
          unit: "R$ mil · out.",
          size: v.size === "md" ? undefined : (v.size as string),
          delta: v.delta ? `{{ label: "+12,5%", intent: "success" }}` : undefined,
          trend: TREND_CODE[v.trend as string],
          details: v.details ? `{[{ label: "Recorrente", value: "R$ 980 mil" }, …]}` : undefined,
          action: v.action ? `{{ label: "Ver relatório" }}` : undefined,
        }),
    },
    demos: [],
  },
};
