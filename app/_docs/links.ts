import { figmaSource } from "@/lib/tokens";

/** Links fixos do site de docs, usados no servidor e no cliente. */

export const FIGMA_URL = `https://www.figma.com/design/${figmaSource.fileKey}`;

export const TOP_LINKS = [
  { label: "Docs", href: "/" },
  { label: "Componentes", href: "/componentes" },
  { label: "Tokens", href: "/tokens" },
  { label: "Estilos", href: "/estilos" },
  { label: "Identidades", href: "/identidades" },
  { label: "Estúdio", href: "/estudio" },
] as const;

/**
 * Larguras de layout do site de docs, num lugar so.
 *
 * Sao degraus primitivos de espacamento fazendo papel de largura de layout:
 * nao existe token semantico de largura de sidebar no Figma. Divergencia
 * registrada — quando o token existir (ex.: dimension/layout/sidebar), troca aqui.
 */
export const LAYOUT = {
  sidebar: "w-(--santo-dimension-space-256)",
  drawer: "w-(--santo-dimension-space-288)",
  /** Painel de controles do playground, ao lado do preview a partir de md. */
  panel: "md:w-(--santo-dimension-space-256)",
  /** Recuo de ancora: topbar (size/56) + trilha sticky. Use em toda secao com id. */
  anchor: "scroll-mt-6xl",
} as const;

/** Nome de um icone de lib/ui/icons — string, para atravessar do servidor para o shell. */
export type NavIcon =
  | "BookIcon"
  | "CodeIcon"
  | "Grid2Icon"
  | "PaletteIcon"
  | "FontIcon"
  | "VectorSquareIcon"
  | "CircleHalfStrokeIcon"
  | "ArrowsLeftRightIcon"
  | "ListIcon"
  | "IconsIcon"
  | "IdCardIcon"
  | "CubeIcon"
  | "BezierCurveIcon"
  | "FileIcon";
export type NavLink = { label: string; href: string; icon?: NavIcon };
export type NavGroup = { title: string; items: NavLink[]; icon?: NavIcon; count?: number; railIcon?: NavIcon; groups?: NavGroup[] };
/** Todos os destinos, inclusive os de subgrupos; usado para resolver rota/hash. */
export const navItems = (group: NavGroup): NavLink[] => [
  ...group.items,
  ...(group.groups ?? []).flatMap(navItems),
];
/** badge: selo curto exibido a direita no ⌘K (ex.: "Primitivo"), em vez de texto corrido. */
export type SearchItem = { href: string; label: string; hint?: string; group: string; badge?: string };

/** Âncora de grupo de tokens: `bg/brand/solid` → `grupo-bg-brand-solid`. */
export const groupAnchor = (group: string) => `grupo-${group.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`;
