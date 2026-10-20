import type { ComponentMeta } from "./registry.types";

export const brandCardMeta: ComponentMeta[] = [
  {
    name: "BrandCard",
    slug: "brand-card",
    category: "blocos",
    tier: "semantico",
    source: "brand-card.tsx",
    description:
      "Ficha de identidade de uma marca em uma linha compacta: logo (+ Padrão), tipografia, cor de marca, neutros claro/escuro e raio principal, separados por divisores, em grade fixa de colunas por token (alinham entre fichas); 2 por linha no celular.",
    related: ["brand-logo", "brand-switch", "swatch"],
  },
];
