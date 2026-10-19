"use client";

import { jsx } from "./demo-kit";
import type { DemoMap } from "./registry.types";
import { Sparkline, type SparklineSize } from "./sparkline";

const SERIES = [12, 18, 14, 22, 19, 27, 24, 31, 29, 36];

const TONE: Record<string, string> = {
  current: "text-icon-primary",
  brand: "text-icon-brand",
  success: "text-icon-success",
  danger: "text-icon-danger",
};

export const sparklineDemos: DemoMap = {
  sparkline: {
    playground: {
      controls: [
        { kind: "select", prop: "size", label: "Tamanho", options: ["sm", "md", "lg"], initial: "md" },
        { kind: "select", prop: "tone", label: "Cor do pai", options: Object.keys(TONE), initial: "brand" },
        { kind: "boolean", prop: "area", label: "Área", initial: true },
        { kind: "boolean", prop: "dot", label: "Ponto final", initial: true },
        { kind: "boolean", prop: "fluid", label: "Largura do pai", initial: false },
      ],
      layout: "stretch",
      Preview: ({ values: v }) => (
        <div className={`mx-auto w-full max-w-(--santo-dimension-space-240) ${TONE[v.tone as string]}`}>
          <Sparkline values={SERIES} size={v.size as SparklineSize} area={v.area as boolean} dot={v.dot as boolean} fluid={v.fluid as boolean} label="Receita, 10 semanas" />
        </div>
      ),
      code: (v) =>
        `<div className="${TONE[v.tone as string]}">\n  ${jsx(
          "Sparkline",
          { values: "{receita}", size: v.size as string, area: v.area as boolean, dot: v.dot ? undefined : "{false}", fluid: v.fluid as boolean },
          undefined,
          { size: "md" },
        )}\n</div>`,
    },
    demos: [
      {
        title: "Com número",
        code: `<span className="santo-heading-4-bold tabular-nums">R$ 36 mil</span>
<div className="w-(--santo-dimension-space-96) text-icon-brand">
  <Sparkline values={receita} size="sm" />
</div>`,
        Preview: () => (
          <div className="flex items-end gap-md">
            <div className="flex items-baseline gap-2xs">
              <span className="santo-heading-4-bold text-text-primary tabular-nums">36</span>
              <span className="santo-caption-regular text-text-tertiary">mil</span>
            </div>
            <div className="w-(--santo-dimension-space-96) pb-2xs text-icon-brand">
              <Sparkline values={SERIES} size="sm" label="Receita, 10 semanas" />
            </div>
          </div>
        ),
      },
    ],
  },
};
