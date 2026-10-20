import type { CSSProperties, ReactNode } from "react";
import { CURSOR_MOTION, TONE, TOOLTIP_CLASS, tooltipAlign, type ChartTone } from "./chart-kit";

export type ChartTooltipRow = {
  /** Nome da serie: vem depois do valor, em texto secundario. */
  name: ReactNode;
  /** Valor ja formatado: e o que a pessoa procura, em destaque. */
  value: ReactNode;
  tone?: ChartTone;
};

/** Chave da serie: traco curto para linha/area, quadradinho para barra e fatia. */
export type ChartKeyMark = "line" | "rect";

function Key({ tone = "brand", mark }: { tone?: ChartTone; mark: ChartKeyMark }) {
  return mark === "line" ? (
    <span aria-hidden className={`h-3xs w-xs shrink-0 rounded-full ${TONE[tone].bg}`} />
  ) : (
    <span aria-hidden className={`size-xs shrink-0 rounded-xs ${TONE[tone].bg}`} />
  );
}

/**
 * Leitura de um ponto do grafico, flutuando sobre ele.
 *
 * Use dentro de um grafico (o pai e `relative`) para mostrar TODAS as series
 * no x em foco — a pessoa nao precisa acertar a linha. Valor na frente, nome
 * depois: aqui ela ja sabe a serie e quer o numero. Texto sempre em token de
 * texto; a identidade vem da chave ao lado. `x` (0–100) posiciona: no alto
 * da plotagem a bolha fica ao lado da guia, com folga de space/sm, e nunca
 * cobre o ponto ativo; sem `x` a bolha fica no fluxo (documentacao).
 */
export function ChartTooltip({
  title,
  rows,
  mark = "line",
  x,
  y,
  placement = "top",
  className = "",
}: {
  /** Rotulo do x em foco: "mar.", "Semana 3". */
  title?: ReactNode;
  rows: ChartTooltipRow[];
  mark?: ChartKeyMark;
  /** Posicao horizontal em % do pai. Sem ela, o tooltip e estatico. */
  x?: number;
  /** Posicao vertical em % do pai (barra horizontal): a bolha fica acima desse ponto. */
  y?: number;
  /** `top`: no alto da area de plotagem (grafico grande); `above`: acima do pai (micro-viz). */
  placement?: "top" | "above";
  className?: string;
}) {
  const floating = x !== undefined;
  const style: CSSProperties | undefined = floating
    ? { left: `${x}%`, ...(y !== undefined && { top: `${y}%` }) }
    : undefined;
  const vertical = y !== undefined ? "-mt-2xs -translate-y-full" : placement === "above" ? "bottom-full mb-2xs" : "top-0";
  // No alto da plotagem a bolha vai ao lado da guia (folga space/sm); acima do pai, centrada.
  const where = floating ? `${vertical} ${tooltipAlign(x, placement === "top" && y === undefined ? "side" : "center")} ${CURSOR_MOTION}` : "relative";
  return (
    <div className={`${TOOLTIP_CLASS} ${where} ${className}`} style={style} aria-hidden>
      {title != null && <span className="santo-caption-medium text-text-tertiary">{title}</span>}
      {rows.map((r, i) => (
        <span key={i} className="flex items-center gap-xs">
          <Key tone={r.tone} mark={mark} />
          <span className="santo-body-small-semibold text-text-primary tabular-nums">{r.value}</span>
          <span className="santo-caption-regular text-text-secondary">{r.name}</span>
        </span>
      ))}
    </div>
  );
}
