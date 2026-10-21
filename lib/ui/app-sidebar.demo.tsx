"use client";

import { AppSidebar, type AppSidebarGroup } from "./app-sidebar";
import { Card } from "./card";
import { Code, File, Palette, TrendUp } from "./icons";
import { componentsByTier } from "./registry";
import type { DemoMap } from "./registry.types";

const GROUPS: AppSidebarGroup[] = [
  { items: [{ href: "#documentacao", label: "Docs home" }] },
  { title: "Documentos", railIcon: <File size={20} />, items: [{ href: "#leia-me", label: "SantoDS — leia-me" }, { href: "#arquitetura", label: "Arquitetura" }] },
  { title: "Exemplos", items: [{ href: "#dashboard", label: "Dashboard" }, { href: "#landing", label: "Landing" }] },
  { title: "Fundamentos", railIcon: <Palette size={20} />, items: [{ href: "#cor", label: "Cor" }, { href: "#tipografia", label: "Tipografia" }] },
  {
    title: "Componentes",
    railIcon: <Code size={20} />,
    items: [],
    groups: componentsByTier().map((tier) => ({
      title: tier.label,
      items: tier.items.slice(0, 3).map((component) => ({
        href: `#${component.slug}`,
        label: component.name,
        active: component.slug === "button",
      })),
    })),
  },
];

const TREE: AppSidebarGroup[] = [
  {
    title: "Análises",
    icon: <TrendUp size={16} />,
    count: 12,
    items: [
      { href: "#receita", label: "Receita" },
      { href: "#clientes", label: "Clientes", count: 3 },
      { href: "#funil", label: "Funil" },
    ],
    groups: [{
      title: "Relatórios",
      icon: <File size={16} />,
      items: [{ href: "#outubro", label: "Outubro", active: true }, { href: "#setembro", label: "Setembro" }],
    }],
  },
  { title: "Documentos", icon: <File size={16} />, items: [{ href: "#guia", label: "Guia da equipe" }] },
];

export const appSidebarDemos: DemoMap = {
  "app-sidebar": {
    playground: {
      controls: [{ kind: "boolean", prop: "showRail", label: "Trilho de ícones", initial: true }],
      layout: "stretch",
      code: (values) => `<AppSidebar groups={grupos} showRail={${values.showRail}} />`,
      Preview: ({ values }) => (
        <Card variant="sunken" padding="sm" className="mx-auto w-full max-w-(--santo-dimension-space-384)">
          <AppSidebar groups={GROUPS} showRail={Boolean(values.showRail)} label="Playground da sidebar" />
        </Card>
      ),
    },
    demos: [
      {
        title: "Árvore aninhada",
        layout: "stretch",
        code: `<AppSidebar showRail={false} groups={[{
  title: "Análises", icon: <Icon.TrendUp size={16} />, count: 12,
  items: [
    { href: "/receita", label: "Receita" },
    { href: "/clientes", label: "Clientes", count: 3 },
  ],
  groups: [{
    title: "Relatórios", icon: <Icon.File size={16} />,
    items: [{ href: "/relatorios/outubro", label: "Outubro", active: true }],
  }],
}]} />`,
        Preview: () => (
          <Card variant="sunken" padding="sm" className="mx-auto w-full max-w-(--santo-dimension-space-384)">
            <AppSidebar groups={TREE} showRail={false} label="Demo árvore aninhada" />
          </Card>
        ),
      },
      {
        title: "Recolher e expandir tudo",
        layout: "stretch",
        code: `// Busca e botão fixos no topo do pai que rola (sem padding em cima).
<aside className="overflow-y-scroll santo-pinned-scroll px-xs pb-sm">
  <AppSidebar
    groups={grupos}
    showRail={false}
    onSearch={abrirBusca}
    foldAll
    pinned
    surface="sunken"
  />
</aside>`,
        Preview: () => (
          <Card variant="sunken" padded={false} className="mx-auto w-full max-w-(--santo-dimension-space-320) overflow-hidden">
            <div className="santo-pinned-scroll max-h-(--santo-dimension-space-320) overflow-y-scroll px-sm pb-sm">
              <AppSidebar
                groups={GROUPS}
                showRail={false}
                onSearch={() => undefined}
                foldAll
                pinned
                surface="sunken"
                label="Demo recolher e expandir tudo"
              />
            </div>
          </Card>
        ),
      },
      {
        title: "Com trilho",
        layout: "stretch",
        code: `<AppSidebar
  groups={grupos}        // { title?, railIcon?, items: [...], groups?: [...] }
  onSearch={abrirBusca}  // liga o campo de busca (⌘K)
  onNavigate={fecharGaveta}
/>`,
        Preview: () => (
          // Sobre o chao (sunken): a pastilha ativa so eleva sobre o tom de baixo.
          <Card variant="sunken" padding="sm" className="mx-auto w-full max-w-(--santo-dimension-space-384)">
            <AppSidebar groups={GROUPS} label="Demo com trilho" />
          </Card>
        ),
      },
      {
        title: "Sem trilho",
        layout: "stretch",
        code: `<AppSidebar groups={grupos} showRail={false} />`,
        Preview: () => (
          <Card variant="sunken" padding="sm" className="mx-auto w-full max-w-(--santo-dimension-space-256)">
            <AppSidebar groups={GROUPS} showRail={false} label="Demo sem trilho" />
          </Card>
        ),
      },
    ],
  },
};
