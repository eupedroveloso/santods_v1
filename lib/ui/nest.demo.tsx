"use client";

import { Nest } from "./nest";
import type { DemoMap } from "./registry.types";

/** Faixa sem caixa: so o tom do nivel, para ver os recuos. */
function Level({ children }: { children?: React.ReactNode }) {
  return <span className="santo-caption-medium text-text-tertiary">{children}</span>;
}

export const nestDemos: DemoMap = {
  nest: {
    demos: [
      {
        title: "Três níveis",
        layout: "stretch",
        code: `<Nest inset="sm" radius="var(--santo-radius-2xl)" className="bg-surface-sunken">
  <Nest inset="xs" className="bg-surface-raised shadow-xs">   // raio = 2xl − sm
    <div className="santo-nested bg-surface-sunken p-md" />  // raio = (2xl − sm) − xs
  </Nest>
</Nest>`,
        Preview: () => (
          <Nest inset="sm" radius="var(--santo-radius-2xl)" className="mx-auto w-full max-w-(--santo-dimension-space-448) bg-surface-sunken">
            <Level>Nível 1 · recuo sm</Level>
            <Nest inset="xs" className="bg-surface-raised shadow-xs">
              <Level>Nível 2 · recuo xs</Level>
              <div className="santo-nested flex h-(--santo-dimension-space-96) items-center justify-center bg-surface-sunken">
                <Level>Nível 3</Level>
              </div>
            </Nest>
          </Nest>
        ),
      },
    ],
  },
};
