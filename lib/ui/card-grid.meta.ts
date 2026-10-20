import type { ComponentMeta } from "./registry.types";

export const cardGridMeta: ComponentMeta[] = [
  {
    name: "CardGrid",
    slug: "card-grid",
    category: "estrutura",
    tier: "primitivo",
    source: "card-grid.tsx",
    description:
      "Toda fileira de cartões ou peças irmãs. Masonry por padrão: cada cartão na altura do conteúdo, empilhado na coluna sem vão, na ordem do DOM. Precisa de JS (sem JS, grade alinhada ao topo). masonry={false} para peças de altura igual.",
    related: ["card", "stat", "link-card"],
  },
];
