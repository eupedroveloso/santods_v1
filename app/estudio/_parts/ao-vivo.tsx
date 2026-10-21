"use client";

import { useEffect, useState } from "react";
import type { MensagemRascunho } from "./mensagens";
import { useEstiloRascunho } from "./use-estilo-rascunho";

/**
 * Tela cheia ao vivo: escuta o BroadcastChannel `estudio:<sistema>` que o
 * editor publica e reescreve o <style id="estudio-rascunho"> com o rascunho em
 * edição (e carrega as fontes dele). Sem editor aberto nada chega e vale o
 * salvo, que já veio no SSR.
 */
export function AoVivo({ canal }: { canal: string }) {
  const [rascunho, setRascunho] = useState<MensagemRascunho | null>(null);
  useEstiloRascunho(rascunho?.css, undefined, { manter: true });

  useEffect(() => {
    if (typeof BroadcastChannel === "undefined") return;
    const bc = new BroadcastChannel(canal);
    bc.onmessage = (e) => e.data?.tipo === "estudio-rascunho" && setRascunho(e.data as MensagemRascunho);
    bc.postMessage({ tipo: "estudio-pedir" });
    return () => bc.close();
  }, [canal]);

  return <>{rascunho?.fontes.map((url) => <link key={url} rel="stylesheet" href={url} precedence="default" />)}</>;
}
