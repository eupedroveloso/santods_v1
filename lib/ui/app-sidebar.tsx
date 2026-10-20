"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { IconButton } from "./button";
import { Count } from "./chip";
import { Disclosure } from "./disclosure";
import { Expand } from "./icons";
import { NavItem, NavSub, SidebarNav } from "./nav";
import { NAV_STEM_STYLE } from "./nav-layout";
import { RailItem, RailNav } from "./rail-nav";
import { SearchTrigger } from "./search-trigger";

export type AppSidebarItem = { href: string; label: string; icon?: ReactNode; active?: boolean; count?: number };
export type AppSidebarGroup = {
  title?: string;
  items: AppSidebarItem[];
  /** Subgrupos com o mesmo Disclosure e estado independente. */
  groups?: AppSidebarGroup[];
  /** Ícone e contador opcionais da pasta; usam a mesma linha dos destinos. */
  icon?: ReactNode;
  count?: number;
  /** Atalho opcional no trilho: abre o grupo e leva o foco ao seu cabeçalho. */
  railIcon?: ReactNode;
};

const groupItems = (group: AppSidebarGroup): AppSidebarItem[] => [
  ...group.items,
  ...(group.groups ?? []).flatMap(groupItems),
];

function activeGroupPaths(groups: AppSidebarGroup[], prefix = ""): string[] {
  return groups.flatMap((group, index) => {
    const path = `${prefix}${index}`;
    return groupItems(group).some((item) => item.active)
      ? [path, ...activeGroupPaths(group.groups ?? [], `${path}.`)]
      : [];
  });
}

