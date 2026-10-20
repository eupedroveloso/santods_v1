"use client";

import { TransactionRow } from "./transaction-row";
import type { DemoMap } from "./registry.types";

export const transactionRowDemos: DemoMap = {
  "transaction-row": {
    playground: {
      controls: [
        { kind: "select", prop: "amount", label: "Valor", options: ["8200", "-312.4"], initial: "8200" },
        { kind: "boolean", prop: "action", label: "Ação de linha", initial: true },
      ],
      layout: "stretch",
      Preview: ({ values: v }) => (
        <div className="mx-auto w-full max-w-(--santo-dimension-container-sm)">
          <TransactionRow
            title={Number(v.amount) >= 0 ? "Salário" : "Mercado Bom Preço"}
            category={Number(v.amount) >= 0 ? "Receita" : "Alimentação"}
            date="15 out."
            amount={Number(v.amount)}
            onAction={v.action ? () => {} : undefined}
            divider={false}
          />
        </div>
      ),
      code: (v) => `<TransactionRow title="…" category="…" date="15 out." amount={${v.amount}}${v.action ? " onAction={abrirMenu}" : ""} />`,
    },
    demos: [],
  },
};
