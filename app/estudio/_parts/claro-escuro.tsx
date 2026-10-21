"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardGrid, Overline } from "@/lib/ui";
import type { MensagemAltura, MensagemRascunho } from "./mensagens";

const TEMAS = [
  { id: "light", label: "Claro" },
  { id: "dark", label: "Escuro" },
] as const;

/**
 * Claro e escuro lado a lado: dois iframes da rota /estudio/preview, cada um
 * com o seu `<html data-theme>`. O CSS do rascunho vai por postMessage a cada
 * mudança; a altura volta do iframe (sem barra de rolagem dentro).
 */
export function ClaroEscuro({ css, familias }: { css: string; familias: string[] }) {
  const quadros = useRef<Record<string, HTMLIFrameElement | null>>({});
  const [alturas, setAlturas] = useState<Record<string, number>>({});
  const atual = useRef<MensagemRascunho>({ tipo: "estudio-rascunho", css, familias });

  useEffect(() => {
    atual.current = { tipo: "estudio-rascunho", css, familias };
    for (const f of Object.values(quadros.current)) f?.contentWindow?.postMessage(atual.current, window.location.origin);
  }, [css, familias]);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      const tema = TEMAS.find((t) => quadros.current[t.id]?.contentWindow === e.source)?.id;
      if (!tema) return;
      if (e.data?.tipo === "estudio-pronto") (e.source as Window).postMessage(atual.current, window.location.origin);
      if (e.data?.tipo === "estudio-altura") setAlturas((a) => ({ ...a, [tema]: (e.data as MensagemAltura).altura }));
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <CardGrid columns={{ "2xl": 2 }} gap="md" masonry={false}>
      {TEMAS.map((t) => (
        <Card key={t.id} variant="double" padded={false} header={<Overline>{t.label}</Overline>}>
          <iframe
            ref={(el) => {
              quadros.current[t.id] = el;
            }}
            src={`/estudio/preview?tema=${t.id}`}
            title={`Amostra do rascunho no tema ${t.label.toLowerCase()}`}
            className="block w-full overflow-hidden rounded-(--santo-card-inner-radius)"
            style={{ height: alturas[t.id] ? `${alturas[t.id]}px` : "var(--santo-dimension-space-448)" }}
          />
        </Card>
      ))}
    </CardGrid>
  );
}
