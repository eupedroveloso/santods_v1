/**
 * Catalogo de famílias do Google Fonts disponíveis no SantoDS.
 *
 * A tipografia do sistema é resolvida **pelo nome da família**, que vem dos
 * tokens `brand/family/sans` e `brand/family/mono`. Por isso a fonte precisa
 * chegar do Google Fonts com o nome real — e não com o nome hasheado que o
 * `next/font` gera. É o que permite uma marca trocar a fonte só mudando o token.
 *
 * `weights` é faixa contínua quando a família é variável, ou lista explícita
 * quando é estática. Pedir ao Google um peso que a família não tem devolve 400
 * e derruba a folha inteira — daí a lista ser conservadora e conferida.
 */

export type FontCategory = "sans" | "serif" | "mono" | "display";

export type FontEntry = {
  family: string;
  category: FontCategory;
  /** Faixa contínua (variável) ou pesos estáticos disponíveis. */
  weights: { from: number; to: number } | number[];
};

export const FONT_CATALOG: FontEntry[] = [
  // Sans — variáveis, cobrem os seis pesos do sistema (300 a 800)
  { family: "Albert Sans", category: "sans", weights: { from: 100, to: 900 } },
  { family: "Inter", category: "sans", weights: { from: 100, to: 900 } },
  { family: "Figtree", category: "sans", weights: { from: 300, to: 900 } },
  { family: "Manrope", category: "sans", weights: { from: 200, to: 800 } },
  { family: "Plus Jakarta Sans", category: "sans", weights: { from: 200, to: 800 } },
  { family: "DM Sans", category: "sans", weights: { from: 100, to: 1000 } },
  { family: "Outfit", category: "sans", weights: { from: 100, to: 900 } },
  { family: "Sora", category: "sans", weights: { from: 100, to: 800 } },
  { family: "Work Sans", category: "sans", weights: { from: 100, to: 900 } },
  { family: "Rubik", category: "sans", weights: { from: 300, to: 900 } },
  { family: "Public Sans", category: "sans", weights: { from: 100, to: 900 } },
  { family: "Nunito Sans", category: "sans", weights: { from: 200, to: 1000 } },
  { family: "Onest", category: "sans", weights: { from: 100, to: 900 } },
  { family: "Geist", category: "sans", weights: { from: 100, to: 900 } },
  { family: "Lexend", category: "sans", weights: { from: 100, to: 900 } },
  { family: "Epilogue", category: "sans", weights: { from: 100, to: 900 } },

  // Serif
  { family: "Source Serif 4", category: "serif", weights: { from: 200, to: 900 } },
  { family: "Fraunces", category: "serif", weights: { from: 100, to: 900 } },
  { family: "Playfair Display", category: "serif", weights: { from: 400, to: 900 } },
  { family: "Lora", category: "serif", weights: { from: 400, to: 700 } },
  { family: "Newsreader", category: "serif", weights: { from: 200, to: 800 } },

  // Display
  { family: "Bricolage Grotesque", category: "display", weights: { from: 200, to: 800 } },
  { family: "Space Grotesk", category: "display", weights: { from: 300, to: 700 } },
  { family: "Chivo", category: "display", weights: { from: 100, to: 900 } },
  { family: "Archivo", category: "display", weights: { from: 100, to: 900 } },

  // Mono
  { family: "JetBrains Mono", category: "mono", weights: { from: 100, to: 800 } },
  { family: "Geist Mono", category: "mono", weights: { from: 100, to: 900 } },
  { family: "Fira Code", category: "mono", weights: { from: 300, to: 700 } },
  { family: "Roboto Mono", category: "mono", weights: { from: 100, to: 700 } },
  { family: "IBM Plex Mono", category: "mono", weights: [100, 200, 300, 400, 500, 600, 700] },
  { family: "Space Mono", category: "mono", weights: [400, 700] },
  { family: "Source Code Pro", category: "mono", weights: { from: 200, to: 900 } },
];

export const FONT_BY_FAMILY = new Map(FONT_CATALOG.map((f) => [f.family, f]));

export const CATEGORY_LABEL: Record<FontCategory, string> = {
  sans: "Sem serifa",
  serif: "Com serifa",
  display: "Display",
  mono: "Monoespaçada",
};

/**
 * URL da folha de estilo do Google Fonts para uma família.
 *
 * Uma família por URL de propósito: se um nome estiver errado, só aquela fonte
 * falha em vez de derrubar todas as outras junto.
 */
export function googleFontUrl(family: string): string | null {
  const entry = FONT_BY_FAMILY.get(family);
  if (!entry) return null;
  const name = family.replace(/ /g, "+");
  const axis = Array.isArray(entry.weights)
    ? entry.weights.join(";")
    : `${entry.weights.from}..${entry.weights.to}`;
  return `https://fonts.googleapis.com/css2?family=${name}:wght@${axis}&display=swap`;
}
