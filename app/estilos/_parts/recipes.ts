/**
 * Receitas de lib/ui/motion.css mostradas em /estilos/movimento. Lista unica:
 * o servidor conta daqui, o cliente (motion-recipes.tsx) desenha a demo de cada.
 * `replay` remonta e roda de novo; `toggle` alterna o estado; `none` e interacao direta.
 */
export const RECIPES = [
  { cls: "santo-transition-colors", mode: "toggle" },
  { cls: "santo-transition-opacity", mode: "toggle" },
  { cls: "santo-transition-transform", mode: "toggle" },
  { cls: "santo-press", mode: "none" },
  { cls: "santo-animate-fade-in", mode: "replay" },
  { cls: "santo-animate-scale-in", mode: "replay" },
  { cls: "santo-animate-slide-in-up", mode: "replay" },
  { cls: "santo-animate-slide-in-right", mode: "replay" },
  { cls: "santo-animate-pop", mode: "replay" },
  { cls: "santo-animate-pulse", mode: "none" },
  { cls: "santo-animate-shimmer", mode: "none" },
  { cls: "santo-collapse", mode: "toggle" },
] as const;

export type RecipeClass = (typeof RECIPES)[number]["cls"];
