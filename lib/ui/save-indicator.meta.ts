import type { ComponentMeta } from "./registry.types";

export const saveIndicatorMeta: ComponentMeta[] = [
  {
    name: "SaveIndicator",
    slug: "save-indicator",
    category: "dado",
    tier: "primitivo",
    source: "save-indicator.tsx",
    description:
      "Estado do salvamento automático no cabeçalho de um editor: ícone + micro-texto (`salvo`, `salvando` com pulso, `erro` em text/danger), caption medium, aria-live polite. Sem botão nem explicação: o detalhe do erro mora onde a pessoa corrige. **Dívida de paridade**: sem par no Figma.",
    related: ["editor-frame", "tag"],
  },
];
