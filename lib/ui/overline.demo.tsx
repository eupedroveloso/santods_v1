"use client";

import { Overline } from "./overline";
import type { DemoMap } from "./registry.types";

export const overlineDemos: DemoMap = {
  overline: {
    demos: [
      {
        title: "Básico",
        code: `<Overline>Reserva de emergência</Overline>`,
        Preview: () => (
          <div className="flex flex-col gap-3xs">
            <Overline>Reserva de emergência</Overline>
            <span className="santo-heading-4-bold tabular-nums">R$ 13.000</span>
          </div>
        ),
      },
    ],
  },
};
