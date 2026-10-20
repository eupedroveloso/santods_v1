"use client";

import type { ReactNode } from "react";
import { Avatar } from "./data";
import { RADIUS_BADGE } from "./radius";

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
    <span className={`santo-caption-regular inline-flex w-fit items-center gap-2xs ${RADIUS_BADGE} border-thin border-border-subtle px-xs py-3xs text-text-secondary`}>
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
    // Quebra em vez de rolar: barra de rolagem sob a faixa e ultimo item cortado na borda liam como defeito.
    // Cada cotacao ocupa uma celula de largura minima de token; a hairline de cima separa as linhas quebradas.
    <div className="flex flex-wrap items-stretch overflow-hidden rounded-xl border-thin border-border-subtle bg-surface-raised">
      {items.map((t, i) => (
        <div
          key={t.symbol}
          className={`-mt-px flex min-w-(--santo-dimension-space-240) flex-1 items-center gap-xs border-t-thin border-border-subtle px-md py-sm ${
            i > 0 ? "-ml-px border-l-thin" : ""
          }`}
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
