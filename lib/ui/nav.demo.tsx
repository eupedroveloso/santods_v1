"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { IconButton } from "./button";
import { Card } from "./card";
import { PEOPLE, photo } from "./demo-people";
import * as Icon from "./icons";
import { NavItem, NavSection, NavSub, NavUser, Pagination, SidebarNav } from "./nav";
import { RailItem, RailNav } from "./rail-nav";
import type { ControlValues, DemoMap } from "./registry.types";

const MAIN = [
  { label: "Painel", icon: <Icon.Palette size={16} /> },
  { label: "Análises", icon: <Icon.TrendUp size={16} /> },
  { label: "Projetos", icon: <Icon.Save size={16} /> },
];
const RAIL = [
  { id: "inicio", label: "Início", icon: <Icon.Expand size={20} /> },
  { id: "projetos", label: "Projetos", icon: <Icon.Save size={20} /> },
  { id: "codigo", label: "Código", icon: <Icon.Code size={20} /> },
];
const DOCS = [
  { label: "Biblioteca", icon: <Icon.Code size={16} /> },
  { label: "Relatórios", icon: <Icon.Book size={16} /> },
];

function SidebarPreview({ values: v }: { values: ControlValues }) {
  const [active, setActive] = useState("Painel");
  const [area, setArea] = useState("inicio");
  const item = (n: { label: string; icon: ReactNode }, extra?: { count?: number; sub?: boolean }) => (
    <NavItem
      key={n.label}
      icon={v.icons && !extra?.sub ? n.icon : undefined}
      active={active === n.label}
      onClick={() => setActive(n.label)}
      count={v.counts ? extra?.count : undefined}
      sub={extra?.sub}
    >
      {n.label}
    </NavItem>
  );
  // Nivel 1 (cartao) com o trilho (chao em trilho) e o painel (poco) onde a
  // pastilha ativa eleva.
  return (
    <Card padding="sm" className="w-full max-w-(--santo-dimension-space-384)">
      <div className="flex gap-sm">
        {v.rail && (
          <RailNav footer={<RailItem icon={<Icon.Sun size={20} />} label="Tema" />}>
            {RAIL.map((r) => (
              <RailItem key={r.id} icon={r.icon} label={r.label} active={area === r.id} dot={r.id === "projetos"} onClick={() => setArea(r.id)} />
            ))}
          </RailNav>
        )}
        <Card variant="well" padding="sm" className="min-w-0 flex-1">
          <SidebarNav>
            {v.emphasis && (
              <NavItem emphasis icon={<Icon.Plus size={16} />}>
                Criar
              </NavItem>
            )}
            <NavSection>
              {item(MAIN[0])}
              {item(MAIN[1], { count: 12 })}
              {v.tree && (
                <NavSub>
                  {item({ label: "Receita", icon: null }, { sub: true })}
                  {item({ label: "Clientes", icon: null }, { sub: true, count: 3 })}
                  {item({ label: "Funil", icon: null }, { sub: true })}
                </NavSub>
              )}
              {item(MAIN[2])}
            </NavSection>
            <NavSection title={v.titles ? "Documentos" : undefined}>
              {DOCS.map((n) => item(n))}
            </NavSection>
          </SidebarNav>
          {v.user && (
            <NavUser
              name={PEOPLE.pedro.name}
              email="pedro@exemplo.com"
              avatarSrc={photo("pedro")}
              action={
                <IconButton size="sm" variant="ghost" label="Opções da conta">
                  <Icon.More size={16} />
                </IconButton>
              }
            />
          )}
        </Card>
      </div>
    </Card>
  );
}

function PaginationDemo() {
  const [page, setPage] = useState(1);
  return (
    <div className="w-full max-w-(--santo-dimension-space-448)">
      <Pagination
        summary={`Página ${page} de 3`}
        canPrevious={page > 1}
        canNext={page < 3}
        onPrevious={() => setPage((p) => p - 1)}
        onNext={() => setPage((p) => p + 1)}
      />
    </div>
  );
}

