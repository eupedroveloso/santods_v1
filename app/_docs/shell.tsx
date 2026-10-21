"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  buttonClass,
  Card,
  CommandPalette,
  Icon,
  IconButton,
  AppSidebar,
  type AppSidebarGroup,
  BrandLogo,
  type BrandOption,
  NavItem,
  NavSection,
  Nest,
  SidebarNav,
  Tag,
  useModal,
  useModKey,
  Switch,
  type CommandItem,
} from "@/lib/ui";
import { ThemeToggle } from "../_components/theme-toggle";
import { BrandControl } from "../_components/brand-control";
import { canonicalExampleHash } from "../exemplos/_anchors";
import * as FigmaIcons from "@/lib/icons";
import { FIGMA_URL, LAYOUT, TOP_LINKS, navItems, type NavGroup, type NavIcon, type SearchItem } from "./links";

/**
 * Moldura do site de docs: topbar fina, sidebar com busca e area de conteudo.
 *
 * Tudo segue o mesmo tema — topbar, sidebar e conteudo mudam juntos no
 * alternador. O ⌘K (Ctrl K fora do Mac) abre a busca de qualquer pagina.
 */
export function DocsShell({
  nav,
  search,
  brands = [],
  children,
}: {
  nav: NavGroup[];
  search: SearchItem[];
  /** Marcas do DS (modos de Brand); com mais de uma, aparece o seletor de marca. */
  brands?: BrandOption[];
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const mod = useModKey();
  // O editor do Estúdio traz os próprios painéis: sem a sidebar da doc e sem o padding de página.
  const workspace = pathname.startsWith("/estudio/");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const items: CommandItem[] = useMemo(
    // Sem subhead nos resultados (regra do Pedro): a dica so alimenta a busca.
    () =>
      search.map((s) => ({
        id: s.href,
        label: s.label,
        keywords: [s.hint, s.badge].filter(Boolean).join(" "),
        group: s.group,
        trailing: s.badge ? <Tag intent={s.badge === "Primitivo" ? "neutral" : "brand"}>{s.badge}</Tag> : undefined,
      })),
    [search],
  );

  const openSearch = () => {
    setMenuOpen(false);
    setSearchOpen(true);
  };

  const [collapsed, setCollapsed] = useSidebarCollapsed();
  // No aside a faixa do topo (logo, recolher pastas, compactar) fica fixa; na gaveta
  // a logo mora no cabeçalho dela e nada compacta.
  const sidebar = (pinned: boolean) => (
    <Sidebar
      nav={nav}
      pathname={pathname}
      pinned={pinned}
      collapsed={pinned && collapsed}
      onCollapsedChange={pinned ? setCollapsed : undefined}
      onNavigate={() => setMenuOpen(false)}
    />
  );

  // A rota de preview do Estúdio roda dentro de um iframe: sem moldura nenhuma.
  if (pathname === "/estudio/preview") return <>{children}</>;

  return (
    // Sidebar de altura inteira, colada no topo; a topbar fica so sobre o conteudo, na
    // mesma linha (size/56, mesmo divisor) da faixa da logo da sidebar (Pedro, 2026-10-21).
    <div className="flex min-h-full">
      {!workspace && (
        <aside
          style={
            {
              transition: "width var(--santo-motion-duration-normal) var(--santo-motion-easing-standard)",
              "--santo-pinned-bleed": "var(--santo-space-xs)",
            } as CSSProperties
          }
          className={`sticky top-0 hidden h-dvh ${collapsed ? LAYOUT.rail : LAYOUT.sidebar} shrink-0 overflow-y-scroll santo-pinned-scroll scrollbar-edge border-r-thin border-border-subtle px-xs pb-sm lg:block`}
        >
          {sidebar(true)}
        </aside>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-(--santo-layer-sticky) border-b-thin border-border-subtle bg-surface-page">
          {/* Altura total = size/56 com a borda inclusa: igual a faixa da logo na sidebar. */}
          <div className="flex h-[calc(var(--santo-dimension-size-56)-var(--santo-border-thin))] w-full items-center gap-sm px-md md:gap-md lg:px-lg">
            <IconButton label="Abrir menu" size="sm" className="lg:hidden" onClick={() => setMenuOpen(true)}>
              <Icon.Menu size={16} />
            </IconButton>
            {/* Abaixo de lg a sidebar some: a logo volta para a topbar (o simbolo no celular). */}
            <span className="flex lg:hidden">
              <span className="hidden sm:flex"><HomeLogo /></span>
              <span className="flex sm:hidden"><HomeLogo variant="mark" /></span>
            </span>
            <Switch
              checked={pathname.startsWith("/estudio")}
              onChange={() => undefined}
              offHref="/"
              onHref="/estudio"
              label="Área do site"
              offLabel="Documentação"
              onLabel="Estúdio"
              offIcon={<Icon.BookIcon size={16} />}
              onIcon={<Icon.SlidersIcon size={16} />}
              offTone="brand"
              onTone="accent"
            />
            <div className="ml-auto flex items-center gap-2xs">
              {/* Busca no grupo da direita (saiu da sidebar): o mesmo modal do ⌘K. */}
              <IconButton label={`Buscar (${mod} K)`} size="sm" onClick={openSearch} aria-keyshortcuts={`${mod === "⌘" ? "Meta" : "Control"}+K`}>
                <Icon.Search size={16} />
              </IconButton>
              {/* No celular o Figma sai da topbar para caber o alternador; segue na home. */}
              <span className="hidden sm:block">
                <a
                  href={FIGMA_URL}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Abrir o arquivo no Figma"
                  title="Abrir o arquivo no Figma"
                  className={buttonClass({ variant: "ghost", size: "sm", icon: true })}
                >
                  <Icon.Figma size={16} />
                </a>
              </span>
              {/* Dropdown de marca: no celular o gatilho fica so com o ponto da marca. */}
              <BrandControl brands={brands} />
              <ThemeToggle />
            </div>
          </div>
        </header>
        {/* Altura minima = viewport menos a topbar: o rodape da pagina (mt-auto) encosta embaixo. */}
        <main
          className={`flex min-h-[calc(100dvh-var(--santo-dimension-size-56))] min-w-0 flex-1 flex-col ${workspace ? "" : "px-md py-2xl lg:px-3xl"}`}
        >
          {children}
        </main>
      </div>

      {menuOpen && (
        <MenuDrawer onClose={() => setMenuOpen(false)}>
          {sidebar(false)}
        </MenuDrawer>
      )}

      <CommandPalette
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        items={items}
        onSelect={(item) => {
          setSearchOpen(false);
          const [path, anchor] = item.id.split("#");
          if (pathname === "/exemplos" && path === pathname && anchor) {
            const id = canonicalExampleHash(anchor);
            if (window.location.hash.slice(1) === id) document.getElementById(id)?.scrollIntoView();
            else window.location.hash = id;
          } else {
            router.push(item.id);
          }
        }}
        placeholder="Buscar componente, token, estilo…"
        label="Buscar na documentação"
      />
    </div>
  );
}

/** Icone da sidebar pelo nome — o nome e string para atravessar do servidor. */
function NavGlyph({ name, size = 16 }: { name: NavIcon; size?: 16 | 20 }) {
  const Glyph = FigmaIcons[name];
  return <Glyph size={size} />;
}

/** Gaveta do menu no celular: modal de verdade (Esc, foco preso, foco devolvido). */
function MenuDrawer({ onClose, children }: { onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useModal(ref, onClose);
  return (
    <div
      className="santo-animate-fade-in fixed inset-0 z-(--santo-layer-overlay) bg-surface-overlay lg:hidden"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className={`santo-animate-slide-in-left flex h-full ${LAYOUT.drawer} max-w-full flex-col p-xs`}
      >
        {/* Borda dupla: marca e fechar na moldura, navegacao no painel. */}
        <Card
          variant="double"
          padded={false}
          className="h-full"
          header={
            <div className="flex min-w-0 flex-1 items-center justify-between">
              <BrandLogo brand="santo" priority />
              <IconButton label="Fechar menu" size="sm" onClick={onClose}>
                <Icon.Close size={16} />
              </IconButton>
            </div>
          }
        >
          {/* Aninhamento: recuo xs nos quatro lados e entre os blocos do menu. */}
          <Nest inset="xs" className="min-h-0 flex-1 overflow-y-auto">
            <SidebarNav className="lg:hidden">
              <NavSection>
                {TOP_LINKS.map((l) => (
                  <NavItem key={l.href} href={l.href} onClick={onClose}>
                    {l.label}
                  </NavItem>
                ))}
              </NavSection>
            </SidebarNav>
            {children}
          </Nest>
        </Card>
      </div>
    </div>
  );
}

/*
 * Item com hash (/exemplos#dashboard, /tokens/semantic#…) so fica ativo na hash
 * dele ou numa ancora filha (#cartoes-saldo). Sem hash na URL, vale o primeiro
 * item daquela rota — a visualizacao padrao da pagina.
 */
const subscribeHash = (cb: () => void) => {
  window.addEventListener("hashchange", cb);
  window.addEventListener("popstate", cb);
  return () => {
    window.removeEventListener("hashchange", cb);
    window.removeEventListener("popstate", cb);
  };
};
const readHash = () => window.location.hash.slice(1);

function isActive(href: string, pathname: string, hash: string, nav: NavGroup[]) {
  const [path, anchor] = href.split("#");
  if (path !== pathname) return false;
  if (anchor === undefined) return true;
  const activeHash = pathname === "/exemplos" ? canonicalExampleHash(hash) : hash;
  if (activeHash) return activeHash === anchor || activeHash.startsWith(`${anchor}-`);
  const first = nav.flatMap(navItems).find((i) => i.href.split("#")[0] === path);
  return first?.href === href;
}

/** Logo com link para a home, na faixa do topo da sidebar (completa ou reduzida). */
function HomeLogo({ variant = "full" }: { variant?: "full" | "mark" }) {
  return (
    <Link href="/" aria-label="SantoDS — início" className="flex shrink-0 items-center rounded-md">
      <BrandLogo brand="santo" variant={variant} priority={variant === "full"} />
    </Link>
  );
}

/*
 * Sidebar compactada (trilho): mora no localStorage, como tema e marca, e e lida
 * por useSyncExternalStore (servidor = expandida, sem divergir na hidratacao).
 */
const SIDEBAR_KEY = "santo-sidebar";
const sidebarListeners = new Set<() => void>();
const subscribeSidebar = (cb: () => void) => {
  sidebarListeners.add(cb);
  return () => sidebarListeners.delete(cb);
};
const readSidebar = () => {
  try {
    return localStorage.getItem(SIDEBAR_KEY) === "compacta";
  } catch {
    return false;
  }
};
function useSidebarCollapsed(): [boolean, (collapsed: boolean) => void] {
  const collapsed = useSyncExternalStore(subscribeSidebar, readSidebar, () => false);
  const set = (next: boolean) => {
    try {
      if (next) localStorage.setItem(SIDEBAR_KEY, "compacta");
      else localStorage.removeItem(SIDEBAR_KEY);
    } catch {
      // Sem storage (aba privada): a sidebar fica expandida.
    }
    sidebarListeners.forEach((l) => l());
  };
  return [collapsed, set];
}

function Sidebar({
  nav,
  pathname,
  pinned,
  collapsed,
  onCollapsedChange,
  onNavigate,
}: {
  nav: NavGroup[];
  pathname: string;
  pinned: boolean;
  collapsed: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  onNavigate: () => void;
}) {
  const hash = useSyncExternalStore(subscribeHash, readHash, () => "");
  // Atalhos podem repetir destinos (Ícones em Fundamentos e no catálogo).
  // A última ocorrência é a entrada canônica, dentro da camada do componente.
  const activeItem = nav.flatMap(navItems).reverse().find((item) => isActive(item.href, pathname, hash, nav));
  const sidebarGroup = (group: NavGroup): AppSidebarGroup => ({
    title: group.title || undefined,
    icon: group.icon ? <NavGlyph name={group.icon} /> : undefined,
    count: group.count,
    railIcon: group.railIcon ? <NavGlyph name={group.railIcon} size={20} /> : undefined,
    items: group.items.map((item) => ({
      ...item,
      icon: item.icon ? <NavGlyph name={item.icon} /> : undefined,
      active: item === activeItem,
    })),
    groups: group.groups?.map(sidebarGroup),
  });
  return (
    <AppSidebar
      label="Documentação"
      showRail={false}
      foldAll
      pinned={pinned}
      collapsed={collapsed}
      onCollapsedChange={onCollapsedChange}
      // Logo na faixa do topo (só no aside: na gaveta ela já está no cabeçalho).
      brand={pinned ? <HomeLogo /> : undefined}
      brandMark={<HomeLogo variant="mark" />}
      onNavigate={onNavigate}
      groups={nav.map(sidebarGroup)}
    />
  );
}
