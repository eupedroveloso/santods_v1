import type { ComponentMeta } from "./registry.types";

export const fontPickerMeta: ComponentMeta[] = [
  {
    name: "FontPicker",
    slug: "font-picker",
    category: "entrada",
    tier: "semantico",
    source: "font-picker.tsx",
    description:
      "Seletor de família para catálogo grande (índice do Google Fonts, ~1.800 famílias): busca, filtro por categoria em Chips, Curadoria no topo e lista VIRTUAL (só as linhas visíveis no DOM; a altura da linha é medida do token size/36). Cada opção aparece na própria fonte, carregada sob demanda por `previewHref` (só o peso regular, cache por página). Gatilho = poço do Select, altura control-height. Teclado completo; painel em position: fixed. Use no lugar do Select quando a pessoa escolhe pelo desenho da letra. **Dívida de paridade**: sem par no Figma.",
    related: ["select", "chip", "search-input"],
  },
];
