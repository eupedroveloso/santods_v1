import { RADIUS_CONTROL } from "./radius";

/** Mesma linha para destino e pasta: ícone/chevron em 16, altura 36. */
export const NAV_ROW_CLASS = `santo-body-small-medium santo-transition-elevation flex h-(--santo-dimension-size-36) w-full cursor-pointer items-center gap-xs ${RADIUS_CONTROL} px-sm text-left`;
export const NAV_ICON_CLASS = "grid size-(--santo-dimension-icon-16) shrink-0 place-items-center";

/** O tronco continua até o próximo irmão, inclusive por trás de uma subárvore. */
export const NAV_BRANCH_CLASS = "relative not-last:before:absolute not-last:before:-top-3xs not-last:before:-bottom-3xs not-last:before:-left-sm not-last:before:border-l-thin not-last:before:border-border-subtle";

/** Cotovelo no centro da linha do cabeçalho, independente da altura do ramo. */
export const NAV_ELBOW_CLASS = "pointer-events-none absolute -top-3xs -left-sm w-sm rounded-bl-md border-b-thin border-l-thin border-border-subtle";
export const NAV_ELBOW_STYLE = { height: "calc(var(--santo-dimension-size-36) / 2 + var(--santo-space-3xs))" };

/** Liga o fundo do ícone/chevron do pai ao início dos ramos. */
export const NAV_STEM_STYLE = {
  left: "calc(var(--santo-space-sm) + var(--santo-dimension-icon-16) / 2)",
  top: "calc((var(--santo-dimension-size-36) + var(--santo-dimension-icon-16)) / 2)",
  height: "calc((var(--santo-dimension-size-36) - var(--santo-dimension-icon-16)) / 2 + var(--santo-space-3xs))",
};
