import type { TokenDoc } from "./types";
import type { BrandSpec } from "./brand-mode.mjs";
import type { AuditRow } from "./contrast-audit.mjs";

export type Papel =
  | "caption-small" | "caption" | "body-small" | "body" | "body-large"
  | "heading-6" | "heading-5" | "heading-4" | "heading-3" | "heading-2" | "heading-1";
export type Controle = "sm" | "md" | "lg";
/** [size, leading] em px, de caption-small a heading-1 (11 linhas). */
export type TabelaTipo = [number, number][];
export type Neutros = { hue: number | "marca"; chroma: number | "santo" };

export type Rascunho = {
  /** Nome do modo (coluna no Figma). Unico; nao pode ser "Santo" nem "VTSD". */
  modo: string;
  /** brand/id: slug unico, vira data-brand. Reservados: santo, vtsd. */
  id: string;
  nome: string;
  cor: {
    /** 'base' copia a Palette da marca padrao; 'marca' gera as rampas pela cor oficial. */
    origem: "base" | "marca";
    marca: string;
    ancora: "500" | "600" | "700";
    neutros: keyof typeof PRESETS.neutros | Neutros;
  };
  tipografia: {
    corpo: string;
    titulo: string;
    mono: string;
    escala: keyof typeof PRESETS.tipografia | TabelaTipo | { base: number; razao: number };
  };
  /** Base do raio (= radius/md). Presets: PRESETS.raio. */
  raio: number;
  /** Unidade de espaco. Presets: PRESETS.densidade. */
  espaco: number;
  sombra: { intensidade: number; tinta: "atual" | "marca" };
  controles: keyof typeof PRESETS.controles | [number, number, number];
  /**
   * Passos editados a mao, aplicados depois da formula (px inteiros >= 0). Valor que
   * cai num degrau primitivo vira alias; senao, numero. Raio md = `raio` (a base).
   */
  passos?: {
    raio?: Partial<Record<keyof typeof RAIO_FATOR, number>>;
    espaco?: Partial<Record<NivelEspaco, number>>;
    /** Intensidade POR NIVEL (numero >= 0), no lugar de sombra.intensidade para as camadas daquele nivel. */
    sombra?: Partial<Record<NivelSombra, number>>;
  };
};

export type NivelSombra = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
export type NivelEspaco = "3xs" | "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | "8xl";

export type SistemaSalvo = {
  schema: "santods.brand-mode/1";
  base: { fileKey: string; hashes: Record<"Palette" | "Brand" | "Color", string> };
  mode: string;
  draft: Rascunho;
  spec: BrandSpec;
  descriptions: Record<string, string>;
};

export type Derivado =
  | {
      ok: true;
      problems: [];
      modo: string;
      spec: BrandSpec;
      /** Bloco CSS para um <style>; escopo [data-brand='<id>'] ou o `scope` pedido. */
      css: string;
      /** Familias para carregar do Google Fonts antes de aplicar o css. */
      familias: string[];
      auditoria: { Light: AuditRow[]; Dark: AuditRow[] };
      salvo: SistemaSalvo;
    }
  | { ok: false; problems: string[]; spec: BrandSpec | undefined };

export type DerivarOpts = { fonts?: string[]; scope?: string };

export declare const SCHEMA: "santods.brand-mode/1";
export declare const RAIO_FATOR: Record<"xs" | "sm" | "lg" | "xl" | "2xl" | "3xl", number>;
export declare const ESPACO_FATOR: Record<NivelEspaco, number>;
export declare const PAPEL_PASSO: Record<Papel, number>;
export declare const PAPEIS: Papel[];
export declare const CONTROLES: Controle[];
export declare const SOMBRA_NIVEIS: NivelSombra[];
export declare const PRESETS: {
  raio: { reto: 0; suave: 4; padrao: 8; arredondado: 12 };
  densidade: { compacta: 3; padrao: 4; confortavel: 5 };
  tipografia: { compacta: TabelaTipo; santo: "base"; editorial: TabelaTipo };
  sombra: { suave: 0.6; padrao: 1; marcada: 1.6 };
  controles: { compacto: [number, number, number]; padrao: [number, number, number]; amplo: [number, number, number] };
  neutros: { cinza: Neutros; tingido: Neutros; quente: Neutros };
  familias: { nome: string; corpo: string; titulo: string; mono: string }[];
};
export declare const RASCUNHO_PADRAO: Rascunho;

export declare function raio(base: number, nivel: keyof typeof RAIO_FATOR): number;
export declare function espaco(unidade: number, nivel: NivelEspaco): number;
export declare function tamanho(base: number, razao: number, papel: Papel): number;
export declare function entrelinha(size: number): number;
export declare function baseHashes(doc: TokenDoc): Record<string, string>;
export declare function derivar(doc: TokenDoc, draft: Partial<Rascunho>, opts?: DerivarOpts): Derivado;
export declare function criarEstudio(
  doc: TokenDoc,
  opts?: DerivarOpts,
): { derivar: (draft: Partial<Rascunho>, opts?: DerivarOpts) => Derivado };
export declare function salvoAtual(doc: TokenDoc, salvo: SistemaSalvo): boolean;
