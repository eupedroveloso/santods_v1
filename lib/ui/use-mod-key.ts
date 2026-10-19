"use client";

import { useSyncExternalStore } from "react";

type NavigatorWithUAData = Navigator & { userAgentData?: { platform?: string } };

const subscribe = () => () => undefined;

const isApple = () => {
  const nav = navigator as NavigatorWithUAData;
  return /mac|iphone|ipad/i.test(nav.userAgentData?.platform ?? nav.platform ?? "");
};

/**
 * A tecla modificadora da plataforma: "⌘" no Mac, "Ctrl" no resto.
 *
 * Use em todo `Kbd` que ensina atalho com modificador — mostrar ⌘ no Windows
 * ensina errado. No servidor responde "⌘"; no cliente corrige depois da
 * hidratacao, sem aviso de divergencia.
 */
export function useModKey(): string {
  return useSyncExternalStore(subscribe, () => (isApple() ? "⌘" : "Ctrl"), () => "⌘");
}
