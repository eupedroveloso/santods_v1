"use client";

import type { ReactNode } from "react";
import { AreaChart, AxisLabels, BarChart, LineChart, StackedAreaChart } from "./chart";
import { jsx } from "./demo-kit";
import type { ControlValues, DemoMap } from "./registry.types";

const SERIES: Record<string, number[]> = {
  alta: [4, 6, 5, 8, 7, 10, 9, 12, 14],
  queda: [14, 12, 13, 10, 9, 8, 6, 7, 4],
  oscilando: [6, 12, 4, 14, 5, 13, 6, 12, 7],
};
const HEIGHTS = ["40", "48", "56", "64"];
const STROKES: Record<string, string> = {
  primary: "var(--santo-color-icon-primary)",
  brand: "var(--santo-color-icon-brand)",
  accent: "var(--santo-color-icon-accent)",
};
const WEEK = ["seg", "ter", "qua", "qui", "sex", "sáb", "dom"];

type H = 40 | 48 | 56 | 64;

const controls = (withDots = false) => [
  { kind: "select" as const, prop: "series", label: "Série", options: Object.keys(SERIES), initial: "alta" },
  { kind: "select" as const, prop: "height", label: "Altura", options: HEIGHTS, initial: "56" },
  { kind: "select" as const, prop: "stroke", label: "Cor", options: Object.keys(STROKES), initial: "primary" },
  ...(withDots ? [{ kind: "boolean" as const, prop: "dots", label: "Pontos", initial: true }] : []),
];

const wrap = (node: ReactNode) => <div className="mx-auto w-full max-w-(--santo-dimension-space-448)">{node}</div>;

const chartCode = (name: string, v: ControlValues, extra: Record<string, string | boolean | undefined> = {}) =>
  jsx(
    name,
    {
      values: `{[${SERIES[v.series as string].join(", ")}]}`,
      height: v.height === "56" ? undefined : `{${v.height}}`,
      stroke: v.stroke === "primary" ? undefined : STROKES[v.stroke as string],
      ...extra,
    },
  );

export const chartDemos: DemoMap = {
  "line-chart": {
    playground: {
      controls: controls(true),
      layout: "stretch",
      Preview: ({ values: v }) =>
        wrap(
          <LineChart
            values={SERIES[v.series as string]}
            height={Number(v.height) as H}
            stroke={STROKES[v.stroke as string]}
            dots={v.dots as boolean}
          />,
        ),
      code: (v) => chartCode("LineChart", v, { dots: v.dots ? undefined : "{false}" }),
    },
    demos: [
      {
        title: "Com eixo",
        layout: "stretch",
        code: `<LineChart values={valores} height={64} />\n<AxisLabels labels={["seg", "ter", …]} />`,
        Preview: () =>
          wrap(
            <div className="flex flex-col gap-2xs">
              <LineChart values={[6, 5, 4, 14, 8, 7, 9]} height={64} />
              <AxisLabels labels={WEEK} />
            </div>,
          ),
      },
    ],
  },
  "area-chart": {
    playground: {
      controls: controls(),
      layout: "stretch",
      Preview: ({ values: v }) =>
        wrap(
          <AreaChart values={SERIES[v.series as string]} height={Number(v.height) as H} stroke={STROKES[v.stroke as string]} />,
        ),
      code: (v) => chartCode("AreaChart", v),
    },
    demos: [],
  },
  "bar-chart": {
    playground: {
      controls: [
        { kind: "select", prop: "series", label: "Série", options: Object.keys(SERIES), initial: "oscilando" },
        { kind: "select", prop: "height", label: "Altura", options: HEIGHTS, initial: "56" },
        { kind: "select", prop: "fill", label: "Cor", options: ["neutral", "brand", "accent"], initial: "neutral" },
      ],
      layout: "stretch",
      Preview: ({ values: v }) =>
        wrap(
          <BarChart
            values={SERIES[v.series as string]}
            height={Number(v.height) as H}
            fill={`var(--santo-color-bg-${v.fill}-solid-default)`}
          />,
        ),
      code: (v) =>
        jsx("BarChart", {
          values: `{[${SERIES[v.series as string].join(", ")}]}`,
          height: v.height === "56" ? undefined : `{${v.height}}`,
          fill: v.fill === "neutral" ? undefined : `var(--santo-color-bg-${v.fill}-solid-default)`,
        }),
    },
    demos: [],
  },
  "stacked-area-chart": {
    playground: {
      controls: [
        { kind: "select", prop: "height", label: "Altura", options: HEIGHTS, initial: "64" },
        { kind: "boolean", prop: "labels", label: "Eixo", initial: true },
      ],
      layout: "stretch",
      Preview: ({ values: v }) =>
        wrap(
          <StackedAreaChart
            height={Number(v.height) as H}
            series={[
              { values: [3, 6, 4, 8, 5, 9, 6], color: "var(--santo-color-icon-accent)" },
              { values: [6, 10, 7, 13, 9, 15, 11], color: "var(--santo-color-icon-primary)" },
            ]}
            labels={v.labels ? WEEK : undefined}
          />,
        ),
      code: (v) => `<StackedAreaChart${v.height === "64" ? "" : ` height={${v.height}}`}
  series={[
    { values: [3, 6, 4, 8, 5, 9, 6], color: "var(--santo-color-icon-accent)" },
    { values: [6, 10, 7, 13, 9, 15, 11], color: "var(--santo-color-icon-primary)" },
  ]}${v.labels ? `
  labels={["seg", "ter", "qua", "qui", "sex", "sáb", "dom"]}` : ""}
/>`,
    },
    demos: [],
  },
  "axis-labels": {
    demos: [
      {
        title: "Básico",
        layout: "stretch",
        code: `<AxisLabels labels={["jan", "fev", "mar", "abr", "mai", "jun"]} />`,
        Preview: () => wrap(<AxisLabels labels={["jan", "fev", "mar", "abr", "mai", "jun"]} />),
      },
    ],
  },
};
