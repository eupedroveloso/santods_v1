import type { ComponentMeta } from "./registry.types";

/* Blocos: sem `figma` — so existem no codigo (codeOnly), par pendente. */
export const financeCardsMeta: ComponentMeta[] = [
  {
    name: "GoalsCard",
    slug: "goals-card",
    category: "blocos",
    tier: "semantico",
    source: "finance-cards.tsx",
    description:
      "Metas com teto conhecido (reserva, viagem): anel com a fração, nome em overline, valor guardado e alvo; metas separadas por Divider. Bloco pronto, alimentado por dado; a tela só compõe.",
    related: ["ring", "stat-card"],
  },
  {
    name: "InvestCard",
    slug: "invest-card",
    category: "blocos",
    tier: "semantico",
    source: "finance-cards.tsx",
    description:
      "Ordem com valor e modalidade (compra de ativo, aporte): valor em campo-poço, tipo em Segmented, resumo de custo e ação primária. Bloco pronto, alimentado por dado; a tela só compõe.",
    related: ["limit-card", "key-value"],
  },
  {
    name: "LimitCard",
    slug: "limit-card",
    category: "blocos",
    tier: "semantico",
    source: "finance-cards.tsx",
    description:
      "Teto configurável (limite de pagamento, orçamento): número grande, NumberField, moeda em Segmented e nota opcional. Bloco pronto, alimentado por dado; a tela só compõe.",
    related: ["invest-card", "number-field"],
  },
  {
    name: "TransactionsCard",
    slug: "transactions-card",
    category: "blocos",
    tier: "semantico",
    source: "finance-cards.tsx",
    description:
      "Extrato curto: contagem, \"Ver todas\" e TransactionRow por linha. Bloco pronto, alimentado por dado; a tela só compõe.",
    related: ["transaction-row", "payments-card"],
  },
  {
    name: "PaymentsCard",
    slug: "payments-card",
    category: "blocos",
    tier: "semantico",
    source: "finance-cards.tsx",
    description:
      "Lista operacional com seleção: Table com status em Tag, valor à direita, ações por linha e paginação com a contagem selecionada. Bloco pronto, alimentado por dado; a tela só compõe.",
    related: ["table", "pagination", "transactions-card"],
  },
];
