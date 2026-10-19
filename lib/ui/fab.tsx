import type { ButtonHTMLAttributes, ReactNode } from "react";

export type FabTone = "brand" | "raised";
export type FabSize = "md" | "lg";
export type FabPosition = "end" | "center" | "start";

const TONE: Record<FabTone, string> = {
  brand: "bg-brand-solid-default text-text-on-brand hover:bg-brand-solid-hover active:bg-brand-solid-active",
  raised:
    "border-thin border-border-subtle bg-surface-raised text-text-primary hover:bg-neutral-subtle-default active:bg-neutral-subtle-hover",
};

const SIZE: Record<FabSize, { round: string; extended: string; text: string }> = {
  md: {
    round: "size-(--santo-dimension-size-48)",
    extended: "h-(--santo-dimension-size-48) pl-md pr-lg gap-xs",
    text: "santo-body-small-semibold",
  },
  lg: {
    round: "size-(--santo-dimension-size-56)",
    extended: "h-(--santo-dimension-size-56) pl-lg pr-xl gap-xs",
    text: "santo-body-semibold",
  },
};

/**
 * Fixo no rodape da janela, acima do conteudo rolavel. O `bottom` vai em
 * `SAFE_BOTTOM` (style): space/xl mais a area da barra de gesto do iPhone.
 */
const POSITION: Record<FabPosition, string> = {
  end: "fixed right-xl z-(--santo-layer-sticky)",
  center: "fixed left-1/2 -translate-x-1/2 z-(--santo-layer-sticky)",
  start: "fixed left-xl z-(--santo-layer-sticky)",
};

const SAFE_BOTTOM = "calc(var(--santo-space-xl) + env(safe-area-inset-bottom, var(--santo-space-none)))";

/**
 * Botão de ação flutuante.
 *
 * Use para a UMA ação principal de uma tela que rola (novo pedido, escrever,
 * adicionar) e precisa ficar à mão o tempo todo. Mais de um FAB por tela é
 * ruído — o resto vai em Button. Círculo só com ícone; `extended` mostra o
 * rótulo ao lado e é o certo quando o ícone sozinho não diz a ação. `brand` é o
 * acento da região; `raised` quando a tela já tem outro elemento em brand.
 */
export function Fab({
  icon,
  label,
  extended = false,
  tone = "brand",
  size = "md",
  position,
  className = "",
  type = "button",
  style,
  ...rest
}: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  /** O icone (Icon.*). */
  icon: ReactNode;
  /** Nome da acao. Vira o texto no `extended`; no circulo, aria-label e title. */
  label: string;
  extended?: boolean;
  tone?: FabTone;
  size?: FabSize;
  /** Fixa no canto ou centro inferior da janela. Sem ele, fica no fluxo. */
  position?: FabPosition;
}) {
  const s = SIZE[size];
  return (
    <button
      type={type}
      aria-label={extended ? undefined : label}
      title={extended ? undefined : label}
      className={`inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full shadow-lg santo-press hover:shadow-xl active:shadow-md disabled:cursor-not-allowed disabled:bg-disabled disabled:text-text-disabled disabled:shadow-none ${
        TONE[tone]
      } ${extended ? `${s.extended} ${s.text}` : s.round} ${position ? POSITION[position] : ""} ${className}`}
      style={position ? { bottom: SAFE_BOTTOM, ...style } : style}
      {...rest}
    >
      <span className="grid shrink-0 place-items-center" aria-hidden>
        {icon}
      </span>
      {extended && <span>{label}</span>}
    </button>
  );
}
