"use client";

import { CopyButton } from "./copy-button";
import type { DemoMap } from "./registry.types";

export const copyButtonDemos: DemoMap = {
  "copy-button": {
    demos: [
      {
        title: "Básico",
        code: `<code>--santo-color-bg-brand-solid-default</code>
<CopyButton value="--santo-color-bg-brand-solid-default" label="Copiar nome da variável" />`,
        Preview: () => (
          <div className="flex items-center gap-2xs">
            <code className="santo-code-sm text-text-secondary">--santo-color-bg-brand-solid-default</code>
            <CopyButton value="--santo-color-bg-brand-solid-default" label="Copiar nome da variável" />
          </div>
        ),
      },
      {
        title: "Variantes",
        code: `<CopyButton value={link} variant="secondary" size="md" />`,
        Preview: () => (
          <div className="flex items-center gap-sm">
            <CopyButton value="ghost" />
            <CopyButton value="secondary" variant="secondary" size="md" />
            <CopyButton value="subtle" variant="subtle" size="md" />
          </div>
        ),
      },
    ],
  },
};
