"use client";

import type { DemoMap } from "./registry.types";
import { SearchTrigger } from "./search-trigger";

export const searchTriggerDemos: DemoMap = {
  "search-trigger": {
    demos: [
      {
        title: "Básico",
        layout: "stretch",
        code: `<SearchTrigger onClick={abrirBusca} />`,
        Preview: () => (
          <div className="mx-auto w-full max-w-(--santo-dimension-space-256)">
            <SearchTrigger onClick={() => undefined} />
          </div>
        ),
      },
    ],
  },
};
