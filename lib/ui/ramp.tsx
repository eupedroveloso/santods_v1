"use client";

/**
 * Faixa de rampa.
 *
 * Os degraus ficam encostados, com um único raio por fora — a rampa precisa ler
 * como **uma** escala contínua. Onze retângulos separados com número embaixo
 * parecem amostras avulsas e escondem justamente o que interessa: se a
 * progressão de luminosidade é suave ou tem degrau.
 *
 * O degrau-semente ganha um anel por dentro, para se localizar sem legenda.
 */
export function RampStrip({
  colors,
  steps,
  seedIndex,
  className = "",
}: {
  /** Uma cor CSS por degrau — aceita `var(--santo-…)`. */
  colors: string[];
  /** Rótulo de cada degrau, usado no title. */
  steps: readonly (string | number)[];
  seedIndex?: number;
  className?: string;
}) {
  return (
    <div
      className={`flex h-2xl w-full overflow-hidden rounded-md border-thin border-border-subtle ${className}`}
    >
      {colors.map((color, i) => (
        <span
          key={i}
          title={`${steps[i]}`}
          className="relative min-w-0 flex-1"
          style={{ background: color }}
        >
          {i === seedIndex && (
            <span className="absolute inset-3xs rounded-xs border-thick border-[color-mix(in_srgb,var(--santo-color-surface-raised)_70%,transparent)]" />
          )}
        </span>
      ))}
    </div>
  );
}

/** Marcadores de degrau alinhados sob a faixa: só as âncoras. */
export function RampScale({ steps }: { steps: readonly (string | number)[] }) {
  const anchors = [0, Math.floor(steps.length / 2), steps.length - 1];
  return (
    <div className="flex justify-between">
      {anchors.map((i) => (
        <span key={i} className="santo-caption-small-regular tabular-nums text-text-tertiary">
          {steps[i]}
        </span>
      ))}
    </div>
  );
}
