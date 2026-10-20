import type { ComponentMeta } from "./registry.types";

export const numberFieldMeta: ComponentMeta[] = [
  {
    name: "NumberField",
    slug: "number-field",
    category: "entrada",
    tier: "semantico",
    source: "number-field.tsx",
    description:
      "Slider de largura total para um número, com o valor flutuando acima do punho (ou mín/valor/máx abaixo); campo exato opcional numa linha própria.",
    related: ["input"],
  },
];
