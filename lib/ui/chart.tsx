/**
 * Graficos minimos em SVG puro, pintados por token.
 *
 * Nao ha biblioteca por tras: sao formas simples para o preview mostrar como o
 * tema se comporta em dado. Traco em `color/icon/*`, area com o mesmo tom em
 * opacidade baixa, grade em `color/border/subtle`.
 */

type Series = number[];

function scale(values: Series, width: number, height: number, pad = 2) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = max - min || 1;
  return values.map((v, i) => ({
    x: (i / (values.length - 1 || 1)) * width,
    y: pad + (1 - (v - min) / span) * (height - pad * 2),
  }));
}

/** Curva suave por Catmull-Rom convertida em Bezier — sem picos duros. */
function smoothPath(points: { x: number; y: number }[]) {
  if (points.length < 2) return "";
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

export type ChartProps = {
  values: Series;
  /** Altura em token de tamanho. */
  height?: 40 | 48 | 56 | 64;
  className?: string;
  /** Cor do traco. Aceita qualquer var de token. */
  stroke?: string;
};

const H = { 40: "var(--santo-dimension-space-40)", 48: "var(--santo-dimension-space-48)", 56: "var(--santo-dimension-space-56)", 64: "var(--santo-dimension-space-64)" };

/**
 * Linha com marcadores nos pontos.
 *
 * O SVG estica na horizontal (`preserveAspectRatio="none"`) para a curva ocupar
 * toda a largura. O traco aguenta isso por causa de `non-scaling-stroke`, mas um
 * `<circle>` viraria elipse — por isso os pontos sao elementos HTML posicionados
 * por porcentagem, que continuam redondos em qualquer largura.
 */
export function LineChart({
  values,
  height = 56,
  className = "",
  stroke = "var(--santo-color-icon-primary)",
  dots = true,
}: ChartProps & { dots?: boolean }) {
  const pts = scale(values, 100, 40);
  return (
    <div className={`relative w-full ${className}`} style={{ height: H[height] }} aria-hidden>
      <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="absolute inset-0 size-full">
        <path
          d={smoothPath(pts)}
          fill="none"
          stroke={stroke}
          strokeWidth={1.5}
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {dots &&
        pts.map((p, i) => (
          <span
            key={i}
            className="absolute size-2xs -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ left: `${p.x}%`, top: `${(p.y / 40) * 100}%`, background: stroke }}
          />
        ))}
    </div>
  );
}

/** Linha com area preenchida — bom para volume acumulado. */
export function AreaChart({
  values,
  height = 56,
  className = "",
  stroke = "var(--santo-color-icon-brand)",
}: ChartProps) {
  const pts = scale(values, 100, 40);
  const line = smoothPath(pts);
  return (
    <svg viewBox="0 0 100 40" preserveAspectRatio="none" className={`w-full ${className}`} style={{ height: H[height] }} aria-hidden>
      <path d={`${line} L 100 40 L 0 40 Z`} fill={stroke} opacity={0.12} />
      <path d={line} fill="none" stroke={stroke} strokeWidth={1.5} vectorEffect="non-scaling-stroke" strokeLinecap="round" />
    </svg>
  );
}

/** Barras. Usa flex em vez de SVG para o raio acompanhar o token. */
export function BarChart({
  values,
  height = 56,
  className = "",
  fill = "var(--santo-color-bg-neutral-solid-default)",
}: Omit<ChartProps, "stroke"> & { fill?: string }) {
  const max = Math.max(...values);
  return (
    <div className={`flex items-end gap-3xs ${className}`} style={{ height: H[height] }} aria-hidden>
      {values.map((v, i) => (
        <div
          key={i}
          className="min-w-0 flex-1 rounded-xs"
          style={{ height: `${Math.max((v / max) * 100, 4)}%`, background: fill }}
        />
      ))}
    </div>
  );
}

/** Eixo de rotulos abaixo de um grafico. */
export function AxisLabels({ labels }: { labels: string[] }) {
  return (
    <div className="flex justify-between">
      {labels.map((l) => (
        <span key={l} className="santo-caption-small-regular text-text-tertiary">
          {l}
        </span>
      ))}
    </div>
  );
}

/**
 * Area empilhada com grade e eixo — o grafico grande do painel.
 *
 * Duas series desenhadas uma sobre a outra, cada uma com preenchimento em
 * degrade do proprio tom ate transparente. A grade usa `border/subtle`, entao
 * ela recua no modo escuro sem virar listra.
 */
export function StackedAreaChart({
  series,
  labels,
  height = 64,
  className = "",
}: {
  /** Da base para o topo. Cada uma com sua cor de token. */
  series: { values: number[]; color: string }[];
  labels?: string[];
  height?: 40 | 48 | 56 | 64;
  className?: string;
}) {
  const length = Math.max(...series.map((s) => s.values.length));
  // Empilha: cada serie soma as anteriores no mesmo indice.
  const stacked: number[][] = [];
  for (let i = 0; i < series.length; i++) {
    stacked.push(
      series[i].values.map((v, j) => v + (stacked[i - 1]?.[j] ?? 0)),
    );
  }
  const top = Math.max(...stacked[stacked.length - 1]);

  const toPoints = (values: number[]) =>
    values.map((v, i) => ({ x: (i / (length - 1 || 1)) * 100, y: 40 - (v / top) * 38 }));

  return (
    <div className={`flex flex-col gap-2xs ${className}`}>
      <svg
        viewBox="0 0 100 40"
        preserveAspectRatio="none"
        className="w-full"
        style={{ height: H[height] }}
        aria-hidden
      >
        {[0.25, 0.5, 0.75].map((f) => (
          <line
            key={f}
            x1={0}
            x2={100}
            y1={40 * f}
            y2={40 * f}
            stroke="var(--santo-color-border-subtle)"
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
          />
        ))}
        {stacked
          .map((values, i) => ({ pts: toPoints(values), color: series[i].color, i }))
          .reverse()
          .map(({ pts, color, i }) => (
            <g key={i}>
              <path d={`${smoothPath(pts)} L 100 40 L 0 40 Z`} fill={color} opacity={0.28} />
              <path
                d={smoothPath(pts)}
                fill="none"
                stroke={color}
                strokeWidth={1.5}
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
              />
            </g>
          ))}
      </svg>
      {labels && <AxisLabels labels={labels} />}
    </div>
  );
}
