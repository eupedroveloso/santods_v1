"use client";

import { useState } from "react";
import { IconButton } from "./button";
import { Avatar } from "./data";
import { Check, Close } from "./icons";

/**
 * Aviso flutuante de prova social ("Fabio acabou de garantir…"): avatar com a
 * inicial, a frase, a linha "compra verificada" com visto em success e o
 * fechar. Fica no canto inferior esquerdo e entra com santo-animate-slide-in-up
 * (motion/duration/normal + easing/entrance; reduced-motion zera).
 *
 * `placement`: `viewport` (padrao, fixo na janela — a pagina real) ou `frame`
 * (sticky no rodape da area visivel do pai, ultimo filho dele — como a
 * LandingPage dentro da doc: acompanha a rolagem sem sair da moldura). Fechar e
 * local; `onClose` avisa o pai.
 */
export function SocialProofToast({
  name,
  message,
  verified = "compra verificada",
  avatarSrc,
  placement = "viewport",
  onClose,
}: {
  /** Quem: vira a inicial do avatar e abre a frase. */
  name: string;
  /** O resto da frase: "acabou de garantir o Venda Todo Santo Dia". */
  message: string;
  /** Linha de confirmacao com o visto. Vazio = sem linha. */
  verified?: string;
  avatarSrc?: string;
  placement?: "viewport" | "frame";
  onClose?: () => void;
}) {
  const [open, setOpen] = useState(true);
  if (!open) return null;
  return (
    <div
      role="status"
      className={`santo-animate-slide-in-up santo-edge ${placement === "viewport" ? "fixed bottom-md left-md z-(--santo-layer-toast)" : "sticky bottom-md mb-md ml-md w-fit"} flex max-w-(--santo-dimension-space-320) items-center gap-sm rounded-lg bg-surface-raised p-sm pr-xs text-left shadow-lg`}
    >
      <Avatar name={name} src={avatarSrc} size={40} />
      <div className="flex min-w-0 flex-1 flex-col gap-3xs">
        <p className="santo-body-small-regular text-text-primary">
          <strong className="santo-body-small-semibold">{name}</strong> {message}
        </p>
        {verified && (
          <span className="santo-caption-medium flex items-center gap-2xs text-text-secondary">
            <span className="text-icon-success">
              <Check size={12} />
            </span>
            {verified}
          </span>
        )}
      </div>
      <IconButton
        size="sm"
        variant="ghost"
        label="Fechar aviso"
        onClick={() => {
          setOpen(false);
          onClose?.();
        }}
      >
        <Close size={16} />
      </IconButton>
    </div>
  );
}
