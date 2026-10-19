import type { ComponentMeta } from "./registry.types";

export const inputMeta: ComponentMeta[] = [
  {
    name: "Input",
    slug: "input",
    category: "entrada",
    tier: "primitivo",
    source: "input.tsx",
    description: "Campo de uma linha. mono para hex, medida e nome de token. invalid pinta a borda e liga aria-invalid.",
    related: ["field", "textarea", "search-input"],
    figma: { name: "Input", nodeId: "125:243" },
  },
  {
    name: "Textarea",
    slug: "textarea",
    category: "entrada",
    tier: "primitivo",
    source: "input.tsx",
    description: "Texto longo: descrição, observação, mensagem. Para uma linha, Input.",
    related: ["input", "field"],
  },
  {
    name: "SearchInput",
    slug: "search-input",
    category: "entrada",
    tier: "semantico",
    source: "input.tsx",
    description: "Input com lupa embutida e forma de comprimido. Use para filtrar o que já está na tela.",
    related: ["input", "command-palette"],
  },
  {
    name: "Field",
    slug: "field",
    category: "entrada",
    tier: "semantico",
    source: "input.tsx",
    description: "Rótulo + campo + apoio, com o espaçamento certo. hint some quando há error.",
    related: ["input", "select", "textarea"],
  },
];
