"use client";

import { Card, CardHeader } from "./card";
import { BarChart, DonutChart } from "./chart";
import { Count } from "./chip";

export type BreakdownItem = { name: string; value: number };

/**
 * Partes de um total num cartao: `kind="bars"` (barras horizontais por
 * categoria, valor na ponta — gastos por categoria) ou `kind="donut"`
 * (distribuicao, total no meio e legenda com a parte de cada fatia, ate 5).
 * Grafico direto no cartao, sem poco; hover e teclado do proprio grafico.
 * Alimentado por dado.
 */
export function BreakdownCard({
  title,
  meta,
  kind,
  items,
  format,
  centerLabel,
}: {
  title: string;
  /** Total ao lado do titulo, em Count. */
  meta?: string;
  kind: "bars" | "donut";
  items: BreakdownItem[];
  format?: (v: number) => string;
  /** Donut: rotulo do total no centro ("Total"). */
  centerLabel?: string;
}) {
  return (
    <Card>
      <CardHeader title={title} meta={meta ? <Count>{meta}</Count> : undefined} />
      {kind === "bars" ? (
        <BarChart
          orientation="horizontal"
          values={items.map((i) => i.value)}
          labels={items.map((i) => i.name)}
          valueLabels
          format={format}
          label={title}
        />
      ) : (
        <DonutChart data={items} format={format} centerLabel={centerLabel} label={title} />
      )}
    </Card>
  );
}
