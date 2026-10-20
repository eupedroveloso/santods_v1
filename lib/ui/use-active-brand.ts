"use client";

import { useSyncExternalStore } from "react";

/*
 * Marca ativa = data-brand do contexto. Le o atributo do elemento raiz (onde o
 * seletor de marca da doc grava) e escuta mudancas nele; sem atributo = a marca
 * padrao. Para um trecho com marca propria, passe a marca explicita ao
 * componente em vez de usar este hook.
 */
function subscribe(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-brand"] });
  return () => mo.disconnect();
}

/** Id da marca ativa no documento (`santo`, `vtsd`); `fallback` sem atributo e no servidor. */
export function useActiveBrand(fallback = "santo") {
  return useSyncExternalStore(
    subscribe,
    () => document.documentElement.getAttribute("data-brand") ?? fallback,
    () => fallback,
  );
}
