"use client";

import { useCallback, useState, type KeyboardEvent, type PointerEvent } from "react";

/*
 * Kit dos graficos: escala, curva, ticks, tons de serie, formato de numero e o
 * cursor (ponteiro + teclado). Nao e componente — e o que Sparkline, MiniBars,
 * Ring, os primitivos de grafico (ChartTooltip, ChartLegend, ChartGrid,
 * AxisLabels) e os graficos semanticos dividem, como button-class divide as
 * classes do botao. Por isso nao tem meta e o primitivo pode importar daqui.
 *
 * Specs de marca (skill dataviz): linha border/thick (2px), ponto size-xs com
 * anel border/thick na cor da superficie, barra com no maximo space/24 de
 * espessura e ponta de dado arredondada (base reta), vao de space/3xs entre
 * marcas que se tocam, grade hairline border/subtle, texto sempre em token de
 * texto — nunca na cor da serie.
 */

/* ------------------------------------------------------------------ tons */

/**
 * Tom de serie. A ordem de CHART_TONES e a ordem fixa de atribuicao (nunca
 * ciclada): o protagonista em brand, o resto monocromatico, e so depois as
 * cores de intencao. `muted` e o "resto" — barra fora de destaque, serie que
 * recua quando outra esta em foco.
 *
 * PENDENCIA FIGMA: nao existe paleta categorica de dado (data/series/1..n)
 * nem a validacao de daltonismo dela. Ate existir, as series usam color/icon/*
 * (brand, tertiary, accent, info) e os pares bg/<tom>/subtle/default de lavagem.
 */
export type ChartTone = "brand" | "neutral" | "accent" | "info" | "success" | "warning" | "danger" | "muted";

export const CHART_TONES: ChartTone[] = ["brand", "neutral", "accent", "info", "success", "warning", "danger"];

type ToneClasses = {
  /** Cor da marca via currentColor (SVG stroke/fill="currentColor", bg-current). */
  text: string;
  /** Preenchimento HTML (barra, chave de legenda). */
  bg: string;
  /** Contorno (chave de linha na legenda e no tooltip). */
  border: string;
  /** Lavagem da area: o par subtle do mesmo tom, opaco — sem opacidade solta. */
  wash: string;
};

export const TONE: Record<ChartTone, ToneClasses> = {
  brand: { text: "text-icon-brand", bg: "bg-icon-brand", border: "border-icon-brand", wash: "var(--santo-color-bg-brand-subtle-default)" },
  neutral: { text: "text-icon-tertiary", bg: "bg-icon-tertiary", border: "border-icon-tertiary", wash: "var(--santo-color-bg-neutral-subtle-default)" },
  accent: { text: "text-icon-accent", bg: "bg-icon-accent", border: "border-icon-accent", wash: "var(--santo-color-bg-accent-subtle-default)" },
  info: { text: "text-icon-info", bg: "bg-icon-info", border: "border-icon-info", wash: "var(--santo-color-bg-info-subtle-default)" },
  success: { text: "text-icon-success", bg: "bg-icon-success", border: "border-icon-success", wash: "var(--santo-color-bg-success-subtle-default)" },
  warning: { text: "text-icon-warning", bg: "bg-icon-warning", border: "border-icon-warning", wash: "var(--santo-color-bg-warning-subtle-default)" },
  danger: { text: "text-icon-danger", bg: "bg-icon-danger", border: "border-icon-danger", wash: "var(--santo-color-bg-danger-subtle-default)" },
  muted: {
    text: "text-neutral-subtle-active",
    bg: "bg-neutral-subtle-active",
    border: "border-neutral-subtle-active",
    wash: "var(--santo-color-bg-neutral-subtle-default)",
  },
};

/** Tom da serie i quando ela nao escolheu: ordem fixa, nunca ciclada por posicao no filtro. */
export const toneAt = (i: number, tone?: ChartTone): ChartTone => tone ?? CHART_TONES[i % CHART_TONES.length];

/** Cor da superficie atras do grafico: o anel do ponto recorta nela, sem halo. */
export const SURFACE_RING = {
  raised: "border-surface-raised",
  sunken: "border-surface-sunken",
  page: "border-surface-page",
} as const;
export type ChartSurface = keyof typeof SURFACE_RING;

/* --------------------------------------------------------------- numeros */

const plain = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 });
const compact = new Intl.NumberFormat("pt-BR", { notation: "compact", maximumFractionDigits: 1 });

/** Valor no tooltip e no rotulo direto: 1.234,5. */
export const formatValue = (v: number) => plain.format(v);
/** Tick de eixo: compacto a partir de mil (0 / 1 mil / 2 mil). */
export const formatTick = (v: number) => (Math.abs(v) >= 1000 ? compact.format(v) : plain.format(v));

/** Degrau "redondo" (1, 2, 2,5, 5 x 10^n) mais proximo de um passo bruto. */
function niceStep(raw: number) {
  const pow = 10 ** Math.floor(Math.log10(raw || 1));
  const f = raw / pow;
  return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * pow;
}

/**
 * Ticks igualmente espacados cobrindo [min, max] com numeros redondos. O
 * dominio do grafico e [ticks[0], ticks.at(-1)] — por isso grade e eixo podem
 * ser flex justify-between, sem posicionar nada a mao.
 */
