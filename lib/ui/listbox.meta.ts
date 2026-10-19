import type { ComponentMeta } from "./registry.types";

export const listboxMeta: ComponentMeta[] = [
  {
    name: "Select",
    slug: "select",
    category: "entrada",
    tier: "primitivo",
    source: "listbox.tsx",
    description:
      "Escolha numa lista. Nunca o nativo: o <select> do sistema ignora tema, tipografia e densidade. Aceita grupos, dica por opção, marcador à esquerda e labelStyle; ganha busca a partir de 12 opções. Painel em position: fixed para não ser recortado.",
    related: ["field", "segmented"],
    figma: { name: "Select", nodeId: "125:304" },
  },
];
