import type { ComponentMeta } from "./registry.types";

export const navMeta: ComponentMeta[] = [
  {
    name: "SidebarNav",
    slug: "sidebar-nav",
    category: "aplicacao",
    tier: "semantico",
    source: "nav.tsx",
    description:
      "Navegação lateral de aplicação. Item ativo em preenchimento neutro forte — num painel claro o sutil some.",
    related: ["nav-section", "nav-item", "nav-user"],
  },
  {
    name: "NavSection",
    slug: "nav-section",
    category: "aplicacao",
    tier: "semantico",
    source: "nav.tsx",
    description: "Grupo da SidebarNav, com título pequeno em cinza.",
    related: ["sidebar-nav"],
  },
  {
    name: "NavSub",
    slug: "nav-sub",
    category: "aplicacao",
    tier: "semantico",
    source: "nav.tsx",
    description: "Subitens de um NavItem, com conectores de árvore saindo do ícone do pai.",
    related: ["nav-item", "sidebar-nav"],
  },
  {
    name: "NavItem",
    slug: "nav-item",
    category: "aplicacao",
    tier: "semantico",
    source: "nav.tsx",
    description: "Item da SidebarNav. Com href vira link; emphasis para a ação do topo (Criar).",
    related: ["sidebar-nav"],
  },
  {
    name: "NavUser",
    slug: "nav-user",
    category: "aplicacao",
    tier: "semantico",
    source: "nav.tsx",
    description: "Rodapé da nav: quem está logado e o menu da conta.",
    related: ["sidebar-nav"],
  },
  {
    name: "Pagination",
    slug: "pagination",
    category: "dado",
    tier: "semantico",
    source: "nav.tsx",
    description: "Contagem à esquerda, navegação à direita. Embaixo de Table.",
    related: ["table"],
  },
];
