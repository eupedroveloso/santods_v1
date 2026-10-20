"use client";

import type { ReactNode } from "react";
import { AreaChart, BarChart, DonutChart, LineChart, StackedAreaChart, type ChartHeight, type ChartSeries } from "./chart";
import { AxisLabels } from "./chart-axis";
import { ChartGrid } from "./chart-grid";
import type { ChartTone } from "./chart-kit";
import { ChartLegend } from "./chart-legend";
import { ChartTooltip } from "./chart-tooltip";
import { jsx } from "./demo-kit";
import type { ControlValues, DemoMap } from "./registry.types";

const MONTHS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
const WEEK = ["seg", "ter", "qua", "qui", "sex", "sáb", "dom"];

/** Tres series de exemplo; o controle "Séries" escolhe quantas entram. */
const SERIES: ChartSeries[] = [
  { name: "Receita", values: [42, 48, 45, 53, 58, 55, 62, 68, 64, 71, 77, 84] },
  { name: "Custos", values: [30, 31, 33, 34, 36, 35, 38, 40, 41, 42, 44, 45] },
  { name: "Impostos", values: [8, 9, 9, 10, 11, 11, 12, 13, 13, 14, 15, 16] },
];
const take = (v: ControlValues) => SERIES.slice(0, Number(v.series));

const HEIGHTS = ["128", "160", "192", "224"];
const brl = (n: number) => `R$ ${n.toLocaleString("pt-BR")} mil`;

const wrap = (node: ReactNode) => <div className="mx-auto w-full max-w-(--santo-dimension-container-sm)">{node}</div>;

/** Trecho de series para o codigo do playground. */
const seriesCode = (v: ControlValues) =>
  `{[\n${take(v)
    .map((s) => `    { name: "${s.name}", values: [${s.values.slice(0, 4).join(", ")}, …] },`)
    .join("\n")}\n  ]}`;

const DONUT = [
  { name: "Orgânico", value: 4200 },
  { name: "Pago", value: 2600 },
  { name: "Indicação", value: 1500 },
  { name: "E-mail", value: 900 },
  { name: "Outros", value: 400 },
];

const CHANNELS = ["Busca orgânica", "Redes sociais", "Indicação", "E-mail", "Direto"];

