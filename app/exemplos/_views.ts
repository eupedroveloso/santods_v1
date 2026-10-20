import { createElement, type ComponentType, type ReactNode } from "react";
import { Icon } from "@/lib/ui";
import { DASHBOARD_BLOCKS, DashboardScreen } from "./dashboard";
import { CompassoScreen } from "./compasso";
import { LANDING, LANDING_BLOCKS } from "./_anchors";

/**
 * Visualizacoes de /exemplos. Uma visualizacao nova = um componente + uma
 * linha aqui: a aba, o indice lateral e a sidebar saem desta lista.
 * `blocks` sao as ancoras (ids) que o componente poe na pagina.
 */
export type ExampleView = {
  /** Vai na hash: /exemplos#dashboard. */
  slug: string;
  label: string;
  /** Icone da tab bar flutuante (celular). */
  icon: ReactNode;
  Component: ComponentType;
  blocks: { id: string; label: string }[];
  /**
   * A tela encosta nas bordas da area (pagina inteira, como a landing). Sem ele,
   * a tela ganha o respiro de pagina (space/md, lg: space/xl) dentro do layout full.
   */
  bleed?: boolean;
};

export const VIEWS: ExampleView[] = [
  { slug: "dashboard", label: "Dashboard", icon: createElement(Icon.TrendUp, { size: 20 }), Component: DashboardScreen, blocks: DASHBOARD_BLOCKS },
  { slug: LANDING.home, label: "Landing Page", icon: createElement(Icon.Link, { size: 20 }), Component: CompassoScreen, blocks: LANDING_BLOCKS, bleed: true },
];
