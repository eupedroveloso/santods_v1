import type { ComponentMeta } from "./registry.types";

export const colorMeta: ComponentMeta[] = [
  {
    name: "Color",
    slug: "color",
    category: "cor",
    tier: "primitivo",
    source: "color.ts",
    description: "Módulo de conversão: hexToRgb, rgbToHsv, contrastRatio… Use contrastRatio para conferir par duvidoso.",
    related: ["color-picker"],
  },
];
