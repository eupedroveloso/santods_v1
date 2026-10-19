"use client";

import { useState } from "react";
import * as Icon from "./icons";
import { RailItem, RailNav } from "./rail-nav";
import type { DemoMap } from "./registry.types";

const AREAS = [
  { label: "Painel", icon: <Icon.Grid size={16} /> },
  { label: "Análises", icon: <Icon.TrendUp size={16} />, dot: true },
  { label: "Biblioteca", icon: <Icon.Layers size={16} /> },
  { label: "Documentos", icon: <Icon.File size={16} /> },
];

function RailPreview() {
  const [active, setActive] = useState("Painel");
  return (
    <div className="h-(--santo-dimension-space-320)">
      <RailNav footer={<RailItem icon={<Icon.IdCard size={16} />} label="Conta" />}>
        {AREAS.map((a) => (
          <RailItem
            key={a.label}
            icon={a.icon}
            label={a.label}
            dot={a.dot}
            active={active === a.label}
            onClick={() => setActive(a.label)}
          />
        ))}
      </RailNav>
    </div>
  );
}

export const railNavDemos: DemoMap = {
  "rail-nav": {
    demos: [
      {
        title: "Básico",
        code: `<RailNav footer={<RailItem icon={<Icon.IdCard size={16} />} label="Conta" />}>
  <RailItem icon={<Icon.Grid size={16} />} label="Painel" href="/" active />
  <RailItem icon={<Icon.TrendUp size={16} />} label="Análises" href="/analises" dot />
  <RailItem icon={<Icon.Layers size={16} />} label="Biblioteca" href="/biblioteca" />
</RailNav>`,
        Preview: RailPreview,
      },
    ],
  },
  "rail-item": {
    demos: [
      {
        title: "Estados",
        code: `<RailItem icon={<Icon.Grid size={16} />} label="Painel" active />
<RailItem icon={<Icon.TrendUp size={16} />} label="Análises" dot />
<RailItem icon={<Icon.Layers size={16} />} label="Biblioteca" />`,
        Preview: () => (
          <div className="flex items-center gap-2xs rounded-full bg-surface-sunken p-2xs">
            <RailItem icon={<Icon.Grid size={16} />} label="Painel" active />
            <RailItem icon={<Icon.TrendUp size={16} />} label="Análises" dot />
            <RailItem icon={<Icon.Layers size={16} />} label="Biblioteca" />
          </div>
        ),
      },
    ],
  },
};
