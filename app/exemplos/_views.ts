import { createElement, type ComponentType, type ReactNode } from "react";
import { Icon } from "@/lib/ui";
import { APLICACAO_BLOCKS, ApplicationScreen, CARTOES_BLOCKS, CardsScreen, DashboardScreen } from "./_screens/showcase";
import { FINANCAS_BLOCKS, Overview } from "./overview";

/**
 * Visualizacoes de /exemplos. Uma visualizacao nova = um componente + uma
 * linha aqui: a aba, o indice lateral e a sidebar saem desta lista.
 * `blocks` sao as ancoras (ids) que o componente poe na pagina.
 */
export type ExampleView = {
  /** Vai na hash: /exemplos#financas. */
  slug: string;
  label: string;
  /** Icone da tab bar flutuante (celular). */
  icon: ReactNode;
  Component: ComponentType;
  blocks: { id: string; label: string }[];
};

export const VIEWS: ExampleView[] = [
  { slug: "financas", label: "Finanças", icon: createElement(Icon.TrendUp, { size: 20 }), Component: Overview, blocks: FINANCAS_BLOCKS },
  { slug: "cartoes", label: "Cartões", icon: createElement(Icon.Grid, { size: 20 }), Component: CardsScreen, blocks: CARTOES_BLOCKS },
  { slug: "painel", label: "Painel", icon: createElement(Icon.Layers, { size: 20 }), Component: DashboardScreen, blocks: [] },
  { slug: "aplicacao", label: "Aplicação", icon: createElement(Icon.Book, { size: 20 }), Component: ApplicationScreen, blocks: APLICACAO_BLOCKS },
];
