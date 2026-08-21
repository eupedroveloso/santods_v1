"use client";

import { useState } from "react";

/**
 * Campo numerico com slider.
 *
 * O slider e para explorar — arrastar e ver a interface reagir. O campo e para
 * acertar. Os dois editam o mesmo valor, entao quem sabe o numero digita e quem
 * esta procurando arrasta.
 */
export function NumberField({
  value,
  onChange,
  min,
  max,
  step = 1,
  unit,
  label,
  disabled,
  className = "",
}: {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  /** Sufixo mostrado dentro do campo: px, ms, %. */
  unit?: string;
  label: string;
  disabled?: boolean;
  className?: string;
}) {
  const [draft, setDraft] = useState<string | null>(null);

  return (
    <div className={`flex min-w-0 flex-1 items-center gap-2xs ${className}`}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={Math.min(max, Math.max(min, value))}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        aria-label={`${label} (deslizar)`}
        className="santo-range h-(--santo-dimension-size-28) min-w-0 flex-1"
      />
      <span className="relative flex w-(--santo-dimension-space-88) shrink-0 items-center">
        <input
          type="number"
          value={draft ?? value}
          step={step}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={(e) => {
            setDraft(null);
            const n = Number(e.target.value);
            if (Number.isFinite(n)) onChange(n);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") (e.target as HTMLInputElement).blur();
          }}
          disabled={disabled}
          aria-label={label}
          className={`santo-caption-regular h-(--santo-dimension-size-28) w-full min-w-0 rounded-md border-thin border-border-default bg-input-default text-right font-mono tabular-nums text-text-primary disabled:cursor-not-allowed disabled:border-border-disabled disabled:bg-input-disabled disabled:text-text-disabled ${unit ? "pr-2xl pl-2xs" : "px-2xs"}`}
        />
        {unit && (
          <span className="santo-caption-small-regular pointer-events-none absolute right-2xs text-text-tertiary">
            {unit}
          </span>
        )}
      </span>
    </div>
  );
}
