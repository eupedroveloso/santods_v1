"use client";

import { useState } from "react";
import { buildIndex, isAlias, resolveValue } from "@/lib/tokens/emit.mjs";
import { derive } from "@/lib/tokens/scales";
import { rangeFor } from "@/lib/tokens/ranges";
import type { RawValue, TokenDoc } from "@/lib/tokens/types";
import { Disclosure, NumberField, PanelSection } from "@/lib/ui";

type Change = { collection: string; name: string; mode: string; value: RawValue };

/** Valor numérico atual de um token, resolvendo alias se houver. */
export function numberOf(doc: TokenDoc, collection: string, name: string, mode: string): number {
  const def = doc.collections[collection]?.variables?.[name];
  if (!def) return 0;
  const values = def.values ?? { [doc.collections[collection].defaultMode]: def.value as RawValue };
  const raw = values[mode] ?? values[doc.collections[collection].defaultMode];
  if (typeof raw === "number") return raw;
  if (typeof raw === "string" && isAlias(raw)) {
    try {
      return Number(resolveValue(buildIndex(doc), raw, mode));
    } catch {
      return 0;
    }
  }
  return Number(raw) || 0;
}

/**
 * Seção de escala: uma base que dirige tudo, e ajuste fino escondido.
 *
 * A base vem primeiro porque é a decisão que importa — a proporção entre os
 * degraus é o que faz a escala parecer uma escala, e ela não muda de produto
 * para produto. O ajuste fino existe para a exceção, não para o caminho comum,
 * então fica recolhido.
 */
export function ScaleSection({
  title,
  doc,
  collection,
  prefix,
  ratios,
  baseKey,
  baseLabel,
  baseRange,
  onChange,
  /** Token que guarda a base quando ela não é um dos apelidos (caso do raio). */
  baseToken,
}: {
  title: string;
  doc: TokenDoc;
  collection: string;
  /** Prefixo dos apelidos, ex. "space/". */
  prefix: string;
  ratios: Record<string, number>;
  /** Apelido cuja proporção é 1 — a base. */
  baseKey: string;
  baseLabel: string;
  baseRange: { min: number; max: number; step: number };
  onChange: (changes: Change[]) => void;
  baseToken?: { collection: string; name: string };
}) {
  const [open, setOpen] = useState(false);
  const modeOf = (c: string) => doc.collections[c].defaultMode;

  const base = baseToken
    ? numberOf(doc, baseToken.collection, baseToken.name, modeOf(baseToken.collection))
    : numberOf(doc, collection, `${prefix}${baseKey}`, modeOf(collection));

  /** Move a base e recalcula todos os apelidos pela proporção. */
  const applyBase = (next: number) => {
    const changes: Change[] = Object.entries(ratios).map(([key, ratio]) => ({
      collection,
      name: `${prefix}${key}`,
      mode: modeOf(collection),
      value: derive(next, ratio),
    }));
    if (baseToken) {
      changes.push({
        collection: baseToken.collection,
        name: baseToken.name,
        mode: modeOf(baseToken.collection),
        value: next,
      });
    }
    onChange(changes);
  };

  const keys = Object.keys(ratios);

  return (
    <PanelSection title={title}>
      <NumberField
        label={baseLabel}
        value={base}
        onChange={applyBase}
        min={baseRange.min}
        max={baseRange.max}
        step={baseRange.step}
        unit="px"
      />

      <Disclosure label="Ajuste fino" open={open} onToggle={() => setOpen((o) => !o)} count={keys.length}>
        {keys.map((key) => {
          const name = `${prefix}${key}`;
          const value = numberOf(doc, collection, name, modeOf(collection));
          const range = rangeFor(name, value);
          return (
            <div key={key} className="flex items-center gap-2xs">
              <span
                className="santo-caption-regular w-(--santo-dimension-space-48) shrink-0 truncate text-text-secondary"
                title={name}
              >
                {key}
              </span>
              <NumberField
                label={name}
                value={value}
                onChange={(v) => onChange([{ collection, name, mode: modeOf(collection), value: v }])}
                min={range.min}
                max={range.max}
                step={range.step}
                unit="px"
              />
            </div>
          );
        })}
      </Disclosure>
    </PanelSection>
  );
}
