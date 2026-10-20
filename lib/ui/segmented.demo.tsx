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
const ICON_RANGES = [
  { value: "3m", label: <Icon.Grid size={16} />, title: "Grade" },
  { value: "30d", label: <Icon.ListIcon size={16} />, title: "Lista" },
  { value: "7d", label: <Icon.Code size={16} />, title: "Código" },
];

function SegmentedPlayground({ values: v }: { values: ControlValues }) {
  const [value, setValue] = useState("30d");
  return (
    <div className="w-full max-w-(--santo-dimension-space-384)">
      <Segmented
        size={v.size as "sm" | "md"}
        block={Boolean(v.block)}
        value={value}
        onChange={setValue}
        options={(v.icons ? ICON_RANGES : RANGES).slice(0, Number(v.count) === 2 ? 2 : 3)}
      />
    </div>
  );
}

function IconOnly() {
  const [mode, setMode] = useState("30d");
  return (
    <Segmented
      value={mode}
      onChange={setMode}
      options={ICON_RANGES}
    />
  );
}

function FullWidth() {
  const [value, setValue] = useState("1m");
  return (
    <div className="w-full max-w-(--santo-dimension-space-320)">
      <Segmented
        size="md"
        block
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
        { kind: "boolean", prop: "icons", label: "Só ícones", initial: false },
        { kind: "boolean", prop: "block", label: "Largura total", initial: false },
      ],
      Preview: SegmentedPlayground,
      code: (v) =>
        jsx(
          "Segmented",
          {
            size: v.size as string,
            block: v.block,
            value: "{periodo}",
            onChange: "{setPeriodo}",
            options: v.icons ? "{opcoesComIcones}" : Number(v.count) === 2 ? `{[{ value: "3m", label: "3 meses" }, { value: "30d", label: "30 dias" }]}` : "{periodos}",
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
    { value: "grade", label: <Icon.Grid size={16} />, title: "Grade" },
    { value: "lista", label: <Icon.ListIcon size={16} />, title: "Lista" },
    { value: "codigo", label: <Icon.Code size={16} />, title: "Código" },
  ]}
/>`,
        Preview: IconOnly,
      },
      {
        title: "Largura total",
        code: `<Segmented size="md" block … />`,
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
