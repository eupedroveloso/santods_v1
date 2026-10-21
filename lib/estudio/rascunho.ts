import snapshot from "@/tokens/santods.figma.json";
import { FONT_CATALOG } from "@/lib/fonts/catalog";
import { buildIndex, resolveValue } from "@/lib/tokens/emit.mjs";
import {
  criarEstudio,
  entrelinha,
  espaco,
  ESPACO_FATOR,
  PAPEIS,
  PRESETS,
  raio,
  RAIO_FATOR,
  RASCUNHO_PADRAO,
  SOMBRA_NIVEIS,
  tamanho,
  type NivelEspaco,
  type NivelSombra,
  type Papel,
  type Rascunho,
  type TabelaTipo,
} from "@/lib/tokens/estudio.mjs";
import type { BrandSpec } from "@/lib/tokens/brand-mode.mjs";
import type { TokenDoc } from "@/lib/tokens/types";
import { ESTILO_IDS, type EstiloId } from "./estilos";

/**
 * Ponte entre o banco do Estúdio e a API do Compasso (lib/tokens/estudio.mjs).
 * Módulo puro: o servidor valida o save com ele e o cliente desenha o preview.
 *
 * Cada estilo grava a sua FATIA do rascunho em `estilos.base` e os passos
 * editados à mão em `estilos.overrides`:
 *   raio       base { valor }                         overrides { xs?, sm?, lg?… } → passos.raio
 *   espaco     base { valor }                         overrides { "3xs"?…"8xl"? } → passos.espaco
 *   tipografia base { corpo, titulo, mono, escala }   overrides { <papel>: [size, leading] }
 *   controles  base { valor }                         overrides { sm?, md?, lg? }
 *   cor        base = Rascunho.cor (parcial)          —
 *   sombra     base = Rascunho.sombra (parcial)       overrides { xs?…"2xl"? } → passos.sombra (intensidade do nível)
 */

export const doc = snapshot as unknown as TokenDoc;
const index = buildIndex(doc);
export const estudio = criarEstudio(doc, { fonts: FONT_CATALOG.map((f) => f.family) });

/** Escopo do preview: o mesmo `data-brand` em toda tela do Estúdio (contrato, §4). */
export const ESCOPO = "[data-brand='rascunho']";

export type Registro = { base: Record<string, unknown>; overrides: Record<string, unknown> };
export type Registros = Record<EstiloId, Registro>;

export const NIVEIS_RAIO = Object.keys(RAIO_FATOR) as (keyof typeof RAIO_FATOR)[];
export const NIVEIS_ESPACO = Object.keys(ESPACO_FATOR) as NivelEspaco[];
export const PAPEIS_TIPO = PAPEIS as Papel[];
export const NIVEIS_SOMBRA = SOMBRA_NIVEIS as NivelSombra[];
export const NIVEIS_CONTROLE = ["sm", "md", "lg"] as const;

export const vazio = (): Registros =>
  Object.fromEntries(ESTILO_IDS.map((e) => [e, { base: {}, overrides: {} }])) as unknown as Registros;

/** Nome de modo único no Figma: nunca Santo, VTSD nem Rascunho. */
export function modoDe(nome: string) {
  const reservado = ["santo", "vtsd", "rascunho"].includes(nome.trim().toLowerCase());
  return reservado ? `${nome.trim()} (Estúdio)` : nome.trim();
}

const numero = (v: unknown): number | undefined => (typeof v === "number" && Number.isFinite(v) ? v : undefined);
const inteiros = (o: Record<string, unknown>) =>
  Object.fromEntries(Object.entries(o).filter(([, v]) => numero(v) !== undefined)) as Record<string, number>;

/** Tabela [size, leading] de uma escala: preset, tabela pronta ou { base, razao }. */
export function tabelaDe(escala: Rascunho["tipografia"]["escala"]): TabelaTipo {
  const valor = typeof escala === "string" ? PRESETS.tipografia[escala] : escala;
  if (valor === "base") {
    return PAPEIS_TIPO.map((p) => [
      Number(resolveValue(index, doc.collections.Brand.variables[`brand/type/${p}/size`].values?.Santo, "Santo")),
      Number(resolveValue(index, doc.collections.Brand.variables[`brand/type/${p}/leading`].values?.Santo, "Santo")),
    ]);
  }
  if (Array.isArray(valor)) return valor;
  return PAPEIS_TIPO.map((p) => {
    const size = tamanho(valor.base, valor.razao, p);
    return [size, entrelinha(size)];
  });
}

