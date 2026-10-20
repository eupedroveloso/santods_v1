import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight } from "./icons";
import { RADIUS_CONTROL, RADIUS_CONTROL_VAR, RADIUS_TRACK, RADIUS_TRACK_VAR } from "./radius";

const INTENT = {
  success: "bg-success-solid-default text-text-on-success hover:bg-success-solid-hover active:bg-success-solid-active",
  brand: "bg-brand-solid-default text-text-on-brand hover:bg-brand-solid-hover active:bg-brand-solid-active",
} as const;

/**
 * CTA principal de pagina de venda: botao largo (largura do pai), texto grande
 * e, na ponta direita, uma PASTILHA escura (surface/inverse) com a seta diagonal.
 * Um por pagina. Para acao comum, use Button.
 *
 * Raio concentrico (regua de equilibrio, principio 5 — sem capsula): o botao e
 * moldura da pastilha com folga space/xs igual em cima, embaixo e na ponta;
 * leva RADIUS_TRACK (lg) e a pastilha leva lg − xs (calc de tokens). Altura
 * size/64 = pastilha size/48 + 2 × space/xs. Sombra md.
 *
 * `size="md"`: para ficar LADO A LADO com um Button lg (hero com duas acoes):
 * altura size/48 = pastilha size/40 + 2 × space/2xs, raio de controle (md, o
 * mesmo do Button irmao) e pastilha md − 2xs. Largura do conteudo.
 */
export function CtaButton({
  children,
  href,
  onClick,
  intent = "success",
  size = "lg",
  className = "",
}: {
  children: ReactNode;
  /** Vira link. */
  href?: string;
  onClick?: () => void;
  intent?: keyof typeof INTENT;
  /** lg (padrao): largo, size/64. md: ao lado de um Button lg, size/48. */
  size?: "md" | "lg";
  className?: string;
}) {
  const md = size === "md";
  const cls = md
    ? `santo-body-small-semibold santo-press santo-transition-colors inline-flex h-(--santo-dimension-size-48) w-fit cursor-pointer items-center gap-sm ${RADIUS_CONTROL} p-2xs pl-md text-left shadow-sm ${INTENT[intent]} ${className}`
    : `santo-heading-6-bold santo-press santo-transition-colors flex min-h-(--santo-dimension-size-64) w-full cursor-pointer items-center justify-between gap-md ${RADIUS_TRACK} py-xs pr-xs pl-lg text-left shadow-md ${INTENT[intent]} ${className}`;
  const body = (
    <>
      <span className="min-w-0">{children}</span>
      <span
        aria-hidden
        className={`grid shrink-0 place-items-center bg-surface-inverse text-text-inverse ${md ? "size-(--santo-dimension-size-40)" : "size-(--santo-dimension-size-48)"}`}
        style={{
          borderRadius: md
            ? `calc(${RADIUS_CONTROL_VAR} - var(--santo-space-2xs))`
            : `calc(${RADIUS_TRACK_VAR} - var(--santo-space-xs))`,
        }}
      >
        <ArrowUpRight size={md ? 16 : 20} />
      </span>
    </>
  );
  return href ? (
    <Link href={href} className={cls}>
      {body}
    </Link>
  ) : (
    <button type="button" onClick={onClick} className={cls}>
      {body}
    </button>
  );
}
