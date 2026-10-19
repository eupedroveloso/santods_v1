"use client";

import { Breadcrumb } from "./breadcrumb";
import type { DemoMap } from "./registry.types";

export const breadcrumbDemos: DemoMap = {
  breadcrumb: {
    demos: [
      {
        title: "Básico",
        code: `<Breadcrumb
  items={[
    { label: "Docs", href: "/" },
    { label: "Componentes", href: "/componentes" },
    { label: "Breadcrumb" },
  ]}
/>`,
        Preview: () => (
          <Breadcrumb
            items={[
              { label: "Docs", href: "/" },
              { label: "Componentes", href: "/componentes" },
              { label: "Breadcrumb" },
            ]}
          />
        ),
      },
    ],
  },
};
