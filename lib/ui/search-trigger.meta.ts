import type { ComponentMeta } from "./registry.types";

export const searchTriggerMeta: ComponentMeta[] = [
  {
    name: "SearchTrigger",
    slug: "search-trigger",
    category: "navegacao",
    tier: "semantico",
    source: "search-trigger.tsx",
    description: "Parece campo de busca e abre a busca de verdade (⌘K). O atalho segue a plataforma.",
    related: ["command-palette", "kbd", "search-input"],
  },
];
