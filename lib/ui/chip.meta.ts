import type { ComponentMeta } from "./registry.types";

export const chipMeta: ComponentMeta[] = [
  {
    name: "Chip",
    slug: "chip",
    category: "estrutura",
    tier: "primitivo",
    source: "chip.tsx",
    description: "Pastilha clicável (filtro, aba de editor).",
    related: ["tag", "tab-bar"],
  },
  {
    name: "Tag",
    slug: "tag",
    category: "estrutura",
    tier: "primitivo",
    source: "chip.tsx",
    description: "Rótulo estático de estado ou categoria. Clicável, é Chip.",
    related: ["chip", "count"],
    figma: { name: "Badge", nodeId: "125:357" },
  },
  {
    name: "Count",
    slug: "count",
    category: "estrutura",
    tier: "primitivo",
    source: "chip.tsx",
    description: "Contador discreto ao lado de um rótulo de grupo.",
    related: ["tag"],
  },
];
