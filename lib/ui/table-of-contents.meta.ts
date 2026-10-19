import type { ComponentMeta } from "./registry.types";

export const tableOfContentsMeta: ComponentMeta[] = [
  {
    name: "TableOfContents",
    slug: "table-of-contents",
    category: "navegacao",
    tier: "semantico",
    source: "table-of-contents.tsx",
    description:
      "Índice da página na coluna direita: grupos e itens, item visível marcado por uma linha de brand à esquerda. Acompanha a rolagem sozinho.",
    related: ["sidebar-nav", "breadcrumb"],
  },
];
