import type { ReactNode } from "react";

/**
 * Cabecalho de dashboard: titulo (heading-4, um degrau acima do numero de KPI) + meta curta na mesma linha, e a
 * direita o filtro de periodo (Segmented) e a acao primaria — alinhado a
 * grade de cartoes logo abaixo (mesma largura, sem padding proprio). Abaixo de
 * md, os controles descem para a linha de baixo. Sem subhead.
 */
export function DashboardHeader({
  title,
  meta,
  filter,
  action,
}: {
  title: string;
  /** Ao lado do titulo: "Atualizado há 2 min", Count. */
  meta?: ReactNode;
  /** Filtro de periodo: <Segmented …/>. */
  filter?: ReactNode;
  /** Acao primaria: <Button variant="primary">. */
  action?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-sm md:flex-row md:items-center md:justify-between">
      <div className="flex min-w-0 items-baseline gap-sm">
        <h2 className="santo-heading-4-bold tracking-tight text-text-primary">{title}</h2>
        {meta && <span className="santo-caption-medium text-text-tertiary">{meta}</span>}
      </div>
      {(filter || action) && (
        <div className="flex flex-wrap items-center gap-sm">
          {filter}
          {action}
        </div>
      )}
    </header>
  );
}
