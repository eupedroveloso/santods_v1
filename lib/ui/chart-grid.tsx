/**
 * Grade de fundo de grafico: linhas hairline igualmente espacadas.
 *
 * Use atras da area de plotagem (o pai e `relative`), com o mesmo numero de
 * linhas que os ticks do eixo — os dois sao flex justify-between, entao casam
 * sem posicionar nada a mao. Recessiva: border/subtle, que recua no escuro;
 * so a linha de base (zero) sobe para border/default. Nunca tracejada.
 * `horizontal` acompanha um eixo y (linha, area, coluna); `vertical`, um eixo
 * x de valor (barra horizontal).
 */
export function ChartGrid({
  lines = 5,
  orientation = "horizontal",
  baseline = true,
  className = "",
}: {
  /** Quantidade de linhas, incluindo as das pontas. */
  lines?: number;
  orientation?: "horizontal" | "vertical";
  /** Destaca a linha do zero (a de baixo; a da esquerda na vertical). */
  baseline?: boolean;
  className?: string;
}) {
  const n = Math.max(2, lines);
  const horizontal = orientation === "horizontal";
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 flex justify-between ${horizontal ? "flex-col" : "flex-row-reverse"} ${className}`}
    >
      {Array.from({ length: n }, (_, i) => {
        const base = baseline && i === n - 1;
        return (
          <span
            key={i}
            className={`block ${horizontal ? "h-0 w-full border-t-thin" : "h-full w-0 border-l-thin"} ${
              base ? "border-border-default" : "border-border-subtle"
            }`}
          />
        );
      })}
    </div>
  );
}
