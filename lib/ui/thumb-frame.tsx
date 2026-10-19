import type { CSSProperties, ReactNode } from "react";

/* Grade de fundo: linhas border/subtle a cada space/md, apagando para as bordas
   com um degrade da propria cor do poco por cima. Uma camada so, sem mascara;
   inline e nao @utility porque e a unica moldura que usa — e so tokens. */
const LINE = "var(--santo-color-border-subtle) var(--santo-border-thin), transparent var(--santo-border-thin)";
const GRID: CSSProperties = {
  backgroundImage:
    "radial-gradient(ellipse at center, transparent, var(--santo-color-surface-sunken) 75%)," +
    `linear-gradient(to right, ${LINE}),` +
    `linear-gradient(to bottom, ${LINE})`,
  backgroundSize: "100% 100%, var(--santo-space-md) var(--santo-space-md), var(--santo-space-md) var(--santo-space-md)",
  backgroundPosition: "center",
};

/**
 * Prancheta da ilustracao em px de desenho: 320 x 200 (16:10). O SVG escala a
 * prancheta inteira para a largura da moldura, entao cartao e formas mantem a
 * mesma proporcao em qualquer card. O cartao tem 176 x 112 fixos em toda
 * miniatura (55% x 56%), conteudo centrado, a pelo menos space/lg da borda.
 */
const BOARD = { w: 320, h: 200 } as const;

/**
 * Moldura de ilustracao: poco sunken 16:10 com grade sutil e um cartao
 * pequeno no centro, onde as formas de Skeleton desenham a anatomia.
 *
 * Use so para miniatura de componente (lib/thumbs) e afins — uma vitrine.
 * O desenho escala com a moldura: toda miniatura tem o cartao no mesmo tamanho
 * relativo, e a fileira le como um conjunto. O cartao e flex em coluna com
 * gap xs; para outra disposicao, aninhe um div de layout. Decorativa: fica
 * fora da arvore de acessibilidade. Sem raio proprio: quem a envolve recorta.
 */
export function ThumbFrame({
  children,
  pad = "sm",
  label,
}: {
  children: ReactNode;
  /** Respiro do cartao: `sm` para conteudo denso, `md` para peca isolada. */
  pad?: "sm" | "md";
  /** Rotulo minusculo em mono no canto. Raro: o titulo do card ja nomeia. */
  label?: string;
}) {
  return (
    <div aria-hidden="true" className="relative aspect-16/10 w-full overflow-hidden bg-surface-sunken" style={GRID}>
      {label && <span className="santo-code-sm absolute left-xs top-xs text-text-tertiary">{label}</span>}
      <svg viewBox={`0 0 ${BOARD.w} ${BOARD.h}`} className="absolute inset-0 size-full">
        <foreignObject width={BOARD.w} height={BOARD.h}>
          <div className="flex size-full items-center justify-center p-lg">
            <div
              data-thumb-card
              className={`flex h-(--santo-dimension-space-112) w-(--santo-dimension-space-176) flex-col justify-center gap-xs rounded-sm bg-surface-raised shadow-sm ${
                pad === "sm" ? "p-sm" : "p-md"
              }`}
            >
              {children}
            </div>
          </div>
        </foreignObject>
      </svg>
    </div>
  );
}
