/**
 * Raio por familia de peca — principio 5 do Pedro (2026-10-19): a identidade do
 * Santo nao tem borda 100% arredondada. `radius/full` so em CIRCULO geometrico
 * (avatar, radio, punho do range, ring, ponto/marker, swatch e
 * icon-tile redondos, dia escolhido do calendario). Todo o resto sai daqui.
 *
 * Um lugar so: quando o token entrar, a troca e nesta linha (find/replace por
 * `TODO(radius/control)`), nao em cada componente.
 */

// radius/control (-> brand/shape/radius-control): base de CONTROLE, separada do raio de
// container (radius/md -> radius-base) desde o nivel B do Estudio. No Santo e VTSD = 8 = radius/md.
/** Controle interativo compacto: botao, chip, count, aba, item de nav, campo de uma linha, FAB. */
export const RADIUS_CONTROL = "rounded-control";

// Trilho = control + space/2xs: concentrico ao controle que ele envolve, em qualquer marca
// (com control 8 e p-2xs 4 da os 12 de sempre; se o Estudio mudar o control, o trilho acompanha).
/** Trilho que envolve controles com `p-2xs`: Segmented, RailNav, tab bar, composer. */
export const RADIUS_TRACK = "rounded-[calc(var(--santo-radius-control)+var(--santo-space-2xs))]";

/** Pontas de uma faixa feita de celulas (cabecalho tonal da Table): o raio de controle so nas pontas. */
export const RADIUS_CONTROL_START = "rounded-l-control";
export const RADIUS_CONTROL_END = "rounded-r-control";

/**
 * EXCECAO do Pedro (2026-10-19): BADGE e TAG podem ser 100% arredondados —
 * rotulo estatico pequeno (Tag/Badge, Count, Marker) e a unica forma em capsula
 * fora do circulo geometrico. Nada mais (bloco, superficie, controle) e capsula.
 */
export const RADIUS_BADGE = "rounded-full";

/** Barra fina de dado (Progress, MiniBars, trilha de range, texto de Skeleton): o piso do sistema. */
export const RADIUS_BAR = "rounded-xs";

/*
 * Os mesmos degraus como valor CSS, para o calculo concentrico em `style`
 * (Card, moldura dupla): raio da moldura = raio do filho + padding.
 */
export const RADIUS_CONTROL_VAR = "var(--santo-radius-control)";
export const RADIUS_TRACK_VAR = "var(--santo-radius-lg)";

/*
 * Aninhamento (regra do Pedro, 2026-10-21): moldura com UM recuo igual nos
 * quatro lados; raio interno = max(radius/xs, externo − recuo). Quem aplica e o
 * primitivo Nest (nest.tsx) e o Card; aqui so a conta, em CSS de tokens.
 */
export type NestInset = "none" | "3xs" | "2xs" | "xs" | "sm" | "md" | "lg" | "xl";

/** Recuo real em CSS: o token de espaco + o fio da moldura quando ela tem borda (santo-edge). */
export function nestInset(inset: NestInset, edge = false): string {
  const space = inset === "none" ? "0px" : `var(--santo-space-${inset})`;
  return edge ? `${space} + var(--santo-border-thin)` : space;
}

/**
 * Raio do filho (regra do Pedro: o externo e SEMPRE maior; decisao do maestro, 2026-10-21):
 *   - moldura justa (recuo < externo): concentrico, max(externo − recuo, radius/xs);
 *   - moldura folgada (recuo >= externo): min(controle, degrau abaixo do externo),
 *     com o degrau abaixo = externo − radius/xs (12 → 8, 8 → 4, 4 → 0) — exato na
 *     escala ate 16; acima disso o controle ja e menor.
 * Sem condicional em CSS: cada termo e "ligado" por um fator * 1000 que satura
 * (positivo no seu caso, negativo no outro) e o max final escolhe.
 */
export function nestInner(outer: string, inset: string): string {
  const d = `(${outer} - (${inset}))`;
  const tight = `max(calc(${d}), min(var(--santo-radius-xs), calc(${d} * 1000)))`;
  const roomy = `min(var(--santo-radius-control), calc(${outer} - var(--santo-radius-xs)), calc(-1 * ${d} * 1000))`;
  return `max(0px, ${tight}, ${roomy})`;
}
