"use client";

import { CtaButton } from "./cta-button";
import type { DemoMap } from "./registry.types";

export const ctaButtonDemos: DemoMap = {
  "cta-button": {
    playground: {
      controls: [
        { kind: "select", prop: "intent", label: "Intenção", options: ["success", "brand"], initial: "success" },
        { kind: "text", prop: "children", label: "Texto", initial: "Quero vender todos os dias" },
      ],
      layout: "stretch",
      Preview: ({ values: v }) => (
        <div className="mx-auto w-full max-w-(--santo-dimension-container-sm)">
          <CtaButton intent={v.intent as "success" | "brand"}>{v.children as string}</CtaButton>
        </div>
      ),
      code: (v) => `<CtaButton${v.intent !== "success" ? ` intent="${v.intent}"` : ""} href="/checkout">${v.children}</CtaButton>`,
    },
    demos: [],
  },
};
