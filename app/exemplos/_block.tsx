import type { ReactNode } from "react";

/**
 * Ancora de um bloco de visualizacao (alvo do indice lateral). E `grid` de
 * proposito: o cartao filho estica em largura e altura, entao a fileira da
 * grade continua com alturas iguais. col-span/row-span vem por className.
 */
export function Block({ id, className = "", children }: { id: string; className?: string; children: ReactNode }) {
  return (
    <div id={id} className={`grid min-w-0 grid-cols-1 scroll-mt-6xl ${className}`}>
      {children}
    </div>
  );
}
