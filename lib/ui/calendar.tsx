"use client";

import { useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { IconButton } from "./button";
import { ChevronLeft, ChevronRight } from "./icons";

const WEEKDAYS = ["D", "S", "T", "Q", "Q", "S", "S"];
const WEEKDAY_NAMES = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

type View = { y: number; m: number };
type Cell = { day: number; inMonth: boolean };

const daysIn = (v: View) => new Date(v.y, v.m + 1, 0).getDate();
const firstWeekday = (v: View) => new Date(v.y, v.m, 1).getDay();
const shift = (v: View, delta: number): View => {
  const d = new Date(v.y, v.m + delta, 1);
  return { y: d.getFullYear(), m: d.getMonth() };
};
const sameView = (a: View, b: View) => a.y === b.y && a.m === b.m;

/**
 * Calendario de um mes, interativo (skill santo-ui-craft).
 *
 * Anatomia: titulo do mes + ano como meta, duas setas iguais (IconButton
 * pilula tonal); dias da semana em caption text/tertiary; cada dia e um
 * circulo com hover tonal. HOJE = anel brand/subtle; SELECIONADO =
 * brand/solid + text/on-brand (nunca neutro escuro); INTERVALO = faixa
 * brand/subtle continua com as pontas arredondadas (mesmo principio do
 * realce de linha inset). Dias dos meses vizinhos em text/disabled.
 *
 * Teclado (aria grid): setas movem o dia, Home/End vao ao inicio/fim da
 * semana, PageUp/PageDown trocam o mes, Enter/Espaco escolhem.
 *
 * Compativel com a API estatica: `month` (nome), `year`, `selected`, `today`
 * (`startWeekday` e `days` sao aceitos e ignorados: o mes real sai de
 * month/year). `onSelect` recebe a escolha; `mode="range"` escolhe intervalo
 * em dois cliques. Sem `onSelect`, a selecao vive dentro.
 */
export function Calendar({
  month,
  year,
  selected,
  today,
  mode = "single",
  onSelect,
  className = "",
}: {
  /** Nome do mes em portugues ("Junho"). */
  month: string;
  year: number;
  /** Compatibilidade: ignorado, o mes real vem de month/year. */
  startWeekday?: number;
  /** Compatibilidade: ignorado, o numero de dias vem de month/year. */
  days?: number;
  /** Dias escolhidos do mes inicial. Em range, o intervalo inteiro. */
  selected?: number[];
  /** Dia de hoje no mes inicial. */
  today?: number;
  mode?: "single" | "range";
  /** Recebe os dias escolhidos (do mes exibido) e o mes/ano. */
  onSelect?: (days: number[], view: { month: string; year: number }) => void;
  className?: string;
}) {
  const initial: View = { y: year, m: Math.max(0, MONTHS.indexOf(month)) };
  const [view, setView] = useState<View>(initial);
  const [picked, setPicked] = useState<{ view: View; days: number[] }>({ view: initial, days: selected ?? [] });
  const [anchor, setAnchor] = useState<number | null>(null);
  const [focusDay, setFocusDay] = useState<number>(today ?? selected?.[0] ?? 1);
  const grid = useRef<HTMLDivElement>(null);

  const total = daysIn(view);
  const lead = firstWeekday(view);
  const prevTotal = daysIn(shift(view, -1));
  const cells: Cell[] = [
    ...Array.from({ length: lead }, (_, i) => ({ day: prevTotal - lead + 1 + i, inMonth: false })),
    ...Array.from({ length: total }, (_, i) => ({ day: i + 1, inMonth: true })),
  ];
  for (let n = 1; cells.length % 7 !== 0; n++) cells.push({ day: n, inMonth: false });
  const rows = Array.from({ length: cells.length / 7 }, (_, r) => cells.slice(r * 7, r * 7 + 7));

  const chosen = sameView(picked.view, view) ? picked.days : [];
  const isChosen = (c: Cell | undefined) => !!c && c.inMonth && chosen.includes(c.day);
  const isToday = (c: Cell) => c.inMonth && today !== undefined && sameView(view, initial) && c.day === today;
  const ends = chosen.length > 0 ? [Math.min(...chosen), Math.max(...chosen)] : [];

  const choose = (day: number) => {
    let next: number[];
    if (mode === "range" && anchor !== null) {
      const [a, b] = [Math.min(anchor, day), Math.max(anchor, day)];
      next = Array.from({ length: b - a + 1 }, (_, i) => a + i);
      setAnchor(null);
    } else {
      next = [day];
      if (mode === "range") setAnchor(day);
    }
    setPicked({ view, days: next });
    onSelect?.(next, { month: MONTHS[view.m], year: view.y });
  };

  const go = (delta: number, day?: number) => {
    const v = shift(view, delta);
    setView(v);
    setAnchor(null);
    setFocusDay(Math.max(1, Math.min(day ?? focusDay, daysIn(v))));
  };

  const focusSoon = () =>
    requestAnimationFrame(() => grid.current?.querySelector<HTMLElement>('button[tabindex="0"]')?.focus());

  const onKey = (e: KeyboardEvent) => {
    const wd = (lead + focusDay - 1) % 7;
    const moves: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7, Home: -wd, End: 6 - wd };
    if (e.key in moves) {
      e.preventDefault();
      const target = focusDay + moves[e.key];
      if (target < 1) go(-1, daysIn(shift(view, -1)) + target);
      else if (target > total) go(1, target - total);
      else setFocusDay(target);
      focusSoon();
    } else if (e.key === "PageUp" || e.key === "PageDown") {
      e.preventDefault();
      go(e.key === "PageUp" ? -1 : 1);
      focusSoon();
    }
  };

  return (
    <div className={`mx-auto flex w-fit flex-col gap-sm ${className}`}>
      <div className="flex items-center justify-between gap-sm">
        <div className="flex items-baseline gap-xs" aria-live="polite">
          <span className="santo-body-large-semibold text-text-primary">{MONTHS[view.m]}</span>
          <span className="santo-caption-medium text-text-tertiary tabular-nums">{view.y}</span>
        </div>
        <div className="flex gap-2xs">
          <IconButton size="sm" variant="subtle" label="Mês anterior" onClick={() => go(-1)}>
            <ChevronLeft size={16} />
          </IconButton>
          <IconButton size="sm" variant="subtle" label="Próximo mês" onClick={() => go(1)}>
            <ChevronRight size={16} />
          </IconButton>
        </div>
      </div>

      <div ref={grid} role="grid" aria-label={`${MONTHS[view.m]} de ${view.y}`} onKeyDown={onKey} className="flex flex-col gap-2xs">
        <div role="row" className="grid grid-cols-7">
          {WEEKDAYS.map((d, i) => (
            <span
              key={i}
              role="columnheader"
              aria-label={WEEKDAY_NAMES[i]}
              className="santo-caption-medium grid h-(--santo-dimension-size-24) w-2xl place-items-center text-text-tertiary"
            >
              {d}
            </span>
          ))}
        </div>

        {rows.map((row, r) => (
          <div key={r} role="row" className="grid grid-cols-7">
            {row.map((c, i) => {
              const on = isChosen(c);
              // Faixa do intervalo: liga ao vizinho escolhido na mesma semana.
              const band = mode === "range" && on && chosen.length > 1;
              const joinLeft = band && i > 0 && isChosen(row[i - 1]);
              const joinRight = band && i < 6 && isChosen(row[i + 1]);
              const solid = on && (mode === "single" || ends.includes(c.day));
              const current = c.inMonth && c.day === focusDay;
              return (
                <div
                  key={`${r}-${i}`}
                  role="gridcell"
                  aria-selected={c.inMonth ? on : undefined}
                  className={`grid size-2xl place-items-center ${band ? "bg-brand-subtle-default" : ""} ${
                    joinLeft ? "" : "rounded-l-full"
                  } ${joinRight ? "" : "rounded-r-full"}`}
                >
                  {c.inMonth ? (
                    <button
                      type="button"
                      tabIndex={current ? 0 : -1}
                      aria-current={isToday(c) ? "date" : undefined}
                      aria-label={`${c.day} de ${MONTHS[view.m]}`}
                      onClick={() => {
                        setFocusDay(c.day);
                        choose(c.day);
                      }}
                      className={`santo-caption-medium santo-transition-colors grid size-2xl cursor-pointer place-items-center rounded-full tabular-nums ${
                        solid
                          ? "bg-brand-solid-default text-text-on-brand hover:bg-brand-solid-hover"
                          : on
                            ? "text-text-brand hover:bg-brand-subtle-hover"
                            : "text-text-secondary hover:bg-neutral-subtle-default hover:text-text-primary"
                      }`}
                      // Hoje: anel brand/subtle por dentro (some sob o solido).
                      style={
                        isToday(c) && !solid
                          ? { boxShadow: "inset 0 0 0 var(--santo-border-thick) var(--santo-color-bg-brand-subtle-active)" }
                          : undefined
                      }
                    >
                      {c.day}
                    </button>
                  ) : (
                    <span aria-hidden className="santo-caption-medium text-text-disabled tabular-nums">
                      {c.day}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
