import type { ReactNode } from "react";

/**
 * Ancora de um bloco de visualizacao (alvo do indice lateral). Coluna flex: o
 * cartao filho ocupa a largura e fica com a altura do proprio conteudo (sem
 * margem morta). col-span/row-span vem por className.
 */
export function Block({
  id,
  fill = false,
  className = "",
  children,
}: {
  id: string;
  /** Numa fileira com stretch, o cartao filho ocupa a altura da celula. */
  fill?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div id={id} className={`flex min-w-0 scroll-mt-6xl flex-col ${fill ? "*:flex-1" : ""} ${className}`}>
      {children}
    </div>
  );
}
