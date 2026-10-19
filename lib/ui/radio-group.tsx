"use client";

import { useRef } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import { RadioMark } from "./toggle";

/**
 * Opcao de escolha unica em forma de cartao: o cartao inteiro e o alvo, o
 * marcador do Radio fica dentro. Marcado = borda brand + fundo selected.
 * Use dentro de RadioGroup, que cuida do teclado.
 */
export function RadioCard({
  checked,
  onSelect,
  children,
  leading,
  disabled,
  tabIndex,
  onKeyDown,
  buttonRef,
}: {
  checked: boolean;
  onSelect: () => void;
  /** Rotulo da opcao. */
  children: ReactNode;
  /** Marcador visual a esquerda do rotulo: icone, amostra. */
  leading?: ReactNode;
  disabled?: boolean;
  tabIndex?: number;
  onKeyDown?: (e: KeyboardEvent<HTMLButtonElement>) => void;
  buttonRef?: (el: HTMLButtonElement | null) => void;
}) {
  return (
    <button
      ref={buttonRef}
      type="button"
      role="radio"
      aria-checked={checked}
      disabled={disabled}
      tabIndex={tabIndex}
      onClick={onSelect}
      onKeyDown={onKeyDown}
      // Selecionado ELEVA por tom (raised + shadow-xs + hairline), sobre o poco
      // dos nao selecionados; o brand fica so na marca do radio (skill
      // santo-ui-craft, secao 4). Raio limitado ao interno do Card pai.
      className={`santo-focus-field santo-transition-elevation flex cursor-pointer items-center gap-xs border-thin p-sm text-left disabled:cursor-not-allowed disabled:opacity-60 ${
        checked
          ? "border-border-subtle bg-surface-raised shadow-xs"
          : "border-transparent bg-surface-sunken hover:bg-neutral-subtle-default"
      }`}
      style={{ borderRadius: "min(var(--santo-radius-lg), var(--santo-card-inner-radius, var(--santo-radius-lg)))" }}
    >
      <RadioMark checked={checked} disabled={disabled} />
      {leading && <span className="shrink-0 text-icon-secondary">{leading}</span>}
      <span className="santo-body-small-medium min-w-0 text-text-primary">{children}</span>
    </button>
  );
}

export type RadioCardOption<T extends string> = {
  value: T;
  label: ReactNode;
  leading?: ReactNode;
  disabled?: boolean;
};

const COLS = { 1: "grid-cols-1", 2: "grid-cols-1 sm:grid-cols-2", 3: "grid-cols-1 sm:grid-cols-3" } as const;

/**
 * Escolha unica entre poucas opcoes que merecem destaque (plano, modo,
 * formato). Teclado de radio de verdade: setas movem e escolhem, so a opcao
 * marcada fica no Tab (tabindex itinerante), Home/End vao as pontas.
 */
export function RadioGroup<T extends string>({
  value,
  onChange,
  options,
  label,
  columns = 2,
  className = "",
}: {
  value: T;
  onChange: (value: T) => void;
  options: RadioCardOption<T>[];
  /** Nome acessivel do grupo. */
  label: string;
  columns?: 1 | 2 | 3;
  className?: string;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const enabled = options.map((o, i) => (o.disabled ? -1 : i)).filter((i) => i >= 0);
  const current = options.findIndex((o) => o.value === value);
  const focusable = current >= 0 && !options[current].disabled ? current : enabled[0];

  const move = (from: number, step: number | "first" | "last") => {
    const pos = enabled.indexOf(from);
    const next =
      step === "first"
        ? enabled[0]
        : step === "last"
          ? enabled[enabled.length - 1]
          : enabled[(pos + step + enabled.length) % enabled.length];
    if (next === undefined) return;
    onChange(options[next].value);
    refs.current[next]?.focus();
  };

  const onKeyDown = (i: number) => (e: KeyboardEvent<HTMLButtonElement>) => {
    const map: Record<string, number | "first" | "last"> = {
      ArrowRight: 1,
      ArrowDown: 1,
      ArrowLeft: -1,
      ArrowUp: -1,
      Home: "first",
      End: "last",
    };
    const step = map[e.key];
    if (step === undefined) return;
    e.preventDefault();
    move(i, step);
  };

  return (
    <div role="radiogroup" aria-label={label} className={`grid gap-sm ${COLS[columns]} ${className}`}>
      {options.map((o, i) => (
        <RadioCard
          key={o.value}
          checked={o.value === value}
          onSelect={() => onChange(o.value)}
          leading={o.leading}
          disabled={o.disabled}
          tabIndex={i === focusable ? 0 : -1}
          onKeyDown={onKeyDown(i)}
          buttonRef={(el) => {
            refs.current[i] = el;
          }}
        >
          {o.label}
        </RadioCard>
      ))}
    </div>
  );
}
