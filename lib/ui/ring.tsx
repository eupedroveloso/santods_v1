import type { ReactNode } from "react";
import { resolved } from "@/lib/tokens";

export type RingTone = "current" | "brand" | "accent" | "success" | "warning" | "danger" | "info";
export type RingSize = "sm" | "md" | "lg";

/**
 * Lado e espessura saem do token. O viewBox tem o lado do anel em px, entao uma
 * unidade do SVG e um px e o traco fica exatamente no degrau da escala. A
 * espessura acompanha o lado (~1/8) para o anel pequeno nao virar fio.
 */
const SIZES: Record<RingSize, { side: string; stroke: string; box: string; text: string }> = {
  sm: {
    side: resolved["dimension/size/32"],
    stroke: resolved["border/heavy"],
    box: "size-(--santo-dimension-size-32)",
    text: "santo-caption-small-semibold",
  },
  md: {
    side: resolved["dimension/size/64"],
    stroke: resolved["dimension/space/8"],
    box: "size-(--santo-dimension-size-64)",
    text: "santo-body-small-semibold",
  },
  lg: {
    side: resolved["dimension/space/96"],
    stroke: resolved["dimension/space/12"],
    box: "size-(--santo-dimension-space-96)",
    text: "santo-heading-6-semibold",
  },
};

/** Cor do arco. `current` herda do pai: o anel pinta com o texto em volta. */
const TONE: Record<RingTone, string> = {
  current: "",
  brand: "text-icon-brand",
  accent: "text-icon-accent",
  success: "text-icon-success",
  warning: "text-icon-warning",
  danger: "text-icon-danger",
  info: "text-icon-info",
};

/**
 * Anel de progresso.
 *
 * Use quando a fração cabe num canto — ao lado de um número grande, num tile,
 * na linha de uma lista — e a barra de Progress ocuparia largura demais. Um
 * acento só: o arco leva a cor, a trilha fica em neutral/subtle/active,
 * que segue visível dentro de poço. O rótulo do meio
 * é opcional; no `sm` prefira deixar o número fora do anel.
 */
export function Ring({
  value,
  label,
  size = "md",
  tone = "current",
  children,
  className = "",
}: {
  /** 0 a 100. Fora disso e cortado. */
  value: number;
  /** Rotulo acessivel: "Meta de vendas". */
  label: string;
  size?: RingSize;
  tone?: RingTone;
  /** Conteudo central: "72%", um icone. */
  children?: ReactNode;
  className?: string;
}) {
  const pct = Math.min(100, Math.max(0, value));
  const s = SIZES[size];
  const side = parseFloat(s.side);
  const stroke = parseFloat(s.stroke);
  const r = (side - stroke) / 2;
  const c = side / 2;
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct)}
      className={`relative inline-grid shrink-0 place-items-center ${s.box} ${TONE[tone]} ${className}`}
    >
      <svg viewBox={`0 0 ${side} ${side}`} className="absolute inset-0 size-full -rotate-90" aria-hidden>
        <circle cx={c} cy={c} r={r} fill="none" strokeWidth={stroke} className="stroke-neutral-subtle-active" />
        {pct > 0 && (
          <circle
            cx={c}
            cy={c}
            r={r}
            fill="none"
            stroke="currentColor"
            strokeWidth={stroke}
            strokeLinecap="round"
            // pathLength=100 deixa o dasharray falar em porcentagem.
            pathLength={100}
            strokeDasharray="100 100"
            strokeDashoffset={100 - pct}
            className="transition-[stroke-dashoffset] duration-(--santo-motion-duration-slow) ease-(--santo-motion-easing-standard) motion-reduce:transition-none"
          />
        )}
      </svg>
      {children != null && (
        <span className={`relative text-text-primary tabular-nums ${s.text}`}>{children}</span>
      )}
    </div>
  );
}
