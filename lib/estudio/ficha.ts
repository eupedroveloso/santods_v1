import { googleFontUrl } from "@/lib/fonts/catalog";
import type { Sistema } from "./schema";

/**
 * O resumo de um sistema para a ficha da lista (/estudio), lido do `salvo`
 * (o modo de marca validado). Dado puro: o servidor monta e o cliente só mostra.
 */
export type SistemaFicha = {
  id: string;
  nome: string;
  slug: string;
  atualizadoEm: string;
  /** Família de título (a do nome na ficha) e a de corpo. */
  titulo: string;
  corpo: string;
  /** Folha do Google Fonts da família de título, só o peso do nome. */
  fonteUrl: string | null;
  marca: string;
  neutros: { light: string; dark: string };
  /** Raio base em px. */
  raio: number;
};

type Valor = string | number;

/** Segue a cadeia de alias (`{palette/neutral/50}`, `{dimension/radius/12}`) até o valor. */
function resolver(v: Valor | undefined, tabela: Record<string, Valor>): Valor | undefined {
  for (let i = 0; i < 8 && typeof v === "string"; i++) {
    const m = /^\{(.+)\}$/.exec(v);
    if (!m) return v;
    if (m[1] in tabela) v = tabela[m[1]];
    else {
      // Dimensão primitiva: o último segmento é o valor (dimension/radius/12 → 12).
      const n = Number(m[1].split("/").pop());
      return Number.isFinite(n) ? n : undefined;
    }
  }
  return v;
}

const fonteUrl = (familia: string) =>
  googleFontUrl(familia) ?? `https://fonts.googleapis.com/css2?family=${familia.replace(/ /g, "+")}&display=swap`;

export function fichaDe(s: Sistema): SistemaFicha {
  const spec = (s.salvo?.spec ?? {}) as Record<string, Record<string, Valor>>;
  const tabela = { ...spec.Palette, ...spec.Brand };
  const draft = (s.salvo?.draft ?? {}) as { cor?: { ancora?: string } };
  const ancora = draft.cor?.ancora ?? "600";
  const cor = (nome: string) => String(resolver(`{${nome}}`, tabela) ?? "—");
  const titulo = String(tabela["brand/family/heading"] ?? tabela["brand/family/sans"] ?? "Albert Sans");
  const raio = Number(resolver(tabela["brand/shape/radius-base"], tabela) ?? 0);

  return {
    id: s.id,
    nome: s.nome,
    slug: s.slug,
    atualizadoEm: s.atualizadoEm.toISOString(),
    titulo,
    corpo: String(tabela["brand/family/sans"] ?? titulo),
    fonteUrl: fonteUrl(titulo),
    marca: cor(`palette/brand/${ancora}`),
    neutros: { light: cor("brand/surface/page/light"), dark: cor("brand/surface/page/dark") },
    raio: Number.isFinite(raio) ? raio : 0,
  };
}
