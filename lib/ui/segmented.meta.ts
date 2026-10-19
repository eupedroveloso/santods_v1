import type { ComponentMeta } from "./registry.types";

export const segmentedMeta: ComponentMeta[] = [
  {
    name: "Segmented",
    slug: "segmented",
    category: "estrutura",
    tier: "primitivo",
    source: "segmented.tsx",
    description:
      "Escolha única entre 2 e 4 opções visíveis em que a comparação entre elas importa. Com mais opções, ou quando cada uma precisa de explicação, Select.",
    related: ["tab-bar", "select"],
  },
  {
    name: "TabBar",
    slug: "tab-bar",
    category: "estrutura",
    tier: "primitivo",
    source: "segmented.tsx",
    description: "Abas em pastilha, para trocar de vista dentro da mesma página.",
    related: ["segmented", "chip"],
  },
];
