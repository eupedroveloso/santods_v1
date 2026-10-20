import { Star, StarHalf } from "./icons";

/**
 * Avaliacao em estrelas + nota ("4,9/5"): prova social de produto, ao lado de
 * um CTA. As estrelas usam icon/warning (amarelo) e arredondam para a meia
 * estrela mais proxima; a nota e o texto que conta (o leitor de tela le o
 * rotulo inteiro, as estrelas sao decorativas).
 */
export function Rating({
  value,
  max = 5,
  label,
  size = 20,
  className = "",
}: {
  /** Nota usada para desenhar as estrelas (0..max). */
  value: number;
  max?: number;
  /** Texto da nota ao lado: "4,9/5". Padrao: o valor com virgula. */
  label?: string;
  size?: 16 | 20 | 24;
  className?: string;
}) {
  const shown = label ?? `${value.toLocaleString("pt-BR")}/${max}`;
  const halves = Math.round(Math.min(max, Math.max(0, value)) * 2);
  return (
    <span className={`inline-flex items-center gap-xs ${className}`} role="img" aria-label={`Avaliação ${shown}`}>
      <span aria-hidden className="flex items-center gap-3xs">
        {Array.from({ length: max }, (_, i) => {
          const full = halves >= (i + 1) * 2;
          const half = !full && halves === i * 2 + 1;
          // Estrela vazia: icon/disabled; cheia e meia: icon/warning (amarelo).
          return (
            <span key={i} className={`flex ${full || half ? "text-icon-warning" : "text-icon-disabled"}`}>
              {half ? <StarHalf size={size} /> : <Star size={size} />}
            </span>
          );
        })}
      </span>
      <span aria-hidden className="santo-body-small-semibold tabular-nums text-text-primary">
        {shown}
      </span>
    </span>
  );
}
