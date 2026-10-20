"use client";

import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import { Search } from "./icons";
import type { ControlSize } from "./button";
import { RADIUS_CONTROL } from "./radius";

/**
 * Campos de entrada do SantoDS.
 *
 * `variant`:
 *   well     (padrao) POCO: surface/sunken, sem contorno em repouso, pastilha
 *            (1 linha) — campo dentro de cartao (skill santo-ui-craft, secao 9).
 *   outline  contorno border/default sobre bg/input, raio md: formulario longo
 *            sobre o chao, onde o poco nao se destacaria.
 * Foco nos dois: anel brand/subtle + borda brand. Placeholder em
 * color/text/placeholder.
 */

export type FieldVariant = "well" | "outline";

const LOOK: Record<FieldVariant, { box: string; idle: string }> = {
  well: { box: `${RADIUS_CONTROL} bg-surface-sunken`, idle: "border-transparent hover:bg-neutral-subtle-default" },
  outline: { box: `${RADIUS_CONTROL} bg-input-default`, idle: "border-border-default hover:border-border-strong" },
};

const SIZES: Record<ControlSize, string> = {
  sm: "h-(--santo-dimension-size-32) px-xs santo-caption-regular",
  md: "h-(--santo-dimension-size-40) px-sm santo-body-small-regular",
  lg: "h-(--santo-dimension-size-48) px-md santo-body-regular",
};

const BASE =
  "santo-focus-field w-full min-w-0 border-thin text-text-primary placeholder:text-text-placeholder transition-colors duration-(--santo-motion-duration-fast) ease-(--santo-motion-easing-standard) disabled:cursor-not-allowed disabled:border-border-disabled disabled:bg-input-disabled disabled:text-text-disabled";

// `size` do HTML e numerico; o nosso e a escala de controle, entao substituimos.
export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  size?: ControlSize;
  /** Pinta a borda de perigo e liga aria-invalid. */
  invalid?: boolean;
  /** Usa fonte mono — bom para hex, medidas e nomes de token. */
  mono?: boolean;
  variant?: FieldVariant;
};

export function Input({ size = "md", invalid, mono, variant = "well", className = "", ...rest }: InputProps) {
  return (
    <input
      aria-invalid={invalid || undefined}
      className={`${BASE} ${LOOK[variant].box} ${SIZES[size]} ${invalid ? "border-border-danger" : LOOK[variant].idle} ${mono ? "font-mono" : ""} ${className}`}
      {...rest}
    />
  );
}

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean; variant?: FieldVariant };

/** Multilinha: poco ou contorno, com o raio de controle — irmao do Input de uma linha (mesmo degrau). */
export function Textarea({ invalid, variant = "well", className = "", rows = 3, ...rest }: TextareaProps) {
  return (
    <textarea
      rows={rows}
      aria-invalid={invalid || undefined}
      className={`${BASE} ${variant === "well" ? `${RADIUS_CONTROL} bg-surface-sunken` : LOOK.outline.box} santo-body-small-regular px-sm py-xs ${invalid ? "border-border-danger" : LOOK[variant].idle} ${className}`}
      {...rest}
    />
  );
}

/** Input com o icone de busca embutido. */
export function SearchInput({ size = "md", className = "", ...rest }: InputProps) {
  return (
    <div className="relative flex min-w-0 flex-1 items-center">
      <span className="pointer-events-none absolute left-sm text-text-tertiary">
        <Search size={16} />
      </span>
      <Input size={size} className={`pl-3xl ${className}`} {...rest} />
    </div>
  );
}

export type FieldProps = {
  label: string;
  /** Texto de apoio abaixo do campo. */
  hint?: ReactNode;
  /** Substitui o hint e pinta tudo de perigo. */
  error?: ReactNode;
  /** Marca o campo como opcional no rotulo. */
  optional?: boolean;
  children: ReactNode;
  className?: string;
};

/** Rotulo + campo + apoio, com o espacamento certo entre eles. */
export function Field({ label, hint, error, optional, children, className = "" }: FieldProps) {
  return (
    <label className={`flex min-w-0 flex-col gap-2xs ${className}`}>
      <span className="flex items-baseline gap-2xs">
        <span className="santo-body-small-medium text-text-primary">{label}</span>
        {optional && <span className="santo-caption-regular text-text-tertiary">opcional</span>}
      </span>
      {children}
      {error ? (
        <span className="santo-caption-regular text-text-danger">{error}</span>
      ) : hint ? (
        <span className="santo-caption-regular text-text-tertiary">{hint}</span>
      ) : null}
    </label>
  );
}
