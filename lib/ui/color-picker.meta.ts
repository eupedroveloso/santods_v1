import type { ComponentMeta } from "./registry.types";

export const colorPickerMeta: ComponentMeta[] = [
  {
    name: "ColorPicker",
    slug: "color-picker",
    category: "cor",
    tier: "semantico",
    source: "color-picker.tsx",
    description:
      "Seletor completo: área saturação × brilho, matiz, alfa, conta-gotas e campos que alternam HEX / RGB / HSL. Setas ajustam a área 2D.",
    related: ["swatch-picker"],
  },
];
