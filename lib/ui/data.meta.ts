import type { ComponentMeta } from "./registry.types";

export const dataMeta: ComponentMeta[] = [
  {
    name: "Table",
    slug: "table",
    category: "dado",
    tier: "semantico",
    source: "data.tsx",
    description: "Tabela compacta. selected liga a coluna de seleção, rowAction a de ações.",
    related: ["pagination", "tag"],
  },
  {
    name: "Avatar",
    slug: "avatar",
    category: "dado",
    tier: "primitivo",
    source: "data.tsx",
    description: "Pessoa em lista, feed e conversa: foto em círculo (src/alt), AVIF opcional em avifSrc com fallback WebP e iniciais se ambas as fontes falharem. Tamanhos 24/32/40, com acervo tipado em demo-people.ts.",
  },
  {
    name: "AvatarGroup",
    slug: "avatar-group",
    category: "dado",
    tier: "primitivo",
    source: "data.tsx",
    description: "Avatares sobrepostos (quem está num documento, num time), com anel da cor da superfície.",
    related: ["avatar"],
  },
  {
    name: "Calendar",
    slug: "calendar",
    category: "dado",
    tier: "semantico",
    source: "calendar.tsx",
    description: "Mês interativo com dia único ou intervalo, hoje marcado e teclado de grade.",
  },
];
