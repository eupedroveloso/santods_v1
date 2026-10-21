
/**
 * Classes do botao do SantoDS, num modulo sem "use client".
 *
 * Fica separado de button.tsx porque funcao exportada de modulo cliente vira
 * referencia de cliente: um Server Component que chamasse `buttonClass()` para
 * estilizar um `<Link>` quebraria. Aqui ela roda dos dois lados.
 *
 * Cada medida por tamanho vem dos tokens control/<medida>/<sm, md ou lg> (Estudio > Controles):
 * altura, padding horizontal, raio, borda, fonte do rotulo, icone e gap. Cor de
 * `color/bg/*` + `color/text/on-*`, transicao de `motion/*`. Nenhum valor solto.
 */

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "subtle" | "contrast" | "ghost-inverse";
export type ControlSize = "sm" | "md" | "lg";

const VARIANTS: Record<ButtonVariant, string> = {
  contrast:
    "bg-surface-inverse text-text-inverse hover:bg-neutral-solid-hover active:bg-neutral-solid-active",
  primary:
    "bg-brand-solid-default text-text-on-brand hover:bg-brand-solid-hover active:bg-brand-solid-active",
  // Pastilha elevada: raised + sombra curta + hairline subtle nos DOIS temas — o
  // secundario quase sempre mora num cartao raised, e raised sobre raised o
  // tom nao separa (skill santo-ui-craft, secao 2).
  secondary:
    "border-border-subtle bg-surface-raised text-text-primary shadow-xs hover:bg-neutral-subtle-default active:bg-neutral-subtle-hover",
  ghost: "text-text-secondary hover:bg-neutral-subtle-default hover:text-text-primary active:bg-neutral-subtle-hover",
  danger:
    "bg-danger-solid-default text-text-on-danger hover:bg-danger-solid-hover active:bg-danger-solid-active",
  subtle:
    "bg-neutral-subtle-default text-text-primary hover:bg-neutral-subtle-hover active:bg-neutral-subtle-active",
  // Sobre superficie SEMPRE escura (janela de codigo): degraus fixos da Palette,
  // que nao trocam com o tema. Divida: falta o semantico color/surface/code.
  "ghost-inverse":
    "text-(--santo-palette-neutral-400) hover:bg-(--santo-palette-neutral-800) hover:text-(--santo-palette-neutral-100) active:bg-(--santo-palette-neutral-700)",
};

// O text style da a familia, o peso, a entrelinha e o tracking; o tamanho vem de
// control/font (com `!`: typography.css fica fora de @layer e venceria o utilitario).
const SIZES: Record<ControlSize, { box: string; text: string; gap: string; border: string; radius: string }> = {
  sm: {
    box: "santo-control-sm h-(--santo-control-height-sm) px-(--santo-control-padding-x-sm)",
    text: "santo-caption-semibold text-(length:--santo-control-font-sm)!",
    gap: "gap-(--santo-control-gap-sm)",
    border: "border-(length:--santo-control-border-sm)",
    radius: "rounded-(--santo-control-radius-sm)",
  },
  md: {
    box: "santo-control-md h-(--santo-control-height-md) px-(--santo-control-padding-x-md)",
    text: "santo-body-small-semibold text-(length:--santo-control-font-md)!",
    gap: "gap-(--santo-control-gap-md)",
    border: "border-(length:--santo-control-border-md)",
    radius: "rounded-(--santo-control-radius-md)",
  },
  lg: {
    box: "santo-control-lg h-(--santo-control-height-lg) px-(--santo-control-padding-x-lg)",
    text: "santo-body-semibold text-(length:--santo-control-font-lg)!",
    gap: "gap-(--santo-control-gap-lg)",
    border: "border-(length:--santo-control-border-lg)",
    radius: "rounded-(--santo-control-radius-lg)",
  },
};

/** Variantes com contorno: so elas recebem a espessura de borda do controle. */
const BORDERED = new Set<ButtonVariant>(["secondary"]);

/* Aperto com mola (lib/ui/motion.css). */
const MOTION = "santo-press";

const DISABLED =
  "disabled:cursor-not-allowed disabled:bg-disabled disabled:text-text-disabled disabled:border-border-disabled disabled:hover:bg-disabled";

const ICON_BOX: Record<ControlSize, string> = {
  sm: "santo-control-sm size-(--santo-control-height-sm)",
  md: "santo-control-md size-(--santo-control-height-md)",
  lg: "santo-control-lg size-(--santo-control-height-lg)",
};

/**
 * As classes do botao, para quando o elemento nao pode ser um `<button>`.
 *
 * Use num link que tem cara de botao (`<Link className={buttonClass()}>`) — um
 * `<button>` dentro de `<a>` e HTML invalido, e copiar as classes a mao e o
 * caminho para o link e o botao divergirem.
 *
 * Raio de CONTROLE (principio 5 do Pedro: sem borda 100% arredondada) —
 * control/radius/<tamanho>, que no Santo e radius/control (= RADIUS_CONTROL). `pill` ficou sem efeito: mantido so por
 * compatibilidade de API.
 */
export function buttonClass({
  variant = "secondary",
  size = "md",
  icon = false,
  block = false,
}: { variant?: ButtonVariant; size?: ControlSize; icon?: boolean; block?: boolean; pill?: boolean } = {}) {
  const s = SIZES[size];
  const box = icon ? ICON_BOX[size] : `${s.box} ${s.text} ${s.gap} whitespace-nowrap`;
  const border = BORDERED.has(variant) ? s.border : "";
  return `inline-flex shrink-0 cursor-pointer items-center justify-center ${s.radius} ${box} ${border} ${VARIANTS[variant]} ${MOTION} ${DISABLED} ${block ? "w-full min-w-0" : ""}`;
}

