import type { ReactNode } from "react";

/**
 * Linha de lista: marcador a esquerda (IconTile ou Avatar), titulo, metadado
 * curto e algo a direita (valor, Select, IconButton). Transacoes, membros de
 * time, quem tem acesso. `divider` separa da proxima linha por hairline —
 * nunca cartao nem sombra por linha (skill santo-ui-craft). Acao a direita e
 * IconButton `ghost`. `interactive` da hover tonal INSET com raio aninhado
 * (santo-row: min(radius/sm, raio interno do Card)).
 */
export function ListRow({
  leading,
  title,
  meta,
  trailing,
  divider,
  interactive,
  className = "",
}: {
  leading?: ReactNode;
  title: ReactNode;
  /** Metadado curto (data, e-mail, categoria) — dado, nao explicacao. */
  meta?: ReactNode;
  trailing?: ReactNode;
  divider?: boolean;
  /** Linha clicavel (o pai cuida do clique): hover tonal com raio. */
  interactive?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center gap-sm py-sm ${divider ? "border-b-thin border-border-subtle last:border-b-0" : ""} ${
        interactive ? "santo-row -mx-sm cursor-pointer px-sm hover:bg-neutral-subtle-default" : ""
      } ${className}`}
    >
      {leading}
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="santo-body-small-semibold truncate text-text-primary">{title}</span>
        {meta && <span className="santo-caption-regular truncate text-text-tertiary">{meta}</span>}
      </span>
      {trailing && <span className="shrink-0 tabular-nums">{trailing}</span>}
    </div>
  );
}
