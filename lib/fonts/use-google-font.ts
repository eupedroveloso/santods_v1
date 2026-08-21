"use client";

import { useEffect } from "react";
import { fontLinkId, googleFontUrl } from "./catalog";

/**
 * Carrega famílias do Google Fonts em runtime.
 *
 * O Studio precisa disso porque a família é um token editável: no momento em que
 * alguém troca `brand/family/sans`, a fonte tem que existir para o preview
 * mostrar a verdade. Os <link> são deduplicados por id e ficam na página — tirar
 * e recolocar causaria um piscar de texto a cada mudança.
 */
export function useGoogleFonts(families: (string | undefined)[]) {
  const key = families.filter(Boolean).sort().join("|");

  useEffect(() => {
    for (const family of key ? key.split("|") : []) {
      const id = fontLinkId(family);
      if (document.getElementById(id)) continue;
      const href = googleFontUrl(family);
      if (!href) continue;
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href = href;
      document.head.appendChild(link);
    }
  }, [key]);
}
