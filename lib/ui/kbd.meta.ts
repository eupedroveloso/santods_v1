import type { ComponentMeta } from "./registry.types";

export const kbdMeta: ComponentMeta[] = [
  {
    name: "Kbd",
    slug: "kbd",
    category: "codigo",
    tier: "primitivo",
    source: "kbd.tsx",
    description: "Tecla de atalho, ao lado de onde o atalho age. Se a tecla não faz nada ali, não use.",
    related: ["command-palette"],
  },
];
