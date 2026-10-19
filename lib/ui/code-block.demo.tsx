"use client";

import { CodeBlock } from "./code-block";
import type { DemoMap } from "./registry.types";

const SAMPLE = `import { Button } from "@/lib/ui";

<Button variant="primary">Salvar</Button>`;

export const codeBlockDemos: DemoMap = {
  "code-block": {
    demos: [
      {
        title: "Básico",
        layout: "stretch",
        code: `<CodeBlock code={codigo} />`,
        Preview: () => (
          <div className="w-full">
            <CodeBlock code={SAMPLE} />
          </div>
        ),
      },
      {
        title: "Com título",
        layout: "stretch",
        code: `<CodeBlock title="app/page.tsx" code={codigo} />`,
        Preview: () => (
          <div className="w-full">
            <CodeBlock title="app/page.tsx" code={SAMPLE} />
          </div>
        ),
      },
    ],
  },
};
