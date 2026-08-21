// GERADO POR scripts/build-tokens.mjs A PARTIR DE brands/*.json. Nao edite a mao.

export type BrandSummary = {
  id: string;
  name: string;
  description: string;
  /** Quantos tokens/styles esta marca muda em relacao a base Santo. */
  overrides: number;
};

/** Marcas disponiveis. A base "santo" vive em :root; as demais em [data-brand]. */
export const brands = [
  {
    "id": "santo",
    "name": "Santo",
    "description": "A marca base. Espelha o Figma SantoDS v1 sem nenhum override — serve de ponto de partida para as demais.",
    "overrides": 0
  },
  {
    "id": "aurora",
    "name": "Aurora",
    "description": "Marca de exemplo derivada do Santo: rampa brand em teal, acento em rosa, cantos mais duros e tipografia mono trocada. Serve para provar que uma marca inteira cabe em poucos overrides.",
    "overrides": 18
  }
] as const satisfies readonly BrandSummary[];

export type BrandId = (typeof brands)[number]['id'];
