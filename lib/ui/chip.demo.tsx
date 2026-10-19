"use client";

import { useState } from "react";
import { Chip, Count, Tag, type Intent } from "./chip";
import { jsx } from "./demo-kit";
import * as Icon from "./icons";
import type { ControlValues, DemoMap } from "./registry.types";

const INTENTS: Intent[] = ["neutral", "brand", "accent", "success", "warning", "danger", "info"];

function ChipPlayground({ values: v }: { values: ControlValues }) {
  const [active, setActive] = useState(true);
  return (
    <Chip
      active={active}
      onClick={() => setActive((a) => !a)}
      leading={v.leading ? <Icon.Palette size={16} /> : undefined}
    >
      {v.children as string}
    </Chip>
  );
}

function Filters() {
  const [value, setValue] = useState("cores");
  return (
    <div className="flex flex-wrap items-center justify-center gap-2xs">
      {["cores", "tipografia", "dimensões", "efeitos"].map((c) => (
        <Chip key={c} active={value === c} onClick={() => setValue(c)}>
          {c}
        </Chip>
      ))}
    </div>
  );
}

export const chipDemos: DemoMap = {
  chip: {
    playground: {
      controls: [
        { kind: "text", prop: "children", label: "Texto", initial: "cores" },
        { kind: "boolean", prop: "leading", label: "Ícone", initial: false },
      ],
      Preview: ChipPlayground,
      code: (v) =>
        jsx(
          "Chip",
          {
            active: "{ativo}",
            onClick: "{alternar}",
            leading: v.leading ? "{<Icon.Palette size={16} />}" : undefined,
          },
          v.children as string,
        ),
    },
    demos: [
      {
        title: "Filtro",
        code: `{filtros.map((f) => (
  <Chip key={f} active={atual === f} onClick={() => setAtual(f)}>{f}</Chip>
))}`,
        Preview: Filters,
      },
    ],
  },
  tag: {
    playground: {
      controls: [
        { kind: "select", prop: "intent", label: "Intenção", options: INTENTS, initial: "success" },
        { kind: "text", prop: "children", label: "Texto", initial: "Pago" },
        { kind: "boolean", prop: "icon", label: "Ícone", initial: false },
      ],
      Preview: ({ values: v }) => (
        <Tag intent={v.intent as Intent}>
          {v.icon && <Icon.Check size={12} />}
          {v.children as string}
        </Tag>
      ),
      code: (v) =>
        jsx(
          "Tag",
          { intent: v.intent as string },
          `${v.icon ? "<Icon.Check size={12} />" : ""}${v.children}`,
          { intent: "neutral" },
        ),
    },
    demos: [
      {
        title: "Intenções",
        code: INTENTS.map((i) => `<Tag intent="${i}">${i}</Tag>`).join("\n"),
        Preview: () => (
          <div className="flex flex-wrap items-center justify-center gap-2xs">
            {INTENTS.map((i) => (
              <Tag key={i} intent={i}>
                {i}
              </Tag>
            ))}
          </div>
        ),
      },
      {
        title: "Com ponto",
        code: `<Tag intent="warning" dot>Pendente</Tag>`,
        Preview: () => (
          <div className="flex items-center gap-2xs">
            <Tag intent="warning" dot>Pendente</Tag>
            <Tag intent="success" dot>Online</Tag>
            <Tag intent="danger" dot>Falhou</Tag>
          </div>
        ),
      },
      {
        title: "Com ícone",
        code: `<Tag intent="success"><Icon.TrendUp size={12} />+12,5%</Tag>`,
        Preview: () => (
          <div className="flex items-center gap-2xs">
            <Tag intent="success">
              <Icon.TrendUp size={12} />
              +12,5%
            </Tag>
            <Tag intent="danger">
              <Icon.Close size={12} />
              Falhou
            </Tag>
          </div>
        ),
      },
    ],
  },
  count: {
    demos: [
      {
        title: "Básico",
        code: `<span>Cores</span> <Count>345</Count>`,
        Preview: () => (
          <span className="flex items-baseline gap-2xs">
            <span className="santo-body-small-medium">Variáveis</span>
            <Count>345</Count>
          </span>
        ),
      },
    ],
  },
};
