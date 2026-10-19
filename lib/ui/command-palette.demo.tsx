"use client";

import { useState } from "react";
import { Button } from "./button";
import { CommandPalette, type CommandItem } from "./command-palette";
import * as Icon from "./icons";
import type { DemoMap } from "./registry.types";

const ITEMS: CommandItem[] = [
  { id: "button", label: "Button", group: "Componentes" },
  { id: "select", label: "Select", group: "Componentes" },
  { id: "card", label: "Card", group: "Componentes" },
  { id: "brand", label: "color/bg/brand/solid/default", group: "Tokens" },
  { id: "space", label: "space/md", group: "Tokens" },
  { id: "h1", label: "heading-1-bold", group: "Tipografia" },
];

function Basic() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col items-center">
      <Button leading={<Icon.Search size={16} />} onClick={() => setOpen(true)}>
        Abrir busca
      </Button>
      <CommandPalette
        open={open}
        onClose={() => setOpen(false)}
        items={ITEMS}
        onSelect={() => setOpen(false)}
        placeholder="Buscar componente ou token…"
      />
    </div>
  );
}

export const commandPaletteDemos: DemoMap = {
  "command-palette": {
    demos: [
      {
        title: "Básico",
        code: `<CommandPalette
  open={open}
  onClose={() => setOpen(false)}
  items={[{ id: "button", label: "Button", group: "Componentes" }, …]}
  onSelect={(item) => router.push(rotas[item.id])}
/>`,
        Preview: Basic,
      },
    ],
  },
};
