"use client";

import type { DemoMap } from "./registry.types";
import { Skeleton as S } from "./skeleton";
import { ThumbFrame } from "./thumb-frame";

export const thumbFrameDemos: DemoMap = {
  "thumb-frame": {
    playground: {
      controls: [{ kind: "select", prop: "pad", label: "Respiro", options: ["sm", "md"], initial: "sm" }],
      layout: "stretch",
      Preview: ({ values: v }) => (
        <div className="mx-auto w-full max-w-(--santo-dimension-space-320)">
          <ThumbFrame pad={v.pad as "sm" | "md"}>
            <S.Bar w="lg" size="lg" tone="strong" />
            <S.Bar w="xl" size="sm" />
            <S.Field placeholder="md" />
            <div className="flex justify-end">
              <S.Button size="sm" />
            </div>
          </ThumbFrame>
        </div>
      ),
      code: (v) => `<ThumbFrame pad="${v.pad}">
  <S.Bar w="lg" size="lg" tone="strong" />
  <S.Bar w="xl" size="sm" />
  <S.Field placeholder="md" />
  <S.Button size="sm" />
</ThumbFrame>`,
    },
    demos: [
      {
        title: "Primitivo",
        layout: "stretch",
        code: `<ThumbFrame pad="md">
  <S.Button w="lg" />
</ThumbFrame>`,
        Preview: () => (
          <div className="mx-auto w-full max-w-(--santo-dimension-space-320)">
            <ThumbFrame pad="md">
              <div className="flex justify-center">
                <S.Button w="lg" />
              </div>
            </ThumbFrame>
          </div>
        ),
      },
    ],
  },
};
