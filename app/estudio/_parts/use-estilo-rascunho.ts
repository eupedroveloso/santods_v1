"use client";

import { useLayoutEffect } from "react";

/**
 * Mantém UM <style id="estudio-rascunho"> no <head> com o CSS do rascunho
 * (contrato, §4: "reescreva o conteúdo a cada mudança"), para documento que
 * só recebe o CSS depois de montar (o iframe de /estudio/preview) e para a
 * tela cheia ao vivo (reescreve o <style> do SSR). O editor renderiza o
 * <style> na árvore, com o SSR da derivação do servidor.
 */
export function useEstiloRascunho(css: string | undefined, doc?: Document | null, opts: { manter?: boolean } = {}) {
  const { manter = false } = opts;
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
  // `manter`: o <style> é do SSR (tela cheia), quem o remove é o React.
  useLayoutEffect(() => {
    if (manter) return;
    const d = doc ?? document;
    return () => d?.getElementById("estudio-rascunho")?.remove();
  }, [doc, manter]);
}
