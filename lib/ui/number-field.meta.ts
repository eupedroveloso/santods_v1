import type { ComponentMeta } from "./registry.types";

export const numberFieldMeta: ComponentMeta[] = [
  {
    name: "NumberField",
    slug: "number-field",
    category: "entrada",
    tier: "semantico",
    source: "number-field.tsx",
    description:
      "Slider de largura total para um número, com o valor flutuando acima do punho (ou mín/valor/máx abaixo); campo exato opcional numa linha própria. `layout=\"inline\"`: UMA linha no grid do painel — rótulo à esquerda (space/80), trilha no meio, campo compacto com unidade à direita; para painel de ajustes com vários parâmetros.",
    related: ["input"],
  },
];
