"use client";

import { useState } from "react";
import { NumberField } from "./number-field";
import type { DemoMap } from "./registry.types";

function Basic() {
  const [value, setValue] = useState(16);
  return (
    <div className="mx-auto flex w-full max-w-(--santo-dimension-space-320)">
      <NumberField label="Raio" value={value} onChange={setValue} min={0} max={64} unit="px" />
    </div>
  );
}

export const numberFieldDemos: DemoMap = {
  "number-field": {
    demos: [
      {
        title: "Básico",
        layout: "stretch",
        code: `const [raio, setRaio] = useState(16);

<NumberField label="Raio" value={raio} onChange={setRaio} min={0} max={64} unit="px" />`,
        Preview: Basic,
      },
    ],
  },
};
