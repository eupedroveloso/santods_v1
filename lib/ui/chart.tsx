"use client";

import { useState, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import { resolved } from "@/lib/tokens";
import { AxisLabels } from "./chart-axis";
import { ChartGrid } from "./chart-grid";
import {
  CURSOR_MOTION,
  SURFACE_RING,
  TONE,
  formatTick,
  formatValue,
  niceTicks,
  smoothPath,
  toneAt,
  useChartCursor,
  xAt,
  type ChartSurface,
  type ChartTone,
  type Point,
} from "./chart-kit";
import { ChartLegend } from "./chart-legend";
import { ChartTooltip } from "./chart-tooltip";
import { RADIUS_BAR } from "./radius";

/*
 * Graficos do SantoDS: SVG e HTML puros, pintados por token, sem biblioteca.
 *
 * Todos seguem o mesmo contrato (skill dataviz + santo-ui-craft):
 *  - um eixo de valor so (nunca dois); ticks redondos e compactos;
 *  - grade hairline recessiva (ChartGrid), eixo em caption tertiary (AxisLabels);
 *  - camada de hover por padrao: linha/area ganham guia vertical que encaixa no
 *    ponto mais proximo e um tooltip com TODAS as series; barra e fatia sao o
 *    proprio alvo e acendem; teclado anda pelo mesmo cursor (uma parada de Tab);
 *  - legenda com 2+ series, nunca com uma (o titulo do cartao ja nomeia);
 *  - tabela de dados escondida (sr-only) para leitor de tela, mais um anuncio
 *    aria-live do ponto em foco.
 */

/* ----------------------------------------------------------------- tipos */

export type ChartSeries = {
  name: string;
  values: number[];
  /** Tom da serie. Sem ele, a ordem fixa (brand, neutral, accent, info…). */
  tone?: ChartTone;
  /** Cor crua por var de token (compatibilidade). Prefira `tone`. */
  color?: string;
};

/** Altura da area de plotagem, em degraus de dimension/space. */
export type ChartHeight = 40 | 48 | 56 | 64 | 96 | 128 | 160 | 192 | 224 | 256;

const heightOf = (h: ChartHeight): CSSProperties => ({ height: `var(--santo-dimension-space-${h})` });

const STROKE: CSSProperties = { strokeWidth: "var(--santo-border-thick)" };

/** Props comuns de grafico grande. */
type BaseProps = {
  /** Rotulo de cada x (eixo e tooltip): ["jan", "fev", …]. */
  labels?: string[];
  height?: ChartHeight;
  /** Eixo de valor (ticks) ao lado. */
  yAxis?: boolean;
  /** Grade de fundo. */
  grid?: boolean;
  /** Legenda acima. Padrao: so com 2+ series. */
  legend?: boolean;
  /** Formata o valor no tooltip, no rotulo direto e na tabela. */
  format?: (v: number) => string;
  /** Nome do grafico para leitor de tela: "Receita por mes". */
  label?: string;
  /** Hover, foco e teclado. Desligue em grafico decorativo. */
  interactive?: boolean;
  className?: string;
};

/** Junta `values` (uma serie) e `series` (varias) numa lista so. */
function normalize(values?: number[], series?: ChartSeries[], color?: string): ChartSeries[] {
  if (series?.length) return series;
  return [{ name: "Valor", values: values ?? [], color }];
}

/** Cor da serie: classe do tom, ou a var crua de compatibilidade. Recua para `muted` quando outra esta em foco. */
function paint(s: ChartSeries, i: number, dim: boolean): { className: string; style?: CSSProperties } {
  if (dim) return { className: TONE.muted.text };
  if (s.color) return { className: "", style: { color: s.color } };
  return { className: TONE[toneAt(i, s.tone)].text };
}

/** Lavagem da area: o par subtle do tom. Cor crua (compatibilidade) nao tem par, cai na lavagem neutra. */
const washOf = (s: ChartSeries, i: number, dim: boolean) =>
  dim ? TONE.muted.wash : s.color ? TONE.neutral.wash : TONE[toneAt(i, s.tone)].wash;

/* ----------------------------------------------------------------- moldura */

/**
 * Esqueleto comum: legenda, eixo y | area de plotagem, eixo x, tabela sr-only.
 * A area de plotagem e o alvo do ponteiro e do foco.
 */
function Frame({
  legend,
  height,
  yTicks,
  xLabels,
  xMode = "edge",
  active,
  table,
  className = "",
  children,
}: {
  legend?: ReactNode;
  height: ChartHeight;
  yTicks?: number[];
  xLabels?: string[];
  xMode?: "edge" | "band";
  active: number | null;
  table: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`flex min-w-0 flex-col gap-sm ${className}`}>
      {legend}
      <div className="flex gap-xs">
        {/* Eixo y na altura exata da plotagem: os ticks casam com a grade. */}
        {yTicks && (
          <div className="shrink-0" style={heightOf(height)}>
            <AxisLabels orientation="y" labels={[...yTicks].reverse().map(formatTick)} />
          </div>
        )}
        <div className="flex min-w-0 flex-1 flex-col gap-xs">
          {children}
          {xLabels && <AxisLabels labels={xLabels} mode={xMode} active={active} />}
        </div>
      </div>
      {table}
    </div>
  );
}

