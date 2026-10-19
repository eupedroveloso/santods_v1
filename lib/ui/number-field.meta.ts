import type { ComponentMeta } from "./registry.types";

export const numberFieldMeta: ComponentMeta[] = [
  {
    name: "NumberField",
    slug: "number-field",
    category: "entrada",
    tier: "semantico",
    source: "number-field.tsx",
    description:
      "Slider e campo numérico para o mesmo valor: arrasta quem está explorando, digita quem sabe o número.",
    related: ["input"],
  },
];
