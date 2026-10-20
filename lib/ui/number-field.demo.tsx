"use client";

import { useState } from "react";
import { NumberField } from "./number-field";
import type { DemoMap } from "./registry.types";

function Playground({ valueLabel, field }: { valueLabel: "above" | "below" | "none"; field: boolean }) {
  const [value, setValue] = useState(16);
  return (
    <div className="mx-auto flex w-full max-w-(--santo-dimension-space-320)">
      <NumberField label="Raio" value={value} onChange={setValue} min={0} max={64} unit="px" valueLabel={valueLabel} field={field} />
    </div>
  );
}

export const numberFieldDemos: DemoMap = {
  "number-field": {
    playground: {
      controls: [
        { kind: "select", prop: "valueLabel", label: "Valor", options: ["above", "below", "none"], initial: "above" },
        { kind: "boolean", prop: "field", label: "Campo exato", initial: false },
      ],
      layout: "stretch",
      Preview: ({ values: v }) => <Playground valueLabel={v.valueLabel as "above" | "below" | "none"} field={v.field as boolean} />,
      code: (v) =>
        `<NumberField label="Raio" value={raio} onChange={setRaio} min={0} max={64} unit="px"${v.valueLabel !== "above" ? ` valueLabel="${v.valueLabel}"` : ""}${v.field ? " field" : ""} />`,
    },
    demos: [],
  },
};
