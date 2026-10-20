"use client";

import type { ReactNode } from "react";
import { NavItem, NavSection, SidebarNav } from "./nav";
import { RailItem, RailNav } from "./rail-nav";
import { SearchTrigger } from "./search-trigger";

export type AppSidebarArea = { id: string; label: string; icon: ReactNode };
export type AppSidebarItem = { href: string; label: string; icon?: ReactNode; active?: boolean };
export type AppSidebarGroup = { title?: string; items: AppSidebarItem[] };

/**
 * Sidebar completa de aplicacao ou documentacao: trilho de AREAS (RailNav) no
 * topo, colado ao campo de busca, e ao lado o painel de SECOES da area ativa
 * (SidebarNav agrupada por NavSection) — um bloco so (skill santo-ui-craft §7).
 *
 * Use quando o produto tem poucas areas grandes (Inicio, Exemplos,
 * Componentes...) e cada uma tem muitas secoes. Clicar no trilho so troca o
 * painel (`onAreaChange`); quem decide a area pela rota e quem navega e o
 * pai. O trilho fica sticky no topo enquanto a lista rola.
 */
export function AppSidebar({
  areas,
  area,
  onAreaChange,
  groups,
  onSearch,
  onNavigate,
  railLabel = "Áreas",
  className = "",
}: {
  areas: AppSidebarArea[];
  /** Id da area ativa. */
  area: string;
  onAreaChange: (id: string) => void;
  /** Secoes da area ativa. Grupo sem titulo = itens soltos no topo. */
  groups: AppSidebarGroup[];
  /** Liga o campo de busca (abre a paleta ⌘K). */
  onSearch?: () => void;
  /** Depois de clicar num item (fechar a gaveta no celular, por exemplo). */
  onNavigate?: () => void;
  /** Rotulo do <nav> do trilho; o do painel e o nome da area ativa. */
  railLabel?: string;
  className?: string;
}) {
  return (
    <div className={`flex gap-xs ${className}`}>
      <div className="sticky top-0 self-start">
        <RailNav label={railLabel}>
          {areas.map((a) => (
            <RailItem key={a.id} icon={a.icon} label={a.label} active={area === a.id} onClick={() => onAreaChange(a.id)} />
          ))}
        </RailNav>
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-md">
        {onSearch && <SearchTrigger onClick={onSearch} />}
        <SidebarNav label={areas.find((a) => a.id === area)?.label ?? "Seções"}>
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
    </div>
  );
}
