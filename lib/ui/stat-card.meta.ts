import type { ComponentMeta } from "./registry.types";

/* Blocos: sem `figma` — so existem no codigo (codeOnly), par pendente. */
export const statCardMeta: ComponentMeta[] = [
  {
    name: "StatCard",
    slug: "stat-card",
    category: "blocos",
    tier: "semantico",
    source: "stat-card.tsx",
    description:
      "Métrica num cartão: número com unidade (o viz desce de linha quando não cabe ao lado, nunca por cima), variação em Tag e uma micro-viz (spark, barras ou anel) no acento; título com período opcional, detalhes por Divider (sem poço) e ação. KPI, saldo, cotação. Bloco pronto, alimentado por dado; a tela só compõe.",
    related: ["stat", "sparkline", "mini-bars", "ring", "chart-card"],
  },
];
