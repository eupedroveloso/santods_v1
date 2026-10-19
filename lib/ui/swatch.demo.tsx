"use client";

import { useState } from "react";
import { colorValue } from "@/lib/tokens";
import { ColorRow } from "./color-row";
import { Swatch } from "./swatch";
import { SwatchPicker } from "./swatch-picker";
import type { DemoMap } from "./registry.types";

const BRAND_HEX = colorValue("color/bg/brand/solid/default");

function Picker() {
  const [color, setColor] = useState(BRAND_HEX);
  return (
    <div className="flex items-center gap-sm">
      <SwatchPicker color={color} onChange={setColor} label="Cor de exemplo" />
      <code className="santo-code-sm text-text-secondary">{color}</code>
    </div>
  );
}

function Row() {
  const [color, setColor] = useState(BRAND_HEX);
  const [linked, setLinked] = useState(false);
  return (
    <div className="w-full max-w-(--santo-dimension-space-448)">
      <ColorRow
        label="solid/default"
        title="color/bg/brand/solid/default"
        resolved={linked ? "var(--santo-palette-brand-600)" : color}
        value={linked ? "palette/brand/600" : color}
        linked={linked}
        linkOptions={["palette/brand/500", "palette/brand/600", "palette/brand/700"]}
        onChangeHex={setColor}
        onChangeLink={() => undefined}
        onToggleLink={() => setLinked((l) => !l)}
        dirty={color !== BRAND_HEX}
        onReset={() => setColor(BRAND_HEX)}
      />
    </div>
  );
}

export const swatchDemos: DemoMap = {
  swatch: {
    demos: [
      {
        title: "Básico",
        code: `<Swatch color="var(--santo-color-bg-brand-solid-default)" />`,
        Preview: () => <Swatch color="var(--santo-color-bg-brand-solid-default)" title="brand" />,
      },
      {
        title: "Tamanhos e forma",
        code: `<Swatch size="md" … />\n<Swatch size="sm" … />\n<Swatch size="xs" round … />`,
        Preview: () => (
          <div className="flex items-center gap-sm">
            <Swatch color="var(--santo-color-bg-accent-solid-default)" size="md" />
            <Swatch color="var(--santo-color-bg-success-solid-default)" size="sm" />
            <Swatch color="var(--santo-color-bg-danger-solid-default)" size="xs" round />
          </div>
        ),
      },
      {
        title: "Com alfa",
        code: `<Swatch color="var(--santo-color-surface-overlay)" />`,
        Preview: () => <Swatch color="var(--santo-color-surface-overlay)" title="surface/overlay" />,
      },
    ],
  },
  "swatch-picker": {
    demos: [
      {
        title: "Básico",
        code: `const [cor, setCor] = useState(colorValue("color/bg/brand/solid/default"));

<SwatchPicker color={cor} onChange={setCor} label="Cor de exemplo" />`,
        Preview: Picker,
      },
    ],
  },
  "color-row": {
    demos: [
      {
        title: "Básico",
        layout: "stretch",
        code: `<ColorRow
  label="solid/default"
  resolved={cor}
  value={cor}
  linked={false}
  linkOptions={["palette/brand/500", "palette/brand/600"]}
  onChangeHex={setCor}
  onChangeLink={setLink}
  onToggleLink={toggle}
/>`,
        Preview: Row,
      },
    ],
  },
};
