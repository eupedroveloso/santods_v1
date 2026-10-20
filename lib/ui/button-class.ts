import { RADIUS_CONTROL } from "./radius";

/**
 * Classes do botao do SantoDS, num modulo sem "use client".
 *
 * Fica separado de button.tsx porque funcao exportada de modulo cliente vira
 * referencia de cliente: um Server Component que chamasse `buttonClass()` para
 * estilizar um `<Link>` quebraria. Aqui ela roda dos dois lados.
 *
 * Altura vem de `dimension/size/*`, preenchimento de `space/*`, cor de
 * `color/bg/*` + `color/text/on-*`, transicao de `motion/*`. Nenhum valor solto.
 */

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "subtle" | "ghost-inverse";
export type ControlSize = "sm" | "md" | "lg";

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-solid-default text-text-on-brand hover:bg-brand-solid-hover active:bg-brand-solid-active",
  // Pastilha elevada: raised + sombra curta + hairline subtle nos DOIS temas — o
  // secundario quase sempre mora num cartao raised, e raised sobre raised o
  // tom nao separa (skill santo-ui-craft, secao 2).
  secondary:
    "border-thin border-border-subtle bg-surface-raised text-text-primary shadow-xs hover:bg-neutral-subtle-default active:bg-neutral-subtle-hover",
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

const SIZES: Record<ControlSize, { box: string; text: string; gap: string }> = {
  sm: { box: "h-(--santo-dimension-size-32) px-sm", text: "santo-caption-semibold", gap: "gap-2xs" },
  md: { box: "h-(--santo-dimension-size-40) px-md", text: "santo-body-small-semibold", gap: "gap-xs" },
  lg: { box: "h-(--santo-dimension-size-48) px-lg", text: "santo-body-semibold", gap: "gap-xs" },
};

/* Aperto com mola (lib/ui/motion.css). */
const MOTION = "santo-press";

const DISABLED =
  "disabled:cursor-not-allowed disabled:bg-disabled disabled:text-text-disabled disabled:border-border-disabled disabled:hover:bg-disabled";

const ICON_BOX: Record<ControlSize, string> = {
  sm: "size-(--santo-dimension-size-32)",
  md: "size-(--santo-dimension-size-40)",
  lg: "size-(--santo-dimension-size-48)",
};

/**
 * As classes do botao, para quando o elemento nao pode ser um `<button>`.
 *
 * Use num link que tem cara de botao (`<Link className={buttonClass()}>`) — um
 * `<button>` dentro de `<a>` e HTML invalido, e copiar as classes a mao e o
 * caminho para o link e o botao divergirem.
 *
 * Raio de CONTROLE (principio 5 do Pedro: sem borda 100% arredondada) —
 * `RADIUS_CONTROL` de radius.ts. `pill` ficou sem efeito: mantido so por
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
  return `inline-flex shrink-0 cursor-pointer items-center justify-center ${RADIUS_CONTROL} ${box} ${VARIANTS[variant]} ${MOTION} ${DISABLED} ${block ? "w-full min-w-0" : ""}`;
}

