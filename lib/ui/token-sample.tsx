import type { CSSProperties, ReactNode } from "react";
import { Swatch } from "./swatch";
import { RADIUS_BAR } from "./radius";

export type TokenSampleVariant = "swatch" | "shadow" | "radius" | "corner" | "bar" | "line" | "text" | "easing" | "duration";

type TextProperty = "fontSize" | "fontWeight" | "fontFamily" | "letterSpacing";

/**
 * Amostra viva de um token, lendo a propria var CSS — segue o tema e a marca.
 * Para pagina de tokens, estilos e identidade: o token desenhado do jeito que
 * ele age (cor como amostra, sombra num bloco, raio num canto, espaco como
 * barra, curva como trajeto, duracao como deslocamento).
 *
 * easing e duration animam no hover e no foco (o bloco recebe Tab).
 * `corner` mostra UM canto ampliado (miniatura de preset de raio): com `scale`
 * o raio cresce na mesma proporção, e Reto/Suave/Arredondado se leem de relance.
 */
export function TokenSample({
  variant,
  value,
  label,
  caption,
  property = "fontSize",
  sample = "Aa",
  scale,
  bezier,
  className = "",
}: {
  variant: TokenSampleVariant;
  /** A var CSS do token: "var(--santo-…)". */
  value: string;
  /** swatch: nome ao lado da amostra. */
  label?: ReactNode;
  /** swatch: valor resolvido (hex) — dado, em mono. */
  caption?: ReactNode;
  /** text: qual propriedade o token controla. */
  property?: TextProperty;
  /** text: o texto da amostra. */
  sample?: string;
  /** bar: fracao da largura (ex. 0.1 para container, que nao cabe inteiro). corner: ampliacao do raio (ex. 2). */
  scale?: number;
  /** easing: os quatro numeros da cubic-bezier, para desenhar a curva. */
  bezier?: [number, number, number, number];
  className?: string;
}) {
  switch (variant) {
    case "swatch":
      return (
        <span className={`inline-flex min-w-0 items-center gap-xs ${className}`}>
          <Swatch color={value} />
          {(label || caption) && (
            <span className="flex min-w-0 flex-col">
              {label && <span className="santo-body-small-medium truncate text-text-primary">{label}</span>}
              {caption && <span className="santo-code-sm truncate text-text-tertiary">{caption}</span>}
            </span>
          )}
        </span>
      );
    case "shadow":
      return (
        <span
          className={`block size-3xl border-thin border-border-subtle bg-surface-raised ${className}`}
          style={{ boxShadow: value, borderRadius: "min(var(--santo-radius-lg), var(--santo-card-inner-radius, var(--santo-radius-lg)))" }}
        />
      );
    case "radius":
      return (
        <span
          className={`block size-2xl border-thin border-border-default bg-brand-subtle-default ${className}`}
          style={{ borderRadius: value }}
        />
      );
    case "corner":
      // O quadrado interno passa da moldura: so o canto de cima a esquerda aparece, grande.
      return (
        <span className={`relative block size-2xl overflow-hidden ${className}`}>
          <span
            className="absolute left-0 top-0 block size-4xl border-thick border-border-brand bg-brand-subtle-default"
            style={{ borderTopLeftRadius: scale ? `calc(${value} * ${scale})` : value }}
          />
        </span>
      );
    case "bar":
      return (
        <span
          className={`block h-xs max-w-full rounded-xs bg-brand-solid-default ${className}`}
          style={{ width: scale ? `calc(${value} * ${scale})` : value }}
        />
      );
    case "line":
      return <span className={`block w-full bg-brand-solid-default ${className}`} style={{ height: value }} />;
    case "text":
      return (
        <span className={`santo-body-regular text-text-primary ${className}`} style={{ [property]: value } as CSSProperties}>
          {sample}
        </span>
      );
    case "easing":
      return <EasingSample value={value} bezier={bezier ?? [0.25, 0.1, 0.25, 1]} className={className} />;
    case "duration":
      return <DurationSample value={value} className={className} />;
  }
}

/** Curva da cubic-bezier + bolinha que a percorre: x linear, y na curva do token. */
function EasingSample({ value, bezier, className }: { value: string; bezier: [number, number, number, number]; className: string }) {
  const [x1, y1, x2, y2] = bezier;
  const d = `M 0 100 C ${x1 * 100} ${100 - y1 * 100}, ${x2 * 100} ${100 - y2 * 100}, 100 0`;
  const slow = "var(--santo-motion-duration-slower)";
  return (
    <span
      tabIndex={0}
      aria-label={`Curva ${value}`}
      className={`group relative block size-(--santo-dimension-space-96) border-thin border-border-subtle bg-surface-sunken ${className}`}
      // Raio aninhado: nunca maior que o raio interno da celula/Card em volta.
      style={{ borderRadius: "min(var(--santo-radius-md), var(--santo-card-inner-radius, var(--santo-radius-md)))" }}
    >
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden className="absolute inset-xs size-[calc(100%-var(--santo-space-md))] overflow-visible">
        <path d={d} fill="none" stroke="var(--santo-color-icon-brand)" strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
      </svg>
      <span className="absolute inset-xs">
        {/* x: linear */}
        <span
          className="absolute inset-0 group-hover:translate-x-full group-focus-visible:translate-x-full"
          style={{ transitionProperty: "translate", transitionDuration: slow, transitionTimingFunction: "var(--santo-motion-easing-linear)" }}
        >
          {/* y: a curva do token */}
          <span
            className="absolute inset-0 group-hover:-translate-y-full group-focus-visible:-translate-y-full"
            style={{ transitionProperty: "translate", transitionDuration: slow, transitionTimingFunction: value }}
          >
            <span className="absolute bottom-0 left-0 size-xs -translate-x-1/2 translate-y-1/2 rounded-full bg-brand-solid-default" />
          </span>
        </span>
      </span>
    </span>
  );
}

/** Bloco que atravessa a trilha com a duracao do token. */
function DurationSample({ value, className }: { value: string; className: string }) {
  return (
    <span
      tabIndex={0}
      aria-label={`Duração ${value}`}
      className={`group relative block h-md w-full ${RADIUS_BAR} bg-neutral-subtle-default ${className}`}
    >
      <span
        className="absolute top-0 left-0 size-md rounded-full bg-brand-solid-default group-hover:left-[calc(100%-var(--santo-space-md))] group-focus-visible:left-[calc(100%-var(--santo-space-md))]"
        style={{ transitionProperty: "left", transitionDuration: value, transitionTimingFunction: "var(--santo-motion-easing-standard)" }}
      />
    </span>
  );
}