export const chartDemos: DemoMap = {
  "line-chart": {
    playground: {
      controls: [
        { kind: "select", prop: "series", label: "Séries", options: ["1", "2", "3"], initial: "2" },
        { kind: "select", prop: "height", label: "Altura", options: HEIGHTS, initial: "160" },
        { kind: "boolean", prop: "yAxis", label: "Eixo y", initial: true },
        { kind: "boolean", prop: "grid", label: "Grade", initial: true },
        { kind: "boolean", prop: "dots", label: "Ponto em todo x", initial: false },
      ],
      layout: "stretch",
      Preview: ({ values: v }) =>
        wrap(
          <LineChart
            series={take(v)}
            labels={MONTHS}
            height={Number(v.height) as ChartHeight}
            yAxis={v.yAxis as boolean}
            grid={v.grid as boolean}
            dots={v.dots as boolean}
            label="Receita e custos por mês"
          />,
        ),
      code: (v) =>
        jsx("LineChart", {
          series: seriesCode(v),
          labels: `{["jan", "fev", "mar", …]}`,
          height: v.height === "160" ? undefined : `{${v.height}}`,
          yAxis: v.yAxis ? undefined : "{false}",
          grid: v.grid ? undefined : "{false}",
          dots: v.dots as boolean,
          label: "Receita e custos por mês",
        }),
    },
    demos: [
      {
        title: "Valor formatado",
        layout: "stretch",
        code: `<LineChart values={receita} labels={meses} format={(n) => \`R$ \${n} mil\`} label="Receita" />`,
        Preview: () => wrap(<LineChart values={SERIES[0].values} labels={MONTHS} format={brl} label="Receita por mês" />),
      },
      {
        title: "Sem eixo",
        layout: "stretch",
        code: `<LineChart values={receita} labels={meses} yAxis={false} grid={false} height={96} />`,
        Preview: () => wrap(<LineChart values={SERIES[0].values} labels={MONTHS} yAxis={false} grid={false} height={96} label="Receita" />),
      },
    ],
  },
  "area-chart": {
    playground: {
      controls: [
        { kind: "select", prop: "series", label: "Séries", options: ["1", "2", "3"], initial: "1" },
        { kind: "boolean", prop: "stacked", label: "Empilhada", initial: false },
        { kind: "select", prop: "height", label: "Altura", options: HEIGHTS, initial: "160" },
        { kind: "boolean", prop: "yAxis", label: "Eixo y", initial: true },
      ],
      layout: "stretch",
      Preview: ({ values: v }) =>
        wrap(
          <AreaChart
            series={take(v)}
            labels={MONTHS}
            stacked={v.stacked as boolean}
            height={Number(v.height) as ChartHeight}
            yAxis={v.yAxis as boolean}
            label="Volume por mês"
          />,
        ),
      code: (v) =>
        jsx("AreaChart", {
          series: seriesCode(v),
          labels: `{["jan", "fev", "mar", …]}`,
          stacked: v.stacked as boolean,
          height: v.height === "160" ? undefined : `{${v.height}}`,
          yAxis: v.yAxis ? undefined : "{false}",
          label: "Volume por mês",
        }),
    },
    demos: [
      {
        title: "Empilhada",
        layout: "stretch",
        code: `<AreaChart stacked series={[orgânico, pago]} labels={semana} />`,
        Preview: () =>
          wrap(
            <AreaChart
              stacked
              labels={WEEK}
              label="Visitas por canal"
              series={[
                { name: "Orgânico", values: [320, 410, 380, 460, 520, 300, 260] },
                { name: "Pago", values: [120, 160, 150, 190, 210, 90, 80] },
              ]}
            />,
          ),
      },
    ],
  },
  "bar-chart": {
    playground: {
      controls: [
        { kind: "select", prop: "orientation", label: "Orientação", options: ["vertical", "horizontal"], initial: "vertical" },
        { kind: "select", prop: "series", label: "Séries", options: ["1", "2", "3"], initial: "1" },
        { kind: "select", prop: "mode", label: "Várias séries", options: ["grouped", "stacked"], initial: "grouped" },
        { kind: "boolean", prop: "highlight", label: "Destacar a última", initial: true },
        { kind: "boolean", prop: "valueLabels", label: "Valor na ponta", initial: false },
      ],
      layout: "stretch",
      Preview: ({ values: v }) => {
        const horizontal = v.orientation === "horizontal";
        const labels = horizontal ? CHANNELS : MONTHS.slice(0, 7);
        return wrap(
          <BarChart
            orientation={v.orientation as "vertical" | "horizontal"}
            mode={v.mode as "grouped" | "stacked"}
            labels={labels}
            series={take(v).map((s) => ({ ...s, values: s.values.slice(0, labels.length) }))}
            highlight={v.highlight ? -1 : undefined}
            valueLabels={(v.valueLabels as boolean) || undefined}
            label="Comparação por período"
          />,
        );
      },
      code: (v) =>
        jsx("BarChart", {
          orientation: v.orientation === "vertical" ? undefined : (v.orientation as string),
          mode: v.mode === "grouped" || v.series === "1" ? undefined : (v.mode as string),
          series: seriesCode(v),
          labels: v.orientation === "horizontal" ? `{["Busca orgânica", …]}` : `{["jan", "fev", …]}`,
          highlight: v.highlight ? "{-1}" : undefined,
          valueLabels: v.valueLabels as boolean,
        }),
    },
    demos: [
      {
        title: "Agrupada",
        layout: "stretch",
        code: `<BarChart series={[receita, custos]} labels={meses} />`,
        Preview: () =>
          wrap(<BarChart labels={MONTHS.slice(0, 6)} series={SERIES.slice(0, 2).map((s) => ({ ...s, values: s.values.slice(0, 6) }))} label="Receita e custos" />),
      },
      {
        title: "Empilhada",
        layout: "stretch",
        code: `<BarChart mode="stacked" series={[receita, custos, impostos]} labels={meses} />`,
        Preview: () =>
          wrap(<BarChart mode="stacked" labels={MONTHS.slice(0, 6)} series={SERIES.map((s) => ({ ...s, values: s.values.slice(0, 6) }))} label="Composição" />),
      },
      {
        title: "Horizontal",
        layout: "stretch",
        code: `<BarChart orientation="horizontal" values={[4200, 2600, 1500, 900, 400]} labels={canais} />`,
        Preview: () => wrap(<BarChart orientation="horizontal" values={DONUT.map((d) => d.value)} labels={CHANNELS} label="Visitas por canal" />),
      },
    ],
  },
  "donut-chart": {
    playground: {
      controls: [
        { kind: "select", prop: "variant", label: "Forma", options: ["donut", "pie"], initial: "donut" },
        { kind: "select", prop: "size", label: "Tamanho", options: ["sm", "md", "lg"], initial: "md" },
        { kind: "select", prop: "slices", label: "Fatias", options: ["2", "3", "5"], initial: "3" },
        { kind: "boolean", prop: "legend", label: "Legenda", initial: true },
      ],
      layout: "stretch",
      Preview: ({ values: v }) =>
        wrap(
          <DonutChart
            data={DONUT.slice(0, Number(v.slices))}
            variant={v.variant as "donut" | "pie"}
            size={v.size as "sm" | "md" | "lg"}
            legend={v.legend as boolean}
            label="Visitas por canal"
          />,
        ),
      code: (v) =>
        jsx("DonutChart", {
          data: `{[\n${DONUT.slice(0, Number(v.slices))
            .map((d) => `    { name: "${d.name}", value: ${d.value} },`)
            .join("\n")}\n  ]}`,
          variant: v.variant === "donut" ? undefined : (v.variant as string),
          size: v.size === "md" ? undefined : (v.size as string),
          legend: v.legend ? undefined : "{false}",
          label: "Visitas por canal",
        }),
    },
    demos: [],
  },
  "stacked-area-chart": {
    playground: {
      controls: [{ kind: "select", prop: "height", label: "Altura", options: ["64", "96", "128"], initial: "64" }],
      layout: "stretch",
      Preview: ({ values: v }) =>
        wrap(
          <StackedAreaChart
            height={Number(v.height) as ChartHeight}
            labels={WEEK}
            series={[
              { values: [3, 6, 4, 8, 5, 9, 6], tone: "accent" },
              { values: [6, 10, 7, 13, 9, 15, 11], tone: "brand" },
            ]}
          />,
        ),
      code: (v) => `<StackedAreaChart${v.height === "64" ? "" : ` height={${v.height}}`}
  series={[
    { values: [3, 6, 4, 8, 5, 9, 6], tone: "accent" },
    { values: [6, 10, 7, 13, 9, 15, 11], tone: "brand" },
  ]}
  labels={["seg", "ter", "qua", "qui", "sex", "sáb", "dom"]}
/>`,
    },
    demos: [],
  },
  "axis-labels": {
    playground: {
      controls: [
        { kind: "select", prop: "orientation", label: "Eixo", options: ["x", "y"], initial: "x" },
        { kind: "select", prop: "mode", label: "Posição (x)", options: ["edge", "band"], initial: "edge" },
      ],
      layout: "stretch",
      Preview: ({ values: v }) =>
        v.orientation === "y" ? (
          <div className="mx-auto h-(--santo-dimension-space-128)">
            <AxisLabels orientation="y" labels={["80", "60", "40", "20", "0"]} />
          </div>
        ) : (
          wrap(<AxisLabels labels={MONTHS.slice(0, 6)} mode={v.mode as "edge" | "band"} />)
        ),
      code: (v) =>
        v.orientation === "y"
          ? `<AxisLabels orientation="y" labels={["80", "60", "40", "20", "0"]} />`
          : jsx("AxisLabels", { labels: `{["jan", "fev", "mar", "abr", "mai", "jun"]}`, mode: v.mode === "edge" ? undefined : (v.mode as string) }),
    },
    demos: [],
  },
  "chart-grid": {
    playground: {
      controls: [
        { kind: "select", prop: "lines", label: "Linhas", options: ["3", "4", "5", "6"], initial: "5" },
        { kind: "select", prop: "orientation", label: "Orientação", options: ["horizontal", "vertical"], initial: "horizontal" },
        { kind: "boolean", prop: "baseline", label: "Linha do zero", initial: true },
      ],
      layout: "stretch",
      Preview: ({ values: v }) =>
        wrap(
          <div className="relative h-(--santo-dimension-space-128)">
            <ChartGrid lines={Number(v.lines)} orientation={v.orientation as "horizontal" | "vertical"} baseline={v.baseline as boolean} />
          </div>,
        ),
      code: (v) =>
        `<div className="relative h-(--santo-dimension-space-128)">\n  ${jsx("ChartGrid", {
          lines: v.lines === "5" ? undefined : `{${v.lines}}`,
          orientation: v.orientation === "horizontal" ? undefined : (v.orientation as string),
          baseline: v.baseline ? undefined : "{false}",
        })}\n</div>`,
    },
    demos: [],
  },
  "chart-legend": {
    playground: {
      controls: [
        { kind: "select", prop: "mark", label: "Chave", options: ["rect", "line"], initial: "rect" },
        { kind: "select", prop: "layout", label: "Disposição", options: ["row", "column"], initial: "row" },
        { kind: "boolean", prop: "values", label: "Valores", initial: false },
      ],
      layout: "stretch",
      Preview: ({ values: v }) =>
        wrap(
          <ChartLegend
            mark={v.mark as "rect" | "line"}
            layout={v.layout as "row" | "column"}
            items={DONUT.slice(0, 3).map((d) => ({ name: d.name, value: v.values ? d.value.toLocaleString("pt-BR") : undefined }))
              .map((it, i) => ({ ...it, tone: (["brand", "neutral", "accent"] as ChartTone[])[i] }))}
          />,
        ),
      code: (v) =>
        jsx("ChartLegend", {
          mark: v.mark === "rect" ? undefined : (v.mark as string),
          layout: v.layout === "row" ? undefined : (v.layout as string),
          items: v.values
            ? `{[{ name: "Orgânico", tone: "brand", value: "4.200" }, …]}`
            : `{[{ name: "Orgânico", tone: "brand" }, { name: "Pago", tone: "neutral" }, …]}`,
        }),
    },
    demos: [],
  },
  "chart-tooltip": {
    playground: {
      controls: [
        { kind: "select", prop: "rows", label: "Séries", options: ["1", "2", "3"], initial: "2" },
        { kind: "select", prop: "mark", label: "Chave", options: ["line", "rect"], initial: "line" },
      ],
      Preview: ({ values: v }) => (
        <ChartTooltip
          title="mar."
          mark={v.mark as "line" | "rect"}
          rows={SERIES.slice(0, Number(v.rows)).map((s, i) => ({
            name: s.name,
            value: brl(s.values[2]),
            tone: (["brand", "neutral", "accent"] as ChartTone[])[i],
          }))}
        />
      ),
      code: (v) =>
        jsx("ChartTooltip", {
          title: "mar.",
          mark: v.mark === "line" ? undefined : (v.mark as string),
          x: "{posicaoEmPorcentagem}",
          rows: `{[{ name: "Receita", value: "R$ 45 mil", tone: "brand" }, …]}`,
        }),
    },
    demos: [],
  },
};
