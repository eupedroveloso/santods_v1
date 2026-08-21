"use client";

import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "./icons";

/**
 * Exibicao de dado: avatar, tabela e calendario.
 * Tudo que o preview precisa para parecer produto, sem virar produto.
 */

export function Avatar({
  name,
  size = 32,
  className = "",
}: {
  name: string;
  size?: 24 | 32 | 40;
  className?: string;
}) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  const text = size === 24 ? "santo-caption-small-semibold" : "santo-caption-semibold";
  return (
    <span
      title={name}
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-neutral-subtle-active text-text-secondary ${text} ${className}`}
      style={{ width: `var(--santo-dimension-size-${size})`, height: `var(--santo-dimension-size-${size})` }}
    >
      {initials}
    </span>
  );
}

export type Column<T> = {
  key: string;
  header: ReactNode;
  /** Alinha a direita — use para numero. */
  numeric?: boolean;
  render: (row: T) => ReactNode;
};

/**
 * Tabela compacta.
 *
 * `selected` liga a coluna de selecao; `rowAction` acrescenta a coluna de acoes
 * no fim. As duas sao opcionais para a mesma tabela servir de lista simples e
 * de grade com selecao.
 */
export function Table<T>({
  columns,
  rows,
  getKey,
  className = "",
  selected,
  onToggleRow,
  onToggleAll,
  rowAction,
}: {
  columns: Column<T>[];
  rows: T[];
  getKey: (row: T, index: number) => string;
  className?: string;
  /** Chaves selecionadas. Passar (mesmo vazio) liga a coluna de selecao. */
  selected?: Set<string>;
  onToggleRow?: (key: string) => void;
  onToggleAll?: () => void;
  rowAction?: (row: T) => ReactNode;
}) {
  const selectable = selected !== undefined;
  const allSelected = selectable && rows.length > 0 && rows.every((r, i) => selected.has(getKey(r, i)));

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {selectable && (
              <th scope="col" className="w-0 border-b-thin border-border-subtle px-sm py-xs">
                <CheckCell checked={allSelected} onChange={() => onToggleAll?.()} label="Selecionar todas as linhas" />
              </th>
            )}
            {columns.map((c) => (
              <th
                key={c.key}
                scope="col"
                className={`santo-caption-semibold border-b-thin border-border-subtle px-sm py-xs whitespace-nowrap text-text-secondary ${c.numeric ? "text-right" : "text-left"}`}
              >
                {c.header}
              </th>
            ))}
            {rowAction && <th scope="col" className="w-0 border-b-thin border-border-subtle px-sm py-xs" />}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const key = getKey(row, i);
            return (
              <tr
                key={key}
                data-selected={selectable && selected.has(key) ? "" : undefined}
                className="transition-colors duration-(--santo-motion-duration-fast) hover:bg-neutral-subtle-default data-selected:bg-selected"
              >
                {selectable && (
                  <td className="border-b-thin border-border-subtle px-sm py-xs">
                    <CheckCell
                      checked={selected.has(key)}
                      onChange={() => onToggleRow?.(key)}
                      label={`Selecionar linha ${i + 1}`}
                    />
                  </td>
                )}
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className={`santo-body-small-regular border-b-thin border-border-subtle px-sm py-xs ${c.numeric ? "text-right tabular-nums" : "text-left"}`}
                  >
                    {c.render(row)}
                  </td>
                ))}
                {rowAction && (
                  <td className="border-b-thin border-border-subtle px-sm py-xs text-right">
                    {rowAction(row)}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/** Caixa de selecao enxuta, so para dentro da tabela. */
function CheckCell({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`grid size-md cursor-pointer place-items-center rounded-xs border-thin transition-colors duration-(--santo-motion-duration-fast) ${
        checked
          ? "border-border-brand bg-brand-solid-default text-text-on-brand"
          : "border-border-default bg-input-default hover:border-border-strong"
      }`}
    >
      {checked && (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" style={{ width: "var(--santo-dimension-icon-12)", height: "var(--santo-dimension-icon-12)" }}>
          <path d="m4 12 5 5L20 6" />
        </svg>
      )}
    </button>
  );
}

const WEEKDAYS = ["D", "S", "T", "Q", "Q", "S", "S"];

/**
 * Grade de um mês.
 *
 * As células têm **tamanho fixo** e a grade é `w-fit`. Não é detalhe: com
 * `aspect-square` num cartão largo, cada dia vira um quadrado de 70px e o mês
 * deixa de parecer um mês. Tamanho fixo mantém a proporção certa em qualquer
 * container, sem depender de `max-width` para segurar.
 *
 * O intervalo é uma faixa contínua desenhada no invólucro da célula —
 * arredondada só nas pontas e nas quebras de semana. O dia de hoje é um disco
 * do mesmo tamanho da faixa, então os dois se alinham em vez de brigar.
 *
 * Estática de propósito: existe para o preview mostrar densidade de texto
 * pequeno e estados de seleção, não para escolher data.
 */
export function Calendar({
  month,
  year,
  startWeekday,
  days,
  selected = [],
  today,
  className = "",
}: {
  month: string;
  year: number;
  /** 0 = domingo. Em que coluna o dia 1 começa. */
  startWeekday: number;
  days: number;
  selected?: number[];
  today?: number;
  className?: string;
}) {
  const cells: (number | null)[] = [
    ...Array.from({ length: startWeekday }, () => null),
    ...Array.from({ length: days }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const isSelected = (day: number | null) => day !== null && selected.includes(day);

  return (
    <div className={`mx-auto flex w-fit flex-col gap-2xs ${className}`}>
      <div className="flex items-center justify-between gap-2xs">
        <button
          type="button"
          aria-label="Mês anterior"
          className="grid size-xl cursor-pointer place-items-center rounded-md text-text-tertiary transition-colors duration-(--santo-motion-duration-fast) hover:bg-neutral-subtle-default hover:text-text-primary"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="santo-body-small-semibold">
          {month} {year}
        </span>
        <button
          type="button"
          aria-label="Próximo mês"
          className="grid size-xl cursor-pointer place-items-center rounded-md text-text-tertiary transition-colors duration-(--santo-motion-duration-fast) hover:bg-neutral-subtle-default hover:text-text-primary"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-7">
        {WEEKDAYS.map((d, i) => (
          <span
            key={i}
            className="santo-caption-small-medium grid h-lg w-2xl place-items-center text-text-tertiary"
          >
            {d}
          </span>
        ))}

        {cells.map((day, i) => {
          if (day === null) return <span key={`vazio-${i}`} className="size-2xl" />;

          const selectedNow = isSelected(day);
          // Ponta da faixa: vizinho fora da seleção, ou quebra de semana.
          const joinLeft = selectedNow && isSelected(cells[i - 1] ?? null) && i % 7 !== 0;
          const joinRight = selectedNow && isSelected(cells[i + 1] ?? null) && i % 7 !== 6;
          const isToday = day === today;

          return (
            <span
              key={day}
              className={`grid size-2xl place-items-center ${selectedNow ? "bg-neutral-subtle-active" : ""} ${joinLeft ? "" : "rounded-l-full"} ${joinRight ? "" : "rounded-r-full"}`}
            >
              <span
                className={`santo-caption-regular grid size-2xl place-items-center rounded-full tabular-nums ${
                  isToday
                    ? "bg-neutral-solid-default text-text-on-neutral"
                    : selectedNow
                      ? "text-text-primary"
                      : "text-text-secondary"
                }`}
              >
                {day}
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
