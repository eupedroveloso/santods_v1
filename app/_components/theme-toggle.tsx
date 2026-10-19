"use client";

import { useSyncExternalStore } from "react";
import { Icon, Segmented } from "@/lib/ui";
import { THEME_STORAGE_KEY } from "./theme-script";

type Mode = "system" | "light" | "dark";

/*
 * O modo mora no localStorage e no atributo data-theme da raiz — nao em estado
 * React. Assim ele sobrevive ao recarregar, o script do <head> aplica antes da
 * primeira pintura (sem piscar), e este alternador so le e escreve.
 */
const listeners = new Set<() => void>();

function read(): Mode {
  try {
    const v = localStorage.getItem(THEME_STORAGE_KEY);
    return v === "light" || v === "dark" ? v : "system";
  } catch {
    return "system";
  }
}

function write(mode: Mode) {
  try {
    if (mode === "system") localStorage.removeItem(THEME_STORAGE_KEY);
    else localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch {
    // Sem storage (aba privada): o tema vale so ate recarregar.
  }
  const root = document.documentElement;
  if (mode === "system") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", mode);
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * Controla o tema no elemento raiz:
 *   data-theme  -> claro/escuro (ausente = segue o sistema)
 */
export function ThemeToggle() {
  const mode = useSyncExternalStore(subscribe, read, () => "system" as Mode);
  return (
    <Segmented
      value={mode}
      onChange={write}
      options={[
        { value: "system", label: "Auto", title: "Seguir o sistema" },
        { value: "light", label: <Icon.Sun size={16} />, title: "Tema claro" },
        { value: "dark", label: <Icon.Moon size={16} />, title: "Tema escuro" },
      ]}
    />
  );
}
