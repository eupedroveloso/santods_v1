import type { ComponentMeta } from "./registry.types";

export const nestMeta: ComponentMeta[] = [
  {
    name: "Nest",
    slug: "nest",
    category: "estrutura",
    tier: "primitivo",
    source: "nest.tsx",
    description:
      "Moldura aninhada: UM recuo (token de espaço) igual nos quatro lados e entre as faixas, e o raio do filho calculado sozinho — externo − recuo (piso radius/xs; em moldura folgada, o de controle). Um Nest dentro de outro recalcula no próprio nível. Card, painéis do Select e da paleta, trilho do Segmented, EditorFrame e as miniaturas usam o mesmo mecanismo (useNest).",
    related: ["card", "segmented", "command-palette", "editor-frame", "thumb-frame"],
  },
];
