import type { ComponentMeta } from "./registry.types";

export const iconTileMeta: ComponentMeta[] = [
  {
    name: "IconTile",
    slug: "icon-tile",
    category: "estrutura",
    tier: "primitivo",
    source: "icon-tile.tsx",
    description: "Ícone num slot de tamanho de token, sem caixa por padrão: marcador de linha de lista, de estado vazio, de anexo. Caixa tonal (brand, subtle, outline) só quando a cor carrega significado.",
    related: ["list-row", "empty-state"],
  },
];
