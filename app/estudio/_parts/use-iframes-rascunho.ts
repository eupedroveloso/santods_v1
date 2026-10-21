"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { MensagemAltura, MensagemRascunho } from "./mensagens";

/**
 * Liga iframes de /estudio/preview ao rascunho: manda o CSS e as fontes a cada
 * mudança (e quando o iframe avisa que está pronto) e recebe de volta a altura
 * da amostra. `registrar(chave)` vai no ref de cada iframe.
 *
 * Também publica o rascunho no BroadcastChannel `estudio:<sistema>`: a aba de
 * tela cheia aberta pelo editor acompanha ao vivo, sem salvar.
 */
export function useIframesRascunho(css: string, fontes: string[], canal?: string) {
  const quadros = useRef(new Map<string, HTMLIFrameElement | null>());
  const [alturas, setAlturas] = useState<Record<string, number>>({});
  const atual = useRef<MensagemRascunho>({ tipo: "estudio-rascunho", css, fontes });
  const radio = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    atual.current = { tipo: "estudio-rascunho", css, fontes };
    for (const f of quadros.current.values()) f?.contentWindow?.postMessage(atual.current, window.location.origin);
    radio.current?.postMessage(atual.current);
  }, [css, fontes]);

  useEffect(() => {
    if (!canal || typeof BroadcastChannel === "undefined") return;
    const bc = new BroadcastChannel(canal);
    radio.current = bc;
    // A aba nova pede o estado assim que abre.
    bc.onmessage = (e) => e.data?.tipo === "estudio-pedir" && bc.postMessage(atual.current);
    bc.postMessage(atual.current);
    return () => {
      bc.close();
      radio.current = null;
    };
  }, [canal]);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      const chave = [...quadros.current].find(([, f]) => f?.contentWindow === e.source)?.[0];
      if (!chave) return;
      if (e.data?.tipo === "estudio-pronto") (e.source as Window).postMessage(atual.current, window.location.origin);
      if (e.data?.tipo === "estudio-altura") setAlturas((a) => ({ ...a, [chave]: (e.data as MensagemAltura).altura }));
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const registrar = useCallback(
    (chave: string) => (el: HTMLIFrameElement | null) => {
      quadros.current.set(chave, el);
    },
    [],
  );

  return { registrar, alturas };
}

/** Escala de um aparelho para caber na largura (e, com `alturaUtil`, na altura) medida de um contêiner. */
export function useEscala() {
  const [caixa, setCaixa] = useState({ largura: 0, altura: 0 });
  const obs = useRef<ResizeObserver | null>(null);
  const medir = useCallback((el: HTMLElement | null) => {
    obs.current?.disconnect();
    if (!el) return;
    obs.current = new ResizeObserver(([e]) => setCaixa({ largura: e.contentRect.width, altura: e.contentRect.height }));
    obs.current.observe(el);
  }, []);
  return { caixa, medir };
}
