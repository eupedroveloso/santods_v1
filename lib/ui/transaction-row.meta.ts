import type { ComponentMeta } from "./registry.types";

export const transactionRowMeta: ComponentMeta[] = [
  {
    name: "TransactionRow",
    slug: "transaction-row",
    category: "blocos",
    tier: "semantico",
    source: "transaction-row.tsx",
    description:
      "Linha de extrato: seta de entrada/saída em IconTile tonal de intenção (success/danger), título, categoria · data e valor na mesma cor, com sinal.",
    related: ["list-row", "icon-tile"],
  },
];
