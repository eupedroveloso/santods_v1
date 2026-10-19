"use client";

import { useEffect, useRef, useState } from "react";
import { IconButton } from "./button";
import type { ButtonVariant, ControlSize } from "./button-class";
import { Check, Close, Copy } from "./icons";

type Status = "idle" | "copied" | "failed";

/**
 * Copia um texto para a area de transferencia.
 *
 * Use ao lado de algo que a pessoa vai colar em outro lugar: nome de variavel,
 * classe, trecho de codigo, link. O icone vira um visto por um instante — sem
 * esse retorno a pessoa clica duas vezes para ter certeza. O resultado tambem
 * e anunciado ao leitor de tela, e a falha (contexto inseguro, permissao
 * negada) aparece em vez de ser engolida.
 */
export function CopyButton({
  value,
  label = "Copiar",
  size = "sm",
  variant = "ghost",
  className = "",
}: {
  value: string;
  /** Rotulo acessivel. Diga o que sera copiado: "Copiar nome da variavel". */
  label?: string;
  size?: ControlSize;
  variant?: ButtonVariant;
  className?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const show = (next: Status) => {
    setStatus(next);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus("idle"), 1500);
  };

  const copy = () => {
    if (!navigator.clipboard) {
      show("failed");
      return;
    }
    navigator.clipboard.writeText(value).then(
      () => show("copied"),
      () => show("failed"),
    );
  };

  const message = status === "copied" ? "Copiado" : status === "failed" ? "Não foi possível copiar" : "";

  // relative: o anuncio sr-only e absolute; sem ancestral posicionado ele escapa
  // do overflow-x-auto de uma tabela e alarga a pagina inteira.
  return (
    <span className="relative inline-flex shrink-0">
      <IconButton
        size={size}
        variant={variant}
        label={message || label}
        onClick={copy}
        className={`${status === "failed" ? "text-text-danger" : ""} ${className}`}
      >
        {status === "copied" ? <span className="santo-animate-pop grid"><Check size={16} /></span> : status === "failed" ? <Close size={16} /> : <Copy size={16} />}
      </IconButton>
      <span className="sr-only" aria-live="polite">
        {message}
      </span>
    </span>
  );
}
