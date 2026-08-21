"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

/**
 * Rotulos curtos: estado, categoria, contagem.
 *
 * `Tag` e estatica; `Chip` e clicavel (filtro, grupo colapsavel). As duas usam
 * o par `color/bg/<intencao>/subtle` + `color/text/<intencao>`, que o Figma ja
 * calibrou para ter contraste suficiente nos dois modos.
 */

export type Intent = "neutral" | "brand" | "accent" | "success" | "warning" | "danger" | "info";

const INTENTS: Record<Intent, string> = {
  neutral: "bg-neutral-subtle-default text-text-secondary",
  brand: "bg-brand-subtle-default text-text-brand",
  accent: "bg-accent-subtle-default text-text-accent",
  success: "bg-success-subtle-default text-text-success",
  warning: "bg-warning-subtle-default text-text-warning",
  danger: "bg-danger-subtle-default text-text-danger",
  info: "bg-info-subtle-default text-text-info",
};

export function Tag({
  children,
  intent = "neutral",
  className = "",
}: {
  children: ReactNode;
  intent?: Intent;
  className?: string;
}) {
  return (
    <span
      className={`santo-caption-semibold inline-flex shrink-0 items-center gap-3xs rounded-full px-xs py-3xs whitespace-nowrap ${INTENTS[intent]} ${className}`}
    >
      {children}
    </span>
  );
}

/** Contador compacto, para aparecer ao lado de um rotulo de grupo. */
export function Count({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`santo-caption-small-medium tabular-nums text-text-tertiary ${className}`}>
      {children}
    </span>
  );
}

export type ChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
  leading?: ReactNode;
  trailing?: ReactNode;
};

/** Pastilha clicavel. Ativa = preenchimento neutro solido, como no alvo. */
export function Chip({
  active,
  leading,
  trailing,
  className = "",
  children,
  type = "button",
  ...rest
}: ChipProps) {
  return (
    <button
      type={type}
      aria-pressed={active}
      className={`santo-body-small-medium inline-flex shrink-0 cursor-pointer items-center gap-2xs rounded-full px-sm py-2xs whitespace-nowrap transition-colors duration-(--santo-motion-duration-fast) ease-(--santo-motion-easing-standard) ${
        active
          ? "bg-brand-subtle-default text-text-brand"
          : "text-text-secondary hover:bg-neutral-subtle-default hover:text-text-primary"
      } ${className}`}
      {...rest}
    >
      {leading}
      {children}
      {trailing}
    </button>
  );
}