export const navDemos: DemoMap = {
  "sidebar-nav": {
    playground: {
      controls: [
        { kind: "boolean", prop: "emphasis", label: "Ação no topo", initial: true },
        { kind: "boolean", prop: "icons", label: "Ícones", initial: true },
        { kind: "boolean", prop: "titles", label: "Título de seção", initial: true },
        { kind: "boolean", prop: "user", label: "Usuário no rodapé", initial: true },
        { kind: "boolean", prop: "rail", label: "Trilho", initial: true },
        { kind: "boolean", prop: "tree", label: "Subitens", initial: true },
        { kind: "boolean", prop: "counts", label: "Contagem", initial: true },
      ],
      Preview: SidebarPreview,
      code: (v) => `<SidebarNav>${v.emphasis ? `
  <NavItem emphasis icon={<Icon.Plus size={16} />}>Criar</NavItem>` : ""}
  <NavSection>
    <NavItem href="/painel"${v.icons ? " icon={<Icon.Palette size={16} />}" : ""} active>Painel</NavItem>
    <NavItem href="/analises"${v.icons ? " icon={<Icon.TrendUp size={16} />}" : ""}${v.counts ? " count={12}" : ""}>Análises</NavItem>${v.tree ? `
    <NavSub>
      <NavItem sub href="/analises/receita">Receita</NavItem>
      <NavItem sub href="/analises/clientes"${v.counts ? " count={3}" : ""}>Clientes</NavItem>
    </NavSub>` : ""}
  </NavSection>
  <NavSection${v.titles ? ' title="Documentos"' : ""}>
    <NavItem href="/biblioteca"${v.icons ? " icon={<Icon.Code size={16} />}" : ""}>Biblioteca</NavItem>
  </NavSection>
</SidebarNav>${v.user ? `
<NavUser name="Pedro Veloso" email="pedro@exemplo.com" avatarSrc="/brand/avatar-pedro-96.webp" />` : ""}`,
    },
    demos: [],
  },
  "nav-sub": {
    demos: [
      {
        title: "Árvore",
        code: `<NavItem icon={<Icon.TrendUp size={16} />} count={12}>Análises</NavItem>
<NavSub>
  <NavItem sub href="/analises/receita" active>Receita</NavItem>
  <NavItem sub href="/analises/clientes" count={3}>Clientes</NavItem>
  <NavItem sub href="/analises/funil">Funil</NavItem>
</NavSub>`,
        Preview: () => (
          <Card variant="sunken" padding="sm" className="w-full max-w-(--santo-dimension-space-256)">
            <SidebarNav>
              <NavItem icon={<Icon.TrendUp size={16} />} count={12}>
                Análises
              </NavItem>
              <NavSub>
                <NavItem sub active>Receita</NavItem>
                <NavItem sub count={3}>Clientes</NavItem>
                <NavItem sub>Funil</NavItem>
              </NavSub>
            </SidebarNav>
          </Card>
        ),
      },
    ],
  },
  "nav-section": {
    demos: [
      {
        title: "Básico",
        code: `<NavSection title="Documentos">
  <NavItem>Biblioteca</NavItem>
  <NavItem>Relatórios</NavItem>
</NavSection>`,
        Preview: () => (
          <div className="w-full max-w-(--santo-dimension-space-224)">
            <NavSection title="Documentos">
              <NavItem>Biblioteca</NavItem>
              <NavItem>Relatórios</NavItem>
            </NavSection>
          </div>
        ),
      },
    ],
  },
  "nav-item": {
    demos: [
      {
        title: "Estados",
        code: `<NavItem emphasis icon={…}>Criar</NavItem>
<NavItem icon={…} active>Painel</NavItem>
<NavItem icon={…}>Análises</NavItem>
<NavItem href="/relatorios">Relatórios</NavItem>`,
        Preview: () => (
          <div className="flex w-full max-w-(--santo-dimension-space-224) flex-col gap-3xs">
            <NavItem emphasis icon={<Icon.Plus size={16} />}>Criar</NavItem>
            <NavItem icon={<Icon.Palette size={16} />} active>Painel</NavItem>
            <NavItem icon={<Icon.TrendUp size={16} />}>Análises</NavItem>
          </div>
        ),
      },
    ],
  },
  "nav-user": {
    demos: [
      {
        title: "Básico",
        code: `<NavUser name="Pedro Veloso" email="pedro@exemplo.com" avatarSrc="/brand/avatar-pedro-96.webp" action={<IconButton …/>} />`,
        Preview: () => (
          <div className="w-full max-w-(--santo-dimension-space-256)">
            <NavUser
              name="Pedro Veloso"
              email="pedro@exemplo.com"
              avatarSrc="/brand/avatar-pedro-96.webp"
              action={
                <IconButton size="sm" label="Opções da conta">
                  <Icon.More size={16} />
                </IconButton>
              }
            />
          </div>
        ),
      },
    ],
  },
  pagination: {
    demos: [
      {
        title: "Básico",
        layout: "stretch",
        code: `<Pagination
  summary={\`Página \${pagina} de 3\`}
  canPrevious={pagina > 1}
  canNext={pagina < 3}
  onPrevious={anterior}
  onNext={proxima}
/>`,
        Preview: PaginationDemo,
      },
    ],
  },
};
