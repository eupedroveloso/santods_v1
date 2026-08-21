import type { TokenDoc } from "@/lib/tokens/types";

export type TabId = "marca" | "cores" | "tipografia";

export type TokenGroup = {
  id: string;
  label: string;
  /** Colecao do Figma a que os tokens pertencem. */
  collection: string;
  /** Prefixo de caminho que define o grupo. */
  prefix: string;
  hint?: string;
};

export const TABS: { id: TabId; label: string }[] = [
  { id: "marca", label: "Marca" },
  { id: "cores", label: "Cores" },
  { id: "tipografia", label: "Tipografia" },
];

const PALETTE_FAMILIES = ["brand", "accent", "neutral", "success", "warning", "danger", "info"];
const COLOR_FAMILIES = [
  { key: "surface", label: "Superfície" },
  { key: "bg", label: "Fundo" },
  { key: "text", label: "Texto" },
  { key: "border", label: "Borda" },
  { key: "icon", label: "Ícone" },
];

export const GROUPS: Record<TabId, TokenGroup[]> = {
  // Marca e Tipografia têm painel próprio — não listam tokens soltos.
  marca: [],
  tipografia: [],
  cores: [
    ...COLOR_FAMILIES.map((f) => ({
      id: `color-${f.key}`,
      label: f.label,
      collection: "Color",
      prefix: `color/${f.key}/`,
    })),
    ...PALETTE_FAMILIES.map((family) => ({
      id: `palette-${family}`,
      label: `Palette · ${family}`,
      collection: "Palette",
      prefix: `palette/${family}/`,
    })),
  ],
};

/** Nomes de token de um grupo, na ordem do documento. */
export function tokensOf(doc: TokenDoc, group: TokenGroup): string[] {
  const collection = doc.collections[group.collection];
  if (!collection) return [];
  return Object.keys(collection.variables).filter((name) => name.startsWith(group.prefix));
}

/** Todos os tokens que casam com a busca, agrupados por tab. */
export function searchTokens(doc: TokenDoc, query: string): { tab: TabId; group: TokenGroup; names: string[] }[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const out: { tab: TabId; group: TokenGroup; names: string[] }[] = [];
  for (const tab of TABS) {
    for (const group of GROUPS[tab.id]) {
      const names = tokensOf(doc, group).filter((n) => n.toLowerCase().includes(q));
      if (names.length) out.push({ tab: tab.id, group, names });
    }
  }
  return out;
}
