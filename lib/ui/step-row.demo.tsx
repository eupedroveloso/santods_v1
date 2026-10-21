"use client";

import { useState } from "react";
import { Card } from "./card";
import { Input } from "./input";
import type { DemoMap } from "./registry.types";
import { StepRow } from "./step-row";
import { TokenSample } from "./token-sample";

const DERIVADO = { xs: 4, sm: 8, lg: 12, xl: 16 } as const;
type Nivel = keyof typeof DERIVADO;

function Passos() {
  const [editado, setEditado] = useState<Partial<Record<Nivel, number>>>({ lg: 14 });
  return (
    <Card padding="md" className="w-full max-w-(--santo-dimension-space-384)">
      <div className="flex flex-col">
        {(Object.keys(DERIVADO) as Nivel[]).map((n) => {
          const valor = editado[n] ?? DERIVADO[n];
          return (
            <StepRow
              key={n}
              name={`radius/${n}`}
              sample={<TokenSample variant="radius" value={`var(--santo-radius-${n})`} />}
              unit="px"
              overridden={editado[n] !== undefined}
              onReset={() =>
                setEditado((s) => {
                  const resto = { ...s };
                  delete resto[n];
                  return resto;
                })
              }
            >
              <Input
                size="sm"
                mono
                type="number"
                min={0}
                value={valor}
                onChange={(e) => setEditado((s) => ({ ...s, [n]: Number(e.target.value) }))}
                aria-label={`radius/${n} em px`}
                className="w-(--santo-dimension-space-72) text-right"
              />
            </StepRow>
          );
        })}
      </div>
    </Card>
  );
}

export const stepRowDemos: DemoMap = {
  "step-row": {
    demos: [
      {
        title: "Passos editáveis",
        layout: "stretch",
        code: `<StepRow
  name="radius/lg"
  sample={<TokenSample variant="radius" value="var(--santo-radius-lg)" />}
  unit="px"
  overridden={editado}
  onReset={voltarAoDerivado}
>
  <Input size="sm" mono type="number" value={valor} onChange={…} aria-label="radius/lg em px" />
</StepRow>`,
        Preview: Passos,
      },
      {
        title: "Só leitura",
        layout: "stretch",
        code: `<StepRow name="space/md" sample={<TokenSample variant="bar" value="var(--santo-space-md)" />} unit="px">
  <span className="santo-code-sm text-text-primary">16</span>
</StepRow>`,
        Preview: () => (
          <Card padding="md" className="w-full max-w-(--santo-dimension-space-384)">
            <div className="flex flex-col">
              {["sm", "md", "lg"].map((n) => (
                <StepRow key={n} name={`space/${n}`} sample={<TokenSample variant="bar" value={`var(--santo-space-${n})`} />} unit="px">
                  <span className="santo-code-sm text-text-primary">{{ sm: 12, md: 16, lg: 24 }[n]}</span>
                </StepRow>
              ))}
            </div>
          </Card>
        ),
      },
    ],
  },
};
