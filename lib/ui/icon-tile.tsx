import type { ReactNode } from "react";

/**
 * Icone dentro de uma caixa tonal: marcador de linha de lista, de estado vazio,
 * de anexo, de cabecalho de cartao. Sem contorno 1px (skill santo-ui-craft):
 *   subtle   (padrao) poco tonal — surface/sunken sobre cartao.
 *   outline  pilula elevada (raised + shadow-xs) — sobre chao/poco.
 *   brand    o acento da regiao (brand/subtle + icone brand). Um por regiao.
 * Quadrado com raio lg/xl limitado ao raio interno do Card pai, ou redondo.
 */
const TONE = {
  subtle: "bg-surface-sunken text-icon-secondary",
  outline: "santo-edge bg-surface-raised text-icon-secondary shadow-xs",
  brand: "bg-brand-subtle-default text-icon-brand",
} as const;

export function IconTile({
  children,
  shape = "square",
  tone = "subtle",
  size = "md",
  className = "",
}: {
  /** O icone (Icon.*). */
  children: ReactNode;
  shape?: "square" | "round";
  tone?: keyof typeof TONE;
  size?: "md" | "lg";
  className?: string;
}) {
  return (
    <span
      className={`grid shrink-0 place-items-center ${size === "md" ? "size-2xl" : "size-3xl"} ${shape === "round" ? "rounded-full" : ""} ${TONE[tone]} ${className}`}
      // Quadrado: raio do tamanho, mas nunca maior que o raio interno do Card
      // em volta (raio aninhado); fora de Card, o do tamanho.
      style={
        shape === "round"
          ? undefined
          : {
              borderRadius: `min(var(--santo-radius-${size === "md" ? "lg" : "xl"}), var(--santo-card-inner-radius, var(--santo-radius-${size === "md" ? "lg" : "xl"})))`,
            }
      }
    >
      {children}
    </span>
  );
}
