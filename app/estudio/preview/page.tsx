"use client";

import { useEffect, useRef, useState } from "react";
import { Tela } from "../_parts/telas";
import { isTela, type TelaId } from "../_parts/telas-dados";
import { useEstiloRascunho } from "../_parts/use-estilo-rascunho";
import type { MensagemAltura, MensagemRascunho } from "../_parts/mensagens";

/**
 * Rota interna do preview claro/escuro: roda dentro de um iframe do editor,
 * porque `data-theme` só vale no :root. O tema vem de ?tema=light|dark; o CSS
 * do rascunho chega por postMessage (mesma origem) e vai para o mesmo
 * <style id="estudio-rascunho"> do editor. ?tela=amostra|dashboard|landing
 * escolhe o que renderiza; na amostra a altura volta para o iframe.
 */
/**
 * Tema antes da primeira pintura: aplicado num effect, os controles nasciam no
 * tema salvo e ficavam presos no meio da transição de cor. Sem rolagem nem
 * calha reservada: quem dá a altura é o iframe, medida daqui.
 */
const TEMA_SCRIPT = `var q=new URLSearchParams(location.search),h=document.documentElement;h.setAttribute("data-theme",q.get("tema")==="dark"?"dark":"light");if((!q.get("tela")||q.get("tela")==="amostra")&&!q.get("rolar")){h.style.overflow="hidden";h.style.scrollbarGutter="auto"}`;

export default function PreviewPage() {
  const [rascunho, setRascunho] = useState<MensagemRascunho | null>(null);
  // Amostra: altura medida e devolvida. Dashboard e Landing: altura de tela fixa, a página rola dentro do iframe.
  // Só renderiza depois do CSS (pós-hidratação), então ler a URL aqui não diverge do SSR.
  const [tela] = useState<TelaId>(() => {
    const pedida = typeof window === "undefined" ? null : new URLSearchParams(window.location.search).get("tela");
    return isTela(pedida) ? pedida : "amostra";
  });
  const raiz = useRef<HTMLDivElement>(null);
  useEstiloRascunho(rascunho?.css);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin || e.data?.tipo !== "estudio-rascunho") return;
      setRascunho(e.data as MensagemRascunho);
    };
    window.addEventListener("message", onMessage);
    window.parent.postMessage({ tipo: "estudio-pronto" }, window.location.origin);
    const medir = new ResizeObserver(([entry]) => {
      const msg: MensagemAltura = { tipo: "estudio-altura", altura: Math.ceil(entry.contentRect.height) };
      window.parent.postMessage(msg, window.location.origin);
    });
    if (raiz.current) medir.observe(raiz.current);
    return () => {
      window.removeEventListener("message", onMessage);
      medir.disconnect();
    };
  }, []);

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: TEMA_SCRIPT }} />
      {rascunho?.fontes.map((url) => <link key={url} rel="stylesheet" href={url} precedence="default" />)}
      {/* A amostra só monta com o CSS presente: sem ele os controles pintariam com a marca base e animariam a troca. */}
      {/* Sem recuo: o Card da amostra encosta no iframe e herda o raio dele (filho colado). */}
      <div ref={raiz} data-brand="rascunho">
        {rascunho && <Tela tela={tela} />}
      </div>
    </>
  );
}
