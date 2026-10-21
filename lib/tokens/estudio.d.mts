import type { TokenDoc } from "./types";
import type { BrandSpec } from "./brand-mode.mjs";
import type { AuditRow } from "./contrast-audit.mjs";
import type { FolhaDeFonte, IndiceGoogleFonts, PapelFonte } from "../fonts/google.mjs";

export type Papel =
  | "caption-small" | "caption" | "body-small" | "body" | "body-large"
  | "heading-6" | "heading-5" | "heading-4" | "heading-3" | "heading-2" | "heading-1";
export type Controle = "sm" | "md" | "lg";
/** [size, leading] em px, de caption-small a heading-1 (11 linhas). */
export type TabelaTipo = [number, number][];
export type Neutros = { hue: number | "marca"; chroma: number | "santo" };
/** Derivados da marca, com ajuste fino opcional (que substitui o preset). */
export type NeutrosDerivados = {
  origem: "derivada";
  preset?: keyof typeof PRESETS.neutros;
  /** tinta: % do caminho do matiz neutro do Santo ate o da marca (0..100); saturacao: % do croma dos neutros do Santo (0..300). */
  ajuste?: { tinta: number; saturacao: number };
};
/** A rampa neutral sai desta cor de referencia (entra exata no degrau de luminancia mais proxima), sem depender da marca. */
export type NeutrosManuais = { origem: "manual"; base: string };
export type DegrauBrand = "50" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900" | "950";
export type DegrauNeutralTexto = "0" | DegrauBrand | "1000";

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
    neutros: keyof typeof PRESETS.neutros | Neutros | NeutrosDerivados | NeutrosManuais;
  };
  tipografia: {
    corpo: string;
    titulo: string;
    /** So familia de categoria mono (com `indice`). */
    mono: string;
    /** Tracking por papel em % do tamanho (-10..20). Sem a chave: o da base. */
    tracking?: Partial<Record<Papel, number>>;
    /** Pesos a carregar por papel, subconjunto de 300..800. Padrao: PESOS_PADRAO. */
    pesos?: Partial<Record<PapelFonte, number[]>>;
    /** Id de preset (fixo ou personalizado), o proprio preset, uma tabela, ou { base, razao }. */
    escala: string | PresetTipografia | TabelaTipo | { base: number; razao: number };
  };
  /** Base do raio (= radius/md). Presets: PRESETS.raio. Forma livre: RascunhoLivre. */
  raio: number;
  /** Unidade de espaco. Presets: PRESETS.densidade. Forma livre: RascunhoLivre. */
  espaco: number;
  /** Estilo Superficies: id de preset ('borda-dupla' | 'tonal' | 'plana' | 'vidro') ou o objeto completo. */
  superficies: keyof typeof PRESETS_SUPERFICIES | Superficies;
  /** Efeitos: preset ('sutil' | 'padrao' | 'intenso') ou o objeto. Padrao: 'padrao'. */
  efeitos?: keyof typeof PRESETS_EFEITOS | Efeitos;
  sombra: { intensidade: number; tinta: "atual" | "marca" };
  controles: keyof typeof PRESETS.controles | [number, number, number];
  /**
   * Passos editados a mao, aplicados depois da formula (px inteiros >= 0). Valor que
   * cai num degrau primitivo vira alias; senao, numero. Raio md = `raio` (a base).
   */
  passos?: {
    raio?: Partial<Record<keyof typeof RAIO_FATOR, number>>;
    espaco?: Partial<Record<NivelEspaco, number>>;
    /** Por nivel: numero = intensidade, ou { intensidade, desfoque, deslocamento } (vence o global). */
    sombra?: Partial<Record<NivelSombra, number | { intensidade?: number; desfoque?: number; deslocamento?: number }>>;
    /** Hex #rrggbb por degrau, por cima do derivado; reset = tirar a chave. A auditoria roda no resultado final. */
    cor?: { brand?: Partial<Record<DegrauBrand, string>>; neutral?: Partial<Record<DegrauNeutralTexto, string>> };
  };
};

export type NivelSombra = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
export type NivelEspaco = "3xs" | "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | "8xl";

/** Preset de tipografia (os fixos e os personalizados do banco tem este formato). */
export type PresetTipografia = {
  id: string;
  nome: string;
  familias: Record<PapelFonte, string>;
  pesos: Partial<Record<PapelFonte, number[]>>;
  base: number;
  razao: number;
  /** 11 pares [size, leading], de caption-small a heading-1; vence base/razao. 'base' = a escala do snapshot. */
  tabela?: TabelaTipo | "base";
};

