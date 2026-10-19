"use client";

import { useState } from "react";
import { colorValue } from "@/lib/tokens";
import { Button } from "./button";
import { ColorPicker } from "./color-picker";
import type { DemoMap } from "./registry.types";

function Basic() {
  const [color, setColor] = useState(colorValue("color/bg/accent/solid/default"));
  const [open, setOpen] = useState(false);
  return (
    <div className="relative flex items-center gap-sm">
      <Button onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        {open ? "Fechar seletor" : "Abrir seletor"}
      </Button>
      <code className="santo-code-sm text-text-secondary">{color}</code>
      {open && <ColorPicker value={color} onChange={setColor} onClose={() => setOpen(false)} label="Cor" />}
    </div>
  );
}

export const colorPickerDemos: DemoMap = {
  "color-picker": {
    demos: [
      {
        title: "Básico",
        code: `{open && (
  <ColorPicker value={cor} onChange={setCor} onClose={() => setOpen(false)} label="Cor" />
)}`,
        Preview: Basic,
      },
    ],
  },
};
