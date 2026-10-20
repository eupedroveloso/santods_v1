import type { ComponentMeta } from "./registry.types";

export const feedMeta: ComponentMeta[] = [
  {
    name: "ActivityItem",
    slug: "activity-item",
    category: "aplicacao",
    tier: "semantico",
    source: "feed.tsx",
    description: "Feed \"quem / o quê / quando\". O horário alinhado à direita permite varrer a coluna de tempo.",
    related: ["marker"],
  },
  {
    name: "Marker",
    slug: "marker",
    category: "aplicacao",
    tier: "semantico",
    source: "feed.tsx",
    description: "Pastilha de contexto do feed: tipo de tarefa, arquivo, reunião.",
    related: ["activity-item"],
  },
  {
    name: "Ticker",
    slug: "ticker",
    category: "aplicacao",
    tier: "semantico",
    source: "feed.tsx",
    description: "Faixa de cotações: símbolo, valor e variação. Quebra em linhas em vez de rolar (sem barra horizontal nem item cortado).",
  },
];