/** Rascunho completo a partir do que o banco guarda. */
export function montarRascunho(sistema: { nome: string; slug: string }, r: Registros): Rascunho {
  const tipoBase = { ...RASCUNHO_PADRAO.tipografia, ...(r.tipografia.base as Partial<Rascunho["tipografia"]>) };
  const tipoPassos = r.tipografia.overrides as Partial<Record<Papel, [number, number]>>;
  const escala = Object.keys(tipoPassos).length
    ? tabelaDe(tipoBase.escala).map((linha, i) => tipoPassos[PAPEIS_TIPO[i]] ?? linha)
    : tipoBase.escala;

  const controlesBase = (r.controles.base.valor as Rascunho["controles"] | undefined) ?? RASCUNHO_PADRAO.controles;
  const alturas = typeof controlesBase === "string" ? PRESETS.controles[controlesBase] : controlesBase;
  const ctl = inteiros(r.controles.overrides);
  const controles: Rascunho["controles"] = Object.keys(ctl).length
    ? [ctl.sm ?? alturas[0], ctl.md ?? alturas[1], ctl.lg ?? alturas[2]]
    : controlesBase;

  return {
    ...RASCUNHO_PADRAO,
    modo: modoDe(sistema.nome),
    id: sistema.slug,
    nome: sistema.nome,
    cor: { ...RASCUNHO_PADRAO.cor, ...(r.cor.base as Partial<Rascunho["cor"]>) },
    tipografia: { ...tipoBase, escala },
    raio: numero(r.raio.base.valor) ?? RASCUNHO_PADRAO.raio,
    espaco: numero(r.espaco.base.valor) ?? RASCUNHO_PADRAO.espaco,
    sombra: { ...RASCUNHO_PADRAO.sombra, ...(r.sombra.base as Partial<Rascunho["sombra"]>) },
    controles,
    passos: {
      raio: r.raio.overrides as Record<string, number>,
      espaco: r.espaco.overrides as Record<string, number>,
      sombra: r.sombra.overrides as Record<string, number>,
    },
  };
}

/** Número de uma variável da spec, seguindo o alias até a primitiva. */
const px = (spec: BrandSpec, nome: string) => Number(resolveValue(index, spec.Brand[nome], "Santo"));

/** Os passos que a spec derivou, já em px: o que o centro e o painel mostram. */
export function passosDe(spec: BrandSpec) {
  return {
    raio: Object.fromEntries(["md", ...NIVEIS_RAIO].map((n) => [n, px(spec, n === "md" ? "brand/shape/radius-base" : `brand/shape/radius-${n}`)])),
    espaco: Object.fromEntries(NIVEIS_ESPACO.map((n) => [n, px(spec, `brand/space/${n}`)])),
    tipo: Object.fromEntries(
      PAPEIS_TIPO.map((p) => [p, [px(spec, `brand/type/${p}/size`), px(spec, `brand/type/${p}/leading`)] as [number, number]]),
    ),
    controles: Object.fromEntries(["sm", "md", "lg"].map((c) => [c, px(spec, `brand/control/height/${c}`)])),
    /** Cor (hex com alfa) de cada camada, por nível: brand/shadow/<nível>/<camada>. */
    sombra: Object.fromEntries(
      NIVEIS_SOMBRA.map((n) => [
        n,
        Object.keys(spec.Brand)
          .filter((k) => k.startsWith(`brand/shadow/${n}/`))
          .sort()
          .map((k) => String(spec.Brand[k])),
      ]),
    ) as Record<NivelSombra, string[]>,
  };
}

/** O valor que a fórmula daria sem o override: alvo do "voltar ao derivado". */
export const formula = {
  raio: (base: number, nivel: keyof typeof RAIO_FATOR) => raio(base, nivel),
  espaco: (unidade: number, nivel: NivelEspaco) => espaco(unidade, nivel),
};
