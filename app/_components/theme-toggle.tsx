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

// Padrao do DS: claro. Auto (seguir o sistema) e Escuro so quando escolhidos.
const DEFAULT_MODE: Mode = "light";

function read(): Mode {
  try {
    const v = localStorage.getItem(THEME_STORAGE_KEY);
    return v === "system" || v === "dark" ? v : DEFAULT_MODE;
  } catch {
    return DEFAULT_MODE;
  }
}

function write(mode: Mode) {
  try {
    // Auto tambem e salvo: sem chave, a pagina volta ao claro padrao.
    localStorage.setItem(THEME_STORAGE_KEY, mode);
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
 *   data-theme  -> claro/escuro (ausente = Auto, segue o sistema)
 * Padrao: claro. Ordem: Claro | Auto | Escuro.
 */
export function ThemeToggle() {
  const mode = useSyncExternalStore(subscribe, read, () => DEFAULT_MODE);
  return (
    <Segmented
      value={mode}
      onChange={write}
      options={[
        { value: "light", label: <Icon.Sun size={16} />, title: "Tema claro" },
        // No celular, Auto vira o meio círculo (tema automático) para a topbar caber em 375.
        {
          value: "system",
          label: (
            <>
              <span className="sm:hidden"><Icon.CircleHalfStrokeIcon size={16} /></span>
              <span className="max-sm:sr-only">Auto</span>
            </>
          ),
          title: "Seguir o sistema",
        },
        { value: "dark", label: <Icon.Moon size={16} />, title: "Tema escuro" },
      ]}
    />
  );
}
