"use client";

import { useState } from "react";
import { RADIUS_CONTROL } from "./radius";

/**
 * Valor numerico com slider de LARGURA TOTAL.
 *
 * O slider e para explorar — arrastar e ver a interface reagir. O valor atual
 * aparece fora da trilha (Pedro: a trilha nao encolhe por causa do numero):
 *   `valueLabel="above"` (padrao): rotulo flutuante ACIMA do punho, que acompanha
 *     a posicao e nunca vaza nas pontas (translate proporcional ao valor).
 *   `valueLabel="below"`: linha abaixo da trilha com min a esquerda, valor ao
 *     centro e max a direita.
 *   `valueLabel="none"`: so a trilha (o valor ja aparece em outro lugar, ex. Stat).
 * `field`: campo para digitar o numero exato, numa linha PROPRIA abaixo (nunca ao
 * lado da trilha). Teclado: setas/PageUp/PageDown/Home/End no range nativo.
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
  valueLabel = "above",
  field = false,
  format = (n: number) => n.toLocaleString("pt-BR"),
  className = "",
}: {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  /** Sufixo do valor: px, ms, %. */
  unit?: string;
  label: string;
  disabled?: boolean;
  /** Onde mostrar o valor atual: acima do punho (padrao), abaixo com min/max, ou nenhum. */
  valueLabel?: "above" | "below" | "none";
  /** Campo numerico editavel, numa linha propria abaixo da trilha. */
  field?: boolean;
  /** Como escrever o valor nos rotulos. */
  format?: (n: number) => string;
  className?: string;
}) {
  const [draft, setDraft] = useState<string | null>(null);
  const clamped = Math.min(max, Math.max(min, value));
  const p = max > min ? (clamped - min) / (max - min) : 0;
  const text = (n: number) => `${format(n)}${unit ? ` ${unit}` : ""}`;

  return (
    <div className={`flex min-w-0 flex-1 flex-col gap-2xs ${className}`}>
      <div className={`relative ${valueLabel === "above" ? "pt-lg" : ""}`}>
        {valueLabel === "above" && (
          // Centro do punho: metade do punho (space/8) + (trilha − punho) × p.
          // translateX(−p × 100%): na ponta esquerda alinha pela esquerda, na
          // direita pela direita — o rotulo nunca sai da trilha.
          <span
            aria-hidden
            className="santo-caption-semibold pointer-events-none absolute top-0 whitespace-nowrap tabular-nums text-text-primary"
            style={{
              left: `calc(var(--santo-dimension-space-8) + (100% - var(--santo-dimension-space-16)) * ${p})`,
              transform: `translateX(calc(-100% * ${p}))`,
            }}
          >
            {text(clamped)}
          </span>
        )}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={clamped}
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={disabled}
          aria-label={label}
          aria-valuetext={text(clamped)}
          className="santo-range block h-(--santo-dimension-size-28) w-full min-w-0"
        />
      </div>
      {valueLabel === "below" && (
        <div aria-hidden className="santo-caption-medium flex items-center justify-between tabular-nums">
          <span className="text-text-tertiary">{text(min)}</span>
          <span className="santo-caption-semibold text-text-primary">{text(clamped)}</span>
          <span className="text-text-tertiary">{text(max)}</span>
        </div>
      )}
      {field && (
        <span className="relative flex w-(--santo-dimension-space-128) items-center self-end">
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
            aria-label={`${label} (valor exato)`}
            className={`santo-focus-field santo-caption-regular h-(--santo-dimension-size-28) w-full min-w-0 ${RADIUS_CONTROL} border-thin border-transparent bg-surface-sunken text-right hover:bg-neutral-subtle-default font-mono tabular-nums text-text-primary disabled:cursor-not-allowed disabled:border-border-disabled disabled:bg-input-disabled disabled:text-text-disabled ${unit ? "pr-2xl pl-2xs" : "px-2xs"}`}
          />
          {unit && (
            <span className="santo-caption-small-regular pointer-events-none absolute right-2xs text-text-tertiary">{unit}</span>
          )}
        </span>
      )}
    </div>
  );
}
