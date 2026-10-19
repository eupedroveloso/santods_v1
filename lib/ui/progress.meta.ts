import type { ComponentMeta } from "./registry.types";

export const progressMeta: ComponentMeta[] = [
  {
    name: "Progress",
    slug: "progress",
    category: "dado",
    tier: "primitivo",
    source: "progress.tsx",
    description:
      "Quanto de uma meta já foi cumprido: meta, cota, upload. Sem teto, use Stat. brand no geral, success quando chegar lá é bom, danger quando é ruim.",
    related: ["stat"],
  },
];