export function niceTicks(min: number, max: number, count = 4) {
  if (min === max) max = min + 1;
  const step = niceStep((max - min) / count);
  const lo = Math.floor(min / step) * step;
  const hi = Math.ceil(max / step) * step;
  const out: number[] = [];
  for (let v = lo; v <= hi + step / 2; v += step) out.push(Number(v.toFixed(10)));
  return out;
}

/* ---------------------------------------------------------------- curvas */

export type Point = { x: number; y: number };

/** Curva suave por Catmull-Rom convertida em Bezier — sem picos duros. */
export function smoothPath(points: Point[]) {
  if (points.length < 2) return "";
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    d += ` C ${p1.x + (p2.x - p0.x) / 6} ${p1.y + (p2.y - p0.y) / 6}, ${p2.x - (p3.x - p1.x) / 6} ${
      p2.y - (p3.y - p1.y) / 6
    }, ${p2.x} ${p2.y}`;
  }
  return d;
}

/** x de 0 a 100 por indice: o primeiro ponto na borda esquerda, o ultimo na direita. */
export const xAt = (i: number, length: number) => (i / (length - 1 || 1)) * 100;

/* ---------------------------------------------------------------- cursor */

/**
 * `point`: o cursor encaixa no ponto mais proximo (linha, area, sparkline).
 * `band`: cada indice e uma faixa de largura igual (barras).
 */
export type CursorMode = "point" | "band";

/**
 * Cursor de grafico: ponteiro e teclado levam ao mesmo indice ativo.
 *
 * O alvo e o grafico inteiro (a faixa toda, nao o pixel da linha): o ponteiro
 * encaixa no indice mais proximo do eixo. No teclado o grafico e UMA parada de
 * Tab; setas andam, Home/End vao as pontas, Esc solta. Ao receber foco, o
 * cursor cai no ultimo valor (o mais recente, o que se procura primeiro).
 */
export function useChartCursor(
  count: number,
  { mode = "point", axis = "x" }: { mode?: CursorMode; axis?: "x" | "y" } = {},
) {
  const [active, setActive] = useState<number | null>(null);

  const fromPointer = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      const r = e.currentTarget.getBoundingClientRect();
      const f = axis === "x" ? (e.clientX - r.left) / (r.width || 1) : (e.clientY - r.top) / (r.height || 1);
      const raw = mode === "band" ? Math.floor(f * count) : Math.round(f * (count - 1));
      setActive(Math.min(count - 1, Math.max(0, raw)));
    },
    [axis, count, mode],
  );

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLElement>) => {
      const next = axis === "x" ? ["ArrowRight", "ArrowDown"] : ["ArrowDown", "ArrowRight"];
      const prev = axis === "x" ? ["ArrowLeft", "ArrowUp"] : ["ArrowUp", "ArrowLeft"];
      let handled = true;
      if (next.includes(e.key)) setActive((a) => Math.min(count - 1, (a ?? -1) + 1));
      else if (prev.includes(e.key)) setActive((a) => Math.max(0, (a ?? count) - 1));
      else if (e.key === "Home") setActive(0);
      else if (e.key === "End") setActive(count - 1);
      else if (e.key === "Escape") setActive(null);
      else handled = false;
      if (handled) e.preventDefault();
    },
    [axis, count],
  );

  return {
    active,
    setActive,
    /** Espalhe no elemento que recebe o ponteiro e o foco (a area de plotagem). */
    handlers: {
      tabIndex: 0,
      onPointerMove: fromPointer,
      onPointerDown: fromPointer,
      onPointerLeave: () => setActive(null),
      onKeyDown,
      onFocus: () => setActive((a) => a ?? count - 1),
      onBlur: () => setActive(null),
    },
  };
}

/* --------------------------------------------------------------- tooltip */

/**
 * Bolha do tooltip: nivel 1 que flutua (raised + shadow-lg + santo-edge), como
 * o painel do Select. Nao intercepta o ponteiro — o alvo continua o grafico.
 */
export const TOOLTIP_CLASS =
  "santo-animate-fade-in pointer-events-none absolute z-(--santo-layer-docked) flex w-max flex-col gap-3xs rounded-lg bg-surface-raised px-sm py-xs shadow-lg santo-edge";

/**
 * Posicao horizontal da bolha. `center` (micro-viz, bolha ACIMA do grafico):
 * centrada, e encostada para dentro nas pontas. `side` (grafico grande, bolha
 * no alto da plotagem): sempre AO LADO da guia, com folga de space/sm — a
 * direita na primeira metade, a esquerda na segunda —, entao nunca cobre o
 * ponto ativo, nem nas pontas.
 */
export function tooltipAlign(xPercent: number, mode: "center" | "side" = "center") {
  if (mode === "side") return xPercent <= 50 ? "ml-sm" : "-ml-sm -translate-x-full";
  if (xPercent < 20) return "";
  if (xPercent > 80) return "-translate-x-full";
  return "-translate-x-1/2";
}

/** Movimento do cursor (guia, ponto, bolha): left/top com duracao e curva de token. */
export const CURSOR_MOTION =
  "transition-[left,top] duration-(--santo-motion-duration-fast) ease-(--santo-motion-easing-standard)";
