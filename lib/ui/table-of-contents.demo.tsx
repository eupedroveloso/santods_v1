"use client";

import type { DemoMap } from "./registry.types";
import { TableOfContents } from "./table-of-contents";

export const tableOfContentsDemos: DemoMap = {
  "table-of-contents": {
    demos: [
      {
        title: "Básico",
        code: `<TableOfContents
  items={[
    { id: "primitivo", label: "Primitivos", level: 1, count: 26 },
    { id: "primitivo-acao", label: "Ação", count: 2 },
    { id: "primitivo-entrada", label: "Entrada", count: 6 },
  ]}
/>`,
        Preview: () => (
          <div className="w-(--santo-dimension-space-224)">
            <TableOfContents
              items={[
                { id: "demo-toc-a", label: "Primitivos", level: 1, count: 26 },
                { id: "demo-toc-b", label: "Ação", count: 2 },
                { id: "demo-toc-c", label: "Entrada", count: 6 },
                { id: "demo-toc-d", label: "Semânticos", level: 1, count: 41 },
                { id: "demo-toc-e", label: "Dado", count: 14 },
              ]}
            />
          </div>
        ),
      },
    ],
  },
};
