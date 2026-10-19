import type { ComponentMeta } from "./registry.types";

export const iconsMeta: ComponentMeta[] = [
  {
    name: "Icon",
    slug: "icon",
    category: "icones",
    tier: "primitivo",
    source: "icons.tsx",
    description:
      "Só da página Icones do Figma (Font Awesome, exportada para lib/icons). Cor por currentColor; tamanho de dimension/icon/*. Ícone novo: slug em lib/icons/needed.txt, nunca desenho à mão.",
    related: ["icon-button"],
    // Par no Figma: a pagina Icones inteira (nodeId de cada icone em lib/icons/manifest.json).
    figma: { name: "Página Icones" },
  },
];
