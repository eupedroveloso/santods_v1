"use client";

import { useEffect, useSyncExternalStore } from "react";
import { brandLogoFile, BrandSwitch, hasBrandMark, type BrandOption } from "@/lib/ui";
import { BRAND_STORAGE_KEY } from "./theme-script";

/*
 * Mesmo desenho do ThemeToggle: a marca mora no localStorage e no atributo
 * data-brand da raiz — nao em estado React. O script do <head> aplica antes da
 * primeira pintura; este controle so le e escreve. A marca padrao (a primeira
 * da lista) nao grava atributo: sem data-brand = padrao, como no tokens.css.
 */
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function readAttr(): string {
  return document.documentElement.getAttribute("data-brand") ?? "";
}

export function BrandControl({ brands }: { brands: BrandOption[] }) {
  const fallback = brands[0]?.id ?? "";
  const attr = useSyncExternalStore(subscribe, readAttr, () => "");
  const value = brands.some((b) => b.id === attr) ? attr : fallback;
  // Favicon da marca ativa: a mark (reduzida) quando a marca tem uma; senao o
  // favicon padrao do app (app/favicon.ico). So troca o <link> que este controle cria.
  useEffect(() => {
    const mark = value !== fallback && hasBrandMark(value) ? brandLogoFile(value, "mark") : null;
    let link = document.head.querySelector<HTMLLinkElement>("link[data-brand-icon]");
    if (!mark) {
      link?.remove();
      return;
    }
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      link.type = "image/svg+xml";
      link.dataset.brandIcon = "";
      document.head.appendChild(link);
    }
    link.href = mark.light;
  }, [value, fallback]);
  const write = (id: string) => {
    const root = document.documentElement;
    try {
      if (id === fallback) localStorage.removeItem(BRAND_STORAGE_KEY);
      else localStorage.setItem(BRAND_STORAGE_KEY, id);
    } catch {
      // Sem storage (aba privada): a marca vale so ate recarregar.
    }
    if (id === fallback) root.removeAttribute("data-brand");
    else root.setAttribute("data-brand", id);
    listeners.forEach((l) => l());
  };
  return <BrandSwitch brands={brands} value={value} onChange={write} label="Marca da documentação" />;
}
