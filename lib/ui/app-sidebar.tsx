"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { NavItem, NavSection, SidebarNav } from "./nav";
import { SearchTrigger } from "./search-trigger";

export type AppSidebarItem = { href: string; label: string; icon?: ReactNode; active?: boolean };
export type AppSidebarGroup = { title?: string; items: AppSidebarItem[] };

/**
 * Sidebar completa de aplicacao ou documentacao, numa coluna so: campo de busca
 * no topo e, abaixo, TODOS os grupos ja abertos com os seus itens (rotulo de
 * grupo em Overline, item ativo em pastilha elevada). Sem trilho de icones
 * (Pedro, 2026-10-19): nada escondido atras de um seletor de area — a pessoa
 * ve o mapa inteiro e rola a propria coluna.
 *
 * Use quando a navegacao cabe numa lista longa de secoes. Quem rola e o pai
 * (aside sticky, gaveta); ao montar, o item ativo e trazido para a vista.
 * Quem decide qual item esta ativo e quem navega e o pai.
 */
export function AppSidebar({
  groups,
  onSearch,
  onNavigate,
  label = "Navegação",
  className = "",
}: {
  /** Grupos na ordem de leitura. Grupo sem titulo = itens soltos no topo. */
  groups: AppSidebarGroup[];
  /** Liga o campo de busca (abre a paleta ⌘K). */
  onSearch?: () => void;
  /** Depois de clicar num item (fechar a gaveta no celular, por exemplo). */
  onNavigate?: () => void;
  /** Rotulo do <nav>. */
  label?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const activeHref = groups.flatMap((g) => g.items).find((i) => i.active)?.href;
  useEffect(() => {
    ref.current?.querySelector('[aria-current="page"]')?.scrollIntoView({ block: "center" });
  }, [activeHref]);
  return (
    <div ref={ref} className={`flex min-w-0 flex-col gap-md ${className}`}>
      {onSearch && <SearchTrigger onClick={onSearch} />}
      <SidebarNav label={label}>
        {groups.map((group, i) => (
          <NavSection key={group.title || `grupo-${i}`} title={group.title || undefined}>
            {group.items.map((item) => (
              <NavItem key={item.href} href={item.href} active={item.active} onClick={onNavigate} icon={item.icon}>
                {item.label}
              </NavItem>
            ))}
          </NavSection>
        ))}
      </SidebarNav>
    </div>
  );
}
