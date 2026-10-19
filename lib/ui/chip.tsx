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

const DOT: Record<Intent, string> = {
  neutral: "bg-neutral-solid-default",
  brand: "bg-brand-solid-default",
  accent: "bg-accent-solid-default",
  success: "bg-success-solid-default",
  warning: "bg-warning-solid-default",
  danger: "bg-danger-solid-default",
  info: "bg-info-solid-default",
};

export function Tag({
  children,
  intent = "neutral",
  dot,
  className = "",
}: {
  children: ReactNode;
  intent?: Intent;
  /** Ponto da cor da intencao antes do rotulo — estado ao vivo (Pendente, Online). */
  dot?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`santo-caption-semibold inline-flex h-(--santo-dimension-size-24) shrink-0 items-center gap-3xs rounded-full px-xs whitespace-nowrap ${INTENTS[intent]} ${className}`}
    >
      {dot && <span aria-hidden className={`size-2xs shrink-0 rounded-full ${DOT[intent]}`} />}
      {children}
    </span>
  );
}

/**
 * Contador em pilula, a direita de um rotulo (grupo, aba, item de nav, titulo
 * de cartao). `brand` so para o contador que pede atencao (nao lidos); o
 * resto fica neutro (subtle/hover: um degrau acima de surface/sunken, que no
 * claro tem o mesmo tom de subtle/default — senao some no poco). Numero com tabular-nums, largura minima = altura (1
 * digito vira circulo).
 */
export function Count({
  children,
  tone = "neutral",
  className = "",
}: {
  children: ReactNode;
  tone?: "neutral" | "brand";
  className?: string;
}) {
  return (
    <span
      className={`santo-caption-small-semibold inline-flex h-(--santo-dimension-size-20) min-w-(--santo-dimension-size-20) shrink-0 items-center justify-center rounded-full px-2xs tabular-nums ${
        tone === "brand" ? "bg-brand-solid-default text-text-on-brand" : "bg-neutral-subtle-hover text-text-secondary"
      } ${className}`}
    >
      {children}
    </span>
  );
}

export type ChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
  leading?: ReactNode;
  trailing?: ReactNode;
};

/**
 * Pilula clicavel (filtro, aba de editor). Em repouso e tonal (neutral/subtle),
 * nao texto solto; ativa leva o acento brand/subtle. Altura size/32.
 */
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
      className={`santo-body-small-medium inline-flex h-(--santo-dimension-size-32) shrink-0 cursor-pointer items-center gap-2xs rounded-full px-sm whitespace-nowrap santo-press ${
        active
          ? "bg-brand-subtle-default text-text-brand hover:bg-brand-subtle-hover"
          : "bg-neutral-subtle-default text-text-secondary hover:bg-neutral-subtle-hover hover:text-text-primary"
      } ${className}`}
      {...rest}
    >
      {leading}
      {children}
      {trailing}
    </button>
  );
}
