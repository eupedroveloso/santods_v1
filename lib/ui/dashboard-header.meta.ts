import type { ComponentMeta } from "./registry.types";

export const dashboardHeaderMeta: ComponentMeta[] = [
  {
    name: "DashboardHeader",
    slug: "dashboard-header",
    category: "blocos",
    tier: "semantico",
    source: "dashboard-header.tsx",
    description:
      "Cabeçalho de dashboard: título + meta, filtro de período e ação primária, alinhado à grade de cartões. No celular, os controles descem.",
    related: ["card-grid", "segmented", "button"],
  },
];
