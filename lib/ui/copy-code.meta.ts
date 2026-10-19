import type { ComponentMeta } from "./registry.types";

export const copyCodeMeta: ComponentMeta[] = [
  {
    name: "CopyCode",
    slug: "copy-code",
    category: "codigo",
    tier: "semantico",
    source: "copy-code.tsx",
    description:
      "Nome curto em mono com botão de copiar — var CSS, classe, token — em linha de tabela ou ficha. Para várias linhas, CodeBlock. Sem valor, mostra travessão.",
    related: ["copy-button", "code-block"],
  },
];
