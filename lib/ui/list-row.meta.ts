import type { ComponentMeta } from "./registry.types";

export const listRowMeta: ComponentMeta[] = [
  {
    name: "ListRow",
    slug: "list-row",
    category: "dado",
    tier: "semantico",
    source: "list-row.tsx",
    description:
      "Linha de lista: marcador (IconTile ou Avatar), título, metadado curto e algo à direita (valor, Select, IconButton).",
    related: ["icon-tile", "avatar"],
  },
];
