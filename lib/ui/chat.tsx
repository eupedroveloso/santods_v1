"use client";

import type { FormEvent, ReactNode } from "react";
import { IconButton } from "./button";
import { Avatar } from "./data";
import { IconTile } from "./icon-tile";
import { ArrowUpRight, File, Plus } from "./icons";

/**
 * Conversa.
 *
 * A bolha recebida usa `bg/neutral/subtle` com texto primario; a enviada usa
 * `bg/brand/solid` com `text/on-brand`. Esse par existe justamente para
 * garantir contraste dos dois lados sem precisar escolher cinza na mao.
 */

export function ChatBubble({
  children,
  from = "them",
  time,
  reactions,
}: {
  children: ReactNode;
  from?: "me" | "them";
  time?: string;
  /** Ex.: [["❤️", 1], ["👍", 2]] */
  reactions?: [string, number][];
}) {
  const mine = from === "me";
  return (
    <div className={`flex flex-col gap-3xs ${mine ? "items-end" : "items-start"}`}>
      {time && <span className="santo-caption-small-regular text-text-tertiary">{time}</span>}
      <div
        className={`santo-body-small-regular max-w-5/6 rounded-xl px-md py-sm ${
          mine
            ? "rounded-br-xs bg-brand-solid-default text-text-on-brand"
            : "rounded-bl-xs bg-surface-sunken text-text-primary"
        }`}
      >
        {children}
      </div>
      {reactions && reactions.length > 0 && (
        <div className="flex gap-3xs">
          {reactions.map(([emoji, count]) => (
            <span
              key={emoji}
              className="santo-edge santo-caption-small-medium inline-flex h-(--santo-dimension-size-24) items-center gap-3xs rounded-full bg-surface-raised px-xs shadow-xs"
            >
              <span aria-hidden>{emoji}</span>
              <span className="tabular-nums text-text-secondary">{count}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/** Cabecalho da conversa: quem e, se esta online e as acoes. */
export function ChatHeader({
  name,
  status,
  actions,
  avatarSrc,
}: {
  name: string;
  status?: string;
  /** Foto da pessoa; sem ela, iniciais. */
  avatarSrc?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex items-center gap-sm">
      <span className="relative shrink-0">
        <Avatar name={name} src={avatarSrc} size={40} />
        {status && (
          <span className="absolute right-0 bottom-0 size-xs rounded-full border-thick border-[var(--santo-color-surface-raised)] bg-success-solid-default" />
        )}
      </span>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="santo-body-small-semibold truncate">{name}</span>
        {status && <span className="santo-caption-regular text-text-tertiary">{status}</span>}
      </div>
      {actions}
    </div>
  );
}

/** Tres pontos pulsando, para quem esta digitando. */
export function TypingIndicator() {
  return (
    <div className="inline-flex items-center gap-3xs rounded-xl rounded-bl-xs bg-surface-sunken px-md py-sm">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="santo-animate-pulse size-2xs rounded-full bg-icon-tertiary"
          style={{ animationDelay: `calc(var(--santo-motion-duration-slow) * ${i})` }}
        />
      ))}
    </div>
  );
}

/** Anexo dentro de uma bolha enviada. */
export function ChatAttachment({ name, size }: { name: string; size: string }) {
  return (
    <div className="flex items-center gap-sm">
      <IconTile shape="round" tone="outline">
        <File size={16} />
      </IconTile>
      <span className="flex min-w-0 flex-col">
        <span className="santo-body-small-medium truncate">{name}</span>
        <span className="santo-caption-regular opacity-80">{size}</span>
      </span>
    </div>
  );
}

/**
 * Campo de mensagem: POCO (surface/sunken) em pilula com acoes inline — anexar
 * a esquerda (ghost), enviar a direita (primary em circulo). Sem borda em
 * repouso; foco = anel de campo. Enter envia; o pai guarda o texto.
 */
export function ChatComposer({
  value,
  onChange,
  onSend,
  onAttach,
  placeholder = "Escreva uma mensagem…",
  actions,
  className = "",
}: {
  value: string;
  onChange: (value: string) => void;
  onSend: (value: string) => void;
  /** Sem ele, o botao de anexar some. */
  onAttach?: () => void;
  placeholder?: string;
  /** Acoes extras antes do enviar (IconButton ghost pill). */
  actions?: ReactNode;
  className?: string;
}) {
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (value.trim()) onSend(value);
  };
  return (
    <form
      onSubmit={submit}
      className={`santo-focus-within-field flex items-center gap-2xs rounded-full bg-surface-sunken p-2xs ${className}`}
    >
      {onAttach && (
        <IconButton pill size="sm" label="Anexar" onClick={onAttach}>
          <Plus size={16} />
        </IconButton>
      )}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        // O anel e do poco inteiro (focus-within), nao do input.
        className={`santo-body-small-regular h-(--santo-dimension-size-32) min-w-0 flex-1 bg-transparent text-text-primary outline-none placeholder:text-text-placeholder ${onAttach ? "" : "pl-sm"}`}
      />
      {actions}
      <IconButton pill size="sm" variant="primary" label="Enviar" type="submit" disabled={!value.trim()}>
        <ArrowUpRight size={16} />
      </IconButton>
    </form>
  );
}
