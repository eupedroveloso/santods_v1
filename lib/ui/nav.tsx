"use client";

import type { ReactNode } from "react";

/**
 * Navegacao lateral de aplicacao.
 *
 * O item ativo usa `bg/neutral/solid` — solido, nao sutil — porque num painel
 * cheio de superficies claras o preenchimento sutil some. Titulo de secao usa
 * caption em `text/tertiary`, sem caixa alta forcada.
 */

export function SidebarNav({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <nav className={`flex flex-col gap-3xs ${className}`}>{children}</nav>;
}

export function NavSection({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3xs pt-sm first:pt-0">
      {title && (
        <span className="santo-caption-medium px-xs py-3xs text-text-tertiary">{title}</span>
      )}
      {children}
    </div>
  );
}

export function NavItem({
  icon,
  children,
  active,
  emphasis,
  onClick,
}: {
  icon?: ReactNode;
  children: ReactNode;
  active?: boolean;
  /** Item de acao no topo da nav, tipo "Criar". */
  emphasis?: boolean;
  onClick?: () => void;
}) {
  const tone = emphasis
    ? "bg-neutral-solid-default text-text-on-neutral hover:bg-neutral-solid-hover"
    : active
      ? "bg-neutral-subtle-active text-text-primary"
      : "text-text-secondary hover:bg-neutral-subtle-default hover:text-text-primary";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`santo-body-small-medium flex w-full cursor-pointer items-center gap-xs rounded-md px-xs py-2xs text-left transition-colors duration-(--santo-motion-duration-fast) ease-(--santo-motion-easing-standard) ${tone}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="min-w-0 flex-1 truncate">{children}</span>
    </button>
  );
}

/** Rodape da nav: quem esta logado. */
export function NavUser({
  name,
  email,
  action,
}: {
  name: string;
  email: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-center gap-xs rounded-md px-xs py-2xs">
      <span className="grid size-2xl shrink-0 place-items-center rounded-md bg-neutral-subtle-active">
        <span className="santo-caption-small-semibold text-text-secondary">
          {name.slice(0, 2).toUpperCase()}
        </span>
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="santo-body-small-semibold truncate">{name}</span>
        <span className="santo-caption-regular truncate text-text-tertiary">{email}</span>
      </span>
      {action}
    </div>
  );
}

/** Paginacao de tabela: contagem a esquerda, botoes a direita. */
export function Pagination({
  summary,
  onPrevious,
  onNext,
  canPrevious,
  canNext,
}: {
  summary: ReactNode;
  onPrevious?: () => void;
  onNext?: () => void;
  canPrevious?: boolean;
  canNext?: boolean;
}) {
  const btn =
    "santo-caption-semibold cursor-pointer rounded-md border-thin border-border-default px-sm py-2xs text-text-primary transition-colors duration-(--santo-motion-duration-fast) hover:bg-neutral-subtle-default disabled:cursor-not-allowed disabled:border-border-disabled disabled:text-text-disabled disabled:hover:bg-transparent";
  return (
    <div className="flex items-center justify-between gap-md">
      <span className="santo-caption-regular text-text-tertiary">{summary}</span>
      <div className="flex gap-2xs">
        <button type="button" className={btn} onClick={onPrevious} disabled={!canPrevious}>
          Anterior
        </button>
        <button type="button" className={btn} onClick={onNext} disabled={!canNext}>
          Próxima
        </button>
      </div>
    </div>
  );
}
