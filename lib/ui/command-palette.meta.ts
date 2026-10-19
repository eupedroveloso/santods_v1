import type { ComponentMeta } from "./registry.types";

export const commandPaletteMeta: ComponentMeta[] = [
  {
    name: "CommandPalette",
    slug: "command-palette",
    category: "navegacao",
    tier: "semantico",
    source: "command-palette.tsx",
    description:
      "Busca que abre por cima da página (⌘K), quando há destino demais para um menu e a pessoa sabe o nome do que procura. Ignora acento; teclado completo.",
    related: ["kbd", "search-input"],
  },
];
