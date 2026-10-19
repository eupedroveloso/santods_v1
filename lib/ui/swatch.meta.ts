import type { ComponentMeta } from "./registry.types";

export const swatchMeta: ComponentMeta[] = [
  {
    name: "Swatch",
    slug: "swatch",
    category: "cor",
    tier: "primitivo",
    source: "swatch.tsx",
    description: "Amostra estática, com xadrez atrás para alfa parcial. round para as bolinhas de resumo de marca.",
    related: ["swatch-picker"],
  },
  {
    name: "SwatchPicker",
    slug: "swatch-picker",
    category: "cor",
    tier: "semantico",
    source: "swatch-picker.tsx",
    description: "Amostra que abre o ColorPicker. Use onde a cor é editável.",
    related: ["swatch", "color-picker"],
  },
  {
    name: "ColorRow",
    slug: "color-row",
    category: "cor",
    tier: "semantico",
    source: "color-row.tsx",
    description:
      "A linha do editor: amostra, rótulo de largura fixa, campo e ações. A largura fixa é o que alinha uma coluna longa.",
    related: ["swatch-picker"],
  },
];
