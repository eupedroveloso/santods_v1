import { listCollections, searchIndex } from "@/lib/docs/catalog";
import { components, componentsByTier, TIER_LABEL } from "@/lib/ui/registry";
import { VIEWS } from "@/app/exemplos/_views";
import { listContext } from "./contexto";
import { groupAnchor, type NavGroup, type SearchItem } from "./links";

/**
 * Navegacao e indice de busca do site de docs, montados no servidor a partir
 * do catalogo (tokens e estilos) e do registry (componentes). Nada aqui e
 * escrito a mao alem das paginas fixas.
 */

export function docsNav(): NavGroup[] {
  return [
    {
      title: "",
      items: [{ label: "Docs home", href: "/", icon: "BookIcon" }],
    },
    // Contexto do sistema: um item por arquivo de public/contexto, na ordem do indice.
    {
      title: "Documentos",
      icon: "FileIcon",
      items: listContext().map((d) => ({ label: d.titulo, href: d.page, icon: "FileIcon" as const })),
    },
    // Uma entrada por visualizacao de /exemplos, gerada do registro da Galeria.
    {
      title: "Exemplos",
      icon: "Grid2Icon",
      items: VIEWS.map((v) => ({ label: v.label, href: `/exemplos#${v.slug}`, icon: "Grid2Icon" as const })),
    },
    {
      title: "Fundamentos",
      icon: "PaletteIcon",
      items: [
        { label: "Cor", href: "/tokens/color", icon: "PaletteIcon" },
        { label: "Tipografia", href: "/estilos/tipografia", icon: "FontIcon" },
        { label: "Raio", href: `/tokens/semantic#${groupAnchor("radius")}`, icon: "VectorSquareIcon" },
        { label: "Sombra", href: "/estilos/efeitos", icon: "CircleHalfStrokeIcon" },
        { label: "Espaçamento", href: `/tokens/semantic#${groupAnchor("space")}`, icon: "ArrowsLeftRightIcon" },
        { label: "Movimento", href: "/estilos/movimento", icon: "BezierCurveIcon" },
        { label: "Todos os tokens", href: "/tokens", icon: "ListIcon" },
      ],
    },
    // Camadas e ordem A–Z vêm dos mesmos metadados usados pelo índice.
    {
      title: "Componentes",
      icon: "CubeIcon",
      items: [
        { label: "Todos os componentes", href: "/componentes", icon: "CubeIcon" },
      ],
      groups: componentsByTier().map((tier) => ({
        title: tier.label,
        icon: "CubeIcon",
        count: tier.items.length,
        items: tier.items.map((c) => ({ label: c.name, href: `/componentes/${c.slug}`, icon: "CubeIcon" as const })),
      })),
    },
  ];
}

const KIND_GROUP = { token: "Tokens", "text-style": "Tipografia", "effect-style": "Efeitos" } as const;
/** Palavra em portugues que entra na dica, para "sombra md" achar o effect style `md`. */
const KIND_WORD = { token: "token", "text-style": "tipografia texto", "effect-style": "sombra efeito" } as const;

export function docsSearch(): SearchItem[] {
  const pages: SearchItem[] = [
    { label: "Docs home", href: "/", group: "Páginas" },
    { label: "Componentes", href: "/componentes", group: "Páginas" },
    { label: "Tokens", href: "/tokens", group: "Páginas" },
    ...listCollections().map((c) => ({
      label: `Tokens · ${c.name}`,
      href: c.route,
      hint: `${c.count} variáveis`,
      group: "Páginas",
    })),
    { label: "Estilos", href: "/estilos", group: "Páginas" },
    { label: "Tipografia", href: "/estilos/tipografia", group: "Páginas" },
    { label: "Efeitos", href: "/estilos/efeitos", group: "Páginas" },
    { label: "Movimento", href: "/estilos/movimento", hint: "motion duração curva", group: "Páginas" },
    { label: "Identidades", href: "/identidades", group: "Páginas" },
    ...VIEWS.map((v) => ({ label: `Exemplos · ${v.label}`, href: `/exemplos#${v.slug}`, group: "Páginas" })),
    ...listContext().map((d) => ({ label: `Contexto · ${d.titulo}`, href: d.page, hint: d.arquivo, group: "Páginas" })),
  ];
  const comps: SearchItem[] = components.map((c) => ({
    label: c.name,
    href: `/componentes/${c.slug}`,
    hint: c.description,
    group: "Componentes",
    badge: TIER_LABEL[c.tier],
  }));
  const catalog: SearchItem[] = searchIndex().map((e) => ({
    label: e.name,
    href: e.route,
    hint: `${e.hint} · ${KIND_WORD[e.kind]}`,
    group: KIND_GROUP[e.kind],
  }));
  return [...pages, ...comps, ...catalog];
}
