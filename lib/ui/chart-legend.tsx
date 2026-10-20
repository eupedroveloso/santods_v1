"use client";

import type { ReactNode } from "react";
import { TONE, type ChartTone } from "./chart-kit";
import { RADIUS_BAR, RADIUS_CONTROL } from "./radius";

export type ChartLegendItem = {
  name: ReactNode;
  tone?: ChartTone;
  /** Valor ao lado do nome (total da fatia, ultimo valor da serie). */
  value?: ReactNode;
};

/** A chave espelha a marca: traco para linha, quadradinho para barra/area/fatia. */
export type ChartLegendMark = "line" | "rect";

/**
 * Legenda de grafico: qual cor e qual serie.
 *
 * Obrigatoria com duas ou mais series (a cor nunca e o unico canal); com uma
 * so, o titulo do cartao ja diz o que e — nao ponha legenda. Fica ACIMA do
 * grafico, alinhada a esquerda (`row`), ou ao lado do donut com valores
 * (`column`). Com `onActiveChange`, passar o ponteiro ou o foco num item
 * destaca a serie no grafico e recua as outras. Texto em token de texto,
 * nunca na cor da serie.
 */
export function ChartLegend({
  items,
  mark = "rect",
  layout = "row",
  active = null,
  onActiveChange,
  className = "",
}: {
  items: ChartLegendItem[];
  mark?: ChartLegendMark;
  layout?: "row" | "column";
  /** Indice destacado (vem do grafico). */
  active?: number | null;
  onActiveChange?: (index: number | null) => void;
  className?: string;
}) {
  const interactive = Boolean(onActiveChange);
  return (
    <ul
      // column: largura do conteudo (w-fit) — as linhas esticam ate a mais larga e os valores alinham
      // a direita dela, sem a legenda esticar ate a borda do pai.
      className={`flex ${layout === "row" ? "flex-wrap items-center gap-x-md gap-y-2xs" : "w-fit flex-col gap-2xs"} ${className}`}
      onPointerLeave={interactive ? () => onActiveChange?.(null) : undefined}
    >
      {items.map((it, i) => {
        const tone = it.tone ?? "brand";
        const dim = active !== null && active !== i;
        const key =
          mark === "line" ? (
            <span aria-hidden className={`h-3xs w-sm shrink-0 ${RADIUS_BAR} santo-transition-colors ${TONE[dim ? "muted" : tone].bg}`} />
          ) : (
            <span aria-hidden className={`size-xs shrink-0 ${RADIUS_BAR} santo-transition-colors ${TONE[dim ? "muted" : tone].bg}`} />
          );
        const body = (
          <>
            {key}
            <span
              className={`santo-caption-medium santo-transition-colors ${dim ? "text-text-tertiary" : "text-text-secondary"}`}
            >
              {it.name}
            </span>
            {it.value != null && (
              <span className={`santo-body-small-semibold text-text-primary tabular-nums ${layout === "column" ? "ml-auto pl-md" : ""}`}>
                {it.value}
              </span>
            )}
          </>
        );
        return (
          <li key={i} className={layout === "column" ? "flex" : "inline-flex"}>
            {interactive ? (
              <button
                type="button"
                className={`flex min-w-0 flex-1 items-center gap-xs ${RADIUS_CONTROL} ${layout === "column" ? "py-3xs" : ""}`}
                aria-pressed={active === i}
                onPointerEnter={() => onActiveChange?.(i)}
                onFocus={() => onActiveChange?.(i)}
                onBlur={() => onActiveChange?.(null)}
              >
                {body}
              </button>
            ) : (
              <span className={`flex min-w-0 flex-1 items-center gap-xs ${layout === "column" ? "py-3xs" : ""}`}>{body}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
