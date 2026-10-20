/**
 * Raio por familia de peca — principio 5 do Pedro (2026-10-19): a identidade do
 * Santo nao tem borda 100% arredondada. `radius/full` so em CIRCULO geometrico
 * (avatar, radio, punho do range, ring, ponto/marker, swatch e
 * icon-tile redondos, dia escolhido do calendario). Todo o resto sai daqui.
 *
 * Um lugar so: quando o token entrar, a troca e nesta linha (find/replace por
 * `TODO(radius/control)`), nao em cada componente.
 */

// TODO(radius/control): virar "rounded-control" quando o token Semantic radius/control
// (-> Brand brand/shape/radius-control -> dimension/radius/8) for aprovado e sincronizado.
// Hoje radius/md = 8 = control: nenhuma diferenca visual no Santo.
/** Controle interativo compacto: botao, chip, count, aba, item de nav, campo de uma linha, FAB. */
export const RADIUS_CONTROL = "rounded-md";

// TODO(radius/control): trilho = control + space/2xs (concentrico). Com control = 8 e
// p-2xs = 4, e radius/lg (12); se a marca mudar o control, rever este degrau.
/** Trilho que envolve controles com `p-2xs`: Segmented, RailNav, tab bar, composer. */
export const RADIUS_TRACK = "rounded-lg";

// TODO(radius/control): virar rounded-l-control / rounded-r-control.
/** Pontas de uma faixa feita de celulas (cabecalho tonal da Table): o raio de controle so nas pontas. */
export const RADIUS_CONTROL_START = "rounded-l-md";
export const RADIUS_CONTROL_END = "rounded-r-md";

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
// TODO(radius/control): virar var(--santo-radius-control) junto com RADIUS_CONTROL.
export const RADIUS_CONTROL_VAR = "var(--santo-radius-md)";
export const RADIUS_TRACK_VAR = "var(--santo-radius-lg)";
