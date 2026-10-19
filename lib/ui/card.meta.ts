import type { ComponentMeta } from "./registry.types";

export const cardMeta: ComponentMeta[] = [
  {
    name: "Card",
    slug: "card",
    category: "estrutura",
    tier: "primitivo",
    source: "card.tsx",
    description:
      "Superfície elevada com um assunto só. Sempre com borda além da sombra — no escuro a sombra some. padded={false} quando o conteúdo encosta na borda (tabela).",
    related: ["card-header", "stat", "link-card"],
    figma: { name: "Card", nodeId: "125:378" },
  },
  {
    name: "CardHeader",
    slug: "card-header",
    category: "estrutura",
    tier: "semantico",
    source: "card.tsx",
    description: "Título + descrição + ação no canto.",
    related: ["card"],
  },
  {
    name: "CardFooter",
    slug: "card-footer",
    category: "estrutura",
    tier: "semantico",
    source: "card.tsx",
    description: "Ações do cartão alinhadas à direita: no fim de um Card ou na moldura do Card double.",
    related: ["card"],
  },
  {
    name: "Stat",
    slug: "stat",
    category: "estrutura",
    tier: "semantico",
    source: "card.tsx",
    description: "Número grande com rótulo e variação.",
    related: ["card"],
  },
  {
    name: "Divider",
    slug: "divider",
    category: "estrutura",
    tier: "primitivo",
    source: "card.tsx",
    description: "Divisor de 1px no token de borda.",
  },
];
