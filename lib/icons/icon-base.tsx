// GERADO POR scripts/figma-icons.mjs A PARTIR DA PAGINA ICONES DO FIGMA.
// Nao edite. Para incluir um icone, adicione o slug em lib/icons/needed.txt.

import type { ReactNode } from "react";

export type IconSize = 12 | 16 | 20 | 24 | 32 | 40 | 48;

export type IconProps = {
  /**
   * Altura, casa com os tokens dimension/icon/*. Sem ela, o icone herda
   * --santo-icon-size do contexto (o controle define com --santo-control-icon-*)
   * e cai em dimension/icon/16.
   */
  size?: IconSize;
  className?: string;
  /** Rotulo acessivel. Sem ele, o icone e decorativo. */
  title?: string;
};

/** Moldura comum: cor por currentColor, tamanho por token, viewBox do Figma preservado. */
export function IconBase({
  size,
  className = "",
  title,
  viewBox,
  ratio,
  children,
}: IconProps & { viewBox: string; ratio: number; children: ReactNode }) {
  const height = size ? `var(--santo-dimension-icon-${size})` : "var(--santo-icon-size, var(--santo-dimension-icon-16))";
  return (
    <svg
      viewBox={viewBox}
      fill="currentColor"
      style={{ height, width: ratio === 1 ? height : `calc(${height} * ${ratio})` }}
      className={`shrink-0 ${className}`}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}
