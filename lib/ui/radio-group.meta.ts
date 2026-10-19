import type { ComponentMeta } from "./registry.types";

export const radioGroupMeta: ComponentMeta[] = [
  {
    name: "RadioGroup",
    slug: "radio-group",
    category: "entrada",
    tier: "semantico",
    source: "radio-group.tsx",
    description:
      "Escolha única entre poucas opções em cartões (plano, modo, formato). Setas movem e escolhem; só a opção marcada fica no Tab.",
    related: ["radio-card", "radio", "segmented"],
  },
  {
    name: "RadioCard",
    slug: "radio-card",
    category: "entrada",
    tier: "semantico",
    source: "radio-group.tsx",
    description: "Uma opção do RadioGroup: o cartão inteiro é o alvo, o marcador do Radio fica dentro.",
    related: ["radio-group", "radio"],
  },
];
