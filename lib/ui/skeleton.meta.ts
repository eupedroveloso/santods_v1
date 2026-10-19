import type { ComponentMeta } from "./registry.types";

export const skeletonMeta: ComponentMeta[] = [
  {
    name: "Skeleton",
    slug: "skeleton",
    category: "estrutura",
    tier: "primitivo",
    source: "skeleton.tsx",
    description:
      "Formas neutras (Bar, Block, Circle, Button, Field, Chip, Check, Row, Rule, Bars, Line) para ilustrar a anatomia de um componente ou segurar o lugar enquanto carrega. Sem texto, ícone ou cor de marca; ênfase (cinza médio, nunca preto) só na ação primária.",
    related: ["thumb-frame"],
  },
];
