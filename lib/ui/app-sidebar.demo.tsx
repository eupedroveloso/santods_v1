"use client";

import { useState } from "react";
import { AppSidebar, type AppSidebarGroup } from "./app-sidebar";
import { Card } from "./card";
import * as Icon from "./icons";
import type { DemoMap } from "./registry.types";

const AREAS = [
  { id: "inicio", label: "Início", icon: <Icon.Book size={20} /> },
  { id: "exemplos", label: "Exemplos", icon: <Icon.Grid size={20} /> },
  { id: "componentes", label: "Componentes", icon: <Icon.Layers size={20} /> },
];

const GROUPS: Record<string, AppSidebarGroup[]> = {
  inicio: [{ items: [{ href: "#documentacao", label: "Documentação", active: true }, { href: "#tokens", label: "Tokens" }] }],
  exemplos: [{ title: "Exemplos", items: [{ href: "#financas", label: "Finanças", active: true }, { href: "#cartoes", label: "Cartões" }, { href: "#painel", label: "Painel" }] }],
  componentes: [
    { title: "Primitivos", items: [{ href: "#avatar", label: "Avatar" }, { href: "#button", label: "Button", active: true }, { href: "#card", label: "Card" }] },
    { title: "Semânticos", items: [{ href: "#app-sidebar", label: "AppSidebar" }, { href: "#table", label: "Table" }] },
  ],
};

function Example() {
  const [area, setArea] = useState("componentes");
  return (
    // Sobre o chao (sunken): a pilula ativa so eleva sobre o tom de baixo.
    <Card variant="sunken" padding="sm" className="mx-auto w-full max-w-(--santo-dimension-space-320)">
      <AppSidebar areas={AREAS} area={area} onAreaChange={setArea} groups={GROUPS[area]} onSearch={() => {}} railLabel="Áreas da documentação" />
    </Card>
  );
}

export const appSidebarDemos: DemoMap = {
  "app-sidebar": {
    demos: [
      {
        title: "Trilho + busca + seções",
        layout: "stretch",
        code: `<AppSidebar
  areas={areas}            // { id, label, icon }
  area={area}
  onAreaChange={setArea}   // só troca o painel
  groups={secoesDaArea}    // { title?, items: { href, label, icon?, active? }[] }
  onSearch={abrirBusca}
/>`,
        Preview: Example,
      },
    ],
  },
};
