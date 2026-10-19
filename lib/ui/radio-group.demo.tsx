"use client";

import { useState } from "react";
import * as Icon from "./icons";
import { RadioCard, RadioGroup } from "./radio-group";
import type { DemoMap } from "./registry.types";

function Plans() {
  const [plan, setPlan] = useState("starter");
  return (
    <div className="mx-auto w-full max-w-(--santo-dimension-space-384)">
      <RadioGroup
        label="Plano"
        value={plan}
        onChange={setPlan}
        options={[
          { value: "starter", label: "Starter" },
          { value: "pro", label: "Pro" },
        ]}
      />
    </div>
  );
}

function Modes() {
  const [mode, setMode] = useState("claro");
  return (
    <div className="mx-auto w-full max-w-(--santo-dimension-space-448)">
      <RadioGroup
        label="Tema"
        columns={3}
        value={mode}
        onChange={setMode}
        options={[
          { value: "claro", label: "Claro", leading: <Icon.Sun size={16} /> },
          { value: "escuro", label: "Escuro", leading: <Icon.Moon size={16} /> },
          { value: "auto", label: "Auto", leading: <Icon.Expand size={16} />, disabled: true },
        ]}
      />
    </div>
  );
}

function Single() {
  const [on, setOn] = useState(true);
  return (
    <div className="mx-auto w-full max-w-(--santo-dimension-space-256)">
      <RadioCard checked={on} onSelect={() => setOn((v) => !v)}>
        Pro
      </RadioCard>
    </div>
  );
}

export const radioGroupDemos: DemoMap = {
  "radio-group": {
    demos: [
      {
        title: "Básico",
        layout: "stretch",
        code: `<RadioGroup
  label="Plano"
  value={plano}
  onChange={setPlano}
  options={[{ value: "starter", label: "Starter" }, { value: "pro", label: "Pro" }]}
/>`,
        Preview: Plans,
      },
      {
        title: "Com ícone",
        layout: "stretch",
        code: `<RadioGroup columns={3} options={[{ value: "claro", label: "Claro", leading: <Icon.Sun size={16} /> }, …]} />`,
        Preview: Modes,
      },
    ],
  },
  "radio-card": {
    demos: [
      {
        title: "Básico",
        layout: "stretch",
        code: `<RadioCard checked={marcado} onSelect={escolher}>Pro</RadioCard>`,
        Preview: Single,
      },
    ],
  },
};
