"use client";

import type { ReactNode } from "react";
import { Avatar } from "./data";

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
        className={`santo-body-small-regular max-w-[85%] rounded-xl px-sm py-xs ${
          mine
            ? "rounded-br-xs bg-brand-solid-default text-text-on-brand"
            : "rounded-bl-xs bg-neutral-subtle-default text-text-primary"
        }`}
      >
        {children}
      </div>
      {reactions && reactions.length > 0 && (
        <div className="flex gap-3xs">
          {reactions.map(([emoji, count]) => (
            <span
              key={emoji}
              className="santo-caption-small-medium inline-flex items-center gap-3xs rounded-full border-thin border-border-subtle bg-surface-raised px-2xs py-3xs"
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
}: {
  name: string;
  status?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex items-center gap-sm">
      <span className="relative shrink-0">
        <Avatar name={name} size={40} />
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
    <div className="inline-flex items-center gap-3xs rounded-xl rounded-bl-xs bg-neutral-subtle-default px-sm py-xs">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="size-2xs animate-pulse rounded-full bg-icon-tertiary"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </div>
  );
}

/** Anexo dentro de uma bolha enviada. */
export function ChatAttachment({ name, size }: { name: string; size: string }) {
  return (
    <div className="flex items-center gap-sm">
      <span className="grid size-2xl shrink-0 place-items-center rounded-full bg-surface-raised text-icon-primary">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ width: "var(--santo-dimension-icon-16)", height: "var(--santo-dimension-icon-16)" }}>
          <path d="M14 3v5h5" />
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9l5 5v11a2 2 0 0 1-2 2Z" />
        </svg>
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="santo-body-small-medium truncate">{name}</span>
        <span className="santo-caption-regular opacity-80">{size}</span>
      </span>
    </div>
  );
}
