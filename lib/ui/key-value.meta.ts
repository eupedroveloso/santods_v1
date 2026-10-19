import type { ComponentMeta } from "./registry.types";

export const keyValueMeta: ComponentMeta[] = [
  {
    name: "KeyValue",
    slug: "key-value",
    category: "dado",
    tier: "semantico",
    source: "key-value.tsx",
    description:
      "Linha rótulo × valor para resumo de pedido, detalhe de transação, ficha técnica. Valor tabular e à direita; emphasis na linha de total.",
    related: ["divider", "table"],
  },
];
