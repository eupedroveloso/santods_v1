import type { ComponentMeta } from "./registry.types";

export const appSidebarMeta: ComponentMeta[] = [
  {
    name: "AppSidebar",
    slug: "app-sidebar",
    category: "aplicacao",
    tier: "semantico",
    source: "app-sidebar.tsx",
    description:
      "Sidebar de app ou documentação numa coluna só: busca no topo e todos os grupos já abertos com seus itens, item ativo elevado e trazido para a vista. Sem trilho de ícones.",
    related: ["sidebar-nav", "nav-section", "nav-item", "search-trigger"],
  },
];
