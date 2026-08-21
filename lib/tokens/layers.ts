/**
 * As camadas do SantoDS, e quem pode mexer em quê.
 *
 * O modelo mental: **o Santo é a base; um produto novo ganha cara própria
 * re-apontando a camada semântica, não reescrevendo a fundação.**
 *
 *   Primitives   a física do sistema — a escala de 4px, a rampa tipográfica,
 *                as durações. É o que todo produto derivado tem em comum.
 *                NÃO é personalizável: mexer aqui não cria um produto novo,
 *                cria um sistema incompatível.
 *
 *   Palette      as rampas de cor. Personalizável: é aqui que um produto ganha
 *                hue própria, mantendo a curva de luminosidade do Santo.
 *
 *   Brand        identidade: famílias tipográficas, raio base, nome.
 *
 *   Semantic     os apelidos de uso — space/md, radius/lg, border/thin. Apontam
 *                para degraus de Primitives. **É o painel de controle**: mudar
 *                para qual degrau cada apelido aponta é o que muda a cara do
 *                produto sem quebrar a base.
 *
 *   Color        a camada semântica de cor. Aponta para Palette.
 *
 * Consequência prática: uma marca derivada só contém overrides de Palette,
 * Brand, Semantic e Color. Override em Primitives é erro, e `check-brands`
 * reprova.
 */

export type Layer = "foundation" | "customizable";

export const COLLECTION_LAYER: Record<string, Layer> = {
  Primitives: "foundation",
  Palette: "customizable",
  Brand: "customizable",
  Semantic: "customizable",
  Color: "customizable",
};

export const isFoundation = (collection: string) => COLLECTION_LAYER[collection] === "foundation";

export const FOUNDATION_REASON =
  "Fundação do Santo: a escala crua que todo produto derivado compartilha. " +
  "Para mudar a cara do produto, re-aponte o apelido semântico correspondente.";

/** Qual grupo semântico controla cada família de primitivo. */
export const SEMANTIC_OWNER: Record<string, string> = {
  "dimension/space/": "space/*",
  "dimension/radius/": "radius/*",
  "dimension/border/": "border/*",
  "type/size/": "os text styles",
  "type/leading/": "os text styles",
  "type/weight/": "os text styles",
};

/** Aponta quem controla um primitivo, para a interface explicar em vez de só bloquear. */
export function ownerOf(tokenName: string): string | null {
  const key = Object.keys(SEMANTIC_OWNER).find((prefix) => tokenName.startsWith(prefix));
  return key ? SEMANTIC_OWNER[key] : null;
}
