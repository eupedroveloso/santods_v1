import type { ComponentMeta } from "./registry.types";

export const emptyStateMeta: ComponentMeta[] = [
  {
    name: "EmptyState",
    slug: "empty-state",
    category: "estrutura",
    tier: "semantico",
    source: "empty-state.tsx",
    description: "Lugar vazio com um caminho: ícone, título e a ação que o preenche. Sem texto de apoio.",
    related: ["icon-tile", "card"],
  },
];
