"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

/**
 * Botao do SantoDS.
 *
 * Altura vem de `dimension/size/*`, preenchimento de `space/*`, cor de
 * `color/bg/*` + `color/text/on-*`, transicao de `motion/*`. Nenhum valor solto.
 *
 * Escolha da variante:
 *   primary    a acao principal da tela. No maximo uma por area.
 *   secondary  acoes de apoio que precisam de contorno.
 *   ghost      acoes de barra de ferramentas, onde contorno viraria ruido.
 *   danger     acao destrutiva, sempre com rotulo explicito do que sera perdido.
 *   subtle     preenchimento suave, para segmentos e estados selecionados.
 */

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "subtle";
export type ControlSize = "sm" | "md" | "lg";

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-solid-default text-text-on-brand hover:bg-brand-solid-hover active:bg-brand-solid-active",
  secondary:
    "border-thin border-border-default bg-surface-raised text-text-primary hover:bg-neutral-subtle-default active:bg-neutral-subtle-hover",
  ghost: "text-text-secondary hover:bg-neutral-subtle-default hover:text-text-primary active:bg-neutral-subtle-hover",
  danger:
    "bg-danger-solid-default text-text-on-danger hover:bg-danger-solid-hover active:bg-danger-solid-active",
  subtle:
    "bg-neutral-subtle-default text-text-primary hover:bg-neutral-subtle-hover active:bg-neutral-subtle-active",
};

const SIZES: Record<ControlSize, { box: string; text: string; gap: string }> = {
  sm: { box: "h-(--santo-dimension-size-32) px-sm", text: "santo-caption-semibold", gap: "gap-2xs" },
  md: { box: "h-(--santo-dimension-size-40) px-md", text: "santo-body-small-semibold", gap: "gap-xs" },
  lg: { box: "h-(--santo-dimension-size-48) px-lg", text: "santo-body-semibold", gap: "gap-xs" },
};

const MOTION =
  "transition-colors duration-(--santo-motion-duration-fast) ease-(--santo-motion-easing-standard)";

const DISABLED =
  "disabled:cursor-not-allowed disabled:bg-disabled disabled:text-text-disabled disabled:border-border-disabled disabled:hover:bg-disabled";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ControlSize;
  /** Icone antes do rotulo. Use os componentes de lib/ui/icons. */
  leading?: ReactNode;
  trailing?: ReactNode;
  /**
   * Ocupa toda a largura do container.
   *
   * Dentro de uma linha flex com mais de um botao, NAO use `block` — dois
   * `w-full` na mesma linha se empurram e transbordam. Use `className="flex-1"`,
   * que reparte a largura.
   */
  block?: boolean;
};

export function Button({
  variant = "secondary",
  size = "md",
  leading,
  trailing,
  block,
  className = "",
  children,
  type = "button",
  ...rest
}: ButtonProps) {
  const s = SIZES[size];
  return (
    <button
      type={type}
      className={`inline-flex shrink-0 cursor-pointer items-center justify-center rounded-md whitespace-nowrap ${s.box} ${s.text} ${s.gap} ${VARIANTS[variant]} ${MOTION} ${DISABLED} ${block ? "w-full min-w-0" : ""} ${className}`}
      {...rest}
    >
      {leading}
      {children}
      {trailing}
    </button>
  );
}

export type IconButtonProps = Omit<ButtonProps, "leading" | "trailing" | "block"> & {
  /** Obrigatorio: o botao nao tem rotulo visivel. */
  label: string;
};

/** Botao quadrado so com icone. O `label` vira aria-label e title. */
export function IconButton({
  variant = "ghost",
  size = "md",
  label,
  className = "",
  children,
  type = "button",
  ...rest
}: IconButtonProps) {
  const box = { sm: "size-(--santo-dimension-size-32)", md: "size-(--santo-dimension-size-40)", lg: "size-(--santo-dimension-size-48)" }[size];
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={`inline-flex shrink-0 cursor-pointer items-center justify-center rounded-md ${box} ${VARIANTS[variant]} ${MOTION} ${DISABLED} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
