"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  hexToAlpha,
  hexToRgb,
  hsvToRgb,
  isHex,
  rgbToHex,
  rgbToHsl,
  rgbToHsv,
  hslToRgb,
  type Rgb,
} from "./color";
import { Icon } from "./index-icons";

/**
 * Seletor de cor completo, em popover.
 *
 * Area de saturacao/valor, trilha de matiz, trilha de alfa, conta-gotas e
 * campos numericos que alternam entre HEX, RGB e HSL. O estado interno e HSV
 * porque so ele mantem matiz e saturacao estaveis quando o valor chega a zero —
 * converter para RGB a cada arraste faz a cor "escorregar" no preto.
 */

type Space = "HEX" | "RGB" | "HSL";

/** Arraste continuo dentro de uma area, normalizado em 0..1. */
function useDrag(onMove: (x: number, y: number) => void) {
  const ref = useRef<HTMLDivElement>(null);

  const emit = useCallback(
    (clientX: number, clientY: number) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      onMove(
        Math.min(1, Math.max(0, (clientX - r.left) / r.width)),
        Math.min(1, Math.max(0, (clientY - r.top) / r.height)),
      );
    },
    [onMove],
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      emit(e.clientX, e.clientY);
    },
    [emit],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (e.buttons !== 1) return;
      emit(e.clientX, e.clientY);
    },
    [emit],
  );

  return { ref, onPointerDown, onPointerMove };
}

