"use client";

import { jsx } from "./demo-kit";
import { Fab, type FabSize, type FabTone } from "./fab";
import * as Icon from "./icons";
import type { DemoMap } from "./registry.types";

export const fabDemos: DemoMap = {
  fab: {
    playground: {
      controls: [
        { kind: "boolean", prop: "extended", label: "Com rótulo", initial: false },
        { kind: "select", prop: "tone", label: "Tom", options: ["brand", "raised"], initial: "brand" },
        { kind: "select", prop: "size", label: "Tamanho", options: ["md", "lg"], initial: "md" },
      ],
      Preview: ({ values: v }) => (
        <Fab
          icon={<Icon.Plus size={v.size === "lg" ? 20 : 16} />}
          label="Novo pedido"
          extended={v.extended as boolean}
          tone={v.tone as FabTone}
          size={v.size as FabSize}
        />
      ),
      code: (v) =>
        jsx(
          "Fab",
          {
            icon: `{<Icon.Plus size={${v.size === "lg" ? 20 : 16}} />}`,
            label: "Novo pedido",
            extended: v.extended as boolean,
            tone: v.tone as string,
            size: v.size as string,
          },
          undefined,
          { tone: "brand", size: "md" },
        ),
    },
    demos: [
      {
        title: "Variantes",
        code: `<Fab icon={<Icon.Plus size={16} />} label="Novo pedido" />
<Fab icon={<Icon.Sparkles size={16} />} label="Gerar" tone="raised" />
<Fab icon={<Icon.Plus size={16} />} label="Novo pedido" extended />`,
        Preview: () => (
          <div className="flex items-center gap-md">
            <Fab icon={<Icon.Plus size={16} />} label="Novo pedido" />
            <Fab icon={<Icon.Sparkles size={16} />} label="Gerar" tone="raised" />
            <Fab icon={<Icon.Plus size={16} />} label="Novo pedido" extended />
          </div>
        ),
      },
    ],
  },
};
