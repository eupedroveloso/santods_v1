"use client";

import { AppSidebar, type AppSidebarGroup } from "./app-sidebar";
import { Card } from "./card";
import type { DemoMap } from "./registry.types";

const GROUPS: AppSidebarGroup[] = [
  { items: [{ href: "#documentacao", label: "Documentação" }] },
  { title: "Exemplos", items: [{ href: "#dashboard", label: "Dashboard" }, { href: "#landing", label: "Landing" }] },
  { title: "Fundamentos", items: [{ href: "#cor", label: "Cor" }, { href: "#tipografia", label: "Tipografia" }] },
  { title: "Primitivos", items: [{ href: "#avatar", label: "Avatar" }, { href: "#button", label: "Button", active: true }] },
  { title: "Semânticos", items: [{ href: "#app-sidebar", label: "AppSidebar" }, { href: "#table", label: "Table" }] },
];

export const appSidebarDemos: DemoMap = {
  "app-sidebar": {
    demos: [
      {
        title: "Busca + grupos abertos",
        layout: "stretch",
        code: `<AppSidebar
  groups={grupos}        // { title?, items: { href, label, icon?, active? }[] }
  onSearch={abrirBusca}  // liga o campo de busca (⌘K)
  onNavigate={fecharGaveta}
/>`,
        Preview: () => (
          // Sobre o chao (sunken): a pastilha ativa so eleva sobre o tom de baixo.
          <Card variant="sunken" padding="sm" className="mx-auto w-full max-w-(--santo-dimension-space-256)">
            <AppSidebar groups={GROUPS} onSearch={() => {}} label="Documentação" />
          </Card>
        ),
      },
    ],
  },
};
