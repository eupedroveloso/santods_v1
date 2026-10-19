"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { buttonClass, type ButtonVariant, type ControlSize } from "./button-class";

export type { ButtonVariant, ControlSize };

/**
 * Botao do SantoDS.
 *
 * Altura vem de `dimension/size/*`, preenchimento de `space/*`, cor de
 * `color/bg/*` + `color/text/on-*`, transicao de `motion/*`. Nenhum valor solto.
 *
 * Escolha da variante:
 *   primary    a acao principal da tela. No maximo uma por area.
 *   secondary  acoes de apoio: pilula elevada (raised + sombra curta).
 *   ghost      acoes de barra de ferramentas, onde contorno viraria ruido.
 *   danger     acao destrutiva, sempre com rotulo explicito do que sera perdido.
 *   subtle     preenchimento suave, para segmentos e estados selecionados.
 */

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
  /** Pilula (radius/full) e o padrao; `pill={false}` da o retangulo radius/md. */
  pill?: boolean;
};

export function Button({
  variant = "secondary",
  size = "md",
  leading,
  trailing,
  block,
  pill,
  className = "",
  children,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`${buttonClass({ variant, size, block, pill })} ${className}`}
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

/** Botao so com icone: circulo por padrao, quadrado com `pill={false}`. O `label` vira aria-label e title. */
export function IconButton({
  variant = "ghost",
  size = "md",
  label,
  pill,
  className = "",
  children,
  type = "button",
  ...rest
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={`${buttonClass({ variant, size, icon: true, pill })} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
