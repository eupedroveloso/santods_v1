"use client";

import { Rating } from "./rating";
import type { DemoMap } from "./registry.types";

export const ratingDemos: DemoMap = {
  rating: {
    playground: {
      controls: [
        { kind: "select", prop: "value", label: "Nota", options: ["3", "4", "4.5", "5"], initial: "4.5" },
        { kind: "text", prop: "label", label: "Texto", initial: "4,9/5" },
      ],
      Preview: ({ values: v }) => <Rating value={Number(v.value)} label={(v.label as string) || undefined} />,
      code: (v) => `<Rating value={${v.value}}${v.label ? ` label="${v.label}"` : ""} />`,
    },
    demos: [],
  },
};
