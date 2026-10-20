import type { ComponentMeta } from "./registry.types";

export const appSidebarMeta: ComponentMeta[] = [
  {
    name: "AppSidebar",
    slug: "app-sidebar",
    category: "aplicacao",
    tier: "semantico",
    source: "app-sidebar.tsx",
    description:
      "Sidebar completa de app ou documentação: trilho de áreas no topo, colado à busca, e o painel de seções da área ativa agrupado por NavSection. Para poucas áreas grandes com muitas seções.",
    related: ["rail-nav", "sidebar-nav", "nav-section", "search-trigger"],
  },
];
