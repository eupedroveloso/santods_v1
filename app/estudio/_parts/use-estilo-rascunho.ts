"use client";

import { useLayoutEffect } from "react";

/**
 * Mantém UM <style id="estudio-rascunho"> no <head> com o CSS do rascunho
 * (contrato, §4: "reescreva o conteúdo a cada mudança"), para documento que
 * só recebe o CSS depois de montar (o iframe de /estudio/preview). O editor
 * renderiza o <style> na árvore, com o SSR da derivação do servidor.
 */
export function useEstiloRascunho(css: string | undefined, doc?: Document | null) {
  useLayoutEffect(() => {
    const d = doc ?? document;
    if (!d || css === undefined) return;
    let el = d.getElementById("estudio-rascunho") as HTMLStyleElement | null;
    if (!el) {
      el = d.createElement("style");
      el.id = "estudio-rascunho";
      d.head.appendChild(el);
    }
    if (el.textContent !== css) el.textContent = css;
  }, [css, doc]);

  // Saiu do editor: o escopo [data-brand='rascunho'] não existe mais fora dele.
  useLayoutEffect(() => {
    const d = doc ?? document;
    return () => d?.getElementById("estudio-rascunho")?.remove();
  }, [doc]);
}
