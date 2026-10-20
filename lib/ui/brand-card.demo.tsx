"use client";

import { brands } from "@/lib/tokens";
import { BrandCard } from "./brand-card";
import type { DemoMap } from "./registry.types";

/** Valores por marca vindos dos tokens (brands.<id>.resolved), nunca hex escrito a mao. */
const DATA = {
  santo: { name: brands.santo.name, font: "Albert Sans" },
  vtsd: { name: brands.vtsd.name, font: "Sora" },
} as const;
const hex = (id: keyof typeof DATA, name: string) => (brands[id].resolved as Record<string, string>)[name] ?? "—";

export const brandCardDemos: DemoMap = {
  "brand-card": {
    playground: {
      controls: [{ kind: "select", prop: "brand", label: "Marca", options: ["santo", "vtsd"], initial: "santo" }],
      layout: "stretch",
      Preview: ({ values: v }) => {
        const id = v.brand as keyof typeof DATA;
        const d = DATA[id];
        return (
          <div className="w-full">
            <BrandCard
              brand={id}
              name={d.name}
              isDefault={id === "santo"}
              font={d.font}
              color={{ cssVar: "--santo-palette-brand-600", value: hex(id, "palette/brand/600") }}
              neutrals={{
                light: { cssVar: "--santo-palette-neutral-50", value: hex(id, "palette/neutral/50") },
                dark: { cssVar: "--santo-palette-neutral-950", value: hex(id, "palette/neutral/950") },
              }}
              radius={{ cssVar: "--santo-brand-shape-radius-base", value: hex(id, "brand/shape/radius-base") }}
            />
          </div>
        );
      },
      code: (v) => `<BrandCard brand="${v.brand}" name="…" font="…"
  color={{ cssVar, value }} neutrals={{ light, dark }} radius={{ cssVar, value }} />`,
    },
    demos: [],
  },
};