/**
 * Use em aplicações ou documentação com muitos destinos agrupados. Os grupos
 * com título recolhem pelo mesmo Disclosure e começam abertos. A navegação
 * reabre o grupo ativo; recolher esse grupo mantém seu item ativo à vista.
 * O trilho traz atalhos aos grupos com railIcon; showRail={false} deixa só
 * o painel, com a mesma navegação e os mesmos estados.
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
  showRail = true,
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
  /** false: só o painel de navegação, sem reservar espaço para o trilho. */
  showRail?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const activeHref = groups.flatMap(groupItems).find((i) => i.active)?.href;
  const [navigation, setNavigation] = useState<{ activeHref?: string; closed: string[] }>({ activeHref, closed: [] });
  // A escolha manual vale até a próxima rota. Só o novo grupo ativo reabre;
  // os demais conservam seu estado durante a navegação.
  if (navigation.activeHref !== activeHref) {
    setNavigation({
      activeHref,
      closed: navigation.closed.filter((path) => !activeGroupPaths(groups).includes(path)),
    });
  }
  const openGroup = (index: number) => {
    setNavigation((state) => ({ ...state, closed: state.closed.filter((path) => path !== String(index)) }));
    ref.current?.querySelector<HTMLButtonElement>(`[data-sidebar-group="${index}"] button`)?.focus();
  };
  useEffect(() => {
    const root = ref.current;
    const reveal = () => {
      const active = root?.querySelector('[aria-current="page"]');
      if (!active) return;
      // Role apenas o aside/gaveta. Demos embutidas não devem deslocar a página.
      for (let parent = root?.parentElement; parent && parent !== document.body; parent = parent.parentElement) {
        if (!/auto|scroll/.test(getComputedStyle(parent).overflowY)) continue;
        const item = active.getBoundingClientRect();
        const viewport = parent.getBoundingClientRect();
        if (item.top < viewport.top) parent.scrollTop += item.top - viewport.top;
        else if (item.bottom > viewport.bottom) parent.scrollTop += item.bottom - viewport.bottom;
        break;
      }
    };
    reveal();
    // O aside pode nascer oculto no mobile. Revele ao aparecer/mudar de largura
    // ou viewport, sem puxar o scroll durante a exploração de outras pastas.
    let rootWidth = root?.getBoundingClientRect().width ?? 0;
    const resize = new ResizeObserver((entries) => {
      let changed = false;
      for (const entry of entries) {
        if (entry.target === root) {
          if (entry.contentRect.width !== rootWidth) changed = true;
          rootWidth = entry.contentRect.width;
        } else changed = true;
      }
      if (changed) reveal();
    });
    if (root) resize.observe(root);
    for (let parent = root?.parentElement; parent && parent !== document.body; parent = parent.parentElement) {
      if (/auto|scroll/.test(getComputedStyle(parent).overflowY)) resize.observe(parent);
    }
    // O grupo pode estar terminando a animação de abertura ao trocar de rota.
    const onTransition = (event: TransitionEvent) => {
      if (event.propertyName === "grid-template-rows" && (event.target as HTMLElement).contains(root?.querySelector('[aria-current="page"]') ?? null)) reveal();
    };
    root?.addEventListener("transitionend", onTransition);
    return () => {
      resize.disconnect();
      root?.removeEventListener("transitionend", onTransition);
    };
  }, [activeHref]);
  const items = (entries: AppSidebarItem[]) => entries.map((item) => (
    <NavItem key={item.href} href={item.href} active={item.active} onClick={onNavigate} icon={item.icon} count={item.count}>
      {item.label}
    </NavItem>
  ));
  const renderGroup = (group: AppSidebarGroup, path: string, ancestorClosed = false, nested = false): ReactNode => {
    const title = group.title;
    const open = !title || !navigation.closed.includes(path);
    const activeItems = !open && !ancestorClosed ? groupItems(group).filter((item) => item.active) : [];
    const children = [
      ...items(open && !ancestorClosed ? group.items : group.items.filter((item) => !item.active)),
      ...(group.groups ?? []).map((child, index) => renderGroup(child, `${path}.${index}`, ancestorClosed || !open, true)),
    ];
    const node = (
      <div data-sidebar-group={title ? path : undefined} className="relative">
        {/* Fora do painel animado: a haste não é recortada pelo overflow do Disclosure. */}
        {title && (open || activeItems.length > 0) && (
          <span aria-hidden className="pointer-events-none absolute border-l-thin border-border-subtle" style={NAV_STEM_STYLE} />
        )}
        {title ? (
          <>
            <Disclosure
              variant="nav"
              label={title}
              leading={group.icon}
              trailing={group.count !== undefined ? <Count>{group.count}</Count> : undefined}
              open={open}
              onToggle={() => setNavigation((state) => ({
                ...state,
                closed: open ? [...state.closed, path] : state.closed.filter((p) => p !== path),
              }))}
            >
              <NavSub branches>{children}</NavSub>
            </Disclosure>
            {/* Um único ativo permanece visível mesmo com um ancestral fechado. */}
            {activeItems.length > 0 && (
              <NavSub branches>{items(activeItems)}</NavSub>
            )}
          </>
        ) : children}
      </div>
    );
    const visibleChildren = title && (open ? children.length > 0 : activeItems.length > 0);
    // Raízes fechadas e Docs home seguem gap-xs. Uma árvore visível ganha
    // mais xs antes da próxima raiz, sem alterar o ritmo dos ramos internos.
    return <div key={path} className={!nested && visibleChildren ? "pb-xs last:pb-0" : undefined}>{node}</div>;
  };
  return (
    <div ref={ref} className={`flex min-w-0 gap-xs ${className}`}>
      {showRail && (
        <RailNav label={`${label} — atalhos`} className="sticky top-0 shrink-0 self-start">
          <IconButton label="Expandir todos os grupos" onClick={() => setNavigation((state) => ({ ...state, closed: [] }))}>
            <Expand size={20} />
          </IconButton>
          {groups.map((group, index) => group.title && group.railIcon ? (
            <RailItem key={index} icon={group.railIcon} label={group.title} onClick={() => openGroup(index)} />
          ) : null)}
        </RailNav>
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-md">
        {onSearch && <SearchTrigger onClick={onSearch} />}
        <SidebarNav label={label}>
          <div className="flex flex-col gap-xs">
            {groups.map((group, index) => renderGroup(group, String(index)))}
          </div>
        </SidebarNav>
      </div>
    </div>
  );
}
