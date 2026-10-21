import type { ComponentMeta } from "./registry.types";

export const stepRowMeta: ComponentMeta[] = [
  {
    name: "StepRow",
    slug: "step-row",
    category: "entrada",
    tier: "semantico",
    source: "step-row.tsx",
    description:
      "Passo editável de uma escala derivada (raio, espaço, tamanho de texto): amostra viva, nome do token em mono com largura fixa (space/96, a coluna alinha), campos do valor + unidade e o reset ao derivado. `overridden` acende o nome em brand e libera o reset; sem override o reset ocupa o lugar invisível. Hairline entre linhas, sem caixa. **Dívida de paridade**: sem par no Figma.",
    related: ["input", "token-sample", "editor-frame"],
  },
];
