import type { ComponentMeta } from "./registry.types";

export const codeBlockMeta: ComponentMeta[] = [
  {
    name: "CodeBlock",
    slug: "code-block",
    category: "codigo",
    tier: "semantico",
    source: "code-block.tsx",
    description:
      "Trecho de código para copiar — import, JSX, classe. Fundo surface/sunken: código é conteúdo embutido, não cartão.",
    related: ["copy-button"],
  },
];
