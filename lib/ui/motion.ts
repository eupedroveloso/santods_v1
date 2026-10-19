"use client";

import { useEffect, useState } from "react";

/**
 * Duracoes de motion/duration/* como nomes tipados. O valor vive no CSS
 * (tokens do Figma); `readDuration` le em ms quando o JS precisa esperar uma
 * saida terminar antes de desmontar.
 */
export const DURATION = {
  instant: "--santo-motion-duration-instant",
  fast: "--santo-motion-duration-fast",
  normal: "--santo-motion-duration-normal",
  slow: "--santo-motion-duration-slow",
  slower: "--santo-motion-duration-slower",
} as const;

export type MotionDuration = keyof typeof DURATION;

/** Duracao em ms lida do CSS; 0 com movimento reduzido ou fora do navegador. */
export function readDuration(name: MotionDuration): number {
  if (typeof window === "undefined") return 0;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return 0;
  if (document.querySelector("[data-reduced-motion]")) return 0;
  const raw = getComputedStyle(document.documentElement).getPropertyValue(DURATION[name]).trim();
  const n = parseFloat(raw);
  if (Number.isNaN(n)) return 0;
  return raw.endsWith("ms") ? n : n * 1000;
}

/**
 * Mantem algo montado enquanto a animacao de saida roda.
 *
 * `mounted` decide se renderiza; `state` ("open" | "closed") escolhe a classe
 * de entrada ou de saida (santo-animate-*-in / -out). A saida dura `exit`
 * (padrao `fast`, a mesma das santo-animate-*-out).
 */
export function usePresence(open: boolean, exit: MotionDuration = "fast") {
  // Fechado ha pouco = ainda montado, rodando a saida. Ajustado no render
  // (padrao do React para estado derivado de prop), desmontado no timer.
  const [leaving, setLeaving] = useState(false);
  const [prev, setPrev] = useState(open);
  if (prev !== open) {
    setPrev(open);
    setLeaving(!open);
  }

  useEffect(() => {
    if (!leaving) return;
    const t = window.setTimeout(() => setLeaving(false), readDuration(exit));
    return () => window.clearTimeout(t);
  }, [leaving, exit]);

  return { mounted: open || leaving, state: open ? "open" : "closed" } as const;
}
