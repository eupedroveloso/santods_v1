"use client";

import { useEffect, useRef, useState } from "react";
import { googleFontUrl } from "@/lib/fonts/catalog";
import { AmostraComponentes } from "../_parts/amostra";
import { useEstiloRascunho } from "../_parts/use-estilo-rascunho";
import type { MensagemAltura, MensagemRascunho } from "../_parts/mensagens";

/**
 * Rota interna do preview claro/escuro: roda dentro de um iframe do editor,
 * porque `data-theme` só vale no :root. O tema vem de ?tema=light|dark; o CSS
 * do rascunho chega por postMessage (mesma origem) e vai para o mesmo
 * <style id="estudio-rascunho"> do editor. Devolve a altura para o iframe.
 */
/**
 * Tema antes da primeira pintura: aplicado num effect, os controles nasciam no
 * tema salvo e ficavam presos no meio da transição de cor. Sem rolagem nem
 * calha reservada: quem dá a altura é o iframe, medida daqui.
 */
const TEMA_SCRIPT = `var h=document.documentElement;h.setAttribute("data-theme",new URLSearchParams(location.search).get("tema")==="dark"?"dark":"light");h.style.overflow="hidden";h.style.scrollbarGutter="auto"`;

export default function PreviewPage() {
  const [rascunho, setRascunho] = useState<MensagemRascunho | null>(null);
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
      {rascunho?.familias.map((f) => {
        const href = googleFontUrl(f);
        return href ? <link key={f} rel="stylesheet" href={href} precedence="default" /> : null;
      })}
      {/* A amostra só monta com o CSS presente: sem ele os controles pintariam com a marca base e animariam a troca. */}
      <div ref={raiz} data-brand="rascunho" className="bg-surface-page p-md">
        {rascunho && <AmostraComponentes />}
      </div>
    </>
  );
}
