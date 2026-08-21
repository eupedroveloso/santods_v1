"use client";

import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import { Search } from "./icons";
import type { ControlSize } from "./button";

/**
 * Campos de entrada do SantoDS.
 *
 * Todo campo tem borda `color/border/default`, fundo `color/bg/input/*` e
 * placeholder em `color/text/placeholder` — os tres tokens existem justamente
 * para isso e nao devem ser trocados por cinzas avulsos.
 */

const SIZES: Record<ControlSize, string> = {
  sm: "h-(--santo-dimension-size-32) px-xs santo-caption-regular",
  md: "h-(--santo-dimension-size-40) px-sm santo-body-small-regular",
  lg: "h-(--santo-dimension-size-48) px-md santo-body-regular",
};

const BASE =
  "w-full min-w-0 rounded-md border-thin bg-input-default text-text-primary placeholder:text-text-placeholder transition-colors duration-(--santo-motion-duration-fast) ease-(--santo-motion-easing-standard) disabled:cursor-not-allowed disabled:border-border-disabled disabled:bg-input-disabled disabled:text-text-disabled";

// `size` do HTML e numerico; o nosso e a escala de controle, entao substituimos.
export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  size?: ControlSize;
  /** Pinta a borda de perigo e liga aria-invalid. */
  invalid?: boolean;
  /** Usa fonte mono — bom para hex, medidas e nomes de token. */
  mono?: boolean;
};

export function Input({ size = "md", invalid, mono, className = "", ...rest }: InputProps) {
  return (
    <input
      aria-invalid={invalid || undefined}
      className={`${BASE} ${SIZES[size]} ${invalid ? "border-border-danger" : "border-border-default hover:border-border-strong"} ${mono ? "font-mono" : ""} ${className}`}
      {...rest}
    />
  );
}

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean };

export function Textarea({ invalid, className = "", rows = 3, ...rest }: TextareaProps) {
  return (
    <textarea
      rows={rows}
      aria-invalid={invalid || undefined}
      className={`${BASE} santo-body-small-regular px-sm py-xs ${invalid ? "border-border-danger" : "border-border-default hover:border-border-strong"} ${className}`}
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
      <Input size={size} className={`rounded-full pl-3xl ${className}`} {...rest} />
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
