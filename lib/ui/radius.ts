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
