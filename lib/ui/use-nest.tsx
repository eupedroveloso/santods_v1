"use client";

/*
 * Mecanismo de aninhamento (hook, sem componente proprio): contexto do raio
 * interno, a conta de uma moldura e o provedor. Primitivos (Card, Select,
 * Segmented) usam daqui; o componente Nest (nest.tsx) e a forma pronta.
 */

import { createContext, useContext, type CSSProperties, type ReactNode } from "react";
import { nestInner, nestInset, type NestInset } from "./radius";

/** Raio interno da moldura mais proxima, como expressao CSS de tokens (null = fora de moldura). */
const NestContext = createContext<string | null>(null);

/** Raio que a moldura de cima oferece ao filho; fora de moldura, o padrao dado. */
export function useNestRadius(fallback = "var(--santo-radius-xl)"): string {
  return useContext(NestContext) ?? fallback;
}

export type NestFrame = {
  /** Raio da propria moldura (expressao CSS). */
  outer: string;
  /** Raio que ela entrega aos filhos (nestInner): outer − recuo; em moldura folgada, o de controle. */
  inner: string;
  /** Recuo real (expressao CSS), o mesmo nos quatro lados e entre as faixas. */
  inset: string;
  /** borderRadius + --santo-inner-radius, para o elemento da moldura. */
  style: CSSProperties;
};

/**
 * Conta de uma moldura. `radius` fixa o externo (expressao CSS); `child` faz o
 * externo NASCER do filho (externo = filho + recuo); sem os dois, o externo e
 * o que a moldura de cima oferece (ou `fallback`). `edge`: a moldura tem o fio
 * santo-edge, que entra no recuo.
 */
export function useNest({
  inset,
  radius,
  child,
  edge = false,
  fallback,
}: {
  inset: NestInset;
  radius?: string;
  child?: string;
  edge?: boolean;
  fallback?: string;
}): NestFrame {
  const parent = useContext(NestContext);
  const offered = parent ?? fallback ?? "var(--santo-radius-xl)";
  const real = nestInset(inset, edge);
  // Moldura que nasce do filho tambem nao passa do que a moldura de cima oferece
  // (o externo e sempre maior, em qualquer nivel).
  const grown = child ? `calc(${child} + ${real})` : null;
  const outer = radius ?? (grown ? (parent ? `min(${grown}, ${parent})` : grown) : offered);
  const inner = grown && !parent && !radius ? (child as string) : nestInner(outer, real);
  return {
    outer,
    inner,
    inset: real,
    style: { borderRadius: outer, ["--santo-inner-radius" as string]: inner },
  };
}

/** Entrega o raio interno aos componentes de dentro (Card, Nest, CodeBlock…). */
export function NestScope({ inner, children }: { inner: string; children: ReactNode }) {
  return <NestContext.Provider value={inner}>{children}</NestContext.Provider>;
}

