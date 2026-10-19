import type { ComponentType } from "react";

/**
 * Contrato do registro de componentes.
 *
 * Cada modulo de lib/ui tem um `<modulo>.meta.ts` (dado puro: nome, categoria,
 * quando usar, par no Figma) e um `<modulo>.demo.tsx` (as demos vivas). O
 * registry.ts junta os metas; e dele que saem o indice de /componentes, a
 * sidebar, a busca e o check de par com o Figma. Componente fora do registro
 * nao existe para a documentacao.
 */

export type ComponentCategory =
  | "acao"
  | "entrada"
  | "cor"
  | "estrutura"
  | "navegacao"
  | "dado"
  | "aplicacao"
  | "codigo"
  | "icones";

/**
 * Criterio (decisao do maestro):
 * - PRIMITIVO: bloco generico, sem significado de produto, usavel em qualquer
 *   contexto, e NAO importa outro componente de lib/ui alem de Icon. Precisa
 *   de conteudo de outro componente? Slot (ReactNode), nunca import.
 * - SEMANTICO: carrega um papel/padrao de produto (navegacao, conversa, dado,
 *   formulario, feed, grafico), mesmo que nao componha nada da lib hoje.
 * Composicao nao e o criterio de semantico; e restricao do primitivo. E um
 * semantico se monta SO com primitivos da lib — markup cru que imita um
 * primitivo e divida.
 */
export type ComponentTier = "primitivo" | "semantico";

export type ComponentMeta = {
  /** Nome exportado por @/lib/ui: `Button`. */
  name: string;
  /** Rota /componentes/[slug]: `button`. */
  slug: string;
  category: ComponentCategory;
  /** Obrigatorio: separa o catalogo em Primitivos e Semanticos. */
  tier: ComponentTier;
  /** Quando usar — nao o que faz. Mesma frase do lib/ui/README.md. */
  description: string;
  /** Arquivo em lib/ui onde mora: `button.tsx`. */
  source: string;
  /** Outros slugs que costumam andar junto. */
  related?: string[];
  /**
   * Par no Figma. Ausente = componente so existe no codigo (divergencia a resolver).
   * `nodeId` ausente = o par existe mas o id ainda nao foi levantado.
   */
  figma?: { name: string; nodeId?: string };
};

/** Um bloco de demonstracao: rotulo em cima, cartao com o componente vivo. */
export type Demo = {
  /** Rotulo curto (Basico, Variantes, Tamanhos...). Sem texto explicativo: regra do time. */
  title: string;
  /** Codigo de uso mostrado sob a demo. */
  code: string;
  /** Componente React (pode ter estado). */
  Preview: ComponentType;
  /** `center` (padrao) para peca isolada; `stretch` para algo que ocupa a largura. */
  layout?: "center" | "stretch";
};

export type ControlValue = string | boolean;
export type ControlValues = Record<string, ControlValue>;

export type Control =
  | { kind: "select"; prop: string; label: string; options: string[]; initial: string }
  | { kind: "boolean"; prop: string; label: string; initial: boolean }
  | { kind: "text"; prop: string; label: string; initial: string };

/** Controles ao vivo: as props principais viram campos, o preview reage. */
export type Playground = {
  controls: Control[];
  Preview: ComponentType<{ values: ControlValues }>;
  code: (values: ControlValues) => string;
  layout?: "center" | "stretch";
};

export type ComponentDemos = {
  playground?: Playground;
  demos: Demo[];
};

/** Mapa slug → demos, exportado por cada `<modulo>.demo.tsx`. */
export type DemoMap = Record<string, ComponentDemos>;
