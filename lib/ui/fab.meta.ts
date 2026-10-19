import type { ComponentMeta } from "./registry.types";

export const fabMeta: ComponentMeta[] = [
  {
    name: "Fab",
    slug: "fab",
    category: "acao",
    tier: "primitivo",
    source: "fab.tsx",
    description:
      "A única ação principal de uma tela que rola, sempre à mão. Um por tela. Círculo só com ícone; extended quando o ícone sozinho não diz a ação; position fixa no rodapé.",
    related: ["button", "icon-button"],
  },
];
