import type { ComponentMeta } from "./registry.types";

export const ratingMeta: ComponentMeta[] = [
  {
    name: "Rating",
    slug: "rating",
    category: "dado",
    tier: "marketing",
    source: "rating.tsx",
    description:
      "Avaliação em estrelas + nota (“4,9/5”) ao lado de um CTA ou de um produto. Estrelas decorativas; a nota é o que se lê.",
    related: ["cta-button", "landing-offer"],
  },
];
