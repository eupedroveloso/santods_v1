"use client";

import type { ReactNode } from "react";
import { Avatar } from "./data";

/**
 * Feed de atividade.
 *
 * Cada item e "quem / o que / quando", com um marcador opcional embaixo. O
 * horario fica alinhado a direita na mesma linha do nome — e o que permite
 * varrer a coluna de tempo sem ler o resto.
 */
export function ActivityItem({
  who,
  what,
  when,
  marker,
  avatarSrc,
}: {
  who: string;
  /** Foto de quem agiu; sem ela, iniciais. */
  avatarSrc?: string;
  what: ReactNode;
  when: string;
  /** Pastilha de contexto: tipo de tarefa, arquivo, reuniao. */
  marker?: ReactNode;
}) {
  return (
    <div className="flex gap-sm py-sm">
      <Avatar name={who} src={avatarSrc} size={32} className="mt-3xs" />
      <div className="flex min-w-0 flex-1 flex-col gap-2xs">
        <div className="flex items-baseline justify-between gap-sm">
          <span className="santo-body-small-semibold truncate">{who}</span>
          <span className="santo-caption-regular shrink-0 text-text-tertiary">{when}</span>
        </div>
        <p className="santo-body-small-regular text-text-primary">{what}</p>
        {marker}
      </div>
    </div>
  );
}

/** Marcador de contexto do feed: icone + rotulo, contorno leve. */
export function Marker({ icon, children }: { icon?: ReactNode; children: ReactNode }) {
  return (
    <span className="santo-caption-regular inline-flex w-fit items-center gap-2xs rounded-md border-thin border-border-subtle px-2xs py-3xs text-text-secondary">
      {icon}
      {children}
    </span>
  );
}

/** Faixa de cotacoes: simbolo, valor e variacao. */
export function Ticker({
  items,
}: {
  items: { symbol: string; name: string; value: string; delta: number }[];
}) {
  return (
    <div className="flex items-stretch overflow-x-auto rounded-xl border-thin border-border-subtle bg-surface-raised">
      {items.map((t, i) => (
        <div
          key={t.symbol}
          className={`flex shrink-0 items-center gap-xs px-md py-sm ${i > 0 ? "border-l-thin border-border-subtle" : ""}`}
        >
          <Avatar name={t.symbol} size={24} />
          <span className="santo-body-small-semibold">{t.symbol}</span>
          <span className="santo-body-small-regular tabular-nums text-text-secondary">{t.value}</span>
          <span
            className={`santo-caption-semibold tabular-nums ${t.delta >= 0 ? "text-text-success" : "text-text-danger"}`}
          >
            {t.delta >= 0 ? "▲" : "▼"} {Math.abs(t.delta).toFixed(2)}%
          </span>
        </div>
      ))}
    </div>
  );
}
