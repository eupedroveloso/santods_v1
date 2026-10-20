import type { ComponentMeta } from "./registry.types";

export const railNavMeta: ComponentMeta[] = [
  {
    name: "RailNav",
    slug: "rail-nav",
    category: "navegacao",
    tier: "primitivo",
    source: "rail-nav.tsx",
    description:
      "Primeira coluna de aplicação com várias áreas: troca de área por ícone, o painel ao lado (SidebarNav) mostra as seções. Ativo em pastilha elevada.",
    related: ["rail-item", "sidebar-nav"],
  },
  {
    name: "RailItem",
    slug: "rail-item",
    category: "navegacao",
    tier: "primitivo",
    source: "rail-nav.tsx",
    description: "Item do RailNav: só ícone, nome no title. dot marca novidade; contagem mora no painel.",
    related: ["rail-nav"],
  },
];
