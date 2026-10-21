import type { CSSProperties, ReactNode } from "react";
import type { ShadowName } from "@/lib/tokens";
import { RADIUS_CONTROL_VAR, RADIUS_TRACK_VAR } from "./radius";
import { OVERLINE } from "./text-class";

/**
 * Cartao: superficie que agrupa um assunto so.
 *
 * Profundidade por TOM (skill santo-ui-craft): chao (page/sunken) -> cartao
 * (raised). Sem borda 1px visivel por padrao: o contorno e `santo-edge`,
 * invisivel no claro e hairline no escuro, onde a sombra some. `variant`
 * escolhe o papel — nunca ajuste solto na tela:
 *   raised    (padrao) nivel 1: surface/raised + sombra ambiente, raio xl. O cartao da pagina.
 *             Dentro de uma moldura `sunken` vira radius/lg sozinho (irmao do trilho).
 *   sunken    nivel 0: MOLDURA que contem cartoes e trilho (canvas de app). Raio
 *             concentrico: o do filho (lg) + o padding.
 *   outlined  so contorno (border/default): opcao escolhida, sem fundo nem sombra.
 *   dashed    contorno tracejado: lugar vazio, alvo de "adicionar".
 *   double    moldura (chao) + painel (cartao): cabecalho e rodape na moldura.
 *   well/inset GRUPO sem caixa (regra do Pedro, 2026-10-19: nada de box escuro
 *             em volta de tile, Stat, KeyValue ou lista dentro de cartao). So
 *             empilha com o gap do padding; separe por espaco ou Divider. Poco
 *             de verdade so em campo (Input/Textarea `well`) e codigo (CodeBlock).
 *
 * Equilibrio de raio (skill santo-ui-craft §3): moldura justa = filho + padding;
 * filhos de um cartao folgado (padding >= raio) levam o degrau da familia deles
 * — o piso do raio interno e o raio de controle, nunca abaixo.
 */

export type CardVariant = "raised" | "well" | "inset" | "sunken" | "outlined" | "dashed" | "double";
export type CardPadding = "xs" | "sm" | "md" | "lg";
export type CardRadius = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";

const SURFACE: Record<CardVariant, string> = {
  raised: "santo-edge bg-surface-raised",
  well: "",
  inset: "",
  sunken: "bg-surface-sunken",
  outlined: "border-thin border-border-default",
  dashed: "border-thin border-dashed border-border-default",
  double: "santo-edge bg-surface-sunken",
};

const PADDING: Record<CardPadding, string> = {
  xs: "gap-xs p-xs",
  sm: "gap-xs p-sm",
  md: "gap-sm p-md",
  lg: "gap-md p-lg",
};

/** Grupo sem caixa (well/inset): so o ritmo do padding pedido, sem fundo nem recuo. */
const GROUP_GAP: Record<CardPadding, string> = { xs: "gap-xs", sm: "gap-xs", md: "gap-sm", lg: "gap-md" };

/** Variantes que viraram grupo sem caixa: nao tem raio, fundo nem padding. */
const GROUP = new Set<CardVariant>(["well", "inset"]);

/**
 * Raio interno exposto aos filhos: --santo-card-inner-radius =
 * max(raio de controle, raio - padding). Concentrico quando a moldura e justa;
 * num cartao folgado o filho fica no degrau de controle, igual aos irmaos
 * (botao, campo, codigo). Sem padding, o proprio raio (filho colado herda).
 */
