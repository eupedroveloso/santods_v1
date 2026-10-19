"use client";

import Link from "next/link";
import { Button } from "./button";
import { Count } from "./chip";
import { Avatar } from "./data";
import type { ReactNode } from "react";

/**
 * Navegacao lateral de aplicacao (skill santo-ui-craft, secao 7).
 *
 * Painel de secoes ao lado do trilho (RailNav). O item ativo e a PILULA
 * ELEVADA (surface/raised + shadow-xs) sobre o chao do painel; hover so
 * tonaliza. Subitens ficam em `NavSub`, com conectores de arvore saindo do
 * centro do icone do pai. Contagem em pilula a direita (`count`).
 */

export function SidebarNav({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <nav className={`flex flex-col gap-3xs ${className}`}>{children}</nav>;
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
export function NavSub({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-3xs pl-xl">{children}</div>;
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
  const className = `group santo-body-small-medium santo-transition-elevation flex h-(--santo-dimension-size-36) w-full cursor-pointer items-center gap-xs rounded-full px-sm text-left ${tone}`;
  const content = (
    <>
      {icon && (
        <span
          // Icone um tom abaixo do texto: tertiary em repouso (texto em secondary),
          // sobe para secondary no hover e acompanha o texto primary no ativo.
          className={`santo-transition-colors shrink-0 ${
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
    <div className="relative not-last:before:absolute not-last:before:-top-3xs not-last:before:-bottom-3xs not-last:before:-left-sm not-last:before:border-l-thin not-last:before:border-border-subtle">
      {/* Curva do tronco ate o meio do item. */}
      <span aria-hidden className="absolute -top-3xs bottom-1/2 -left-sm w-sm rounded-bl-md border-b-thin border-l-thin border-border-subtle" />
      {item}
    </div>
  );
}

/** Rodape da nav: quem esta logado, numa pilula elevada. */
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
    <div className="santo-edge flex items-center gap-xs rounded-full bg-surface-raised p-2xs pr-xs shadow-xs">
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
