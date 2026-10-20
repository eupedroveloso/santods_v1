"use client";

import { useId } from "react";
import { resolved } from "@/lib/tokens";
import { CURSOR_MOTION, SURFACE_RING, TOOLTIP_CLASS, formatValue, smoothPath, tooltipAlign, useChartCursor } from "./chart-kit";

export type SparklineSize = "sm" | "md" | "lg";

/** Altura pelo token; o viewBox usa a mesma altura em px, entao o eixo y nao distorce. */
const HEIGHT: Record<SparklineSize, { px: string; box: string }> = {
  sm: { px: resolved["dimension/size/24"], box: "h-(--santo-dimension-size-24)" },
  md: { px: resolved["dimension/size/40"], box: "h-(--santo-dimension-size-40)" },
  lg: { px: resolved["dimension/size/64"], box: "h-(--santo-dimension-size-64)" },
};

/**
 * Largura padrao por tamanho (space/64, 96, 128): num slot sem largura (o
 * `viz` do Stat e flex shrink-0) uma linha w-full colapsava para 0px e so o
 * ponto aparecia. `fluid` volta a ocupar a largura do pai.
 */
const WIDTH: Record<SparklineSize, string> = {
  sm: "w-(--santo-dimension-space-64)",
  md: "w-(--santo-dimension-space-96)",
  lg: "w-(--santo-dimension-space-128)",
};

const STROKE = parseFloat(resolved["border/thick"]);

/**
 * Linha de tendência sem eixo, do tamanho de uma linha de texto.
 *
 * Use colada num número grande (Stat, linha de tabela, tile) para dizer "subindo
 * ou caindo" sem pedir leitura de gráfico. Pinta com currentColor: a cor vem do
 * pai. `area` põe um degradê do mesmo tom até transparente; `dot` marca o valor
 * atual na ponta. Para gráfico de verdade, com eixo e grade, use chart.tsx.
 *
 * Com `label` ela vira interativa: o ponteiro (ou as setas, com foco) anda
 * pelos pontos, o ponto acompanha e uma bolha acima mostra o valor e o
 * rótulo do x (`labels`). Leitor de tela ouve o ponto em foco (aria-live).
 * `interactive={false}` desliga numa linha de tabela densa.
 */
export function Sparkline({
  values,
  size = "md",
  area = false,
  dot = true,
  label,
  fluid = false,
  surface = "raised",
  labels,
  format = formatValue,
  interactive,
  className = "",
}: {
  values: number[];
  size?: SparklineSize;
  area?: boolean;
  dot?: boolean;
  /** Rotulo acessivel ("Receita, 12 meses"). Sem ele a linha e decorativa. */
  label?: string;
  /** Ocupa a largura do pai (grafico de cartao inteiro) em vez da largura do tamanho. */
  fluid?: boolean;
  /** Fundo atras da linha: o anel do ponto final recorta nessa cor, sem halo. */
  surface?: keyof typeof SURFACE_RING;
  /** Rotulo de cada ponto no tooltip: ["jan", "fev", …]. */
  labels?: string[];
  /** Formata o valor no tooltip. */
  format?: (v: number) => string;
  /** Hover e teclado. Padrao: ligado quando ha `label`. */
  interactive?: boolean;
  className?: string;
}) {
  const gradient = useId();
  const live = interactive ?? Boolean(label);
  const { active, handlers } = useChartCursor(values.length);
  const h = parseFloat(HEIGHT[size].px);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = max - min || 1;
  // Folga em cima e embaixo do tamanho do traco, para a curva nao cortar na borda.
  const pad = STROKE;
  const pts = values.map((v, i) => ({
    x: (i / (values.length - 1 || 1)) * 100,
    y: pad + (1 - (v - min) / span) * (h - pad * 2),
  }));
  const line = smoothPath(pts);
  const last = pts[pts.length - 1];
  const at = active === null ? last : pts[active];

  return (
    <div
      className={`relative shrink-0 ${fluid ? "w-full" : WIDTH[size]} ${HEIGHT[size].box} ${className}`}
      role={label ? (live ? "group" : "img") : undefined}
      aria-roledescription={live ? "gráfico" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      {...(live ? handlers : {})}
    >
      <svg viewBox={`0 0 100 ${h}`} preserveAspectRatio="none" className="absolute inset-0 size-full overflow-visible">
        {area && (
          <>
            <defs>
              {/* PENDENCIA: o Figma reestruturado tem opacity/*; quando o sync sair, troque 0.24 e 0 pelos tokens. */}
              <linearGradient id={gradient} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="currentColor" stopOpacity={0.24} />
                <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
              </linearGradient>
            </defs>
            <path d={`${line} L 100 ${h} L 0 ${h} Z`} fill={`url(#${gradient})`} />
          </>
        )}
        <path
          d={line}
          fill="none"
          stroke="currentColor"
          strokeWidth={STROKE}
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {(dot || active !== null) && at && (
        // Ponto em HTML: num SVG esticado um <circle> viraria elipse.
        <span
          aria-hidden
          className={`pointer-events-none absolute size-xs -translate-x-1/2 -translate-y-1/2 rounded-full border-thick bg-current ${SURFACE_RING[surface]} ${CURSOR_MOTION}`}
          style={{ left: `${at.x}%`, top: `${(at.y / h) * 100}%` }}
        />
      )}
      {active !== null && (
        <span
          aria-hidden
          className={`${TOOLTIP_CLASS} bottom-full mb-2xs ${tooltipAlign(pts[active].x)} ${CURSOR_MOTION}`}
          style={{ left: `${pts[active].x}%` }}
        >
          {labels?.[active] && <span className="santo-caption-medium text-text-tertiary">{labels[active]}</span>}
          <span className="santo-body-small-semibold text-text-primary tabular-nums">{format(values[active])}</span>
        </span>
      )}
      {live && (
        <span className="sr-only" aria-live="polite">
          {active === null ? "" : `${labels?.[active] ? `${labels[active]}: ` : ""}${format(values[active])}`}
        </span>
      )}
    </div>
  );
}
