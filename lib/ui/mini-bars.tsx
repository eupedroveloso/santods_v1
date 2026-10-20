"use client";

import { CURSOR_MOTION, TOOLTIP_CLASS, formatValue, tooltipAlign, useChartCursor } from "./chart-kit";

export type MiniBarsSize = "sm" | "md" | "lg";

const HEIGHT: Record<MiniBarsSize, string> = {
  sm: "h-(--santo-dimension-size-24)",
  md: "h-(--santo-dimension-size-40)",
  lg: "h-(--santo-dimension-size-64)",
};

/**
 * Largura da barra: fina o bastante para caber ao lado de um número. O min-h
 * igual a largura faz o menor valor virar um ponto redondo em vez de sumir.
 */
const WIDTH: Record<MiniBarsSize, string> = {
  sm: "w-2xs min-h-2xs",
  md: "w-xs min-h-xs",
  lg: "w-sm min-h-sm",
};

/**
 * Barrinhas verticais compactas, sem eixo.
 *
 * Use para volume por período ao lado de um número (pedidos na semana, acessos
 * por hora). Monocromático: as barras ficam em neutral/subtle/active (separa
 * até dentro de poço) e só a destacada leva a cor do pai (currentColor) — o
 * hoje, o pico, o período selecionado. Sem `highlight`, todas pintam com a cor
 * do pai. Raio cheio: barra baixa vira ponto, não lasca. Sem transição de altura: vai em linha de tabela, e animar height
 * em N linhas x 7 barras é reflow em cascata.
 *
 * Com `label` ela vira interativa: a barra sob o ponteiro (ou a das setas,
 * com foco) acende na cor do pai, as outras recuam, e uma bolha acima mostra
 * o valor e o rótulo (`labels`). O leitor de tela ouve a barra em foco.
 */
export function MiniBars({
  values,
  highlight,
  size = "md",
  label,
  labels,
  format = formatValue,
  interactive,
  className = "",
}: {
  values: number[];
  /** Indice da barra em destaque. Negativo conta do fim: -1 e a ultima. */
  highlight?: number;
  size?: MiniBarsSize;
  /** Rotulo acessivel ("Pedidos, ultimos 7 dias"). Sem ele e decorativo. */
  label?: string;
  /** Rotulo de cada barra no tooltip: ["seg", "ter", …]. */
  labels?: string[];
  format?: (v: number) => string;
  /** Hover e teclado. Padrao: ligado quando ha `label`. */
  interactive?: boolean;
  className?: string;
}) {
  const live = interactive ?? Boolean(label);
  const { active, handlers } = useChartCursor(values.length, { mode: "band" });
  const max = Math.max(...values) || 1;
  const fixed = highlight === undefined ? undefined : highlight < 0 ? values.length + highlight : highlight;
  // Em foco, a barra ativa toma o lugar do destaque fixo.
  const hi = active ?? fixed;
  const x = active === null ? 0 : ((active + 0.5) / values.length) * 100;
  return (
    <div
      className={`relative inline-flex items-end gap-2xs ${HEIGHT[size]} ${className}`}
      role={label ? (live ? "group" : "img") : undefined}
      aria-roledescription={live ? "gráfico" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      {...(live ? handlers : {})}
    >
      {values.map((v, i) => (
        <span
          key={i}
          className={`shrink-0 rounded-full santo-transition-colors ${WIDTH[size]} ${
            hi === undefined || hi === i ? "bg-current" : "bg-neutral-subtle-active"
          }`}
          style={{ height: `${(Math.max(v, 0) / max) * 100}%` }}
        />
      ))}
      {active !== null && (
        <span
          aria-hidden
          className={`${TOOLTIP_CLASS} bottom-full mb-2xs ${tooltipAlign(x)} ${CURSOR_MOTION}`}
          style={{ left: `${x}%` }}
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
