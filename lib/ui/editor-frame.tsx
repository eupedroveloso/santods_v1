import type { ReactNode } from "react";

/**
 * Bancada de edição em três painéis: navegação à esquerda (chão sunken),
 * documento vivo no centro (chão da página) e ajustes à direita, também no
 * chão sunken e SEM caixa: abas, seções e campos direto sobre o chão (os
 * campos seguem como poços pelo santo-floor).
 * Use em editor que mexe num valor e mostra o resultado ao lado (Estúdio,
 * editor de tema). O pai dá a altura (`className`) e decide o que cada painel
 * mostra; quem rola é cada painel, não a página.
 *
 * Abaixo de lg a navegação some e `mobileNav` aparece no topo do centro;
 * abaixo de xl o painel desce para baixo do centro e tudo rola junto.
 * Larguras: degraus primitivos de espaço no papel de largura de layout
 * (space/256 e space/384), como o LAYOUT da doc — não há token de painel.
 */
export function EditorFrame({
  nav,
  panel,
  children,
  mobileNav,
  navLabel = "Navegação",
  panelLabel = "Ajustes",
  className = "",
}: {
  /** Painel esquerdo: seletor e lista de destinos (AppSidebar). */
  nav: ReactNode;
  /** Painel direito: cartões de ajuste empilhados. */
  panel: ReactNode;
  /** O documento vivo. */
  children: ReactNode;
  /** Substituto compacto da navegação abaixo de lg (Select). */
  mobileNav?: ReactNode;
  navLabel?: string;
  panelLabel?: string;
  className?: string;
}) {
  return (
    <div className={`flex min-h-0 ${className}`}>
      <aside
        aria-label={navLabel}
        className="hidden w-(--santo-dimension-space-256) shrink-0 flex-col gap-sm overflow-y-auto scrollbar-edge border-r-thin border-border-subtle bg-surface-sunken p-sm lg:flex"
      >
        <div className="santo-floor flex min-w-0 flex-col gap-sm">{nav}</div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto xl:flex-row xl:overflow-hidden">
        <section className="flex min-w-0 flex-col gap-xl p-md lg:p-xl xl:flex-1 xl:overflow-y-auto">
          {mobileNav && <div className="flex flex-col gap-sm lg:hidden">{mobileNav}</div>}
          {children}
        </section>
        {/* Chão sunken, como a navegação: os ajustes são cartões raised sobre ele, sem moldura dupla. */}
        <aside
          aria-label={panelLabel}
          className="flex shrink-0 flex-col bg-surface-sunken p-md lg:p-xl xl:w-(--santo-dimension-space-384) xl:overflow-y-auto xl:px-md xl:pt-xl"
        >
          {/* santo-floor: campos e trilhos sobre o chão sem caixa (surface.css). */}
          <div className="santo-floor flex min-w-0 flex-col gap-xl">{panel}</div>
        </aside>
      </div>
    </div>
  );
}
