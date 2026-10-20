import type { ComponentMeta } from "./registry.types";

export const cardGridMeta: ComponentMeta[] = [
  {
    name: "CardGrid",
    slug: "card-grid",
    category: "estrutura",
    tier: "primitivo",
    source: "card-grid.tsx",
    description:
      "Toda fileira de cartões ou peças irmãs. Masonry por padrão: cada cartão na altura do conteúdo, empilhado na coluna sem vão, na ordem do DOM. Precisa de JS (sem JS, grade alinhada ao topo). masonry={false} é a grade fixa: topos por fileira e spans previsíveis, para composição com col-span e peças de altura igual; com stretch, índice de cartões de navegação na mesma altura.",
    related: ["card", "stat", "link-card"],
  },
];
