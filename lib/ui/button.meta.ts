import type { ComponentMeta } from "./registry.types";

export const buttonMeta: ComponentMeta[] = [
  {
    name: "Button",
    slug: "button",
    category: "acao",
    tier: "primitivo",
    source: "button.tsx",
    description:
      "primary para a ação principal da tela (uma por região), secondary para apoio com contorno, subtle para preenchimento suave, ghost em barra de ferramentas, danger para destruir. Tamanhos sm/md/lg casam com dimension/size/32|40|48. block só para botão sozinho — em linha com outro, use flex-1.",
    related: ["icon-button", "copy-button"],
    figma: { name: "Button", nodeId: "125:212" },
  },
  {
    name: "IconButton",
    slug: "icon-button",
    category: "acao",
    tier: "primitivo",
    source: "button.tsx",
    description: "Botão quadrado só com ícone. label é obrigatório — vira aria-label e title.",
    related: ["button", "icon"],
  },
];
