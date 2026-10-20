import type { ComponentMeta } from "./registry.types";

export const appSidebarMeta: ComponentMeta[] = [
  {
    name: "AppSidebar",
    slug: "app-sidebar",
    category: "aplicacao",
    tier: "semantico",
    source: "app-sidebar.tsx",
    description:
      "Navegação de app ou documentação em árvore, com pastas recursivas recolhíveis, ícones, contadores e ramificações em cada nível. A rota reabre os ancestrais do único item ativo, que permanece visível ao recolher. showRail={false} é a variante usada pelo site de documentação.",
    related: ["sidebar-nav", "nav-section", "nav-item", "disclosure", "rail-nav", "search-trigger"],
  },
];
