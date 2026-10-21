"use client";

import type { CSSProperties, ReactNode } from "react";
import { RADIUS_CONTROL_VAR } from "./radius";

/**
 * Controle segmentado: escolha unica entre 2 e 4 opcoes visiveis ao mesmo tempo.
 *
 * Prefira a um select quando as opcoes sao poucas e a comparacao entre elas
 * importa — claro/escuro, densidade, escopo.
 */
export type Segment<T extends string> = {
  value: T;
  label: ReactNode;
  /** Rotulo acessivel quando `label` for so um icone. */
  title?: string;
};

/*
 * Trilho em pastilha (surface/sunken, chao) com a pastilha ativa ELEVADA
 * (raised + shadow-xs) — o vocabulario de pastilha da skill santo-ui-craft.
 * Raio aninhado (principio 5 do Pedro): pastilha com o raio de controle
 * (RADIUS_CONTROL). O trilho deriva o raio do controle + o próprio padding:
 * radius/lg é fixo e não acompanha uma mudança de raio da marca.
 */
const TRACK_PADDING = "var(--santo-space-2xs)";
const TRACK_NATURAL = `calc(${RADIUS_CONTROL_VAR} + ${TRACK_PADDING})`;
/*
 * Dentro de um cartao, o trilho nunca passa do raio interno que o pai declara
 * (--santo-card-inner-radius): o externo e sempre maior que o interno (regra
 * do raio aninhado). Fora de cartao vale o natural (controle + 2xs). A
 * pastilha acompanha, concentrica: trilho - 2xs, com piso radius/xs.
 */
const TRACK_RADIUS = `min(${TRACK_NATURAL}, var(--santo-card-inner-radius, ${TRACK_NATURAL}))`;
const TRACK_STYLE = {
  padding: TRACK_PADDING,
  "--santo-track-radius": TRACK_RADIUS,
  borderRadius: "var(--santo-track-radius)",
} as CSSProperties;
/** Pastilha dentro do trilho: concentrica a ele. */
const ITEM_STYLE = { borderRadius: `max(var(--santo-radius-xs), calc(var(--santo-track-radius) - ${TRACK_PADDING}))` };
const FLOATING_TRACK_STYLE = {
  padding: TRACK_PADDING,
  // Barra flutuante mora fora de cartao: raio natural + o fio do santo-edge.
  "--santo-track-radius": TRACK_NATURAL,
  borderRadius: `calc(${TRACK_NATURAL} + var(--santo-border-thin))`,
} as CSSProperties;

const SEG_SIZE = {
  sm: "h-(--santo-dimension-size-24) px-xs santo-caption-semibold",
  md: "h-(--santo-dimension-size-32) px-sm santo-body-small-medium",
} as const;

export function Segmented<T extends string>({
  value,
  onChange,
  options,
  className = "",
  size = "sm",
  block = false,
}: {
  value: T;
  onChange: (value: T) => void;
  options: Segment<T>[];
  className?: string;
  size?: "sm" | "md";
  /** Largura do pai, abas iguais: irmao de campo/botao de largura total no mesmo cartao. */
  block?: boolean;
}) {
  return (
    <div
      role="radiogroup"
      style={TRACK_STYLE}
      className={`${block ? "flex w-full" : "inline-flex"} max-w-full min-w-0 shrink-0 items-center gap-3xs bg-surface-sunken ${className}`}
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            title={o.title}
            // So nomeia pelo title quando o rotulo nao e texto (icone). Com texto
            // visivel, ele e o nome acessivel — "clicar Auto" por voz tem que funcionar.
            aria-label={typeof o.label === "string" ? undefined : o.title}
            onClick={() => onChange(o.value)}
            style={ITEM_STYLE}
            className={`santo-transition-elevation inline-flex cursor-pointer items-center justify-center gap-2xs whitespace-nowrap ${block ? "min-w-0 flex-1" : ""} ${SEG_SIZE[size]} ${
              active
                ? "bg-surface-raised text-text-primary shadow-xs"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export type TabOption<T extends string> = {
  value: T;
  label: ReactNode;
  /** Icone acima do rotulo (floating) ou antes dele (pill). */
  icon?: ReactNode;
  /** Contagem a direita do rotulo (pill): passe um <Count>. */
  count?: ReactNode;
};

/**
 * Abas em pastilha.
 *
 * `pill` (padrao): trilho sunken com a aba ativa elevada, para trocar de vista
 * dentro de uma regiao. `floating`: barra de navegacao flutuante no rodape
 * (celular), raised com sombra grande e fundo desfocado, icone sobre rotulo —
 * so em barra curta e fixa (blur e caro). Posicionar e com quem usa
 * (`fixed bottom-md inset-x-md` ou dentro de um mock).
 */
export function TabBar<T extends string>({
  value,
  onChange,
  options,
  variant = "pill",
  label = "Abas",
  className = "",
}: {
  value: T;
  onChange: (value: T) => void;
  options: TabOption<T>[];
  variant?: "pill" | "floating";
  /** Rotulo acessivel da lista de abas. */
  label?: string;
  className?: string;
}) {
  const floating = variant === "floating";
  return (
    <div
      role="tablist"
      aria-label={label}
      style={floating ? FLOATING_TRACK_STYLE : TRACK_STYLE}
      className={
        floating
          ? `santo-edge flex min-w-0 items-center justify-around gap-3xs bg-surface-raised shadow-lg backdrop-blur-md ${className}`
          : `inline-flex max-w-full min-w-0 items-center gap-3xs overflow-x-auto bg-surface-sunken scrollbar-bare ${className}`
      }
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(o.value)}
            style={ITEM_STYLE}
            className={`santo-transition-elevation flex shrink-0 cursor-pointer items-center justify-center whitespace-nowrap ${
              floating
                ? `santo-caption-semibold min-w-(--santo-dimension-size-56) flex-1 flex-col gap-3xs px-sm py-xs ${
                    active ? "bg-brand-subtle-default text-text-brand" : "text-text-tertiary hover:text-text-primary"
                  }`
                : `santo-body-small-medium h-(--santo-dimension-size-32) gap-xs px-md ${
                    active
                      ? "bg-surface-raised text-text-primary shadow-xs"
                      : "text-text-secondary hover:text-text-primary"
                  }`
            }`}
          >
            {o.icon}
            {o.label}
            {!floating && o.count}
          </button>
        );
      })}
    </div>
  );
}
