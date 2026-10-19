import type { ComponentMeta } from "./registry.types";

export const toggleMeta: ComponentMeta[] = [
  {
    name: "Checkbox",
    slug: "checkbox",
    category: "entrada",
    tier: "primitivo",
    source: "toggle.tsx",
    description: "Caixa quando existe um Salvar depois. Para efeito imediato, Switch.",
    related: ["radio", "switch"],
    figma: { name: "Checkbox", nodeId: "125:332" },
  },
  {
    name: "Radio",
    slug: "radio",
    category: "entrada",
    tier: "primitivo",
    source: "toggle.tsx",
    description: "Escolha única entre opções que precisam de descrição. Sem descrição e com até 4 opções, Segmented.",
    related: ["checkbox", "segmented"],
  },
  {
    name: "Switch",
    slug: "switch",
    category: "entrada",
    tier: "primitivo",
    source: "toggle.tsx",
    description: "Chave quando o efeito é imediato. Quando há um Salvar, Checkbox.",
    related: ["setting-row", "checkbox"],
  },
  {
    name: "SettingRow",
    slug: "setting-row",
    category: "entrada",
    tier: "semantico",
    source: "toggle.tsx",
    description: "Título, apoio e controle à direita — a linha de tela de configuração.",
    related: ["switch"],
  },
];
