import type { TextStyleEntry } from "@/lib/docs/catalog.types";

/** Papeis de texto agrupados como a doc os apresenta. A ordem e a de leitura. */
export const TYPE_GROUPS = [
  { id: "heading", label: "Heading", match: (r: string) => r.startsWith("heading") },
  { id: "body", label: "Body", match: (r: string) => r.startsWith("body") },
  { id: "caption", label: "Caption", match: (r: string) => r.startsWith("caption") },
  { id: "code", label: "Code", match: (r: string) => r.startsWith("code") },
] as const;

/** Ancora do grupo: o grupo `code` e o papel `code` teriam o mesmo id sem o prefixo. */
export const groupAnchor = (id: string) => `grupo-${id}`;

/** Estilos de um grupo, separados por papel (heading-1, heading-2…) na ordem do Figma. */
export function rolesOf(styles: TextStyleEntry[], match: (role: string) => boolean) {
  const roles = new Map<string, TextStyleEntry[]>();
  for (const s of styles) {
    if (!match(s.role)) continue;
    roles.set(s.role, [...(roles.get(s.role) ?? []), s]);
  }
  return [...roles].map(([role, items]) => ({ role, items }));
}
