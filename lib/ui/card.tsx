import type { CSSProperties, ReactNode } from "react";
import type { ShadowName } from "@/lib/tokens";
import { OVERLINE } from "./text-class";

/**
 * Cartao: superficie que agrupa um assunto so.
 *
 * Profundidade por TOM (skill santo-ui-craft): chao (page/sunken) -> cartao
 * (raised) -> poco (sunken dentro do raised). Sem borda 1px visivel por padrao:
 * o contorno e `santo-edge`, invisivel no claro e hairline no escuro, onde a
 * sombra some. `variant` escolhe o papel — nunca ajuste solto na tela:
 *   raised    (padrao) nivel 1: surface/raised + sombra ambiente, raio xl. O cartao da pagina.
 *   well      nivel 2: poco DENTRO de um cartao (surface/sunken, sem contorno),
 *             raio = raio interno do pai. Campo, lista embutida, slot de grafico.
 *   inset     bloco dentro de um cartao no tom do chao (surface/page), raio do pai.
 *   sunken    nivel 0: regiao rebaixada que contem cartoes (canvas, trilho).
 *   outlined  so contorno (border/default): opcao escolhida, sem fundo nem sombra.
 *   dashed    contorno tracejado: lugar vazio, alvo de "adicionar".
 *   double    moldura (chao) + painel (cartao): cabecalho e rodape na moldura.
 */

export type CardVariant = "raised" | "well" | "inset" | "sunken" | "outlined" | "dashed" | "double";
export type CardPadding = "sm" | "md" | "lg";
export type CardRadius = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";

const SURFACE: Record<CardVariant, string> = {
  raised: "santo-edge bg-surface-raised",
  well: "bg-surface-sunken",
  inset: "bg-surface-page",
  sunken: "bg-surface-sunken",
  outlined: "border-thin border-border-default",
  dashed: "border-thin border-dashed border-border-default",
  double: "santo-edge bg-surface-sunken",
};

const PADDING: Record<CardPadding, string> = {
  sm: "gap-xs p-sm",
  md: "gap-sm p-md",
  lg: "gap-md p-lg",
};

/** Raio padrao: radius/xl (16) no maximo (Pedro). well e inset nao tem: herdam o raio interno do pai. */
const DEFAULT_RADIUS: Record<Exclude<CardVariant, "inset" | "well">, CardRadius> = {
  raised: "xl",
  sunken: "xl",
  outlined: "xl",
  dashed: "xl",
  double: "xl",
};

/** Os que leem o raio do pai (nivel 2): nao redefinem a var que leem. */
const NESTED = new Set<CardVariant>(["well", "inset"]);

/**
 * Raio aninhado (regra do Pedro): o Card expoe a seus filhos o raio interno
 * --santo-card-inner-radius = max(radius/xs, raio - padding); sem padding, o
 * proprio raio (filho colado herda o do pai). well/inset leem esse valor do
 * pai e por isso nao o redefinem.
 */
function innerRadius(radius: string, pad: CardPadding | null) {
  return pad ? `max(var(--santo-radius-xs), calc(${radius} - var(--santo-space-${pad})))` : radius;
}

export function Card({
  children,
  className = "",
  variant = "raised",
  elevation = "sm",
  padded = true,
  padding,
  radius,
  header,
  footer,
  footerFlush = false,
}: {
  children: ReactNode;
  className?: string;
  variant?: CardVariant;
  /** Sombra ambiente — so no raised. `sm` em repouso, `lg` em destaque. */
  elevation?: ShadowName;
  /** Desligue quando o conteudo precisar encostar na borda (tabela, imagem). */
  padded?: boolean;
  /** Densidade do preenchimento. Padrao: lg no raised e no double, md nas demais. */
  padding?: CardPadding;
  /** Raio explicito (token). Moldura que envolve cartoes: raio do filho + padding. */
  radius?: CardRadius;
  /** double: cabecalho na moldura, fora do painel. */
  header?: ReactNode;
  /** double: rodape na moldura, fora do painel (CardFooter). */
  footer?: ReactNode;
  /**
   * double: rodape com a largura e o raio do PAINEL (bloco de codigo sob um
   * preview), em vez do recuo de acoes. Bordas coincidem com as do painel.
   */
  footerFlush?: boolean;
}) {
  if (variant === "double") {
    return (
      <DoubleCard className={className} radius={radius ?? "xl"} padded={padded} padding={padding} header={header} footer={footer} footerFlush={footerFlush}>
        {children}
      </DoubleCard>
    );
  }
  const pad = padded ? (padding ?? (variant === "raised" ? "lg" : "md")) : null;
  const own =
    radius !== undefined
      ? `var(--santo-radius-${radius})`
      : NESTED.has(variant)
        ? "var(--santo-card-inner-radius, var(--santo-radius-xl))"
        : `var(--santo-radius-${DEFAULT_RADIUS[variant as keyof typeof DEFAULT_RADIUS]})`;
  const style: CSSProperties & Record<string, string> = { borderRadius: own };
  if (!NESTED.has(variant) || radius !== undefined) style["--santo-card-inner-radius"] = innerRadius(own, pad);
  if (variant === "raised") style.boxShadow = `var(--santo-shadow-${elevation})`;
  return (
    <div className={`flex min-w-0 flex-col ${SURFACE[variant]} ${pad ? PADDING[pad] : ""} ${className}`} style={style}>
      {children}
    </div>
  );
}

