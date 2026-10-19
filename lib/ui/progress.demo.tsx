"use client";

import { jsx } from "./demo-kit";
import { Progress } from "./progress";
import type { DemoMap } from "./registry.types";

type PI = "brand" | "accent" | "success" | "warning" | "danger" | "info";

export const progressDemos: DemoMap = {
  progress: {
    playground: {
      controls: [
        { kind: "select", prop: "value", label: "Valor", options: ["0", "25", "62", "100"], initial: "62" },
        { kind: "select", prop: "intent", label: "Intenção", options: ["brand", "accent", "success", "warning", "danger", "info"], initial: "brand" },
        { kind: "select", prop: "size", label: "Tamanho", options: ["sm", "md"], initial: "sm" },
      ],
      layout: "stretch",
      Preview: ({ values: v }) => (
        <div className="mx-auto w-full max-w-(--santo-dimension-space-320)">
          <Progress value={Number(v.value)} label="Meta" intent={v.intent as PI} size={v.size as "sm" | "md"} />
        </div>
      ),
      code: (v) =>
        jsx(
          "Progress",
          { value: `{${v.value}}`, label: "Meta", intent: v.intent as string, size: v.size as string },
          undefined,
          { intent: "brand", size: "sm" },
        ),
    },
    demos: [
      {
        title: "Metas",
        layout: "stretch",
        code: `<Progress value={82} label="Vendas" intent="success" />
<Progress value={96} label="Armazenamento" intent="danger" />`,
        Preview: () => (
          <div className="mx-auto flex w-full max-w-(--santo-dimension-space-320) flex-col gap-md">
            {[
              { label: "Vendas", value: 82, intent: "success" as const },
              { label: "Leads", value: 45, intent: "brand" as const },
              { label: "Armazenamento", value: 96, intent: "danger" as const },
            ].map((g) => (
              <div key={g.label} className="flex flex-col gap-2xs">
                <div className="santo-caption-medium flex justify-between text-text-secondary">
                  <span>{g.label}</span>
                  <span className="tabular-nums">{g.value}%</span>
                </div>
                <Progress value={g.value} label={g.label} intent={g.intent} />
              </div>
            ))}
          </div>
        ),
      },
    ],
  },
};
