"use client";

import type { ReactNode } from "react";
import { ChevronDown, ChevronRight } from "./icons";
import { Count } from "./chip";

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
  count,
  badge,
  hint,
  children,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
  /** Quantos tokens o grupo tem. */
  count?: number;
  /** Quantos foram alterados — aparece so quando ha algum. */
  badge?: number;
  hint?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2xs">
      <div className="flex items-center gap-2xs">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          className="santo-caption-small-semibold inline-flex cursor-pointer items-center gap-2xs rounded-full bg-neutral-subtle-default px-xs py-3xs tracking-wide text-text-secondary uppercase transition-colors duration-(--santo-motion-duration-fast) hover:bg-neutral-subtle-hover hover:text-text-primary"
        >
          {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          {label}
        </button>
        {badge ? (
          <span className="santo-caption-small-semibold rounded-full bg-accent-subtle-default px-2xs text-text-accent">
            {badge}
          </span>
        ) : null}
        {count !== undefined && <Count className="ml-auto">{count}</Count>}
      </div>

      {open && (
        <div className="flex flex-col gap-2xs pb-xs">
          {hint && <p className="santo-caption-small-regular text-text-tertiary">{hint}</p>}
          {children}
        </div>
      )}
    </div>
  );
}
