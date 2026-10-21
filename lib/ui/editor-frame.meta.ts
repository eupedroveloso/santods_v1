import type { ComponentMeta } from "./registry.types";

export const editorFrameMeta: ComponentMeta[] = [
  {
    name: "EditorFrame",
    slug: "editor-frame",
    category: "aplicacao",
    tier: "semantico",
    source: "editor-frame.tsx",
    description:
      "Bancada de edição em três painéis: navegação no chão sunken à esquerda, documento vivo no centro e ajustes à direita (space/384), cada um rolando por conta própria. Abaixo de lg a navegação vira `mobileNav` no topo do centro; abaixo de xl os ajustes descem para baixo do documento. O pai dá a altura. Usada pelo Estúdio. **Dívida de paridade**: sem par no Figma.",
    related: ["app-sidebar", "step-row", "save-indicator", "card"],
  },
];
