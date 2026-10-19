import type { ReactNode } from "react";

/**
 * Tecla de atalho.
 *
 * Use para ensinar um atalho ao lado de onde ele age (⌘K no campo de busca,
 * Esc no rodape de um painel). Nao use como rotulo decorativo: se a tecla nao
 * faz nada ali, ela so ensina errado.
 */
export function Kbd({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <kbd
      className={`santo-caption-small-medium inline-flex h-(--santo-dimension-size-20) min-w-(--santo-dimension-size-20) shrink-0 items-center justify-center gap-3xs rounded-xs border-thin border-border-subtle bg-surface-sunken px-2xs font-sans text-text-secondary ${className}`}
    >
      {children}
    </kbd>
  );
}
