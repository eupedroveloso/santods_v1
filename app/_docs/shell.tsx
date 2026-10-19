"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import {
  buttonClass,
  Card,
  CommandPalette,
  Icon,
  IconButton,
  SearchTrigger,
  NavItem,
  NavSection,
  RailItem,
  RailNav,
  SidebarNav,
  Tag,
  useModal,
  useModKey,
  type CommandItem,
} from "@/lib/ui";
import { ThemeToggle } from "../_components/theme-toggle";
import * as FigmaIcons from "@/lib/icons";
import { SantoLogo } from "./logo";
import { FIGMA_URL, LAYOUT, TOP_LINKS, type NavGroup, type NavIcon, type SearchItem } from "./links";

/**
 * Moldura do site de docs: topbar fina, sidebar com busca e area de conteudo.
 *
 * Tudo segue o mesmo tema — topbar, sidebar e conteudo mudam juntos no
 * alternador. O ⌘K (Ctrl K fora do Mac) abre a busca de qualquer pagina.
 */
export function DocsShell({
  nav,
  search,
  children,
}: {
  nav: NavGroup[];
  search: SearchItem[];
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const mod = useModKey();

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

  const sidebar = (
    <Sidebar nav={nav} pathname={pathname} onSearch={openSearch} onNavigate={() => setMenuOpen(false)} />
  );

  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-(--santo-layer-sticky) border-b-thin border-border-subtle bg-surface-page">
        {/* Altura total da topbar = size/56 com a borda inclusa: a trilha sticky (top size/56) e a
            sidebar encostam nela sem vao de 1px. */}
        <div className="flex h-[calc(var(--santo-dimension-size-56)-var(--santo-border-thin))] w-full items-center gap-sm px-md md:gap-md lg:px-lg">
          <IconButton label="Abrir menu" size="sm" className="lg:hidden" onClick={() => setMenuOpen(true)}>
            <Icon.Menu size={16} />
          </IconButton>
          <Link href="/" aria-label="SantoDS — início" className="flex shrink-0 items-center rounded-md">
            <SantoLogo />
          </Link>
          <nav aria-label="Seções" className="hidden items-center gap-3xs lg:flex">
            {TOP_LINKS.map((l) => {
              const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={`santo-body-small-medium rounded-md px-sm py-2xs transition-colors ease-(--santo-motion-easing-standard) duration-(--santo-motion-duration-fast) ${
                    active
                      ? "bg-neutral-subtle-default text-text-primary"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>
          <div className="ml-auto flex items-center gap-2xs">
            <IconButton label={`Buscar (${mod} K)`} size="sm" className="lg:hidden" onClick={openSearch}>
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
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Sem container centralizado: a sidebar encosta na borda esquerda da janela e
          o conteudo ocupa o resto. O max-w de leitura fica so no texto corrido. */}
      <div className="flex w-full flex-1">
        <aside className={`sticky top-(--santo-dimension-size-56) hidden h-[calc(100dvh-var(--santo-dimension-size-56))] ${LAYOUT.sidebar} shrink-0 overflow-y-auto scrollbar-edge border-r-thin border-border-subtle px-xs py-sm lg:block`}>
          {sidebar}
        </aside>
        {/* Altura minima = viewport menos a topbar: assim o rodape da pagina (mt-auto)
            encosta embaixo em pagina curta. */}
        <main className="flex min-h-[calc(100dvh-var(--santo-dimension-size-56))] min-w-0 flex-1 flex-col px-md py-2xl lg:px-3xl">
          {children}
        </main>
      </div>

      {menuOpen && (
        <MenuDrawer onClose={() => setMenuOpen(false)}>
          {sidebar}
        </MenuDrawer>
      )}

      <CommandPalette
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        items={items}
        onSelect={(item) => {
          setSearchOpen(false);
          router.push(item.id);
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
              <SantoLogo />
              <IconButton label="Fechar menu" size="sm" onClick={onClose}>
                <Icon.Close size={16} />
              </IconButton>
            </div>
          }
        >
          <div className="flex min-h-0 flex-1 flex-col gap-sm overflow-y-auto p-xs">
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
          </div>
        </Card>
      </div>
    </div>
  );
}

/*
 * Item com hash (/exemplos#cartoes, /tokens/semantic#…) so fica ativo na hash
 * dele ou numa ancora filha (#cartoes-saldo). Sem hash na URL, vale o primeiro
 * item daquela rota — a visualizacao padrao da pagina.
 */
const subscribeHash = (cb: () => void) => {
  window.addEventListener("hashchange", cb);
  return () => window.removeEventListener("hashchange", cb);
};
const readHash = () => window.location.hash.slice(1);

function isActive(href: string, pathname: string, hash: string, nav: NavGroup[]) {
  const [path, anchor] = href.split("#");
  if (path !== pathname) return false;
  if (anchor === undefined) return true;
  if (hash) return hash === anchor || hash.startsWith(`${anchor}-`);
  const first = nav.flatMap((g) => g.items).find((i) => i.href.split("#")[0] === path);
  return first?.href === href;
}

/*
 * Trilho + painel (skill santo-ui-craft, secao 7): o trilho troca de AREA
 * (Inicio, Exemplos, Fundamentos, Componentes); o painel mostra as secoes da
 * area. A area segue a rota; clicar no trilho so troca o painel (sem navegar)
 * ate a rota mudar. Areas saem dos grupos da nav (titulo do grupo).
 */
type Area = { id: string; label: string; icon: NavIcon; groups: string[] };
const AREAS: Area[] = [
  { id: "inicio", label: "Início", icon: "BookIcon", groups: [""] },
  { id: "exemplos", label: "Exemplos", icon: "Grid2Icon", groups: ["Exemplos"] },
  { id: "fundamentos", label: "Fundamentos", icon: "PaletteIcon", groups: ["Fundamentos"] },
  { id: "componentes", label: "Componentes", icon: "CubeIcon", groups: ["Primitivos", "Semânticos"] },
];

function areaOf(pathname: string, nav: NavGroup[]): string {
  for (const area of AREAS)
    for (const g of nav.filter((g) => area.groups.includes(g.title)))
      if (g.items.some((i) => i.href.split("#")[0] === pathname)) return area.id;
  if (pathname.startsWith("/componentes")) return "componentes";
  if (/^\/(tokens|estilos|identidades)/.test(pathname)) return "fundamentos";
  if (pathname.startsWith("/exemplos")) return "exemplos";
  return "inicio";
}

function Sidebar({
  nav,
  pathname,
  onSearch,
  onNavigate,
}: {
  nav: NavGroup[];
  pathname: string;
  onSearch: () => void;
  onNavigate: () => void;
}) {
  const hash = useSyncExternalStore(subscribeHash, readHash, () => "");
  const routeArea = areaOf(pathname, nav);
  // Escolha manual vale so para a rota em que foi feita.
  const [picked, setPicked] = useState<{ path: string; area: string } | null>(null);
  const area = picked?.path === pathname ? picked.area : routeArea;
  const groups = nav.filter((g) => AREAS.find((a) => a.id === area)?.groups.includes(g.title));
  return (
    <div className="flex gap-xs">
      <div className="sticky top-0 self-start">
        <RailNav label="Áreas da documentação">
          {AREAS.map((a) => (
            <RailItem
              key={a.id}
              icon={<NavGlyph name={a.icon} size={20} />}
              label={a.label}
              active={area === a.id}
              onClick={() => setPicked({ path: pathname, area: a.id })}
            />
          ))}
        </RailNav>
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-md">
        <SearchTrigger onClick={onSearch} />
        <SidebarNav label={AREAS.find((a) => a.id === area)?.label ?? "Seções"}>
          {groups.map((group) => (
            <NavSection key={group.title || "inicio"} title={group.title || undefined}>
              {group.items.map((item) => (
                <NavItem
                  key={item.href}
                  href={item.href}
                  active={isActive(item.href, pathname, hash, nav)}
                  onClick={onNavigate}
                  icon={item.icon ? <NavGlyph name={item.icon} /> : undefined}
                >
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
