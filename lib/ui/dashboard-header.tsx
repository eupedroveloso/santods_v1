"use client";

import type { ReactNode } from "react";
import { Button } from "./button";
import { Segmented, type Segment } from "./segmented";

/**
 * Cabecalho de dashboard: titulo (heading-4, um degrau acima do numero de KPI) +
 * meta curta na mesma linha, e a direita o filtro de periodo (Segmented) e a
 * acao primaria — alinhado a grade de cartoes logo abaixo (mesma largura, sem
 * padding proprio). Abaixo de md, os controles descem. Sem subhead.
 *
 * Por DADO (a tela de exemplo so compoe, regra D): `periods` + `period` +
 * `onPeriodChange` desenham o Segmented; `primaryAction` desenha o Button
 * primario. Os slots `filter`/`action` continuam para quem precisa de outra peca.
 */
export function DashboardHeader<T extends string>({
  title,
  meta,
  periods,
  period,
  onPeriodChange,
  primaryAction,
  filter,
  action,
}: {
  title: string;
  /** Ao lado do titulo: "Atualizado há 2 min". */
  meta?: ReactNode;
  /** Periodos do filtro (Segmented). */
  periods?: Segment<T>[];
  period?: T;
  onPeriodChange?: (value: T) => void;
  /** Acao primaria: rotulo, icone e clique. */
  primaryAction?: { label: string; icon?: ReactNode; onClick?: () => void };
  /** Slot livre no lugar do filtro. */
  filter?: ReactNode;
  /** Slot livre no lugar da acao. */
  action?: ReactNode;
}) {
  const periodFilter =
    periods && period !== undefined && onPeriodChange ? (
      <Segmented value={period} onChange={onPeriodChange} options={periods} />
    ) : null;
  const primary = primaryAction ? (
    <Button variant="primary" leading={primaryAction.icon} onClick={primaryAction.onClick}>
      {primaryAction.label}
    </Button>
  ) : null;
  const right = filter ?? periodFilter;
  const act = action ?? primary;
  return (
    <header className="flex flex-col gap-sm md:flex-row md:items-center md:justify-between">
      <div className="flex min-w-0 items-baseline gap-sm">
        <h2 className="santo-heading-4-bold tracking-tight text-text-primary">{title}</h2>
        {meta && <span className="santo-caption-medium text-text-tertiary">{meta}</span>}
      </div>
      {(right || act) && (
        <div className="flex flex-wrap items-center gap-sm">
          {right}
          {act}
        </div>
      )}
    </header>
  );
}
