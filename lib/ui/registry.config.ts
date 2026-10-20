import type { ComponentCategory, ComponentTier } from "./registry.types";

/** Ordem e rotulo das categorias — a mesma do lib/ui/README.md. */
export const CATEGORIES: { id: ComponentCategory; label: string }[] = [
  { id: "acao", label: "Ação" },
  { id: "entrada", label: "Entrada" },
  { id: "cor", label: "Cor" },
  { id: "estrutura", label: "Estrutura" },
  { id: "navegacao", label: "Navegação" },
  { id: "dado", label: "Dado" },
  { id: "aplicacao", label: "Aplicação" },
  { id: "codigo", label: "Código" },
  { id: "blocos", label: "Blocos" },
  { id: "icones", label: "Ícones" },
];

export const CATEGORY_LABEL = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.label])) as Record<
  ComponentCategory,
  string
>;

/** As três camadas do catálogo, na ordem em que aparecem. */
export const TIERS: { id: ComponentTier; label: string }[] = [
  { id: "primitivo", label: "Primitivos" },
  { id: "semantico", label: "Semânticos" },
  { id: "marketing", label: "Marketing" },
];

export const TIER_LABEL = { primitivo: "Primitivo", semantico: "Semântico", marketing: "Marketing" } as const satisfies Record<
  ComponentTier,
  string
>;
