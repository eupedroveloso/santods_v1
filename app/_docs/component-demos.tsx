"use client";

import { useState } from "react";
import { Card, CodeBlock, Field, Input, Select, Switch } from "@/lib/ui";
import { initialValues } from "@/lib/ui/demo-kit";
import { demos } from "@/lib/ui/demos";
import { getComponent } from "@/lib/ui/registry";
import type { Control, ControlValues, Playground } from "@/lib/ui/registry.types";
import { DemoCard } from "./demo-card";
import { LAYOUT } from "./links";

/** Ancora de demo: "Com ícone" → "com-icone". */
const anchor = (title: string) =>
  title
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

/** Playground + demos de um componente do registry. */
export function ComponentDemos({ slug }: { slug: string }) {
  const entry = demos[slug];
  const file = getComponent(slug)?.source ?? `${slug}.tsx`;
  if (!entry || (!entry.playground && entry.demos.length === 0)) {
    return (
      <p className="santo-body-small-regular rounded-xl border-thin border-border-subtle bg-surface-sunken p-lg text-text-secondary">
        Este componente ainda não tem demo registrada em lib/ui.
      </p>
    );
  }
  return (
    <div className="flex flex-col gap-2xl">
      {entry.playground && <PlaygroundBlock playground={entry.playground} file={file} />}
      {/* Demos em grade fluida: uma coluna ate caber duas de container/sm (640px). */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,var(--santo-dimension-container-sm)),1fr))] gap-2xl">
        {entry.demos.map((d) => (
        <DemoCard key={d.title} id={anchor(d.title)} title={d.title} code={d.code} codeTitle={file} layout={d.layout}>
          <d.Preview />
        </DemoCard>
        ))}
      </div>
    </div>
  );
}

const PLAYGROUND_LABEL = <h2 className="santo-body-small-semibold text-text-primary">Playground</h2>;

function PlaygroundBlock({ playground, file }: { playground: Playground; file: string }) {
  const [values, setValues] = useState<ControlValues>(() => initialValues(playground.controls));
  const set = (prop: string, value: string | boolean) => setValues((v) => ({ ...v, [prop]: value }));
  const { Preview } = playground;
  return (
    <section id="playground" className="scroll-mt-6xl">
      <Card
        variant="double"
        padded={false}
        header={PLAYGROUND_LABEL}
        footer={<CodeBlock code={playground.code(values)} title={file} className="flex-1" />}
      >
        <div className="flex min-w-0 flex-col md:flex-row">
          <div
            className={`flex min-h-(--santo-dimension-space-240) min-w-0 flex-1 flex-col justify-center p-xl ${
              playground.layout === "stretch" ? "items-stretch" : "items-center"
            }`}
          >
            <Preview values={values} />
          </div>
          <div
            className={`flex shrink-0 flex-col gap-md border-t-thin border-border-subtle p-md ${LAYOUT.panel} md:border-t-0 md:border-l-thin`}
          >
            {playground.controls.map((c) => (
              <ControlField key={c.prop} control={c} value={values[c.prop]} onChange={(v) => set(c.prop, v)} />
            ))}
          </div>
        </div>
      </Card>
    </section>
  );
}

function ControlField({
  control,
  value,
  onChange,
}: {
  control: Control;
  value: string | boolean;
  onChange: (value: string | boolean) => void;
}) {
  if (control.kind === "boolean") {
    return (
      <div className="flex items-center justify-between gap-sm">
        <span className="santo-body-small-medium text-text-primary">{control.label}</span>
        <Switch checked={value as boolean} onChange={onChange} label={control.label} />
      </div>
    );
  }
  if (control.kind === "select") {
    return (
      <Field label={control.label}>
        <Select
          size="sm"
          mono
          value={value as string}
          onChange={onChange}
          label={control.label}
          options={control.options.map((o) => ({ value: o, label: o }))}
        />
      </Field>
    );
  }
  return (
    <Field label={control.label}>
      <Input size="sm" value={value as string} onChange={(e) => onChange(e.target.value)} />
    </Field>
  );
}