/**
 * Borda dupla (regra do Pedro): moldura no tom do chao (surface/sunken, raio
 * grande) com um PAINEL raised recuado por space/xs, raio = externo - recuo e
 * sombra curta — o painel e a pilula elevada da moldura. Cabecalho e rodape
 * ficam na moldura; o conteudo vive no painel. Para o que agrupa varias
 * coisas: demo, playground, modal, paleta de busca, gaveta.
 */
function DoubleCard({
  children,
  className,
  radius,
  padded,
  padding,
  header,
  footer,
  footerFlush,
}: {
  children: ReactNode;
  className: string;
  radius: CardRadius;
  padded: boolean;
  padding?: CardPadding;
  header?: ReactNode;
  footer?: ReactNode;
  footerFlush: boolean;
}) {
  const outer = `var(--santo-radius-${radius})`;
  // Recuo real = p-xs + o fio do santo-edge (1px): o painel fica concentrico.
  const panel = `max(var(--santo-radius-xs), calc(${outer} - var(--santo-space-xs) - var(--santo-border-thin)))`;
  const pad = padded ? (padding ?? "lg") : null;
  const panelStyle: CSSProperties & Record<string, string> = {
    borderRadius: panel,
    boxShadow: "var(--santo-shadow-xs)",
    "--santo-card-inner-radius": pad ? `max(var(--santo-radius-xs), calc(${panel} - var(--santo-space-${pad})))` : panel,
  };
  return (
    <div
      className={`flex min-w-0 flex-col gap-xs ${SURFACE.double} p-xs ${className}`}
      style={
        {
          borderRadius: outer,
          boxShadow: "var(--santo-shadow-sm)",
          // Cabecalho e rodape vivem na moldura a space/xs + space/md da borda.
          "--santo-card-inner-radius": `max(var(--santo-radius-xs), calc(${outer} - var(--santo-space-xs) - var(--santo-space-md)))`,
        } as CSSProperties
      }
    >
      {/* px-md: com o p-xs da moldura, o conteudo do cabecalho e do rodape fica
          fora da zona arredondada do canto (raio aninhado). */}
      {header && <div className="flex min-w-0 items-center gap-sm px-md pt-2xs">{header}</div>}
      <div
        className={`santo-edge flex min-h-0 min-w-0 flex-1 flex-col bg-surface-raised ${pad ? PADDING[pad] : ""}`}
        style={panelStyle}
      >
        {children}
      </div>
      {footer &&
        (footerFlush ? (
          // Mesma largura do painel (o p-xs da moldura) e o mesmo raio dele.
          <div className="flex min-w-0" style={{ "--santo-card-inner-radius": panel } as CSSProperties}>
            {footer}
          </div>
        ) : (
          <div className="flex min-w-0 items-center gap-sm px-md pb-2xs">{footer}</div>
        ))}
    </div>
  );
}

/** Rodape de cartao: acoes alinhadas a direita (na moldura do Card double, ou no fim de um Card). */
export function CardFooter({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`flex min-w-0 flex-1 items-center justify-end gap-sm ${className}`}>{children}</div>;
}

/**
 * Cabecalho de cartao: titulo + META na mesma linha (data, contagem, status —
 * Count, Tag ou caption), acao no canto. Sem subhead: `description` existe por
 * compatibilidade e deve ser rara (regra do Pedro).
 */
