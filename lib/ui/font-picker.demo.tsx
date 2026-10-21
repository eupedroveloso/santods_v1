"use client";

import { useState } from "react";
import { FONT_CATALOG, googleFontUrl } from "@/lib/fonts/catalog";
import { FontPicker } from "./font-picker";
import type { DemoMap } from "./registry.types";

const FAMILIAS = FONT_CATALOG.map((f) => ({ family: f.family, category: f.category }));
const CATEGORIAS = [
  { value: "sans", label: "Sans" },
  { value: "serif", label: "Serif" },
  { value: "mono", label: "Mono" },
];

function Seletor() {
  const [familia, setFamilia] = useState("Albert Sans");
  return (
    <span className="w-full max-w-(--santo-dimension-space-320)">
      <FontPicker
        label="Família"
        value={familia}
        onChange={setFamilia}
        families={FAMILIAS}
        curated={["Albert Sans", "Inter", "Sora"]}
        categories={CATEGORIAS}
        previewHref={googleFontUrl}
      />
    </span>
  );
}

export const fontPickerDemos: DemoMap = {
  "font-picker": {
    demos: [
      {
        title: "Básico",
        code: `<FontPicker
  label="Família do corpo"
  value={familia}
  onChange={setFamilia}
  families={indice}            // [{ family, category }]
  curated={["Albert Sans", "Inter"]}
  categories={[{ value: "sans", label: "Sans" }, { value: "serif", label: "Serif" }]}
  previewHref={(f) => urlCss2(f, [400])}
/>`,
        Preview: Seletor,
      },
    ],
  },
};
