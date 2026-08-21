"use client";

import { useEffect, useState } from "react";
import { brands } from "@/lib/tokens/brands";
import { Select } from "@/lib/ui";

type Mode = "system" | "light" | "dark";

/**
 * Controla os dois eixos do tema no elemento raiz:
 *   data-theme  -> claro/escuro (ausente = segue o sistema)
 *   data-brand  -> qual marca derivada aplicar (ausente = a base Santo)
 */
export function ThemeToggle() {
  const [mode, setMode] = useState<Mode>("system");
  const [brand, setBrand] = useState<string>("santo");

  useEffect(() => {
    const root = document.documentElement;
    if (mode === "system") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", mode);
  }, [mode]);

  useEffect(() => {
    const root = document.documentElement;
    if (brand === "santo") root.removeAttribute("data-brand");
    else root.setAttribute("data-brand", brand);
  }, [brand]);

  return (
    <div className="flex flex-wrap items-center gap-xs">
      {brands.length > 1 && (
        <Select
          size="sm"
          value={brand}
          onChange={setBrand}
          label="Marca"
          options={brands.map((b) => ({ value: b.id, label: b.name, hint: b.description || undefined }))}
        />
      )}
      <div className="flex items-center gap-2xs rounded-full border-thin border-border-subtle bg-surface-raised p-2xs">
        {(["system", "light", "dark"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`santo-caption-semibold cursor-pointer rounded-full px-sm py-2xs transition-colors ${
              mode === m
                ? "bg-brand-solid-default text-text-on-brand"
                : "text-text-secondary hover:bg-neutral-subtle-hover"
            }`}
          >
            {m === "system" ? "sistema" : m === "light" ? "claro" : "escuro"}
          </button>
        ))}
      </div>
    </div>
  );
}
