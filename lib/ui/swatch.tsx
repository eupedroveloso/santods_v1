/**
 * Amostra de cor — primitivo. Nao importa nenhum outro componente da lib.
 * O SwatchPicker (swatch-picker.tsx) e o ColorRow (color-row.tsx) compoem este.
 */

export type SwatchSize = "xs" | "sm" | "md";

/** Tamanho da amostra, compartilhado com o SwatchPicker. */
export const SWATCH_BOX: Record<SwatchSize, string> = {
  xs: "size-(--santo-dimension-space-12)",
  sm: "size-(--santo-dimension-size-20)",
  md: "size-(--santo-dimension-size-28)",
};

/** Xadrez atras da cor, para alfa parcial ficar legivel: `.santo-checker` em controls.css. */
export const SWATCH_CHECKER = "santo-checker";

/** Amostra de cor estatica. */
export function Swatch({
  color,
  size = "md",
  className = "",
  title,
  round,
}: {
  color: string;
  size?: SwatchSize;
  className?: string;
  title?: string;
  /** Circulo em vez de quadrado — usado nas amostras de resumo da marca. */
  round?: boolean;
}) {
  return (
    <span
      title={title}
      // inline-block: fora de um flex (celula de tabela, texto) um span inline ignora o tamanho.
      className={`relative inline-block shrink-0 overflow-hidden border-thin border-border-subtle align-middle ${SWATCH_CHECKER} ${round ? "rounded-full" : "rounded-sm"} ${SWATCH_BOX[size]} ${className}`}
    >
      <span className="absolute inset-0" style={{ background: color }} />
    </span>
  );
}
