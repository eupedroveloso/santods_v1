import type { ReactNode } from "react";

/**
 * Icone num SLOT de tamanho de token (size/40 ou size/48): marcador de linha de
 * lista, de estado vazio, de anexo, de cabecalho de cartao. O slot alinha o
 * icone com Avatar e com a coluna de texto ao lado.
 *
 * Regra do Pedro (2026-10-19, sem caixa em volta de componente dentro de
 * cartao): o padrao e `plain`, sem fundo. A caixa tonal e OPCIONAL, para quando
 * a cor carrega significado:
 *   plain    (padrao) so o icone, icon/secondary, sem caixa.
 *   brand    o acento da regiao (brand/subtle + icone brand): estado vazio, item em destaque. Um por regiao.
 *   subtle   poco tonal (surface/sunken): grade de icones, marcador que precisa de alvo visual.
 *   outline  pastilha elevada (raised + shadow-xs) — sobre chao/poco (anexo de chat).
 *   success/danger  intencao (bg/<intencao>/subtle + icon/<intencao>): quando o
 *            icone diz entrada/saida, ok/erro — ex. TransactionRow.
 * Com caixa: quadrado no raio interno do Card pai (raio de controle), ou redondo.
 */
const TONE = {
  plain: "text-icon-secondary",
  subtle: "bg-surface-sunken text-icon-secondary",
  outline: "santo-edge bg-surface-raised text-icon-secondary shadow-xs",
  brand: "bg-brand-subtle-default text-icon-brand",
  success: "bg-success-subtle-default text-icon-success",
  danger: "bg-danger-subtle-default text-icon-danger",
} as const;

export function IconTile({
  children,
  shape = "square",
  tone = "plain",
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
