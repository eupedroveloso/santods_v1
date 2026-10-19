import type { ComponentMeta } from "./registry.types";

export const overlineMeta: ComponentMeta[] = [
  {
    name: "Overline",
    slug: "overline",
    category: "estrutura",
    tier: "primitivo",
    source: "overline.tsx",
    description:
      "Rótulo em caixa alta acima de um número ou bloco. Um rótulo, não uma frase. Dívida de token: falta o text style overline no Figma.",
    related: ["stat", "divider"],
  },
];
