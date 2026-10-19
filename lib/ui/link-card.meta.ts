import type { ComponentMeta } from "./registry.types";

export const linkCardMeta: ComponentMeta[] = [
  {
    name: "LinkCard",
    slug: "link-card",
    category: "navegacao",
    tier: "semantico",
    source: "link-card.tsx",
    description:
      "Cartão de entrada para uma seção: ícone, título, apoio e atalhos com chevron. Para página índice.",
    related: ["card"],
  },
];
