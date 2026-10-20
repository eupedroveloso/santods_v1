import type { ComponentMeta } from "./registry.types";

export const brandSwitchMeta: ComponentMeta[] = [
  {
    name: "BrandSwitch",
    slug: "brand-switch",
    category: "aplicacao",
    tier: "semantico",
    source: "brand-switch.tsx",
    description:
      "Seletor de marca ao lado do seletor de tema: troca o data-brand que pinta a interface com outra identidade. Controlado; com uma marca só, não aparece.",
    related: ["brand-logo", "segmented"],
  },
];
