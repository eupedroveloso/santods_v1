/**
 * Primitivas de UI montadas so com tokens do SantoDS.
 * Servem as telas de preview do Studio — e de prova de que os tokens
 * sustentam componentes reais, nao so uma grade de swatches.
 */

export function Card({
  children,
  className = "",
  elevation = "sm",
}: {
  children: React.ReactNode;
  className?: string;
  elevation?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
}) {
  return (
    <div
      className={`flex flex-col gap-md rounded-xl border-thin border-border-subtle bg-surface-raised p-lg ${className}`}
      style={{ boxShadow: `var(--santo-shadow-${elevation})` }}
    >
      {children}
    </div>
  );
}

export function Button({
  children,
  variant = "primary",
  className = "",
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  className?: string;
}) {
  const styles = {
    primary: "bg-brand-solid-default text-text-on-brand hover:bg-brand-solid-hover",
    secondary:
      "border-thin border-border-default bg-surface-raised text-text-primary hover:bg-neutral-subtle-hover",
    ghost: "text-text-secondary hover:bg-neutral-subtle-hover",
    danger: "bg-danger-solid-default text-text-on-danger hover:bg-danger-solid-hover",
  }[variant];
  return (
    <button
      type="button"
      className={`santo-body-small-semibold cursor-pointer rounded-md px-md py-xs transition-colors ${styles} ${className}`}
      style={{ transitionDuration: "var(--santo-motion-duration-fast)", transitionTimingFunction: "var(--santo-motion-easing-standard)" }}
    >
      {children}
    </button>
  );
}

export function Field({
  label,
  placeholder,
  type = "text",
}: {
  label: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="flex min-w-0 flex-1 flex-col gap-2xs">
      <span className="santo-body-small-medium text-text-primary">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        className="santo-body-regular w-full rounded-md border-thin border-border-default bg-input-default px-sm py-xs text-text-primary placeholder:text-text-placeholder"
      />
    </label>
  );
}

export function Tag({
  children,
  intent = "brand",
}: {
  children: React.ReactNode;
  intent?: "brand" | "success" | "warning" | "danger" | "info" | "accent";
}) {
  const styles = {
    brand: "bg-brand-subtle-default text-text-brand",
    success: "bg-success-subtle-default text-text-success",
    warning: "bg-warning-subtle-default text-text-warning",
    danger: "bg-danger-subtle-default text-text-danger",
    info: "bg-info-subtle-default text-text-info",
    accent: "bg-accent-subtle-default text-text-accent",
  }[intent];
  return (
    <span className={`santo-caption-semibold rounded-full px-xs py-3xs ${styles}`}>{children}</span>
  );
}

/** Grafico de linha em SVG, colorido por token. */
export function Sparkline({ points, className = "" }: { points: number[]; className?: string }) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const span = max - min || 1;
  const path = points
    .map((p, i) => `${(i / (points.length - 1)) * 100},${40 - ((p - min) / span) * 36}`)
    .join(" ");
  return (
    <svg viewBox="0 0 100 40" preserveAspectRatio="none" className={`w-full ${className}`} style={{ height: "var(--santo-dimension-size-64)" }}>
      <polyline
        points={path}
        fill="none"
        stroke="var(--santo-color-icon-brand)"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Bars({ values }: { values: number[] }) {
  const max = Math.max(...values);
  return (
    <div className="flex items-end gap-2xs" style={{ height: "var(--santo-dimension-size-64)" }}>
      {values.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-xs bg-accent-solid-default"
          style={{ height: `${(v / max) * 100}%` }}
        />
      ))}
    </div>
  );
}
