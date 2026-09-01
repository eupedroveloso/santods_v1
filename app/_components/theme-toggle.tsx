"use client";

import { useEffect, useState } from "react";

type Mode = "system" | "light" | "dark";

/**
 * Controla o tema no elemento raiz:
 *   data-theme  -> claro/escuro (ausente = segue o sistema)
 */
export function ThemeToggle() {
  const [mode, setMode] = useState<Mode>("system");

  useEffect(() => {
    const root = document.documentElement;
    if (mode === "system") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", mode);
  }, [mode]);

  return (
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
  );
}
