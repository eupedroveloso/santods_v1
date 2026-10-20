"use client";

import { BrandLogo, BRAND_LOGOS, type BrandLogoSize } from "./brand-logo";
import type { DemoMap } from "./registry.types";

export const brandLogoDemos: DemoMap = {
  "brand-logo": {
    playground: {
      controls: [
        { kind: "select", prop: "brand", label: "Marca", options: [...BRAND_LOGOS], initial: "santo" },
        { kind: "select", prop: "size", label: "Altura", options: ["20", "24", "28", "32"], initial: "32" },
        { kind: "select", prop: "variant", label: "Variante", options: ["full", "mark"], initial: "full" },
      ],
      Preview: ({ values: v }) => (
        <BrandLogo brand={v.brand as string} size={Number(v.size) as BrandLogoSize} variant={v.variant as "full" | "mark"} />
      ),
      code: (v) => `<BrandLogo brand="${v.brand}"${v.size !== "24" ? ` size={${v.size}}` : ""}${v.variant !== "full" ? ` variant="${v.variant}"` : ""} />`,
    },
    demos: [],
  },
};
