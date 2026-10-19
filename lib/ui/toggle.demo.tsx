"use client";

import { useState } from "react";
import { jsx } from "./demo-kit";
import { Checkbox, Radio, SettingRow, Switch } from "./toggle";
import type { DemoMap, ControlValues } from "./registry.types";

function CheckboxPlayground({ values: v }: { values: ControlValues }) {
  const [checked, setChecked] = useState(true);
  return (
    <Checkbox
      checked={checked}
      onChange={setChecked}
      label={v.label as string}
      disabled={v.disabled as boolean}
    />
  );
}

function CheckboxStates() {
  const [a, setA] = useState(false);
  const [b, setB] = useState(true);
  return (
    <div className="flex flex-col gap-sm">
      <Checkbox checked={a} onChange={setA} label="Desmarcada" />
      <Checkbox checked={b} onChange={setB} label="Marcada" />
      <Checkbox checked={false} onChange={() => undefined} label="Desabilitada" disabled />
      <Checkbox checked onChange={() => undefined} label="Marcada e desabilitada" disabled />
    </div>
  );
}

function RadioPlayground({ values: v }: { values: ControlValues }) {
  const [plan, setPlan] = useState("starter");
  return (
    <div className="flex flex-col gap-sm">
      {[
        { id: "starter", title: "Starter" },
        { id: "pro", title: "Pro" },
      ].map((p) => (
        <Radio
          key={p.id}
          checked={plan === p.id}
          onChange={() => setPlan(p.id)}
          label={p.title}
          disabled={v.disabled as boolean}
        />
      ))}
    </div>
  );
}

function RadioCards() {
  const [plan, setPlan] = useState("starter");
  return (
    <div className="grid w-full max-w-(--santo-dimension-space-384) grid-cols-2 gap-sm">
      {[
        { id: "starter", title: "Starter" },
        { id: "pro", title: "Pro" },
      ].map((p) => (
        // div, nao button: o Radio ja e um <button>, e botao dentro de botao e HTML invalido.
        // O teclado chega pelo proprio Radio; o cartao so amplia a area de clique.
        <div
          key={p.id}
          onClick={() => setPlan(p.id)}
          className={`cursor-pointer rounded-lg border-thin p-sm transition-colors ease-(--santo-motion-easing-standard) duration-(--santo-motion-duration-fast) ${
            plan === p.id ? "border-border-brand bg-selected" : "border-border-subtle hover:bg-neutral-subtle-default"
          }`}
        >
          <Radio checked={plan === p.id} onChange={() => setPlan(p.id)} label={p.title} />
        </div>
      ))}
    </div>
  );
}

function SwitchPlayground({ values: v }: { values: ControlValues }) {
  const [on, setOn] = useState(true);
  return <Switch checked={on} onChange={setOn} label="Notificações" disabled={v.disabled as boolean} />;
}

function SwitchStates() {
  const [on, setOn] = useState(true);
  const [off, setOff] = useState(false);
  return (
    <div className="flex items-center gap-lg">
      <Switch checked={on} onChange={setOn} label="Ligada" />
      <Switch checked={off} onChange={setOff} label="Desligada" />
      <Switch checked onChange={() => undefined} label="Desabilitada" disabled />
    </div>
  );
}

function Settings() {
  const [essential, setEssential] = useState(true);
  const [functional, setFunctional] = useState(false);
  return (
    <div className="flex w-full max-w-(--santo-dimension-space-384) flex-col gap-md">
      <SettingRow
        title="Estritamente necessários"
        control={<Switch checked={essential} onChange={setEssential} label="Cookies necessários" disabled />}
      />
      <SettingRow
        title="Funcionais"
        control={<Switch checked={functional} onChange={setFunctional} label="Cookies funcionais" />}
      />
    </div>
  );
}

export const toggleDemos: DemoMap = {
  checkbox: {
    playground: {
      controls: [
        { kind: "text", prop: "label", label: "Rótulo", initial: "Aceito os termos" },
        { kind: "boolean", prop: "disabled", label: "Desabilitado", initial: false },
      ],
      Preview: CheckboxPlayground,
      code: (v) =>
        jsx("Checkbox", {
          checked: "{aceito}",
          onChange: "{setAceito}",
          label: v.label as string,
          disabled: v.disabled as boolean,
        }),
    },
    demos: [
      {
        title: "Estados",
        code: `<Checkbox checked={false} onChange={set} label="Desmarcada" />
<Checkbox checked onChange={set} label="Marcada" />
<Checkbox checked={false} onChange={set} label="Desabilitada" disabled />`,
        Preview: CheckboxStates,
      },
    ],
  },
  radio: {
    playground: {
      controls: [
        { kind: "boolean", prop: "disabled", label: "Desabilitado", initial: false },
      ],
      Preview: RadioPlayground,
      code: (v) =>
        jsx("Radio", {
          checked: `{plano === "starter"}`,
          onChange: `{() => setPlano("starter")}`,
          label: "Starter",
          disabled: v.disabled as boolean,
        }),
    },
    demos: [
      {
        title: "Em cartão de escolha",
        code: `// div, não button: o Radio já é um <button>.
<div onClick={() => setPlano("pro")} className="cursor-pointer rounded-lg border-thin p-sm …">
  <Radio checked={plano === "pro"} onChange={() => setPlano("pro")} label="Pro" />
</div>`,
        Preview: RadioCards,
      },
    ],
  },
  switch: {
    playground: {
      controls: [{ kind: "boolean", prop: "disabled", label: "Desabilitado", initial: false }],
      Preview: SwitchPlayground,
      code: (v) =>
        jsx("Switch", {
          checked: "{ligado}",
          onChange: "{setLigado}",
          label: "Notificações",
          disabled: v.disabled as boolean,
        }),
    },
    demos: [
      {
        title: "Estados",
        code: `<Switch checked onChange={set} label="Ligada" />
<Switch checked={false} onChange={set} label="Desligada" />
<Switch checked onChange={set} label="Desabilitada" disabled />`,
        Preview: SwitchStates,
      },
    ],
  },
  "setting-row": {
    demos: [
      {
        title: "Básico",
        layout: "stretch",
        code: `<SettingRow
  title="Funcionais"
  control={<Switch checked={on} onChange={setOn} label="Cookies funcionais" />}
/>`,
        Preview: Settings,
      },
    ],
  },
};
