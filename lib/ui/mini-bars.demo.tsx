"use client";

import { jsx } from "./demo-kit";
import { MiniBars, type MiniBarsSize } from "./mini-bars";
import type { DemoMap } from "./registry.types";

const WEEK = [14, 22, 9, 31, 26, 18, 35];

export const miniBarsDemos: DemoMap = {
  "mini-bars": {
    playground: {
      controls: [
        { kind: "select", prop: "size", label: "Tamanho", options: ["sm", "md", "lg"], initial: "md" },
        { kind: "select", prop: "highlight", label: "Destaque", options: ["nenhum", "-1", "3"], initial: "-1" },
      ],
      Preview: ({ values: v }) => (
        <MiniBars
          values={WEEK}
          size={v.size as MiniBarsSize}
          highlight={v.highlight === "nenhum" ? undefined : Number(v.highlight)}
          label="Pedidos, últimos 7 dias"
          className="text-icon-brand"
        />
      ),
      code: (v) =>
        jsx(
          "MiniBars",
          {
            values: "{pedidos}",
            size: v.size as string,
            highlight: v.highlight === "nenhum" ? undefined : `{${v.highlight}}`,
            className: "text-icon-brand",
          },
          undefined,
          { size: "md" },
        ),
    },
    demos: [
      {
        title: "Com número",
        code: `<span className="santo-heading-4-bold tabular-nums">35</span>
<MiniBars values={pedidos} highlight={-1} size="sm" className="text-icon-brand" />`,
        Preview: () => (
          <div className="flex items-end gap-md">
            <div className="flex items-baseline gap-2xs">
              <span className="santo-heading-4-bold text-text-primary tabular-nums">35</span>
              <span className="santo-caption-regular text-text-tertiary">hoje</span>
            </div>
            <MiniBars values={WEEK} highlight={-1} size="sm" label="Pedidos, últimos 7 dias" className="pb-2xs text-icon-brand" />
          </div>
        ),
      },
    ],
  },
};
