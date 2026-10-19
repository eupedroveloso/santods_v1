"use client";

import { useState } from "react";
import { jsx } from "./demo-kit";
import * as Icon from "./icons";
import { Count } from "./chip";
import { Segmented, TabBar } from "./segmented";
import type { ControlValues, DemoMap } from "./registry.types";

const RANGES = [
  { value: "3m", label: "3 meses" },
  { value: "30d", label: "30 dias" },
  { value: "7d", label: "7 dias" },
];

function SegmentedPlayground({ values: v }: { values: ControlValues }) {
  const [value, setValue] = useState("30d");
  return (
    <Segmented
      size={v.size as "sm" | "md"}
      value={value}
      onChange={setValue}
      options={RANGES.slice(0, Number(v.count) === 2 ? 2 : 3)}
    />
  );
}

function IconOnly() {
  const [mode, setMode] = useState<"claro" | "escuro">("claro");
  return (
    <Segmented
      value={mode}
      onChange={setMode}
      options={[
        { value: "claro", label: <Icon.Sun size={16} />, title: "Claro" },
        { value: "escuro", label: <Icon.Moon size={16} />, title: "Escuro" },
      ]}
    />
  );
}

function FullWidth() {
  const [value, setValue] = useState("1m");
  return (
    <div className="w-full max-w-(--santo-dimension-space-320)">
      <Segmented
        size="md"
        className="w-full"
        value={value}
        onChange={setValue}
        options={[
          { value: "1w", label: "1 semana" },
          { value: "1m", label: "1 mês" },
          { value: "1y", label: "1 ano" },
        ]}
      />
    </div>
  );
}

function TabsPlayground({ values: v }: { values: ControlValues }) {
  const [tab, setTab] = useState("inicio");
  if (v.variant === "floating")
    return (
      <div className="w-full max-w-(--santo-dimension-space-384)">
        <TabBar
          variant="floating"
          label="Navegação"
          value={tab}
          onChange={setTab}
          options={[
            { value: "inicio", label: "Início", icon: <Icon.Expand size={20} /> },
            { value: "buscar", label: "Buscar", icon: <Icon.Search size={20} /> },
            { value: "criar", label: "Criar", icon: <Icon.Plus size={20} /> },
            { value: "salvos", label: "Salvos", icon: <Icon.Save size={20} /> },
          ]}
        />
      </div>
    );
  return (
    <TabBar
      value={tab}
      onChange={setTab}
      options={[
        { value: "inicio", label: "Visão geral" },
        { value: "buscar", label: "Análises", count: v.count ? <Count>12</Count> : undefined },
        { value: "criar", label: "Relatórios" },
        { value: "salvos", label: "Avisos", count: v.count ? <Count tone="brand">3</Count> : undefined },
      ]}
    />
  );
}

export const segmentedDemos: DemoMap = {
  segmented: {
    playground: {
      controls: [
        { kind: "select", prop: "size", label: "Tamanho", options: ["sm", "md"], initial: "md" },
        { kind: "select", prop: "count", label: "Opções", options: ["2", "3"], initial: "3" },
      ],
      Preview: SegmentedPlayground,
      code: (v) =>
        jsx(
          "Segmented",
          {
            size: v.size as string,
            value: "{periodo}",
            onChange: "{setPeriodo}",
            options: Number(v.count) === 2 ? `{[{ value: "3m", label: "3 meses" }, { value: "30d", label: "30 dias" }]}` : "{periodos}",
          },
          undefined,
          { size: "sm" },
        ),
    },
    demos: [
      {
        title: "Só ícone",
        code: `<Segmented
  value={modo}
  onChange={setModo}
  options={[
    { value: "claro", label: <Icon.Sun size={16} />, title: "Claro" },
    { value: "escuro", label: <Icon.Moon size={16} />, title: "Escuro" },
  ]}
/>`,
        Preview: IconOnly,
      },
      {
        title: "Largura total",
        code: `<Segmented size="md" className="w-full" … />`,
        Preview: FullWidth,
      },
    ],
  },
  "tab-bar": {
    playground: {
      controls: [
        { kind: "select", prop: "variant", label: "Variante", options: ["pill", "floating"], initial: "pill" },
        { kind: "boolean", prop: "count", label: "Contagem", initial: true },
      ],
      Preview: TabsPlayground,
      code: (v) =>
        v.variant === "floating"
          ? `<TabBar
  variant="floating"
  label="Navegação"
  value={aba}
  onChange={setAba}
  options={[
    { value: "inicio", label: "Início", icon: <Icon.Expand size={20} /> },
    { value: "buscar", label: "Buscar", icon: <Icon.Search size={20} /> },
    …
  ]}
/>`
          : `<TabBar
  value={aba}
  onChange={setAba}
  options={[
    { value: "visao", label: "Visão geral" },
    { value: "analises", label: "Análises"${v.count ? ", count: <Count>12</Count>" : ""} },
    …
  ]}
/>`,
    },
    demos: [],
  },
};
