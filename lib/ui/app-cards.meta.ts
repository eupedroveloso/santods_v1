import type { ComponentMeta } from "./registry.types";

/* Blocos: sem `figma` — so existem no codigo (codeOnly), par pendente. */
export const appCardsMeta: ComponentMeta[] = [
  {
    name: "ChatCard",
    slug: "chat-card",
    category: "blocos",
    tier: "semantico",
    source: "app-cards.tsx",
    description:
      "Conversa num cartão: pessoa e status, bolhas (texto ou anexo), digitando e composer; enviar acrescenta à lista. Bloco pronto, alimentado por dado; a tela só compõe.",
    related: ["chat-bubble", "chat-composer", "chat-header"],
  },
  {
    name: "ActivityCard",
    slug: "activity-card",
    category: "blocos",
    tier: "semantico",
    source: "app-cards.tsx",
    description:
      "Histórico de time com filtro: abas em Segmented filtram por tipo, itens quem / o quê / quando com pastilha, ação em FAB. Bloco pronto, alimentado por dado; a tela só compõe.",
    related: ["activity-item", "fab"],
  },
  {
    name: "ChartCard",
    slug: "chart-card",
    category: "blocos",
    tier: "semantico",
    source: "app-cards.tsx",
    description:
      "Série principal de um painel: título + total + períodos em Segmented e o gráfico (área, linha, barra) direto no cartão, sem poço. Bloco pronto, alimentado por dado; a tela só compõe.",
    related: ["area-chart", "line-chart", "bar-chart", "stat-card"],
  },
  {
    name: "AppFrame",
    slug: "app-frame",
    category: "blocos",
    tier: "semantico",
    source: "app-cards.tsx",
    description:
      "Tela de app inteira dentro de uma página: chão rebaixado com trilho de ícones, painel de navegação em árvore opcional e conteúdo empilhado ou lado a lado. Dívida: sem par no Figma.",
    related: ["rail-nav", "sidebar-nav", "app-sidebar"],
  },
];