/** Tabela de dados para leitor de tela: a mesma informacao, sem depender de hover nem de cor. */
function DataTable({
  label,
  labels,
  series,
  format,
}: {
  label?: string;
  labels: string[];
  series: ChartSeries[];
  format: (v: number) => string;
}) {
  return (
    <table className="sr-only">
      {label && <caption>{label}</caption>}
      <thead>
        <tr>
          <th scope="col">Série</th>
          {labels.map((l, i) => (
            <th key={i} scope="col">
              {l}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {series.map((s, i) => (
          <tr key={i}>
            <th scope="row">{s.name}</th>
            {labels.map((_, j) => (
              <td key={j}>{s.values[j] === undefined ? "—" : format(s.values[j])}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** Frase do ponto em foco, para o anuncio aria-live: "mar.: Receita 12, Custos 8". */
const readout = (title: string | undefined, rows: { name: string; value: string }[]) =>
  `${title ? `${title}: ` : ""}${rows.map((r) => `${r.name} ${r.value}`).join(", ")}`;

/** Atributos do alvo de interacao (ou de imagem estatica). */
function plotA11y(interactive: boolean, label: string | undefined) {
  return interactive
    ? { role: "group", "aria-roledescription": "gráfico", "aria-label": label ?? "Gráfico" }
    : { role: "img", "aria-label": label ?? "Gráfico" };
}

/* ------------------------------------------------------- linha e area */

type TrendProps = BaseProps & {
  /** Uma serie so (atalho). */
  values?: number[];
  series?: ChartSeries[];
  /** Ponto em todo x. Padrao: so o ponto final da serie principal. */
  dots?: boolean;
  /** Superficie atras do grafico: o anel dos pontos recorta nessa cor. Use `sunken` dentro de poco. */
  surface?: ChartSurface;
};

function TrendChart({
  values,
  series: input,
  labels,
  height = 160,
  yAxis = true,
  grid = true,
  legend,
  format = formatValue,
  label,
  interactive = true,
  dots = false,
  surface = "raised",
  className = "",
  area = false,
  stacked = false,
  color,
}: TrendProps & { area?: boolean; stacked?: boolean; color?: string }) {
  const series = normalize(values, input, color);
  const n = Math.max(1, ...series.map((s) => s.values.length));
  const xs = labels ?? Array.from({ length: n }, (_, i) => String(i + 1));
  const { active, handlers } = useChartCursor(n);
  const [focusSeries, setFocusSeries] = useState<number | null>(null);
  const dimmed = (i: number) => focusSeries !== null && focusSeries !== i;

  // Empilhada: cada serie soma as de baixo no mesmo indice.
  const tops = series.map((s) => s.values.slice());
  if (stacked) for (let i = 1; i < tops.length; i++) tops[i] = tops[i].map((v, j) => v + (tops[i - 1][j] ?? 0));

  const all = tops.flat();
  const lo = area || stacked ? Math.min(0, ...all) : Math.min(...all);
  const ticks = niceTicks(lo, Math.max(...all), 4);
  const t0 = ticks[0];
  const span = ticks[ticks.length - 1] - t0 || 1;
  const yOf = (v: number) => 100 - ((v - t0) / span) * 100;
  const pts = tops.map((vals) => vals.map((v, i) => ({ x: xAt(i, n), y: yOf(v) })));
  const base = yOf(Math.max(0, t0));

  const band = (upper: Point[], lower?: Point[]) => {
    const top = smoothPath(upper);
    if (!lower) return `${top} L ${upper[upper.length - 1].x} ${base} L ${upper[0].x} ${base} Z`;
    return `${top} ${smoothPath([...lower].reverse()).replace(/^M/, "L")} Z`;
  };

  const showLegend = legend ?? series.length >= 2;
  const rows =
    active === null
      ? []
      : series.map((s, i) => ({
          name: s.name,
          value: s.values[active] === undefined ? "—" : format(s.values[active]),
          tone: s.color ? undefined : toneAt(i, s.tone),
        }));
  const ax = active === null ? 0 : xAt(active, n);
  const dotClass = `pointer-events-none absolute size-xs -translate-x-1/2 -translate-y-1/2 rounded-full border-thick bg-current ${SURFACE_RING[surface]}`;

  return (
    <Frame
      className={className}
      height={height}
      active={active}
      yTicks={yAxis ? ticks : undefined}
      xLabels={labels}
      legend={
        showLegend && (
          <ChartLegend
            mark={area ? "rect" : "line"}
            items={series.map((s, i) => ({ name: s.name, tone: toneAt(i, s.tone) }))}
            active={focusSeries}
            onActiveChange={interactive ? setFocusSeries : undefined}
          />
        )
      }
      table={<DataTable label={label} labels={xs} series={series} format={format} />}
    >
      <div
        className="relative min-w-0 touch-pan-y"
        style={heightOf(height)}
        {...plotA11y(interactive, label)}
        {...(interactive ? handlers : {})}
      >
        {grid && <ChartGrid lines={ticks.length} />}
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full overflow-visible" aria-hidden>
          {(area || stacked) &&
            pts
              .map((p, i) => ({ p, i }))
              .reverse()
              .map(({ p, i }) => (
                <path
                  key={`a${i}`}
                  d={band(p, stacked ? pts[i - 1] : undefined)}
                  fill={washOf(series[i], i, dimmed(i))}
                  className="santo-transition-colors"
                />
              ))}
          {pts.map((p, i) => {
            const c = paint(series[i], i, dimmed(i));
            return (
              <path
                key={`l${i}`}
                d={smoothPath(p)}
                fill="none"
                stroke="currentColor"
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`santo-transition-colors ${c.className}`}
                style={{ ...STROKE, ...c.style }}
              />
            );
          })}
        </svg>

        {active !== null && (
          <span
            aria-hidden
            className={`pointer-events-none absolute inset-y-0 w-0 border-l-thin border-border-default ${CURSOR_MOTION}`}
            style={{ left: `${ax}%` }}
          />
        )}

        {pts.map((p, i) => {
          const c = paint(series[i], i, dimmed(i));
          // Em repouso, so o ponto final da serie principal; em foco, um ponto por serie no x ativo.
          const at = active ?? (i === 0 ? p.length - 1 : null);
          return (
            <span key={`d${i}`} aria-hidden>
              {dots &&
                p.map((q, j) => (
                  <span key={j} className={`${dotClass} ${c.className}`} style={{ left: `${q.x}%`, top: `${q.y}%`, ...c.style }} />
                ))}
              {!dots && at !== null && p[at] && (
                <span
                  className={`${dotClass} ${c.className} ${CURSOR_MOTION}`}
                  style={{ left: `${p[at].x}%`, top: `${p[at].y}%`, ...c.style }}
                />
              )}
            </span>
          );
        })}

        {active !== null && <ChartTooltip x={ax} title={labels?.[active]} rows={rows} mark={area ? "rect" : "line"} />}
        {interactive && (
          <span className="sr-only" aria-live="polite">
            {active === null ? "" : readout(labels?.[active], rows)}
          </span>
        )}
      </div>
    </Frame>
  );
}

/**
 * Linha: tendencia de um ou mais valores ao longo do tempo.
 *
 * Use quando a pergunta e "subiu ou caiu, e quando" — receita por mes,
 * acessos por dia. Ate 4 series; mais que isso vira cartoes pequenos. O
 * eixo nao precisa comecar em zero (a forma e a tendencia). `stroke` e
 * `values` continuam valendo para uma serie so.
 */
export function LineChart({
  stroke,
  ...props
}: TrendProps & {
  /** Cor crua da serie unica (compatibilidade). Prefira `series[].tone`. */
  stroke?: string;
}) {
  return <TrendChart {...props} color={stroke} />;
}

/**
 * Area: volume ao longo do tempo, com lavagem do tom da serie embaixo da linha.
 *
 * Use quando a quantidade acumulada importa tanto quanto a tendencia
 * (visitantes, receita). `stacked` empilha as series — partes de um total
 * (canal de aquisicao, plano). O eixo sempre comeca em zero.
 */
export function AreaChart({
  stroke,
  stacked = false,
  ...props
}: TrendProps & {
  /** Series empilhadas: cada faixa e uma parte do total. */
  stacked?: boolean;
  /** Cor crua da serie unica (compatibilidade). Prefira `series[].tone`. */
  stroke?: string;
}) {
  return <TrendChart {...props} area stacked={stacked} color={stroke} />;
}

/**
 * Area empilhada (compatibilidade): o mesmo que `AreaChart stacked`, com a
 * assinatura antiga de series por cor crua. Codigo novo usa AreaChart.
 */
export function StackedAreaChart({
  series,
  labels,
  height = 64,
  className = "",
}: {
  /** Da base para o topo. */
  series: { values: number[]; color?: string; tone?: ChartTone; name?: string }[];
  labels?: string[];
  height?: ChartHeight;
  className?: string;
}) {
  return (
    <TrendChart
      area
      stacked
      yAxis={false}
      legend={false}
      height={height}
      labels={labels}
      className={className}
      series={series.map((s, i) => ({ name: s.name ?? `Série ${i + 1}`, values: s.values, color: s.color, tone: s.tone }))}
    />
  );
}

/* ----------------------------------------------------------------- barras */

/**
 * Barras: comparacao entre categorias ou periodos discretos.
 *
 * `vertical` (colunas) para periodos — o tempo anda da esquerda para a
 * direita; `horizontal` para categorias com nome longo, ranking. Com varias
 * series: `grouped` compara lado a lado, `stacked` mostra a composicao de um
 * total. `highlight` acende uma barra e recua o resto (hoje, o pico) — com
 * uma serie so. A barra e o alvo: hover e teclado acendem a faixa e o
 * tooltip lista todas as series dela. Espessura maxima space/24, ponta de
 * dado arredondada (xs) e base reta; vao de space/3xs entre segmentos.
 */
export function BarChart({
  values,
  series: input,
  labels,
  orientation = "vertical",
  mode = "grouped",
  highlight,
  valueLabels,
  height = 160,
  yAxis = true,
  grid = true,
  legend,
  format = formatValue,
  label,
  interactive = true,
  fill,
  className = "",
}: BaseProps & {
  values?: number[];
  series?: ChartSeries[];
  orientation?: "vertical" | "horizontal";
  mode?: "grouped" | "stacked";
  /** Indice da barra em destaque (uma serie). Negativo conta do fim. */
  highlight?: number;
  /** Valor na ponta da barra. Padrao: so na horizontal com uma serie. */
  valueLabels?: boolean;
  /** Cor crua da serie unica (compatibilidade). Prefira `series[].tone`. */
  fill?: string;
}) {
  const series = normalize(values, input, fill).map((s) => ({ ...s, values: s.values.map((v) => Math.max(0, v)) }));
  const n = Math.max(1, ...series.map((s) => s.values.length));
  const xs = labels ?? Array.from({ length: n }, (_, i) => String(i + 1));
  const horizontal = orientation === "horizontal";
  const { active, handlers } = useChartCursor(n, { mode: "band", axis: horizontal ? "y" : "x" });
  const [focusSeries, setFocusSeries] = useState<number | null>(null);
  const stacked = mode === "stacked" && series.length > 1;
  const single = series.length === 1;
  const hi = highlight === undefined ? undefined : highlight < 0 ? n + highlight : highlight;
  const direct = valueLabels ?? (horizontal && single);

  const totals = Array.from({ length: n }, (_, j) => series.reduce((a, s) => a + (s.values[j] ?? 0), 0));
  const peak = stacked ? Math.max(...totals) : Math.max(...series.flatMap((s) => s.values));
  const ticks = niceTicks(0, peak || 1, 4);
  const top = ticks[ticks.length - 1] || 1;
  const pct = (v: number) => `${(v / top) * 100}%`;

  const dimmed = (si: number, j: number) =>
    (focusSeries !== null && focusSeries !== si) || (single && hi !== undefined && j !== hi);
  const toneOf = (si: number, j: number) => {
    if (dimmed(si, j)) return TONE.muted.bg;
    return series[si].color ? "" : TONE[toneAt(si, series[si].tone)].bg;
  };
  const colorStyle = (si: number, j: number): CSSProperties | undefined =>
    series[si].color && !dimmed(si, j) ? { background: series[si].color } : undefined;

  const rows =
    active === null
      ? []
      : series.map((s, i) => ({
          name: s.name,
          value: s.values[active] === undefined ? "—" : format(s.values[active]),
          tone: s.color ? undefined : toneAt(i, s.tone),
        }));
  const legendNode = (legend ?? series.length >= 2) && (
    <ChartLegend
      items={series.map((s, i) => ({ name: s.name, tone: toneAt(i, s.tone) }))}
      active={focusSeries}
      onActiveChange={interactive ? setFocusSeries : undefined}
    />
  );
  const table = <DataTable label={label} labels={xs} series={series} format={format} />;
  const live = interactive && (
    <span className="sr-only" aria-live="polite">
      {active === null ? "" : readout(xs[active], rows)}
    </span>
  );
  /* Faixa em foco: lavagem tonal atras das barras (hover so tonaliza). */
  const wash = (j: number) => (active === j ? "bg-neutral-subtle-default" : "");

  /* Uma faixa: as barras de uma categoria (lado a lado ou empilhadas). */
  const bars = (j: number) => {
    // Ponta de dado com o raio de RADIUS_BAR (xs) so do lado do valor; a base fica reta.
    const end = horizontal ? "rounded-r-xs" : "rounded-t-xs";
    if (stacked) {
      return (
        <span
          className={`flex gap-3xs ${horizontal ? "h-md flex-row" : "w-full max-w-(--santo-dimension-space-24) flex-col-reverse"}`}
          style={horizontal ? { width: pct(totals[j]) } : { height: pct(totals[j]) }}
        >
          {series.map((s, si) => {
            const last = series.slice(si + 1).every((t) => !t.values[j]);
            return (
              <span
                key={si}
                className={`min-h-0 min-w-0 santo-transition-colors ${toneOf(si, j)} ${last ? end : ""}`}
                style={{ flex: `${s.values[j] ?? 0} 1 0`, ...colorStyle(si, j) }}
              />
            );
          })}
        </span>
      );
    }
    return (
      <span className={`flex gap-3xs ${horizontal ? "w-full flex-col justify-center" : "h-full w-full items-end justify-center"}`}>
        {series.map((s, si) => (
          <span
            key={si}
            className={`relative block santo-transition-colors ${end} ${toneOf(si, j)} ${
              horizontal ? (single ? "h-md" : "h-xs") : "w-full max-w-(--santo-dimension-space-24)"
            }`}
            style={{ ...(horizontal ? { width: pct(s.values[j] ?? 0) } : { height: pct(s.values[j] ?? 0) }), ...colorStyle(si, j) }}
          >
            {direct && single && (
              <span
                className={`santo-caption-small-medium absolute whitespace-nowrap text-text-secondary tabular-nums ${
                  horizontal ? "left-full top-1/2 ml-2xs -translate-y-1/2" : "bottom-full left-1/2 mb-3xs -translate-x-1/2"
                }`}
              >
                {format(s.values[j] ?? 0)}
              </span>
            )}
          </span>
        ))}
      </span>
    );
  };

  if (horizontal) {
    const ty = active === null ? 0 : ((active + 0.5) / n) * 100;
    const tx =
      active === null ? 0 : ((stacked ? totals[active] : Math.max(...series.map((s) => s.values[active] ?? 0))) / top) * 100;
    return (
      <div className={`flex min-w-0 flex-col gap-sm ${className}`}>
        {legendNode}
        <div className="flex gap-sm">
          <div aria-hidden className="flex shrink-0 flex-col">
            {xs.map((l, j) => (
              <span
                key={j}
                className={`santo-caption-medium flex h-xl items-center justify-end whitespace-nowrap santo-transition-colors ${
                  active === j ? "text-text-primary" : "text-text-secondary"
                }`}
              >
                {l}
              </span>
            ))}
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-xs">
            <div className="relative min-w-0 touch-pan-x" {...plotA11y(interactive, label)} {...(interactive ? handlers : {})}>
              {grid && <ChartGrid lines={ticks.length} orientation="vertical" className={direct ? "right-3xl" : ""} />}
              <div className={`relative flex flex-col ${direct ? "pr-3xl" : ""}`}>
                {xs.map((_, j) => (
                  <span key={j} className={`flex h-xl items-center ${RADIUS_BAR} santo-transition-colors ${wash(j)}`}>
                    {bars(j)}
                  </span>
                ))}
              </div>
              {active !== null && !direct && <ChartTooltip x={Math.min(tx, 100)} y={ty} title={xs[active]} rows={rows} mark="rect" />}
              {live}
            </div>
            {yAxis && <AxisLabels labels={ticks.map(formatTick)} className={direct ? "pr-3xl" : ""} />}
          </div>
        </div>
        {table}
      </div>
    );
  }

  const tx = active === null ? 0 : ((active + 0.5) / n) * 100;
  return (
    <Frame
      className={className}
      height={height}
      active={active}
      yTicks={yAxis ? ticks : undefined}
      xLabels={labels}
      xMode="band"
      legend={legendNode}
      table={table}
    >
      <div
        className="relative min-w-0 touch-pan-y"
        style={heightOf(height)}
        {...plotA11y(interactive, label)}
        {...(interactive ? handlers : {})}
      >
        {grid && <ChartGrid lines={ticks.length} />}
        <div className="absolute inset-0 flex">
          {xs.map((_, j) => (
            <span
              key={j}
              className={`flex h-full min-w-0 flex-1 items-end justify-center ${RADIUS_BAR} px-2xs santo-transition-colors ${wash(j)}`}
            >
              {bars(j)}
            </span>
          ))}
        </div>
        {active !== null && <ChartTooltip x={tx} title={xs[active]} rows={rows} mark="rect" />}
        {live}
      </div>
    </Frame>
  );
}

/* ----------------------------------------------------------- donut e pizza */

export type DonutDatum = { name: string; value: number; tone?: ChartTone };
export type DonutSize = "sm" | "md" | "lg";

/** Lado e espessura saem do token; o viewBox tem o lado em px, entao 1 unidade = 1 px. */
const DONUT: Record<DonutSize, { side: string; stroke: string; box: string; value: string }> = {
  sm: { side: resolved["dimension/space/128"], stroke: resolved["dimension/space/12"], box: "size-(--santo-dimension-space-128)", value: "santo-body-semibold" },
  md: { side: resolved["dimension/space/160"], stroke: resolved["dimension/space/16"], box: "size-(--santo-dimension-space-160)", value: "santo-heading-5-bold" },
  lg: { side: resolved["dimension/space/192"], stroke: resolved["dimension/space/24"], box: "size-(--santo-dimension-space-192)", value: "santo-heading-4-bold" },
};
/** Vao entre fatias (space/3xs) e quanto a fatia em foco engorda (border/heavy). */
const SLICE_GAP = parseFloat(resolved["space/3xs"]);
const SLICE_GROW = parseFloat(resolved["border/heavy"]);

/**
 * Donut e pizza: partes de um todo, quando sao poucas (ate 5).
 *
 * Use para composicao com uma parte protagonista (canal que mais vende,
 * categoria que mais gasta). Mais de 5 fatias, ou comparacao fina entre
 * elas, vira BarChart horizontal. `donut` (padrao) poe o total no meio —
 * e, em foco, a fatia; `pie` e o disco cheio, para miniatura. A fatia e o
 * alvo: hover, foco e a legenda engordam a fatia (as outras mantem o tom) e
 * acendem a linha da legenda, que mostra a parte de cada uma (a cor nunca e
 * o unico canal). Ponteiro no furo ou fora do anel volta o centro ao total.
 */
export function DonutChart({
  data,
  variant = "donut",
  size = "md",
  legend = true,
  centerLabel = "Total",
  format = formatValue,
  label,
  interactive = true,
  className = "",
}: {
  data: DonutDatum[];
  variant?: "donut" | "pie";
  size?: DonutSize;
  legend?: boolean;
  /** Rotulo sob o total no meio do donut. */
  centerLabel?: string;
  format?: (v: number) => string;
  label?: string;
  interactive?: boolean;
  className?: string;
}) {
  const { active, setActive, handlers } = useChartCursor(data.length);
  const s = DONUT[size];
  const side = parseFloat(s.side);
  const pie = variant === "pie";
  const stroke = pie ? side / 2 - SLICE_GROW : parseFloat(s.stroke);
  const r = pie ? stroke / 2 : (side - stroke - SLICE_GROW) / 2;
  const c = side / 2;
  const total = data.reduce((a, d) => a + Math.max(0, d.value), 0) || 1;
  const gap = data.length > 1 ? (SLICE_GAP / (2 * Math.PI * r)) * 100 : 0;

  // Inicio de cada fatia = soma das anteriores (em % do anel).
  const lens = data.map((d) => (Math.max(0, d.value) / total) * 100);
  const slices = data.map((d, i) => ({ d, i, len: lens[i], from: lens.slice(0, i).reduce((a, b) => a + b, 0) }));
  const pctOf = (v: number) => `${Math.round((Math.max(0, v) / total) * 100)}%`;
  const focus = active === null ? null : data[active];

  return (
    <div className={`flex flex-wrap items-center gap-lg ${className}`}>
      <div
        className={`relative inline-grid shrink-0 place-items-center ${s.box}`}
        {...plotA11y(interactive, label)}
        {...(interactive
          ? {
              tabIndex: handlers.tabIndex,
              onKeyDown: handlers.onKeyDown,
              onFocus: handlers.onFocus,
              onBlur: handlers.onBlur,
              onPointerLeave: handlers.onPointerLeave,
              // O furo e o canto fora do anel nao sao fatia: o ponteiro ali solta o foco e o centro volta ao total.
              onPointerMove: (e: PointerEvent<HTMLDivElement>) => {
                if ((e.target as Element).tagName.toLowerCase() !== "circle") setActive(null);
              },
            }
          : {})}
      >
        <svg viewBox={`0 0 ${side} ${side}`} className="absolute inset-0 size-full -rotate-90" aria-hidden>
          {slices.map(({ d, i, len, from }) => {
            const dash = Math.max(len - gap, 0);
            return (
              <circle
                key={i}
                cx={c}
                cy={c}
                r={r}
                fill="none"
                stroke="currentColor"
                pathLength={100}
                strokeDasharray={`${dash} ${100 - dash}`}
                strokeDashoffset={-from}
                strokeWidth={active === i ? stroke + SLICE_GROW : stroke}
                pointerEvents="stroke"
                onPointerEnter={interactive ? () => setActive(i) : undefined}
                // Cada fatia guarda o seu tom (ordem fixa CHART_TONES) tambem em foco: recuar as outras
                // para muted deixava tudo cinza quando a fatia ativa era a neutral.
                className={`transition-[stroke-width] duration-(--santo-motion-duration-fast) ease-(--santo-motion-easing-standard) ${
                  TONE[toneAt(i, d.tone)].text
                }`}
              />
            );
          })}
        </svg>
        {!pie && (
          <span className="relative flex flex-col items-center gap-3xs text-center" aria-hidden>
            <span className={`${s.value} text-text-primary tabular-nums`}>{format(focus ? focus.value : total)}</span>
            <span className="santo-caption-medium text-text-tertiary">{focus ? focus.name : centerLabel}</span>
          </span>
        )}
        {interactive && (
          <span className="sr-only" aria-live="polite">
            {focus ? `${focus.name}: ${format(focus.value)} (${pctOf(focus.value)})` : ""}
          </span>
        )}
      </div>
      {legend && (
        <ChartLegend
          layout="column"
          items={data.map((d, i) => ({ name: d.name, tone: toneAt(i, d.tone), value: pctOf(d.value) }))}
          active={active}
          onActiveChange={interactive ? setActive : undefined}
        />
      )}
      <table className="sr-only">
        {label && <caption>{label}</caption>}
        <tbody>
          {data.map((d, i) => (
            <tr key={i}>
              <th scope="row">{d.name}</th>
              <td>{format(d.value)}</td>
              <td>{pctOf(d.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Compatibilidade: as props do LineChart. */
export type ChartProps = TrendProps;
