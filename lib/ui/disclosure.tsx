"use client";

import type { ReactNode } from "react";
import { ChevronDown, ChevronRight } from "./icons";

/**
 * Grupo colapsavel do editor.
 *
 * O gatilho e uma pastilha que abraca o proprio rotulo — nao uma linha de
 * largura total. Isso mantem a coluna de grupos legivel quando ha dezenas
 * deles empilhados, que e exatamente o caso das 12 famílias de cor.
 */
export function Disclosure({
  label,
  open,
  onToggle,
  trailing,
  hint,
  variant = "pill",
  id,
  children,
}: {
  /** Rotulo do gatilho. Texto ou composicao (nome + amostra). */
  label: ReactNode;
  open: boolean;
  onToggle: () => void;
  /**
   * Canto direito da linha do gatilho: contador, Tag de alterados. Slot, e nao
   * prop de numero, porque primitivo nao importa outro componente da lib —
   * quem quer contador passa <Count />.
   */
  trailing?: ReactNode;
  hint?: ReactNode;
  /**
   * pill: gatilho em pastilha que abraca o rotulo (grupos empilhados de editor).
   * row: a linha inteira e o gatilho — lista dentro de um Card padded={false},
   * com divisoria entre itens (o ultimo nao tem); os cantos vem do Card.
   */
  variant?: "pill" | "row";
  /** id da raiz, para ancora (use com scroll-mt-6xl). */
  id?: string;
  children: ReactNode;
}) {
  if (variant === "row") {
    return (
      <div id={id} className="scroll-mt-6xl border-b-thin border-border-subtle last:border-b-0">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          className="flex w-full cursor-pointer items-center gap-sm p-lg text-left transition-colors ease-(--santo-motion-easing-standard) duration-(--santo-motion-duration-fast) hover:bg-neutral-subtle-default"
          // Foco por dentro da linha: o Card recorta (overflow-hidden) o que passar da borda.
          style={{ outlineOffset: "calc(var(--santo-focus-width) * -1)" }}
        >
          <span className="shrink-0 text-icon-tertiary">
            {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </span>
          <span className="min-w-0 flex-1">{label}</span>
          {trailing && <span className="flex shrink-0 items-center gap-2xs">{trailing}</span>}
        </button>
        <div className="santo-collapse" data-open={open} inert={!open}>
          <div>
            <div className="flex flex-col gap-sm px-lg pb-lg">
              {hint && <p className="santo-caption-regular text-text-tertiary">{hint}</p>}
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div id={id} className="flex flex-col gap-2xs">
      <div className="flex items-center gap-2xs">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          className="santo-caption-small-semibold inline-flex cursor-pointer items-center gap-2xs rounded-full bg-neutral-subtle-default px-xs py-3xs tracking-wide text-text-secondary uppercase transition-colors ease-(--santo-motion-easing-standard) duration-(--santo-motion-duration-fast) hover:bg-neutral-subtle-hover hover:text-text-primary"
        >
          {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          {label}
        </button>
        {trailing && <span className="ml-auto flex items-center gap-2xs">{trailing}</span>}
      </div>

      <div className="santo-collapse" data-open={open} inert={!open}>
        <div>
          <div className="flex flex-col gap-2xs pb-xs">
            {hint && <p className="santo-caption-small-regular text-text-tertiary">{hint}</p>}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
