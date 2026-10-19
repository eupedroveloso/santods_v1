"use client";

import * as Icon from "./icons";
import { LinkCard } from "./link-card";
import type { DemoMap } from "./registry.types";

export const linkCardDemos: DemoMap = {
  "link-card": {
    demos: [
      {
        title: "Básico",
        code: `<LinkCard
  icon={<Icon.Palette size={20} />}
  title="Tokens"
  href="/tokens"
  links={[
    { label: "Color", href: "/tokens/color" },
    { label: "Semantic", href: "/tokens/semantic" },
  ]}
/>`,
        Preview: () => (
          <LinkCard
            className="w-full max-w-(--santo-dimension-space-320)"
            icon={<Icon.Palette size={20} />}
            title="Tokens"
            href="/tokens"
            links={[
              { label: "Color", href: "/tokens/color" },
              { label: "Semantic", href: "/tokens/semantic" },
            ]}
          />
        ),
      },
    ],
  },
};
