"use client";

import * as Generated from "@/lib/icons";
import manifest from "@/lib/icons/manifest.json";
import type { IconProps } from "@/lib/icons";
import type { ComponentType } from "react";
import { Sparkles } from "./icons";
import type { DemoMap } from "./registry.types";

type Entry = { slug: string; component: string; figma: { nodeId: string } };

/** A grade sai do manifest gerado da pagina Icones do Figma — nao de uma lista a mao. */
const ENTRIES = Object.entries(manifest.icons as Record<string, Omit<Entry, "slug">>).map(([slug, e]) => ({
  slug,
  ...e,
  Glyph: (Generated as unknown as Record<string, ComponentType<IconProps>>)[e.component],
}));

export const iconsDemos: DemoMap = {
  icon: {
    demos: [
      {
        title: "Conjunto",
        layout: "stretch",
        code: `import { Icon } from "@/lib/ui";

<Icon.Search size={16} />          // nome do papel
<Icon.MagnifyingGlassIcon />       // nome do Figma`,
        Preview: () => (
          <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(var(--santo-dimension-space-112),1fr))] gap-md">
            {ENTRIES.map(({ slug, Glyph }) => (
              <span key={slug} title={slug} className="flex flex-col items-center gap-2xs text-icon-primary">
                {Glyph && <Glyph size={24} />}
                <code className="santo-code-sm max-w-full truncate text-text-tertiary">{slug}</code>
              </span>
            ))}
          </div>
        ),
      },
      {
        title: "Tamanhos",
        code: `<Icon.Sparkles size={12} /> … <Icon.Sparkles size={48} />`,
        Preview: () => (
          <div className="flex items-end gap-md text-icon-primary">
            {([12, 16, 20, 24, 32, 40, 48] as const).map((s) => (
              <span key={s} className="flex flex-col items-center gap-2xs">
                <Sparkles size={s} />
                <code className="santo-code-sm text-text-tertiary">{s}</code>
              </span>
            ))}
          </div>
        ),
      },
    ],
  },
};