export function ColorPicker({
  value,
  onChange,
  onClose,
  showAlpha = true,
  label,
}: {
  /** Hex de 6 ou 8 digitos. */
  value: string;
  onChange: (hex: string) => void;
  onClose: () => void;
  showAlpha?: boolean;
  label: string;
}) {
  const rgb = hexToRgb(value);
  const alpha = hexToAlpha(value);

  /**
   * HSV e o hex que o produziu vivem juntos no estado.
   *
   * Guardar o hex emitido junto e o que impede a cor de "escorregar": quando o
   * valor que volta por prop e o mesmo que acabamos de emitir, nao ressincroniza
   * — senao matiz e saturacao se perderiam toda vez que o brilho chegasse a zero.
   */
  const [state, setState] = useState(() => ({ hsv: rgbToHsv(rgb), hex: value }));
  if (value !== state.hex) setState({ hsv: rgbToHsv(hexToRgb(value)), hex: value });
  const hsv = state.hsv;

  const [space, setSpace] = useState<Space>("HEX");
  const [draft, setDraft] = useState<string | null>(null);
  const popover = useRef<HTMLDivElement>(null);

  const emit = useCallback(
    (next: { h: number; s: number; v: number }, nextAlpha = alpha) => {
      const hex = rgbToHex(hsvToRgb(next), nextAlpha);
      setState({ hsv: next, hex });
      onChange(hex);
    },
    [alpha, onChange],
  );

  const sv = useDrag((x, y) => emit({ ...hsv, s: x, v: 1 - y }));
  const hue = useDrag((x) => emit({ ...hsv, h: x * 360 }));
  const alphaTrack = useDrag((x) => emit(hsv, x));

  // Fecha ao clicar fora ou apertar Escape.
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (popover.current && !popover.current.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const setChannel = (patch: Partial<Rgb>) => {
    const next = { ...rgb, ...patch };
    emit(rgbToHsv(next));
  };

  const hsl = rgbToHsl(rgb);
  const pure = rgbToHex(hsvToRgb({ h: hsv.h, s: 1, v: 1 }));

  async function pickFromScreen() {
    const w = window as unknown as { EyeDropper?: new () => { open: () => Promise<{ sRGBHex: string }> } };
    if (!w.EyeDropper) return;
    try {
      const { sRGBHex } = await new w.EyeDropper().open();
      const next = rgbToHsv(hexToRgb(sRGBHex));
      emit(next);
    } catch {
      /* usuario cancelou */
    }
  }

  const hasEyeDropper = typeof window !== "undefined" && "EyeDropper" in window;

  return (
    <div
      ref={popover}
      role="dialog"
      aria-label={`Seletor de cor de ${label}`}
      className="absolute top-full left-0 z-(--santo-layer-popover) mt-2xs flex w-(--santo-dimension-space-256) flex-col gap-xs rounded-lg border-thin border-border-subtle bg-surface-raised p-xs shadow-lg"
    >
      {/* saturacao x valor */}
      <div
        {...sv}
        className="relative h-(--santo-dimension-space-128) w-full cursor-crosshair touch-none rounded-md"
        style={{
          background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, ${pure})`,
        }}
        role="group"
        aria-label={`Saturação ${Math.round(hsv.s * 100)}%, brilho ${Math.round(hsv.v * 100)}%. Use as setas para ajustar.`}
        tabIndex={0}
        onKeyDown={(e) => {
          const step = e.shiftKey ? 0.1 : 0.02;
          const moves: Record<string, [number, number]> = {
            ArrowLeft: [-step, 0],
            ArrowRight: [step, 0],
            ArrowUp: [0, step],
            ArrowDown: [0, -step],
          };
          const move = moves[e.key];
          if (!move) return;
          e.preventDefault();
          emit({
            ...hsv,
            s: Math.min(1, Math.max(0, hsv.s + move[0])),
            v: Math.min(1, Math.max(0, hsv.v + move[1])),
          });
        }}
      >
        <span
          className="pointer-events-none absolute size-sm -translate-x-1/2 -translate-y-1/2 rounded-full border-thick border-[#fff] shadow-sm"
          style={{ left: `${hsv.s * 100}%`, top: `${(1 - hsv.v) * 100}%`, background: rgbToHex(rgb) }}
        />
      </div>

      {/* conta-gotas + trilhas */}
      <div className="flex items-center gap-xs">
        {hasEyeDropper && (
          <button
            type="button"
            onClick={pickFromScreen}
            title="Capturar cor da tela"
            aria-label="Capturar cor da tela"
            className="shrink-0 cursor-pointer rounded-md p-3xs text-text-secondary hover:bg-neutral-subtle-default hover:text-text-primary"
          >
            <Icon.Eyedropper size={16} />
          </button>
        )}

        <div className="flex min-w-0 flex-1 flex-col gap-2xs">
          <div
            {...hue}
            className="relative h-xs w-full cursor-pointer touch-none rounded-full"
            style={{
              background:
                "linear-gradient(to right,#f00 0%,#ff0 17%,#0f0 33%,#0ff 50%,#00f 67%,#f0f 83%,#f00 100%)",
            }}
            role="slider"
            aria-label="Matiz"
            aria-valuemin={0}
            aria-valuemax={360}
            aria-valuenow={Math.round(hsv.h)}
            tabIndex={0}
          >
            <span
              className="pointer-events-none absolute top-1/2 size-sm -translate-x-1/2 -translate-y-1/2 rounded-full border-thick border-[#fff] shadow-sm"
              style={{ left: `${(hsv.h / 360) * 100}%`, background: pure }}
            />
          </div>

          {showAlpha && (
            <div
              {...alphaTrack}
              className="relative h-xs w-full cursor-pointer touch-none overflow-hidden rounded-full"
              style={{
                backgroundImage: `linear-gradient(to right, transparent, ${rgbToHex(rgb)}), linear-gradient(45deg,var(--santo-color-bg-neutral-subtle-active) 25%,transparent 25%),linear-gradient(-45deg,var(--santo-color-bg-neutral-subtle-active) 25%,transparent 25%),linear-gradient(45deg,transparent 75%,var(--santo-color-bg-neutral-subtle-active) 75%),linear-gradient(-45deg,transparent 75%,var(--santo-color-bg-neutral-subtle-active) 75%)`,
                backgroundSize: "100% 100%, 8px 8px, 8px 8px, 8px 8px, 8px 8px",
                backgroundPosition: "0 0, 0 0, 0 4px, 4px -4px, -4px 0",
              }}
              role="slider"
              aria-label="Opacidade"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(alpha * 100)}
              tabIndex={0}
            >
              <span
                className="pointer-events-none absolute top-1/2 size-sm -translate-x-1/2 -translate-y-1/2 rounded-full border-thick border-[#fff] shadow-sm"
                style={{ left: `${alpha * 100}%`, background: rgbToHex(rgb) }}
              />
            </div>
          )}
        </div>
      </div>

      {/* campos numericos */}
      <div className="flex items-end gap-2xs">
        {space === "HEX" ? (
          <Channel
            label="HEX"
            value={draft ?? value}
            mono
            onChange={setDraft}
            onCommit={(v) => {
              setDraft(null);
              const next = v.trim().toLowerCase();
              if (isHex(next)) {
                setState({ hsv: rgbToHsv(hexToRgb(next)), hex: next });
                onChange(next);
              }
            }}
            className="flex-1"
          />
        ) : space === "RGB" ? (
          (["r", "g", "b"] as const).map((k) => (
            <Channel
              key={k}
              label={k.toUpperCase()}
              value={String(Math.round(rgb[k]))}
              onChange={() => undefined}
              onCommit={(v) => setChannel({ [k]: Number(v) } as Partial<Rgb>)}
              numeric
              className="flex-1"
            />
          ))
        ) : (
          [
            { key: "h", label: "H", value: Math.round(hsl.h), max: 360 },
            { key: "s", label: "S", value: Math.round(hsl.s * 100), max: 100 },
            { key: "l", label: "L", value: Math.round(hsl.l * 100), max: 100 },
          ].map((c) => (
            <Channel
              key={c.key}
              label={c.label}
              value={String(c.value)}
              onChange={() => undefined}
              onCommit={(v) => {
                const n = Number(v);
                const next = {
                  h: c.key === "h" ? n : hsl.h,
                  s: c.key === "s" ? n / 100 : hsl.s,
                  l: c.key === "l" ? n / 100 : hsl.l,
                };
                emit(rgbToHsv(hslToRgb(next)));
              }}
              numeric
              className="flex-1"
            />
          ))
        )}

        {showAlpha && space !== "HEX" && (
          <Channel
            label="A"
            value={String(Math.round(alpha * 100))}
            onChange={() => undefined}
            onCommit={(v) => emit(hsv, Math.min(1, Math.max(0, Number(v) / 100)))}
            numeric
            className="w-(--santo-dimension-space-48)"
          />
        )}

        <button
          type="button"
          onClick={() => setSpace(space === "HEX" ? "RGB" : space === "RGB" ? "HSL" : "HEX")}
          title="Trocar o espaço de cor"
          aria-label={`Espaço de cor: ${space}. Clique para trocar.`}
          className="santo-caption-small-semibold h-(--santo-dimension-size-28) shrink-0 cursor-pointer rounded-md px-2xs text-text-tertiary hover:bg-neutral-subtle-default hover:text-text-primary"
        >
          ⇅
        </button>
      </div>
    </div>
  );
}

function Channel({
  label,
  value,
  onChange,
  onCommit,
  numeric,
  mono,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onCommit: (v: string) => void;
  numeric?: boolean;
  mono?: boolean;
  className?: string;
}) {
  const [local, setLocal] = useState<string | null>(null);
  return (
    <label className={`flex min-w-0 flex-col items-center gap-3xs ${className}`}>
      <input
        type={numeric ? "number" : "text"}
        value={local ?? value}
        onChange={(e) => {
          setLocal(e.target.value);
          onChange(e.target.value);
        }}
        onBlur={(e) => {
          setLocal(null);
          onCommit(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") (e.target as HTMLInputElement).blur();
        }}
        aria-label={label}
        className={`santo-caption-regular h-(--santo-dimension-size-28) w-full min-w-0 rounded-md border-thin border-border-default bg-input-default px-2xs text-center text-text-primary ${mono ? "font-mono" : "tabular-nums"}`}
      />
      <span className="santo-caption-small-medium text-text-tertiary">{label}</span>
    </label>
  );
}
