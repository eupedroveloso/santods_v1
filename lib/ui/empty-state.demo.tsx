"use client";

import { Button } from "./button";
import { EmptyState } from "./empty-state";
import * as Icon from "./icons";
import type { DemoMap } from "./registry.types";

export const emptyStateDemos: DemoMap = {
  "empty-state": {
    demos: [
      {
        title: "Básico",
        layout: "stretch",
        code: `<EmptyState
  icon={<Icon.Plus size={16} />}
  title="Distribuir faixa"
  action={<Button>Criar faixa</Button>}
/>`,
        Preview: () => (
          <div className="mx-auto w-full max-w-(--santo-dimension-space-384)">
            <EmptyState icon={<Icon.Plus size={16} />} title="Distribuir faixa" action={<Button>Criar faixa</Button>} />
          </div>
        ),
      },
    ],
  },
};
