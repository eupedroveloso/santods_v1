"use client";

import { colorValue } from "@/lib/tokens";
import { contrastRatio } from "./color";
import { Tag } from "./chip";
import type { DemoMap } from "./registry.types";

const PAIRS = [
  ["color/text/primary", "color/surface/page"],
  ["color/text/secondary", "color/surface/raised"],
  ["color/text/on-brand", "color/bg/brand/solid/default"],
] as const;

function Contrast() {
  return (
    <div className="flex w-full max-w-(--santo-dimension-space-448) flex-col gap-xs">
      {PAIRS.map(([fg, bg]) => {
        const ratio = contrastRatio(colorValue(fg), colorValue(bg));
        return (
          <div key={fg} className="flex items-center justify-between gap-sm">
            <code className="santo-code-sm min-w-0 truncate text-text-secondary">
              {fg.replace("color/", "")} × {bg.replace("color/", "")}
            </code>
            <Tag intent={ratio >= 4.5 ? "success" : "danger"}>{ratio.toFixed(2)}:1</Tag>
          </div>
        );
      })}
    </div>
  );
}

export const colorDemos: DemoMap = {
  color: {
    demos: [
      {
        title: "Contraste",
        code: `import { Color } from "@/lib/ui";
import { colorValue } from "@/lib/tokens";

Color.contrastRatio(colorValue("color/text/primary"), colorValue("color/surface/page"));`,
        Preview: Contrast,
      },
    ],
  },
};
