"use client";

import Link from "next/link";
import { Button } from "./button";
import { Count } from "./chip";
import { Avatar } from "./data";
import { Children, type ReactNode } from "react";
import { RADIUS_TRACK } from "./radius";
import { NAV_BRANCH_CLASS, NAV_ELBOW_CLASS, NAV_ELBOW_STYLE, NAV_ICON_CLASS, NAV_ROW_CLASS } from "./nav-layout";

/**
 * Navegacao lateral de aplicacao (skill santo-ui-craft, secao 7).
 *
 * Painel de secoes ao lado do trilho (RailNav). O item ativo e a PILULA
 * ELEVADA (surface/raised + shadow-xs) sobre o chao do painel; hover so
 * tonaliza. Subitens ficam em `NavSub`, com conectores de arvore saindo do
 * centro do icone do pai. Contagem em pastilha a direita (`count`).
 */

export function SidebarNav({
  children,
  label = "Seções",
  className = "",
}: {
  children: ReactNode;
  /** Nome do landmark: com trilho + painel ha dois <nav>, cada um precisa do seu. */
  label?: string;
  className?: string;
}) {
  return (
    <nav aria-label={label} className={`flex flex-col gap-3xs ${className}`}>
      {children}
    </nav>
  );
}

/**
 * Grupo da navegacao. O respiro ENTRE grupos (space/xl) e bem maior que o
 * gap entre itens (space/3xs) — e o que faz cada grupo ler como um bloco. O
 * titulo ganha um pouco mais em cima (xs) que embaixo (2xs): pertence aos
 * itens de baixo, nao aos de cima.
 */
export function NavSection({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3xs pt-xl first:pt-0">
      {title && (
        <span className="santo-caption-medium px-sm pt-xs pb-2xs text-text-tertiary">{title}</span>
      )}
      {children}
    </div>
  );
}

/**
 * Subitens de um NavItem, com conectores de arvore. O tronco sai do centro do
 * icone do pai (px-sm + metade do icone de 16 = 20px = space/xl - space/sm).
 */
export function NavSub({ children, branches = false }: { children: ReactNode; /** Desenha ramos em folhas e pastas, sem precisar de NavItem sub. */ branches?: boolean }) {
  return (
    <div className="relative flex flex-col gap-3xs pl-xl">
      {branches ? Children.map(children, (child) => child && (
        <div className={NAV_BRANCH_CLASS} data-nav-branch>
          <span aria-hidden className={NAV_ELBOW_CLASS} style={NAV_ELBOW_STYLE} />
          {child}
        </div>
      )) : children}
    </div>
  );
}

export function NavItem({
  icon,
  children,
  active,
  emphasis,
  count,
  sub,
  onClick,
  href,
}: {
  icon?: ReactNode;
  children: ReactNode;
  active?: boolean;
  /** Item de acao no topo da nav, tipo "Criar": o acento da regiao. */
  emphasis?: boolean;
  /** Contagem a direita: numero vira <Count>; ReactNode passa direto. */
  count?: ReactNode;
  /** Subitem dentro de NavSub: desenha o conector de arvore. */
  sub?: boolean;
  onClick?: () => void;
  /** Vira link de navegacao em vez de botao — o certo quando o item troca de pagina. */
  href?: string;
}) {
  const tone = emphasis
    ? "bg-brand-solid-default text-text-on-brand hover:bg-brand-solid-hover shadow-xs"
    : active
      ? "bg-surface-raised text-text-primary shadow-xs"
      : "text-text-secondary hover:bg-neutral-subtle-default hover:text-text-primary";
  const className = `group ${NAV_ROW_CLASS} ${tone}`;
  const content = (
    <>
      {icon && (
        <span
          // Icone um tom abaixo do texto: tertiary em repouso (texto em secondary),
          // sobe para secondary no hover e acompanha o texto primary no ativo.
          className={`santo-transition-colors ${NAV_ICON_CLASS} ${
            emphasis ? "" : active ? "text-icon-primary" : "text-icon-tertiary group-hover:text-icon-secondary"
          }`}
        >
          {icon}
        </span>
      )}
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {count !== undefined && count !== null && (typeof count === "number" ? <Count>{count}</Count> : count)}
    </>
  );
  const item = href ? (
    <Link href={href} onClick={onClick} aria-current={active ? "page" : undefined} className={className}>
      {content}
    </Link>
  ) : (
    <button type="button" onClick={onClick} aria-current={active ? "page" : undefined} className={className}>
      {content}
    </button>
  );
  if (!sub) return item;
  return (
    // Tronco que continua para o proximo irmao: so quando nao e o ultimo.
    <div className={NAV_BRANCH_CLASS}>
      {/* Curva do tronco ate o meio do item. */}
      <span aria-hidden className={NAV_ELBOW_CLASS} style={NAV_ELBOW_STYLE} />
      {item}
    </div>
  );
}

/** Rodape da nav: quem esta logado, numa pastilha elevada. */
export function NavUser({
  name,
  email,
  action,
  avatarSrc,
}: {
  name: string;
  email: string;
  action?: ReactNode;
  /** Foto do Avatar; sem ela, as iniciais. */
  avatarSrc?: string;
}) {
  return (
    <div className={`santo-edge flex items-center gap-xs ${RADIUS_TRACK} bg-surface-raised p-2xs pr-xs shadow-xs`}>
      <Avatar name={name} src={avatarSrc} size={32} />
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
  return (
    <div className="flex items-center justify-between gap-md">
      <span className="santo-caption-regular text-text-tertiary">{summary}</span>
      <div className="flex gap-2xs">
        <Button size="sm" onClick={onPrevious} disabled={!canPrevious}>
          Anterior
        </Button>
        <Button size="sm" onClick={onNext} disabled={!canNext}>
          Próxima
        </Button>
      </div>
    </div>
  );
}
