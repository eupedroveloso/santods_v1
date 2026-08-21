import type { ReactNode } from "react";
import type { ShadowName } from "@/lib/tokens";

/**
 * Cartao: superficie elevada que agrupa um assunto so.
 *
 * Padrao do sistema: `surface/raised` sobre `surface/page`, borda `border/subtle`,
 * raio `radius/xl` e sombra `xs`. A borda existe para o cartao nao sumir no modo
 * escuro, onde a sombra praticamente nao aparece.
 */

export function Card({
  children,
  className = "",
  elevation = "xs",
  padded = true,
}: {
  children: ReactNode;
  className?: string;
  elevation?: ShadowName;
  /** Desligue quando o conteudo precisar encostar na borda (tabela, imagem). */
  padded?: boolean;
}) {
  return (
    <div
      className={`flex min-w-0 flex-col rounded-xl border-thin border-border-subtle bg-surface-raised ${padded ? "gap-md p-lg" : ""} ${className}`}
      style={{ boxShadow: `var(--santo-shadow-${elevation})` }}
    >
      {children}
    </div>
  );
}

/** Titulo + descricao, com o espacamento certo entre eles. */
export function CardHeader({
  title,
  description,
  action,
  className = "",
}: {
  title: ReactNode;
  description?: ReactNode;
  /** Canto superior direito: botao, tag ou menu. */
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-start justify-between gap-sm ${className}`}>
      <div className="flex min-w-0 flex-col gap-3xs">
        <h3 className="santo-heading-6-semibold truncate">{title}</h3>
        {description && (
          <p className="santo-body-small-regular text-text-secondary">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

/** Numero grande com rotulo, do jeito que aparece nos cartoes de metrica. */
export function Stat({
  label,
  value,
  delta,
  className = "",
}: {
  label: ReactNode;
  value: ReactNode;
  delta?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-3xs ${className}`}>
      <span className="santo-body-small-regular text-text-secondary">{label}</span>
      <span className="santo-heading-4-bold tabular-nums">{value}</span>
      {delta && <span className="santo-caption-regular text-text-tertiary">{delta}</span>}
    </div>
  );
}

/** Divisor de 1px alinhado ao token de borda. */
export function Divider({ className = "" }: { className?: string }) {
  return <hr className={`border-0 border-t-thin border-border-subtle ${className}`} />;
}
