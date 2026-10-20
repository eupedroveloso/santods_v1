"use client";

import { MarkdownView } from "./markdown-view";
import type { DemoMap } from "./registry.types";

const SOURCE = `## Fonte da verdade

Tudo começa em \`tokens/santods.figma.json\`, um espelho **fiel** do Figma.

> Valor errado no CSS significa snapshot desatualizado ou emissor com bug.

- **Nada em \`lib/tokens/\` é editado à mão.**
- Depois de mexer em token:
  - \`npm run tokens\`
  - \`npm run tokens:check\`

| coleção | variáveis |
|---|---|
| Palette | 160 |
| Semantic | 97 |

\`\`\`bash
npm run design:check && npm run build
\`\`\``;

export const markdownViewDemos: DemoMap = {
  "markdown-view": {
    demos: [
      {
        title: "Documento",
        layout: "stretch",
        code: `<MarkdownView source={markdown} />`,
        Preview: () => (
          <div className="mx-auto w-full max-w-(--santo-dimension-container-sm)">
            <MarkdownView source={SOURCE} />
          </div>
        ),
      },
    ],
  },
};
