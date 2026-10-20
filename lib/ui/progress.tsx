import type { Intent } from "./chip";
import { RADIUS_BAR } from "./radius";

type ProgressIntent = Exclude<Intent, "neutral">;

const FILL: Record<ProgressIntent, string> = {
  brand: "bg-brand-solid-default",
  accent: "bg-accent-solid-default",
  success: "bg-success-solid-default",
  warning: "bg-warning-solid-default",
  danger: "bg-danger-solid-default",
  info: "bg-info-solid-default",
};

const HEIGHT = { sm: "h-2xs", md: "h-xs" } as const;

/**
 * Barra de progresso horizontal.
 *
 * Use para quanto de uma meta ja foi cumprido (meta, cota, etapa de upload).
 * Para valor que nao tem teto, use um numero com Stat — barra sem fim nao diz
 * nada. A intencao muda a cor do preenchimento: brand no geral, success quando
 * chegar la e bom, danger quando chegar la e ruim (cota estourando).
 */
export function Progress({
  value,
  label,
  intent = "brand",
  size = "sm",
  className = "",
}: {
  /** 0 a 100. Fora disso e cortado. */
  value: number;
  /** Rotulo acessivel: "Meta de vendas". */
  label: string;
  intent?: ProgressIntent;
  size?: keyof typeof HEIGHT;
  className?: string;
}) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct)}
      className={`w-full overflow-hidden ${RADIUS_BAR} bg-neutral-subtle-default ${HEIGHT[size]} ${className}`}
    >
      <div
        className={`h-full ${RADIUS_BAR} transition-[width] duration-(--santo-motion-duration-normal) ease-(--santo-motion-easing-standard) ${FILL[intent]}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
