import type { ComponentMeta } from "./registry.types";

export const ctaButtonMeta: ComponentMeta[] = [
  {
    name: "CtaButton",
    slug: "cta-button",
    category: "acao",
    tier: "primitivo",
    source: "cta-button.tsx",
    description:
      "CTA principal de página de venda: largo, texto grande, pastilha escura concêntrica com a seta na ponta. Um por página; ação comum é Button.",
    related: ["button", "landing-offer"],
  },
];
