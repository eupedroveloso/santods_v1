"use client";

import { CopyCode } from "./copy-code";
import type { DemoMap } from "./registry.types";

export const copyCodeDemos: DemoMap = {
  "copy-code": {
    demos: [
      {
        title: "Coluna estreita",
        code: `<CopyCode truncate value="--santo-color-bg-brand-solid-default" />`,
        Preview: () => (
          <div className="flex w-(--santo-dimension-space-192) min-w-0">
            <CopyCode truncate value="--santo-color-bg-brand-solid-default" />
          </div>
        ),
      },
      {
        title: "Básico",
        code: `<CopyCode value="--santo-color-bg-brand-solid-default" />
<CopyCode value="bg-brand-solid-default" label="Copiar classe" />
<CopyCode value={null} />`,
        Preview: () => (
          <div className="flex flex-col items-start gap-xs">
            <CopyCode value="--santo-color-bg-brand-solid-default" />
            <CopyCode value="bg-brand-solid-default" label="Copiar classe" />
            <CopyCode value={null} />
          </div>
        ),
      },
    ],
  },
};
