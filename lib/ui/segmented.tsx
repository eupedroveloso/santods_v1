"use client";

import type { ReactNode } from "react";

/**
 * Controle segmentado: escolha unica entre 2 e 4 opcoes visiveis ao mesmo tempo.
 *
 * Prefira a um select quando as opcoes sao poucas e a comparacao entre elas
 * importa — claro/escuro, densidade, escopo.
 */
export type Segment<T extends string> = {
  value: T;
  label: ReactNode;
  /** Rotulo acessivel quando `label` for so um icone. */
  title?: string;
};

export function Segmented<T extends string>({
  value,
  onChange,
  options,
  className = "",
  size = "sm",
}: {
  value: T;
  onChange: (value: T) => void;
  options: Segment<T>[];
  className?: string;
  size?: "sm" | "md";
}) {
  const pad = size === "sm" ? "px-xs py-3xs" : "px-sm py-2xs";
  return (
    <div
      role="radiogroup"
      className={`inline-flex shrink-0 items-center gap-3xs rounded-md border-thin border-border-subtle bg-surface-sunken p-3xs ${className}`}
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            title={o.title}
            aria-label={o.title}
            onClick={() => onChange(o.value)}
            className={`santo-caption-semibold inline-flex cursor-pointer items-center gap-2xs rounded-sm whitespace-nowrap transition-colors duration-(--santo-motion-duration-fast) ease-(--santo-motion-easing-standard) ${pad} ${
              active
                ? "bg-surface-raised text-text-primary shadow-xs"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/** Abas em pastilha, como as do preview no alvo. */
export function TabBar<T extends string>({
  value,
  onChange,
  options,
  className = "",
}: {
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: ReactNode }[];
  className?: string;
}) {
  return (
    <div role="tablist" className={`flex min-w-0 items-center gap-3xs overflow-x-auto ${className}`}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(o.value)}
            className={`santo-body-small-medium shrink-0 cursor-pointer rounded-md px-sm py-2xs whitespace-nowrap transition-colors duration-(--santo-motion-duration-fast) ease-(--santo-motion-easing-standard) ${
              active
                ? "bg-neutral-subtle-active text-text-primary"
                : "text-text-secondary hover:bg-neutral-subtle-default hover:text-text-primary"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
