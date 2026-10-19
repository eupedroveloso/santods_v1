"use client";

import { useState } from "react";
import { ColorPicker } from "./color-picker";
import { SWATCH_BOX, SWATCH_CHECKER, type SwatchSize } from "./swatch";

/** Amostra que abre o seletor completo do SantoDS ao ser clicada. */
export function SwatchPicker({
  color,
  onChange,
  label,
  size = "md",
  showAlpha = true,
}: {
  color: string;
  onChange: (hex: string) => void;
  label: string;
  size?: SwatchSize;
  showAlpha?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="dialog"
        title={label}
        aria-label={label}
        className={`relative block cursor-pointer overflow-hidden rounded-sm border-thin border-border-subtle transition-colors ease-(--santo-motion-easing-standard) duration-(--santo-motion-duration-fast) hover:border-border-strong ${SWATCH_CHECKER} ${SWATCH_BOX[size]}`}
      >
        <span className="absolute inset-0" style={{ background: color }} />
      </button>
      {open && (
        <ColorPicker
          value={color}
          onChange={onChange}
          onClose={() => setOpen(false)}
          showAlpha={showAlpha}
          label={label}
        />
      )}
    </span>
  );
}
