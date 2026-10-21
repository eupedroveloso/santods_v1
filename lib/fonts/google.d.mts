export type CategoriaFonte = "sans" | "serif" | "display" | "handwriting" | "mono";
export type FamiliaIndice = {
  /** Categoria. */
  c: CategoriaFonte;
  /** Pesos estaticos (sem italico); null quando a familia e variavel. */
  w: number[] | null;
  /** Eixos variaveis [min, max] (wght, opsz, wdth...); null quando estatica. */
  ax: Record<string, [number, number]> | null;
  /** Tem italico. */
  i: boolean;
};
/** lib/fonts/google-index.json */
export type IndiceGoogleFonts = {
  generatedBy: string;
  source: string;
  note: string;
  count: number;
  /** Familias de lib/fonts/catalog.ts, destacadas em cima do indice. */
  curadoria: string[];
  families: Record<string, FamiliaIndice>;
};
export type PapelFonte = "corpo" | "titulo" | "mono";
export type FolhaDeFonte = { familia: string; papeis: PapelFonte[]; pesos: number[]; url: string };

export declare const PESOS_DO_SISTEMA: number[];
export declare function pesosDa(indice: IndiceGoogleFonts, familia: string): { faixa: [number, number] } | { lista: number[] } | null;
export declare function temPeso(indice: IndiceGoogleFonts, familia: string, peso: number): boolean;
/** Mensagens com codigo estavel: [familia-fora-do-indice] [mono-nao-monoespacada] [peso-fora-do-sistema] [peso-indisponivel]. */
export declare function problemasDaFamilia(indice: IndiceGoogleFonts, familia: string, papel: PapelFonte, pesos?: number[]): string[];
export declare function urlCss2(familia: string, pesos: number[]): string;
export declare function folhasDeFonte(
  familias: Record<PapelFonte, string>,
  pesos: Partial<Record<PapelFonte, number[]>>,
): FolhaDeFonte[];
