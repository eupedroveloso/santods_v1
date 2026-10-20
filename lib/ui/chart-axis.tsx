/**
 * Rotulos de eixo de grafico.
 *
 * `x` fica abaixo da area de plotagem; `y` a esquerda, com os ticks de cima
 * para baixo (do maior ao menor). Em `edge` (linha, area) cada rotulo centra
 * no seu ponto, pontas inclusive (meio rotulo sobra para o respiro do
 * cartao); em `band` (barras) cada rotulo centra na sua faixa. Os ticks sao
 * flex justify-between, como a ChartGrid: mesmo numero de linhas, mesma
 * posicao. `max` rarefaz um eixo x longo (14 pontos, 7 rotulos). `active`
 * acende o rotulo do x em foco. Texto em caption, `text/tertiary`, tabular.
 */
export function AxisLabels({
  labels,
  orientation = "x",
  mode = "edge",
  max = 8,
  active = null,
  className = "",
}: {
  labels: string[];
  orientation?: "x" | "y";
  mode?: "edge" | "band";
  /** No eixo x, quantos rotulos no maximo: amostra com passo uniforme (os demais ficam vazios, as posicoes nao mudam). */
  max?: number;
  active?: number | null;
  className?: string;
}) {
  const text = "santo-caption-small-regular whitespace-nowrap tabular-nums santo-transition-colors";
  const tone = (i: number) => (active === i ? "text-text-primary" : "text-text-tertiary");

  if (orientation === "y") {
    return (
      <div aria-hidden className={`flex h-full flex-col justify-between ${className}`}>
        {labels.map((l, i) => (
          <span key={i} className="flex h-0 items-center justify-end">
            <span className={`${text} text-text-tertiary`}>{l}</span>
          </span>
        ))}
      </div>
    );
  }

  const n = labels.length;
  // Amostragem uniforme: passo fixo a partir do primeiro, sem forcar o ultimo fora do passo
  // (forcar espremia "nov, dez" e "sem 13, sem 14" no fim). O x em foco aparece sempre e
  // esconde os vizinhos a menos de um passo, para nao colidir.
  const step = n > max ? Math.ceil((n - 1) / (max - 1)) : 1;
  const shown = (i: number) => {
    if (i === active) return true;
    if (i % step !== 0) return false;
    return active === null || active === undefined || Math.abs(i - active) >= step;
  };

  if (mode === "band") {
    return (
      <div aria-hidden className={`flex ${className}`}>
        {labels.map((l, i) => (
          <span key={i} className={`min-w-0 flex-1 truncate text-center ${text} ${tone(i)}`}>
            {shown(i) ? l : ""}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div aria-hidden className={`flex justify-between ${className}`}>
      {labels.map((l, i) => (
        // Centrado no proprio ponto, inclusive nas pontas: encostar a ponta deslocava o rotulo
        // meia largura para fora da sua linha de grade (o "6 mil" da barra horizontal).
        <span key={i} className="flex w-0 justify-center">
          <span className={`${text} ${tone(i)}`}>{shown(i) ? l : ""}</span>
        </span>
      ))}
    </div>
  );
}
