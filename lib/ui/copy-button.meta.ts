import type { ComponentMeta } from "./registry.types";

export const copyButtonMeta: ComponentMeta[] = [
  {
    name: "CopyButton",
    slug: "copy-button",
    category: "codigo",
    tier: "semantico",
    source: "copy-button.tsx",
    description:
      "Copia um texto que a pessoa vai colar em outro lugar: variável, classe, código, link. O ícone vira um visto por um instante.",
    related: ["code-block", "icon-button"],
  },
];
