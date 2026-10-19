import type { ComponentMeta } from "./registry.types";

export const ringMeta: ComponentMeta[] = [
  {
    name: "Ring",
    slug: "ring",
    category: "dado",
    tier: "primitivo",
    source: "ring.tsx",
    description:
      "Fração de uma meta num canto: ao lado de um número grande, num tile, na linha de lista. Com largura sobrando, use Progress. Um acento: arco na cor, trilha em neutral/subtle/active.",
    related: ["progress", "stat", "sparkline", "mini-bars"],
  },
];
