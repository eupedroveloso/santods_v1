"use client";

import { jsx } from "./demo-kit";
import type { DemoMap } from "./registry.types";
import { Ring, type RingSize, type RingTone } from "./ring";

export const ringDemos: DemoMap = {
  ring: {
    playground: {
      controls: [
        { kind: "select", prop: "value", label: "Valor", options: ["0", "25", "72", "100"], initial: "72" },
        { kind: "select", prop: "size", label: "Tamanho", options: ["sm", "md", "lg"], initial: "md" },
        { kind: "select", prop: "tone", label: "Tom", options: ["current", "brand", "accent", "success", "warning", "danger", "info"], initial: "brand" },
        { kind: "boolean", prop: "center", label: "Rótulo central", initial: true },
      ],
      Preview: ({ values: v }) => (
        <Ring value={Number(v.value)} label="Meta" size={v.size as RingSize} tone={v.tone as RingTone}>
          {v.center ? `${v.value}%` : undefined}
        </Ring>
      ),
      code: (v) =>
        jsx(
          "Ring",
          { value: `{${v.value}}`, label: "Meta", size: v.size as string, tone: v.tone as string },
          v.center ? `${v.value}%` : undefined,
          { size: "md", tone: "current" },
        ),
    },
    demos: [
      {
        title: "Tamanhos",
        code: `<Ring value={40} label="Upload" size="sm" tone="brand" />
<Ring value={64} label="Meta" tone="brand">64%</Ring>
<Ring value={88} label="Vendas" size="lg" tone="success">88%</Ring>`,
        Preview: () => (
          <div className="flex items-center gap-lg">
            <Ring value={40} label="Upload" size="sm" tone="brand" />
            <Ring value={64} label="Meta" tone="brand">
              64%
            </Ring>
            <Ring value={88} label="Vendas" size="lg" tone="success">
              88%
            </Ring>
          </div>
        ),
      },
    ],
  },
};
