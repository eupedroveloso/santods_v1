import type { ReactNode } from "react";

/**
 * Cabeçalho de seção de painel.
 *
 * O fio ao lado do rótulo é o que separa blocos num painel estreito, onde não há
 * espaço para o silêncio fazer esse trabalho sozinho.
 */
export function PanelSection({
  title,
  hint,
  children,
  action,
}: {
  title: string;
  /** Uma linha, no máximo. Painel de controle não é lugar de parágrafo. */
  hint?: ReactNode;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-md">
      <div className="flex flex-col gap-2xs">
        <div className="flex items-center gap-xs">
          <h3 className="santo-caption-small-semibold shrink-0 tracking-wide text-text-tertiary uppercase">
            {title}
          </h3>
          <span className="h-px min-w-0 flex-1 bg-border-subtle" />
          {action}
        </div>
        {hint && <p className="santo-caption-small-regular text-text-tertiary">{hint}</p>}
      </div>
      {children}
    </section>
  );
}

/** Rótulo acima do campo. Use quando o rótulo é longo e a coluna é estreita. */
export function StackedField({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-2xs">
      <span className="santo-body-small-medium text-text-primary">{label}</span>
      {children}
      {hint && <span className="santo-caption-small-regular text-text-tertiary">{hint}</span>}
    </div>
  );
}