export type DegrauNeutral = 0 | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 | 1000;
export type Tema = "claro" | "escuro";
export type Superficie = "page" | "raised" | "sunken" | "well" | "panel";
export type Borda = "subtle" | "default" | "strong";
/** Relacao de cores entre superficies e a borda dupla. O painel interno da moldura e `panel`. */
export type Superficies = {
  /** plana | tonal | borda-dupla | vidro. Quando presente, manda na moldura (so borda-dupla liga). */
  tratamento?: "plana" | "tonal" | "borda-dupla" | "vidro";
  /** Parametros do vidro (tratamento 'vidro'). Padrao: VIDRO_PADRAO. */
  vidro?: Partial<Vidro>;
  bordaDupla: boolean;
  /** Degrau de espaco do recuo da moldura (acompanha a densidade). */
  recuo: NivelEspaco;
  /** Profundidade por tom: superficie -> degrau da rampa neutral da marca. */
  tons: Record<Tema, Record<Superficie, DegrauNeutral>>;
  /** #rrggbbaa ou degrau neutral + alfa 0..1. */
  overlay: Record<Tema, string | { degrau: DegrauNeutral; alfa: number }>;
  bordas: Record<Tema, Record<Borda, DegrauNeutral>>;
  /** Borda do painel interno da moldura. */
  bordaInterna: Record<Tema, DegrauNeutral | "transparente">;
};

/**
 * Rascunho com os parametros livres (Estudio > base livre em todo estilo). Superconjunto de
 * Rascunho: todo Rascunho antigo e um RascunhoLivre valido.
 */
export type RascunhoLivre = Omit<Rascunho, "raio" | "espaco" | "sombra" | "controles"> & {
  /** Numero (container = controle) ou { container, controle, curva }; ou id de preset proprio. */
  raio: number | Raio | string;
  /** Numero (unidade, curva santo) ou { unidade, curva }; ou id de preset proprio. */
  espaco: number | Espaco | string;
  sombra: Sombra | string;
  /** Id de preset, [alturas sm, md, lg] ou parametros parciais por tamanho. */
  controles: string | [number, number, number] | Partial<Record<Controle, Partial<ControleTamanho>>>;
};

export type Vidro = {
  /** Degrau de efeito (sm..xl) ou raio do Figma em px (o CSS usa a metade). */
  blur: "sm" | "md" | "lg" | "xl" | number;
  alfa: Record<Tema, number>;
  borda: Record<Tema, number>;
  highlight: Record<Tema, number>;
  /** Degrau neutral ou 'brand-<degrau>'. */
  tinta: Record<Tema, DegrauNeutral | `brand-${DegrauBrand}`>;
  /** Cor da borda do vidro por tema (degrau neutral). Padrao 0 (branco). */
  corBorda?: Record<Tema, DegrauNeutral>;
};
export type Efeitos = {
  blur: Record<"sm" | "md" | "lg" | "xl", number>;
  layerBlur: Record<"sm" | "md", number>;
  glow: { brand: { degrau: DegrauBrand; alfa: number }; neutral: { degrau: DegrauNeutralTexto; alfa: number }; desfoque: number };
  /** Opacidade 0..0.5. */
  noise: number;
  gradiente: { angulo: number; de: DegrauBrand; para: DegrauBrand };
};
export type AuditoriaVidro = { theme: "Light" | "Dark"; fg: string; sobre: string; vidro: string; composto: string; ratio: number; min: 4.5; pass: boolean }[];

export type Raio = { container: number; controle?: number; curva?: "santo" | { razao: number } };
export type Espaco = { unidade: number; curva?: "santo" | "linear" | { razao: number } };
/** Os 7 parametros de um tamanho de controle. paddingX/gap: degrau de espaco ou px; fonte: papel ou px; raio: 'controle' = raio base de controle. */
export type ControleTamanho = {
  altura: number;
  paddingX: NivelEspaco | number;
  raio: "controle" | number;
  borda: number;
  fonte: Papel | number;
  icone: number;
  gap: NivelEspaco | number;
};
export type Sombra = { intensidade: number; tinta: "atual" | "marca" | string; desfoque?: number; deslocamento?: number };
export type Estilo = "cor" | "tipografia" | "raio" | "espaco" | "sombra" | "controles" | "superficies" | "efeitos";
/** Preset de QUALQUER estilo: dados = o pedaco do rascunho daquele estilo (+ passos opcionais). */
export type Preset = { id: string; estilo: Estilo; nome: string; dados: Record<string, unknown>; fixo?: boolean };
export type AuditoriaControles = Record<Controle, {
  valores: { height: number; "padding-x": number; radius: number; border: number; font: number; icon: number; gap: number };
  /** [alvo-pequeno] [controle-apertado] [controle-pilula] [icone-grande] [padding-raio] — nao bloqueiam. */
  avisos: string[];
}>;

