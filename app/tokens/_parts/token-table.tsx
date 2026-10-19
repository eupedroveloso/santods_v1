import type { CatalogVariable } from "@/lib/docs/catalog.types";
import { TokenTableClient } from "./token-table-client";

/** O que a tabela desenha de cada variavel — e so isso viaja para o cliente. */
export type SlimMode = { css: string; alias: string | null };
export type SlimVariable = Pick<CatalogVariable, "slug" | "name" | "type" | "cssVar" | "tailwind"> & {
  /** Na ordem de `modes`. */
  values: (SlimMode | null)[];
};

/**
 * Tabela de um grupo de tokens: amostra, nome do Figma, valor por modo,
 * var CSS e classe Tailwind.
 *
 * Por que o desenho e no cliente e nao aqui: medido no build, renderizar as
 * celulas no servidor DOBRA o peso da pagina (color.html 860 KB -> 1.156 KB),
 * porque cada elemento vai duas vezes — no HTML e no payload RSC, com todas as
 * classes repetidas por celula. Mandar o dado e mais barato que mandar a
 * marcacao. O que pesava antes era o catalogo inteiro (cadeia de alias,
 * escopos, valor cru, declarado…) atravessando como props; aqui ele e enxugado
 * para os seis campos que a tabela usa.
 */
export function TokenTable({ variables, modes }: { variables: CatalogVariable[]; modes: string[] }) {
  const slim: SlimVariable[] = variables.map((v) => ({
    slug: v.slug,
    name: v.name,
    type: v.type,
    cssVar: v.cssVar,
    tailwind: v.tailwind,
    values: modes.map((mode) => {
      const value = v.values.find((x) => x.mode === mode);
      return value ? { css: value.css, alias: value.alias } : null;
    }),
  }));
  return <TokenTableClient variables={slim} modes={modes} />;
}