export function CardHeader({
  title,
  meta,
  leading,
  description,
  action,
  className = "",
}: {
  title: ReactNode;
  /** Ao lado do titulo, na mesma linha: Count, Tag, "há 2 min". */
  meta?: ReactNode;
  /** Antes do titulo: IconTile, Avatar. */
  leading?: ReactNode;
  /** Evite (zero subhead). Mantido por compatibilidade. */
  description?: ReactNode;
  /** Canto superior direito: IconButton ghost, Segmented, menu. */
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-between gap-sm ${className}`}>
      <div className="flex min-w-0 items-center gap-sm">
        {leading && <span className="shrink-0">{leading}</span>}
        <div className="flex min-w-0 flex-col gap-3xs">
          <div className="flex min-w-0 items-baseline gap-xs">
            <h3 className="santo-body-large-semibold min-w-0 text-pretty break-words">{title}</h3>
            {meta && <span className="santo-caption-medium flex shrink-0 items-center gap-2xs text-text-tertiary tabular-nums">{meta}</span>}
          </div>
          {description && <p className="santo-body-small-regular text-text-secondary">{description}</p>}
        </div>
      </div>
      {action && <div className="flex shrink-0 items-center gap-2xs">{action}</div>}
    </div>
  );
}

/**
 * Metrica: rotulo curto, NUMERO grande com UNIDADE pequena embaixo e um slot de
 * micro-visualizacao a direita (Ring, Sparkline, MiniBars — um acento so).
 * O numero e o protagonista do cartao; `delta` vai como Tag ao lado do rotulo
 * ou como texto curto sob a unidade.
 */
export function Stat({
  label,
  value,
  unit,
  delta,
  viz,
  action,
  size = "md",
  className = "",
}: {
  label: ReactNode;
  value: ReactNode;
  /** Unidade/legenda pequena sob o numero: "pedidos", "R$ mil", "/ mes". */
  unit?: ReactNode;
  delta?: ReactNode;
  /** Micro-visualizacao a direita do numero: <Ring/>, <Sparkline/>, <MiniBars/>. */
  viz?: ReactNode;
  /** Canto direito da linha do rotulo: Tag de variacao, IconButton ghost. */
  action?: ReactNode;
  /** sm para metrica secundaria, lg para o numero da tela. */
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const valueClass = { sm: "santo-heading-5-bold", md: "santo-heading-3-bold", lg: "santo-heading-1-bold" }[size];
  return (
    <div className={`flex flex-col gap-sm ${className}`}>
      <div className="flex items-center justify-between gap-sm">
        <span className="santo-body-small-medium text-text-secondary">{label}</span>
        {action}
      </div>
      {/* flex-wrap: sem largura para numero + viz lado a lado, o viz desce para a linha de baixo
          (ml-auto o mantem a direita) em vez de passar por cima do numero. */}
      <div className="flex flex-wrap items-end justify-between gap-md">
        <div className="flex min-w-0 flex-col gap-3xs">
          <span className={`${valueClass} tracking-tight whitespace-nowrap text-text-primary tabular-nums`}>{value}</span>
          {(unit || delta) && (
            <span className="santo-caption-medium flex flex-wrap items-center gap-xs text-text-tertiary">
              {unit}
              {delta}
            </span>
          )}
        </div>
        {viz && <div className="ml-auto flex shrink-0 items-end text-icon-brand">{viz}</div>}
      </div>
    </div>
  );
}

/**
 * Divisor de 1px no token de borda.
 * `vertical` separa itens numa linha (barra de ferramentas); estica na altura
 * do pai. `label` poe um rotulo curto no meio ("ou continue com").
 */
export function Divider({
  orientation = "horizontal",
  label,
  className = "",
}: {
  orientation?: "horizontal" | "vertical";
  label?: ReactNode;
  className?: string;
}) {
  if (orientation === "vertical") {
    return (
      <span
        role="separator"
        aria-orientation="vertical"
        className={`w-0 self-stretch border-l-thin border-border-subtle ${className}`}
      />
    );
  }
  if (label) {
    return (
      <div role="separator" className={`flex items-center gap-sm ${className}`}>
        <span className="flex-1 border-t-thin border-border-subtle" />
        <span className={OVERLINE}>{label}</span>
        <span className="flex-1 border-t-thin border-border-subtle" />
      </div>
    );
  }
  return <hr className={`border-0 border-t-thin border-border-subtle ${className}`} />;
}
