"use client";

import { useState } from "react";
import { Count, Tag } from "./chip";
import { Card } from "./card";
import { Disclosure } from "./disclosure";
import { Swatch } from "./swatch";
import type { DemoMap } from "./registry.types";

function Basic() {
  const [open, setOpen] = useState(true);
  return (
    <div className="w-full max-w-(--santo-dimension-space-320)">
      <Disclosure
        label="superfície"
        open={open}
        onToggle={() => setOpen((o) => !o)}
        trailing={
          <>
            <Tag intent="accent">1</Tag>
            <Count>3</Count>
          </>
        }
      >
        <div className="flex gap-xs">
          <Swatch color="var(--santo-color-surface-page)" />
          <Swatch color="var(--santo-color-surface-raised)" />
          <Swatch color="var(--santo-color-surface-sunken)" />
        </div>
      </Disclosure>
    </div>
  );
}

function Rows() {
  const [open, setOpen] = useState<Set<string>>(new Set(["heading-1"]));
  const toggle = (k: string) =>
    setOpen((s) => {
      const n = new Set(s);
      if (n.has(k)) n.delete(k);
      else n.add(k);
      return n;
    });
  return (
    <Card padded={false} className="mx-auto w-full max-w-(--santo-dimension-space-448) overflow-hidden">
      {[
        { k: "heading-1", cls: "santo-heading-6-semibold" },
        { k: "body", cls: "santo-body-regular" },
        { k: "caption", cls: "santo-caption-regular" },
      ].map((r) => (
        <Disclosure
          key={r.k}
          variant="row"
          id={`demo-${r.k}`}
          open={open.has(r.k)}
          onToggle={() => toggle(r.k)}
          label={
            <span className="flex items-baseline gap-sm">
              <span className={r.cls}>Aa</span>
              <code className="santo-code-sm text-text-secondary">{r.k}</code>
            </span>
          }
          trailing={<Count>6</Count>}
        >
          <span className={r.cls}>O rápido santo pulou a cerca</span>
        </Disclosure>
      ))}
    </Card>
  );
}

export const disclosureDemos: DemoMap = {
  disclosure: {
    demos: [
      {
        title: "Linha",
        layout: "stretch",
        code: `<Card padded={false} className="overflow-hidden">
  <Disclosure variant="row" id="heading-1" label={…} open={aberto} onToggle={alternar} trailing={<Count>6</Count>}>
    …
  </Disclosure>
</Card>`,
        Preview: Rows,
      },
      {
        title: "Básico",
        code: `<Disclosure label="superfície" open={open} onToggle={toggle} trailing={<><Tag intent="accent">1</Tag><Count>3</Count></>}>
  …
</Disclosure>`,
        Preview: Basic,
      },
    ],
  },
};
