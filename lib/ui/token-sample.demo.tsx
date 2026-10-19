"use client";

import type { DemoMap } from "./registry.types";
import { TokenSample } from "./token-sample";

export const tokenSampleDemos: DemoMap = {
  "token-sample": {
    demos: [
      {
        title: "Cor, sombra e raio",
        code: `<TokenSample variant="swatch" value="var(--santo-color-bg-brand-solid-default)" label="brand/solid" />
<TokenSample variant="shadow" value="var(--santo-shadow-md)" />
<TokenSample variant="radius" value="var(--santo-radius-xl)" />`,
        Preview: () => (
          <div className="flex flex-wrap items-center gap-lg">
            <TokenSample variant="swatch" value="var(--santo-color-bg-brand-solid-default)" label="brand/solid" />
            <TokenSample variant="shadow" value="var(--santo-shadow-md)" />
            <TokenSample variant="radius" value="var(--santo-radius-xl)" />
          </div>
        ),
      },
      {
        title: "Medida e texto",
        layout: "stretch",
        code: `<TokenSample variant="bar" value="var(--santo-space-4xl)" />
<TokenSample variant="line" value="var(--santo-border-thick)" />
<TokenSample variant="text" property="fontWeight" value="var(--santo-type-weight-bold)" />`,
        Preview: () => (
          <div className="mx-auto flex w-full max-w-(--santo-dimension-space-320) flex-col gap-md">
            <TokenSample variant="bar" value="var(--santo-space-4xl)" />
            <TokenSample variant="line" value="var(--santo-border-thick)" />
            <div className="flex gap-md">
              <TokenSample variant="text" property="fontSize" value="var(--santo-type-size-30)" />
              <TokenSample variant="text" property="fontWeight" value="var(--santo-type-weight-bold)" />
              <TokenSample variant="text" property="letterSpacing" value="var(--santo-type-tracking-wider)" sample="Santo" />
            </div>
          </div>
        ),
      },
      {
        title: "Movimento",
        code: `<TokenSample variant="easing" value="var(--santo-motion-easing-entrance)" bezier={[0, 0, 0.2, 1]} />
<TokenSample variant="duration" value="var(--santo-motion-duration-slow)" />`,
        Preview: () => (
          <div className="flex w-full max-w-(--santo-dimension-space-384) items-center gap-lg">
            <TokenSample variant="easing" value="var(--santo-motion-easing-entrance)" bezier={[0, 0, 0.2, 1]} />
            <TokenSample variant="duration" value="var(--santo-motion-duration-slow)" />
          </div>
        ),
      },
    ],
  },
};
