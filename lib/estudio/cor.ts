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

/**
 * Degrau da Palette onde um papel da Color termina, num tema. A cadeia passa
 * pela Brand (superfícies e bordas variam por marca: color/border/default →
 * brand/border/default/light → palette/neutral/300), então segue a spec do rascunho.
 */
export function degrauDe(spec: BrandSpec, papel: string, tema: Tema): string | null {
  let v: unknown = doc.collections.Color.variables[papel]?.values?.[tema];
  for (let i = 0; i < 8 && isAlias(v); i++) {
    const alvo = aliasTarget(v);
    if (alvo.startsWith("palette/")) return alvo;
    v = alvo in spec.Brand ? spec.Brand[alvo] : null;
  }
  return null;
}

/** Para cada degrau, os papéis da Color que terminam nele, por tema. */
export function mapaDePapeis(spec: BrandSpec): Map<string, Record<Tema, string[]>> {
  const mapa = new Map<string, Record<Tema, string[]>>();
  for (const nome of Object.keys(doc.collections.Color.variables)) {
    for (const tema of TEMAS) {
      const degrau = degrauDe(spec, nome, tema);
      if (!degrau) continue;
      const atual = mapa.get(degrau) ?? { Light: [], Dark: [] };
      atual[tema].push(nome.replace(/^color\//, ""));
      mapa.set(degrau, atual);
    }
  }
  return mapa;
}

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
    const atual = degrauDe(spec, lado === "fg" ? row.fg : row.bg, tema);
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
