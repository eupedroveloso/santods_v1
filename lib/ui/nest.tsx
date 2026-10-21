"use client";

import type { CSSProperties, ElementType, ReactNode } from "react";
import { nestInset, type NestInset } from "./radius";
import { NestScope, useNest } from "./use-nest";

/** O Nest e coluna flex, salvo quando quem usa ja escolhe o display (hidden lg:flex, grid). */
const HAS_DISPLAY = /(^|\s)([a-z0-9]+:)*(hidden|flex|inline-flex|grid|block|contents)(\s|$)/;

/**
 * Moldura aninhada — o mecanismo que mantem a boa relacao entre raio e recuo
 * em qualquer profundidade (regra do Pedro). A moldura tem UM recuo (token de
 * espaco) igual nos quatro lados e entre as faixas (cabecalho, painel,
 * rodape); o filho recebe raio = externo − recuo (piso radius/xs; em moldura
 * folgada, o de controle — nestInner em radius.ts), sem escolher raio a mao: componentes da lib leem pelo contexto, elementos soltos usam a
 * classe `santo-nested` (border-radius: var(--santo-inner-radius)). Um Nest
 * dentro de outro recalcula no proprio nivel.
 *
 * Use para agrupar: painel dentro de moldura, preview dentro de cartao, lista
 * dentro de popover. O Card ja e um Nest; use este primitivo onde o agrupador
 * nao e um Card.
 */
export function Nest({
  as: Tag = "div",
  inset = "xs",
  radius,
  child,
  edge = false,
  className = "",
  style,
  children,
  ...rest
}: {
  as?: ElementType;
  /** Recuo unico, nos quatro lados e entre as faixas. */
  inset?: NestInset;
  /** Fixa o raio externo (expressao CSS ou token: "var(--santo-radius-lg)"). */
  radius?: string;
  /** O externo nasce do filho: externo = child + recuo. */
  child?: string;
  /** A moldura tem fio (santo-edge): o fio entra no recuo. */
  edge?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
} & Record<string, unknown>) {
  const frame = useNest({ inset, radius, child, edge });
  return (
    <Tag
      {...rest}
      className={`santo-nest ${HAS_DISPLAY.test(className) ? "" : "flex"} ${className}`}
      style={{ ...frame.style, ["--santo-nest-inset" as string]: nestInset(inset), ["--santo-nest-gap" as string]: `calc(${frame.inset})`, ...style }}
    >
      <NestScope inner={frame.inner}>{children}</NestScope>
    </Tag>
  );
}