function innerRadius(radius: string, pad: CardPadding | null) {
  return pad ? `max(${RADIUS_CONTROL_VAR}, calc(${radius} - var(--santo-space-${pad})))` : radius;
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
  contentRadius,
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
  /** Raio explicito (token). Sem ele, o raio sai da regra de equilibrio. */
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
  /**
   * Moldura que NASCE do filho (regra do raio aninhado): o raio do conteúdo,
   * em token, e a moldura vira conteudo + padding. Para quem embrulha uma peca
   * de raio conhecido (preview em iframe com um Card xl dentro): com xl e
   * padding xs a moldura e 16 + 8 = 24. Expoe o mesmo raio aos filhos.
   */
  contentRadius?: CardRadius;
}) {
  if (variant === "double") {
    return (
      <DoubleCard className={className} radius={radius} padded={padded} padding={padding} header={header} footer={footer} footerFlush={footerFlush}>
        {children}
      </DoubleCard>
    );
  }
  if (GROUP.has(variant)) {
    return <div className={`flex min-w-0 flex-col ${GROUP_GAP[padding ?? "md"]} ${className}`}>{children}</div>;
  }
  const pad = padded ? (padding ?? (variant === "raised" ? "lg" : "md")) : null;
  const style: CSSProperties & Record<string, string> = {};
  let own: string;
  if (contentRadius !== undefined) {
    const child = `var(--santo-radius-${contentRadius})`;
    own = pad ? `calc(${child} + var(--santo-space-${pad}))` : child;
    style.borderRadius = own;
    style["--santo-card-inner-radius"] = child;
    style["--santo-card-nested"] = "initial";
    if (variant === "raised") style.boxShadow = `var(--santo-shadow-${elevation})`;
    return (
      <div className={`flex min-w-0 flex-col ${SURFACE[variant]} ${pad ? PADDING[pad] : ""} ${className}`} style={style}>
        {children}
      </div>
    );
  }
  if (radius !== undefined) own = `var(--santo-radius-${radius})`;
  else if (variant === "sunken") {
    // Moldura de cartoes: o filho (raised) vira lg, a moldura = lg + padding.
    own = pad ? `calc(${RADIUS_TRACK_VAR} + var(--santo-space-${pad}))` : RADIUS_TRACK_VAR;
  } else own = "var(--santo-card-nested, var(--santo-radius-xl))";
  style.borderRadius = own;
  style["--santo-card-inner-radius"] = innerRadius(own, pad);
  // Moldura avisa os cartoes filhos; um cartao avisa os netos que ja nao estao na moldura.
  style["--santo-card-nested"] = variant === "sunken" ? RADIUS_TRACK_VAR : "initial";
  if (variant === "raised") style.boxShadow = `var(--santo-shadow-${elevation})`;
  return (
    <div className={`flex min-w-0 flex-col ${SURFACE[variant]} ${pad ? PADDING[pad] : ""} ${className}`} style={style}>
      {children}
    </div>
  );
}

/**
 * Borda dupla (regra do Pedro): moldura no tom do chao (surface/sunken) com um
 * PAINEL raised recuado por space/xs e sombra curta — o painel e a pastilha
 * elevada da moldura. Cabecalho e rodape ficam na moldura; o conteudo vive no
 * painel. Para o que agrupa varias coisas: demo, playground, modal, paleta de
 * busca, gaveta. Raio concentrico de dentro para fora: painel radius/lg,
 * moldura = painel + recuo + fio (`radius` explicito inverte: painel = moldura - recuo).
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
  radius?: CardRadius;
  padded: boolean;
  padding?: CardPadding;
  header?: ReactNode;
  footer?: ReactNode;
  footerFlush: boolean;
}) {
  // Recuo real = p-xs + o fio do santo-edge (1px): painel e moldura concentricos.
  const inset = "var(--santo-space-xs) + var(--santo-border-thin)";
  const outer = radius ? `var(--santo-radius-${radius})` : `calc(${RADIUS_TRACK_VAR} + ${inset})`;
  const panel = radius ? `max(${RADIUS_CONTROL_VAR}, calc(${outer} - ${inset}))` : RADIUS_TRACK_VAR;
  const pad = padded ? (padding ?? "lg") : null;
  const panelStyle: CSSProperties & Record<string, string> = {
    borderRadius: panel,
    boxShadow: "var(--santo-shadow-xs)",
    "--santo-card-inner-radius": pad ? `max(${RADIUS_CONTROL_VAR}, calc(${panel} - var(--santo-space-${pad})))` : panel,
    "--santo-card-nested": "initial",
  };
  return (
    <div
      className={`flex min-w-0 flex-col gap-xs ${SURFACE.double} p-xs ${className}`}
      style={
        {
          borderRadius: outer,
          boxShadow: "var(--santo-shadow-sm)",
          // Cabecalho e rodape vivem na moldura: controles deles no degrau de controle.
          "--santo-card-inner-radius": RADIUS_CONTROL_VAR,
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
  // Escala do numero (Pedro: numeros menores, na base): sm heading-6 (24), md
  // heading-5 (30, padrao de cartao), lg heading-3 (48, so o numero da tela).
  const valueClass = { sm: "santo-heading-6-bold", md: "santo-heading-5-bold", lg: "santo-heading-3-bold" }[size];
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
