"use client";

import { Kbd } from "./kbd";
import type { DemoMap } from "./registry.types";

export const kbdDemos: DemoMap = {
  kbd: {
    demos: [
      {
        title: "Básico",
        code: `<Kbd>⌘</Kbd><Kbd>K</Kbd>`,
        Preview: () => (
          <div className="santo-body-small-regular flex items-center gap-2xs text-text-secondary">
            Buscar <Kbd>⌘</Kbd>
            <Kbd>K</Kbd> · fechar <Kbd>esc</Kbd>
          </div>
        ),
      },
    ],
  },
};
