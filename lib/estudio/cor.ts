import type { BrandSpec } from "@/lib/tokens/brand-mode.mjs";
import { contrast, hexToOklch } from "@/lib/tokens/color.mjs";
import type { AuditRow } from "@/lib/tokens/contrast-audit.mjs";
import { aliasTarget, isAlias } from "@/lib/tokens/emit.mjs";
import { doc } from "./rascunho";

/**
 * Leitura da cor do rascunho para o Estúdio: rampas por família, os papéis
 * semânticos que cada degrau alimenta (a Color aponta para a Palette, por
 * tema) e a sugestão de degrau quando um par reprova. Módulo puro.
 */

export type Tema = "Light" | "Dark";
export const TEMAS: Tema[] = ["Light", "Dark"];

/** Famílias que o rascunho deriva; as outras são copiadas da base e travadas (contrato, §2.1). */
export const DERIVADAS = ["brand", "neutral"] as const;
export const TRAVADAS = ["accent", "success", "warning", "danger", "info"] as const;
export type Familia = (typeof DERIVADAS)[number] | (typeof TRAVADAS)[number];

const palette = doc.collections.Palette.variables;

/** Degraus de uma família na ordem do Figma: `palette/brand/50` … `/950`. */
export const degraus = (familia: Familia) => Object.keys(palette).filter((n) => n.startsWith(`palette/${familia}/`));

/** Para cada degrau, os papéis da Color que apontam para ele, por tema. */
const PAPEIS = new Map<string, Record<Tema, string[]>>();
const ALVO = new Map<string, Record<Tema, string | null>>();
for (const [nome, v] of Object.entries(doc.collections.Color.variables)) {
  const alvo: Record<Tema, string | null> = { Light: null, Dark: null };
  for (const tema of TEMAS) {
    const valor = v.values?.[tema];
    if (!isAlias(valor)) continue;
    const degrau = aliasTarget(valor);
    alvo[tema] = degrau;
    const atual = PAPEIS.get(degrau) ?? { Light: [], Dark: [] };
    atual[tema].push(nome.replace(/^color\//, ""));
    PAPEIS.set(degrau, atual);
  }
  ALVO.set(nome, alvo);
}

export const papeisDe = (degrau: string): Record<Tema, string[]> => PAPEIS.get(degrau) ?? { Light: [], Dark: [] };

/** `palette/brand/600` → `brand/600`. */
export const curto = (nome: string) => nome.replace(/^(palette|color)\//, "");

/** L, C e H do hex, para a leitura OKLCH ao lado do campo. */
export function oklch(hex: string) {
  const [l, c, h] = hexToOklch(hex);
  return `oklch(${(l * 100).toFixed(1)}% ${c.toFixed(3)} ${Number.isFinite(h) ? h.toFixed(1) : "0"})`;
}

export type Sugestao = { lado: "fg" | "bg"; degrau: string; ratio: number };

/**
 * Degrau mais próximo, na mesma família, que faz o par passar. Tenta primeiro
 * o primeiro plano (texto, borda, ícone), depois o fundo. Sem saída na rampa:
 * null (o par só se resolve mudando o papel, que é compartilhado).
 */
export function sugestao(spec: BrandSpec, row: AuditRow, tema: Tema): Sugestao | null {
  const hex = (n: string) => String(spec.Palette[n]);
  const tentar = (lado: "fg" | "bg"): Sugestao | null => {
    const atual = ALVO.get(lado === "fg" ? row.fg : row.bg)?.[tema];
    if (!atual) return null;
    const familia = atual.split("/")[1] as Familia;
    const lista = degraus(familia);
    const i = lista.indexOf(atual);
    const porDistancia = lista.map((n, j) => ({ n, d: Math.abs(j - i) })).filter((x) => x.d > 0).sort((a, b) => a.d - b.d);
    for (const { n } of porDistancia) {
      const ratio = lado === "fg" ? contrast(hex(n), row.bgHex) : contrast(row.fgHex, hex(n));
      if (ratio >= row.min) return { lado, degrau: n, ratio };
    }
    return null;
  };
  return tentar("fg") ?? tentar("bg");
}
