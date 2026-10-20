"use client";

import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

export type CardGridBreakpoint = "base" | "sm" | "md" | "lg" | "xl" | "2xl";
export type CardGridColumns = 1 | 2 | 3 | 4 | 8 | 12;

/** Classes literais (o Tailwind so gera o que le no fonte). */
const COLS: Record<CardGridBreakpoint, Record<CardGridColumns, string>> = {
  base: { 1: "grid-cols-1", 2: "grid-cols-2", 3: "grid-cols-3", 4: "grid-cols-4", 8: "grid-cols-8", 12: "grid-cols-12" },
  sm: { 1: "sm:grid-cols-1", 2: "sm:grid-cols-2", 3: "sm:grid-cols-3", 4: "sm:grid-cols-4", 8: "sm:grid-cols-8", 12: "sm:grid-cols-12" },
  md: { 1: "md:grid-cols-1", 2: "md:grid-cols-2", 3: "md:grid-cols-3", 4: "md:grid-cols-4", 8: "md:grid-cols-8", 12: "md:grid-cols-12" },
  lg: { 1: "lg:grid-cols-1", 2: "lg:grid-cols-2", 3: "lg:grid-cols-3", 4: "lg:grid-cols-4", 8: "lg:grid-cols-8", 12: "lg:grid-cols-12" },
  xl: { 1: "xl:grid-cols-1", 2: "xl:grid-cols-2", 3: "xl:grid-cols-3", 4: "xl:grid-cols-4", 8: "xl:grid-cols-8", 12: "xl:grid-cols-12" },
  "2xl": {
    1: "2xl:grid-cols-1",
    2: "2xl:grid-cols-2",
    3: "2xl:grid-cols-3",
    4: "2xl:grid-cols-4",
    8: "2xl:grid-cols-8",
    12: "2xl:grid-cols-12",
  },
};

const GAP = { sm: "gap-sm", md: "gap-md", lg: "gap-lg", "2xl": "gap-2xl" } as const;
const GAP_VAR = {
  sm: "var(--santo-space-sm)",
  md: "var(--santo-space-md)",
  lg: "var(--santo-space-lg)",
  "2xl": "var(--santo-space-2xl)",
} as const;

/** Largura minima da celula na grade automatica (auto-fill): degrau de dimension. */
const MIN_ITEM = {
  "space-192": "var(--santo-dimension-space-192)",
  "container-sm": "var(--santo-dimension-container-sm)",
} as const;

/** Passo das linhas do masonry: o menor degrau de espaco, para o vao vertical errar no maximo isso. */
const ROW_STEP = "var(--santo-space-3xs)";

/**
 * Grade de cartoes e de pecas irmas. Use para TODA fileira de Card, LinkCard,
 * TokenSample, demo — tela de app/ nao monta `grid` inline (lib:check, regra C).
 *
 * Regra do Pedro (sem margem morta): cada cartao tem a altura do seu conteudo e
 * nao sobra chao entre um cartao e o de baixo. Por padrao a grade e MASONRY:
 * linhas de `space/3xs` e cada filho ocupa tantas linhas quanto a sua altura
 * medida (ResizeObserver), entao os cartoes empilham por coluna sem vao. A
 * ordem e a do DOM (esquerda → direita, de cima para baixo, como o foco anda);
 * `col-span-*` no filho continua valendo; `row-span-*` e ignorado (a altura manda). Limitacao: precisa de JS — antes de
 * hidratar (ou sem JS) a grade e a comum, alinhada ao topo, com vao entre
 * fileiras; e um filho que ocupa todas as colunas espera a coluna mais alta.
 *
 * `masonry={false}` = GRADE FIXA: colunas de largura igual, uma calha so,
 * topos alinhados por fileira e `col-span-*` previsivel. Use em composicao com
 * spans (painel de app, preview de marca) e em pecas de altura igual
 * (miniaturas, amostras, demos). Masonry com span misturado desalinha. `columns` por breakpoint (`{ md: 2, "2xl": 3 }`,
 * base 1); `minItem` troca as colunas fixas por auto-fill com celula minima de token.
 */
export function CardGrid({
  children,
  columns = { md: 2, "2xl": 3 },
  minItem,
  autoFit = false,
  gap = "lg",
  masonry = true,
  stretch = false,
  className = "",
}: {
  children: ReactNode;
  /** Colunas por breakpoint. Sem `base`, comeca em 1. */
  columns?: Partial<Record<CardGridBreakpoint, CardGridColumns>>;
  /** Grade automatica: quantas couberem com esta largura minima (ignora `columns`). */
  minItem?: keyof typeof MIN_ITEM;
  /** Com `minItem`: auto-fit (colunas vazias somem e o item ocupa a linha) em vez de auto-fill. */
  autoFit?: boolean;
  gap?: keyof typeof GAP;
  /** Empilha por coluna sem vao (padrao). Desligue para pecas de altura igual. */
  masonry?: boolean;
  /**
   * Grade fixa (`masonry={false}`) com a fileira na MESMA altura: so para irmaos da
   * mesma natureza — indice de cartoes de navegacao (LinkCard), onde o conteudo
   * do cartao cresce para preencher (lista de links estica). Conteudo
   * heterogeneo nunca: use masonry (sem margem morta).
   */
  stretch?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    const grid = ref.current;
    if (!masonry || !grid) return;
    const layout = () => {
      const cs = getComputedStyle(grid);
      const step = parseFloat(cs.gridAutoRows);
      const gapPx = parseFloat(cs.columnGap);
      if (!step) return;
      for (const el of Array.from(grid.children) as HTMLElement[]) {
        const h = el.getBoundingClientRect().height;
        // O vao vertical vem do span (linhas sem row-gap): altura + gap, arredondado para cima.
        // grid-row inteiro: um row-span-* no filho nao briga com a medida.
        el.style.gridRow = `span ${Math.max(1, Math.ceil((h + gapPx) / step))}`;
      }
    };
    const ro = new ResizeObserver(layout);
    ro.observe(grid);
    for (const el of Array.from(grid.children)) ro.observe(el);
    setReady(true);
    layout();
    return () => {
      ro.disconnect();
      for (const el of Array.from(grid.children) as HTMLElement[]) el.style.gridRow = "";
    };
  }, [masonry, children]);

  const cols = minItem
    ? ""
    : (["base", "sm", "md", "lg", "xl", "2xl"] as const)
        .map((bp) => {
          const n = bp === "base" ? (columns.base ?? 1) : columns[bp];
          return n ? COLS[bp][n] : "";
        })
        .filter(Boolean)
        .join(" ");
  const style: CSSProperties = {};
  if (minItem) {
    style.gridTemplateColumns = `repeat(${autoFit ? "auto-fit" : "auto-fill"}, minmax(min(100%, ${MIN_ITEM[minItem]}), 1fr))`;
  }
  if (masonry && ready) {
    style.gridAutoRows = ROW_STEP;
    style.rowGap = 0;
    style.columnGap = GAP_VAR[gap];
    // Cada span inclui o gap de baixo; o ultimo de cada coluna deixaria um gap
    // sobrando no fim da grade (margem morta). Devolve esse gap.
    style.marginBottom = `calc(-1 * ${GAP_VAR[gap]})`;
  }
  return (
    <div ref={ref} className={`grid min-w-0 ${stretch && !masonry ? "items-stretch" : "items-start"} ${GAP[gap]} ${cols} ${className}`} style={style}>
      {children}
    </div>
  );
}
