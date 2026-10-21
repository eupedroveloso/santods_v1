"use client";

import type { DemoMap } from "./registry.types";
import { SaveIndicator, type SaveState } from "./save-indicator";

export const saveIndicatorDemos: DemoMap = {
  "save-indicator": {
    playground: {
      controls: [{ kind: "select", prop: "state", label: "Estado", options: ["salvo", "salvando", "erro"], initial: "salvo" }],
      code: (values) => `<SaveIndicator state="${values.state}" />`,
      Preview: ({ values }) => <SaveIndicator state={values.state as SaveState} />,
    },
    demos: [
      {
        title: "Estados",
        code: `<SaveIndicator state="salvo" />
<SaveIndicator state="salvando" />
<SaveIndicator state="erro" title="O rascunho não passa na validação." />`,
        Preview: () => (
          <div className="flex items-center gap-lg">
            <SaveIndicator state="salvo" />
            <SaveIndicator state="salvando" />
            <SaveIndicator state="erro" title="O rascunho não passa na validação." />
          </div>
        ),
      },
    ],
  },
};
