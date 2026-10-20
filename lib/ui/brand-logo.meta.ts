import type { ComponentMeta } from "./registry.types";

export const brandLogoMeta: ComponentMeta[] = [
  {
    name: "BrandLogo",
    slug: "brand-logo",
    category: "aplicacao",
    tier: "semantico",
    source: "brand-logo.tsx",
    description:
      "Logo oficial de uma marca do DS pelo id (santo, vtsd): topo de app e ficha da identidade. Variante completa ou reduzida (mark); troca a versão clara/escura pelo tema, sem JS.",
    related: ["brand-switch"],
  },
];