export type SistemaSalvo = {
  schema: "santods.brand-mode/1";
  base: { fileKey: string; hashes: Record<"Palette" | "Brand" | "Color", string> };
  mode: string;
  draft: RascunhoLivre;
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
      /** Uma folha css2 por familia, so com os pesos pedidos e display=swap. */
      fontes: FolhaDeFonte[];
      auditoria: { Light: AuditRow[]; Dark: AuditRow[]; controles: AuditoriaControles; vidro: AuditoriaVidro };
      salvo: SistemaSalvo;
    }
  | { ok: false; problems: string[]; spec: BrandSpec | undefined };

export type DerivarOpts = {
  /** lib/fonts/google-index.json: qualquer familia do Google; sem ele vale `fonts` (lista fechada). */
  indice?: IndiceGoogleFonts;
  fonts?: string[];
  scope?: string;
  /** Presets de tipografia personalizados, para `escala` por id. */
  presetsTipografia?: PresetTipografia[];
  /** Presets PROPRIOS de qualquer estilo, chamados por id no rascunho. */
  presets?: Preset[];
};

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
export declare const PESOS_PADRAO: Record<PapelFonte, number[]>;
export declare const NEUTRAL_DEGRAUS: DegrauNeutral[];
export declare const SUPERFICIES: Superficie[];
export declare const BORDAS: Borda[];
export declare const PRESETS_SUPERFICIES: Record<"borda-dupla" | "tonal" | "plana" | "vidro", Superficies>;
export declare const PRESETS_EFEITOS: Record<"sutil" | "padrao" | "intenso", Efeitos>;
export declare const VIDRO_PADRAO: Vidro;
export declare function efeitosDe(e: NonNullable<Rascunho["efeitos"]>): Efeitos;
/** Texto primary/secondary sobre o vidro composto sobre surface/page e sobre bg/brand/solid/default, nos dois temas. */
export declare function auditarVidro(doc: TokenDoc, modo: string): AuditoriaVidro;
/** Mensagens com o codigo [cor-invalida]. */
export declare function problemasDeCor(cor: Rascunho["cor"], passosCor: NonNullable<Rascunho["passos"]>["cor"], doc: TokenDoc): string[];
/** Matiz a t (0..1) do caminho mais curto de a ate b, em graus. */
export declare function misturarMatiz(a: number, b: number, t: number): number;
/** Mensagens com o codigo [superficie-invalida]. */
export declare function problemasDeSuperficies(sup: Superficies): string[];
export declare const PRESETS_TIPOGRAFIA: Record<"compacta" | "santo" | "editorial", PresetTipografia>;
export declare function validarPresetTipografia(preset: PresetTipografia, opts?: { indice?: IndiceGoogleFonts }): string[];
export declare function aplicarPresetTipografia(rascunho: Rascunho, preset: PresetTipografia): Rascunho;

export declare function raio(base: number, nivel: keyof typeof RAIO_FATOR): number;
export declare function espaco(unidade: number, nivel: NivelEspaco): number;
export declare function tamanho(base: number, razao: number, papel: Papel): number;
export declare function entrelinha(size: number): number;
export declare function baseHashes(doc: TokenDoc): Record<string, string>;
export declare function derivar(doc: TokenDoc, draft: Partial<RascunhoLivre>, opts?: DerivarOpts): Derivado;
export declare function criarEstudio(
  doc: TokenDoc,
  opts?: DerivarOpts,
): { derivar: (draft: Partial<RascunhoLivre>, opts?: DerivarOpts) => Derivado };
export declare function salvoAtual(doc: TokenDoc, salvo: SistemaSalvo): boolean;

export declare const ESTILOS: Estilo[];
export declare const PRESETS_FIXOS: Record<Estilo, Preset[]>;
export declare const PRESETS_CONTROLES: Record<"compacto" | "padrao" | "confortavel", Record<Controle, ControleTamanho>>;
export declare const PRESETS_SOMBRA: Record<"suave" | "padrao" | "marcada", Sombra>;
export declare function aplicarPreset(rascunho: RascunhoLivre, preset: Preset): RascunhoLivre;
/** Forma da entidade + a validacao do estilo (a mesma do derivar). */
export declare function validarPreset(doc: TokenDoc, preset: Preset, opts?: { indice?: IndiceGoogleFonts }): string[];
export declare function raioDe(r: number | Raio): Required<Raio>;
export declare function raioNivel(r: Required<Raio>, nivel: keyof typeof RAIO_FATOR): number;
export declare function espacoDe(e: number | Espaco): Required<Espaco>;
export declare function espacoNivel(e: Required<Espaco>, nivel: NivelEspaco): number;
export declare function controlesDe(c: RascunhoLivre["controles"]): Record<Controle, ControleTamanho>;
export declare function sombraDe(s: RascunhoLivre["sombra"]): Required<Sombra>;
/** [raio-invalido] [espaco-invalido] [controle-invalido] [sombra-invalida] [tracking-invalido]. */
export declare function problemasDeParametros(rascunho: RascunhoLivre): string[];
export declare function auditarControles(doc: TokenDoc, modo: string): AuditoriaControles;
