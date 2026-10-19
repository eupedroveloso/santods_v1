"use client";

import { useState } from "react";
import { CATEGORY_LABEL, FONT_CATALOG } from "@/lib/fonts/catalog";
import { jsx } from "./demo-kit";
import { Field } from "./input";
import { Select, type SelectOption } from "./listbox";
import { Swatch } from "./swatch";
import type { ControlSize } from "./button-class";
import type { DemoMap } from "./registry.types";

const ROLES: SelectOption<string>[] = [
  { value: "dona", label: "Dona" },
  { value: "editora", label: "Editora" },
  { value: "leitora", label: "Leitora", disabled: true },
];

const INTENTS = ["brand", "accent", "success", "warning", "danger", "info"].map((i) => ({
  value: i,
  label: i,
  leading: <Swatch size="xs" round color={`var(--santo-color-bg-${i}-solid-default)`} />,
}));

function PlaygroundPreview({ values: v }: { values: Record<string, string | boolean> }) {
  const [value, setValue] = useState("dona");
  return (
    <div className="mx-auto w-full max-w-(--santo-dimension-space-256)">
      <Select
        value={value}
        onChange={setValue}
        label="Papel"
        options={ROLES}
        size={v.size as ControlSize}
        pill={v.pill as boolean}
        disabled={v.disabled as boolean}
      />
    </div>
  );
}

function Basic() {
  const [value, setValue] = useState("dona");
  return (
    <div className="mx-auto w-full max-w-(--santo-dimension-space-256)">
      <Field label="Papel">
        <Select value={value} onChange={setValue} label="Papel" options={ROLES} />
      </Field>
    </div>
  );
}

function WithLeading() {
  const [value, setValue] = useState("brand");
  return (
    <div className="mx-auto w-full max-w-(--santo-dimension-space-256)">
      <Select value={value} onChange={setValue} label="Intenção" options={INTENTS} mono />
    </div>
  );
}

function Searchable() {
  const [value, setValue] = useState("Albert Sans");
  return (
    <div className="mx-auto w-full max-w-(--santo-dimension-space-256)">
      <Select
        value={value}
        onChange={setValue}
        label="Família tipográfica"
        searchable
        options={FONT_CATALOG.map((f) => ({
          value: f.family,
          label: f.family,
          group: CATEGORY_LABEL[f.category],
          labelStyle: { fontFamily: `"${f.family}", sans-serif` },
        }))}
      />
    </div>
  );
}

export const listboxDemos: DemoMap = {
  select: {
    playground: {
      controls: [
        { kind: "select", prop: "size", label: "Tamanho", options: ["sm", "md", "lg"], initial: "md" },
        { kind: "boolean", prop: "pill", label: "Pastilha", initial: false },
        { kind: "boolean", prop: "disabled", label: "Desabilitado", initial: false },
      ],
      layout: "stretch",
      Preview: PlaygroundPreview,
      code: (v) =>
        jsx(
          "Select",
          {
            value: "{value}",
            onChange: "{setValue}",
            label: "Papel",
            options: "{ROLES}",
            size: v.size as string,
            pill: v.pill as boolean,
            disabled: v.disabled as boolean,
          },
          undefined,
          { size: "md" },
        ),
    },
    demos: [
      {
        title: "Básico",
        layout: "stretch",
        code: `const [papel, setPapel] = useState("dona");

<Field label="Papel">
  <Select
    value={papel}
    onChange={setPapel}
    label="Papel"
    options={[
      { value: "dona", label: "Dona" },
      { value: "editora", label: "Editora" },
      { value: "leitora", label: "Leitora", disabled: true },
    ]}
  />
</Field>`,
        Preview: Basic,
      },
      {
        title: "Com marcador",
        layout: "stretch",
        code: `options={intents.map((i) => ({
  value: i,
  label: i,
  leading: <Swatch size="xs" round color={\`var(--santo-color-bg-\${i}-solid-default)\`} />,
}))}`,
        Preview: WithLeading,
      },
      {
        title: "Com busca e grupos",
        layout: "stretch",
        code: `<Select
  searchable
  options={FONT_CATALOG.map((f) => ({
    value: f.family,
    label: f.family,
    group: CATEGORY_LABEL[f.category],
    labelStyle: { fontFamily: f.family },
  }))}
/>`,
        Preview: Searchable,
      },
    ],
  },
};
