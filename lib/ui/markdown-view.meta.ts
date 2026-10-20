import type { ComponentMeta } from "./registry.types";

export const markdownViewMeta: ComponentMeta[] = [
  {
    name: "MarkdownView",
    slug: "markdown-view",
    category: "codigo",
    tier: "semantico",
    source: "markdown-view.tsx",
    description:
      "Documento em Markdown desenhado com a lib: títulos santo-* com âncora (markdownHeadings alimenta o TableOfContents), listas aninhadas, Table, CodeBlock, citação em poço e Divider. Server component, sem dependência.",
    related: ["code-block", "table", "table-of-contents"],
  },
];
