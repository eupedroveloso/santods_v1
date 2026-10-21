"use client";

import type { CSSProperties, ReactNode } from "react";
import type { ShadowName } from "@/lib/tokens";
import { NestScope, useNest } from "./use-nest";
import { RADIUS_TRACK_VAR, nestInner, nestInset } from "./radius";
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
 *             Le os tokens de superficie (--santo-frame-*): recuo, superficie e
 *             borda do painel; com --santo-frame-enabled 0 cai para cartao.
 *   glass     vidro (santo-glass): sobre imagem ou gradiente, superficie
 *             pequena. O raised tambem vira vidro sozinho quando o DS escolhe vidro.
 *   well/inset GRUPO sem caixa (regra do Pedro, 2026-10-19: nada de box escuro
 *             em volta de tile, Stat, KeyValue ou lista dentro de cartao). So
 *             empilha com o gap do padding; separe por espaco ou Divider. Poco
 *             de verdade so em campo (Input/Textarea `well`) e codigo (CodeBlock).
 *
 * Equilibrio de raio (skill santo-ui-craft §3): e o mecanismo de aninhamento
 * (Nest) — moldura = filho + recuo, filho = max(piso, moldura − recuo).
 */

export type CardVariant = "raised" | "well" | "inset" | "sunken" | "outlined" | "dashed" | "double" | "glass";
export type CardPadding = "xs" | "sm" | "md" | "lg";
export type CardRadius = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";

const SURFACE: Record<CardVariant, string> = {
  // santo-auto-glass: vira vidro sozinho quando o DS escolhe o tratamento vidro.
  raised: "santo-edge bg-surface-raised santo-auto-glass",
  // Vidro explícito (sobre imagem, gradiente): surface.css santo-glass.
  glass: "santo-glass",
  well: "",
  inset: "",
  sunken: "bg-surface-sunken",
  outlined: "border-thin border-border-default",
  dashed: "border-thin border-dashed border-border-default",
  double: "santo-frame",
};

/** Aninhamento: o gap entre as faixas do cartao e o proprio recuo (um token so). */
const PADDING: Record<CardPadding, string> = {
  xs: "gap-xs p-xs",
  sm: "gap-sm p-sm",
  md: "gap-md p-md",
  lg: "gap-lg p-lg",
};

/** Grupo sem caixa (well/inset): so o ritmo do padding pedido, sem fundo nem recuo. */
const GROUP_GAP: Record<CardPadding, string> = { xs: "gap-xs", sm: "gap-xs", md: "gap-sm", lg: "gap-md" };

/** Variantes que viraram grupo sem caixa: nao tem raio, fundo nem padding. */
const GROUP = new Set<CardVariant>(["well", "inset"]);

/** Fio da superficie: entra no recuo da conta de aninhamento (moldura com borda). */
const EDGE = new Set<CardVariant>(["raised", "outlined", "dashed", "double"]);

/**
 * O Card e uma moldura do mecanismo de aninhamento (nest.tsx): o recuo e o
 * padding (igual nos quatro lados), e os filhos recebem o raio
 * max(piso, externo − recuo) pelo contexto (Card, Nest, componentes) e por
 * --santo-inner-radius (elementos soltos, `santo-nested`). Sem `radius`, o
 * externo e o que a moldura de cima oferece — dentro de uma moldura `sunken`
 * o cartao vira lg sozinho; fora de moldura, xl.
 */
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
  /** Densidade do preenchimento (o recuo da moldura). Padrao: lg no raised e no double, md nas demais. */
  padding?: CardPadding;
  /** Raio explicito (token). Sem ele, o raio sai da regra de aninhamento. */
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
   * Moldura que NASCE do filho: o raio do conteudo, em token, e a moldura vira
   * conteudo + recuo (preview em iframe com um Card xl dentro: xl + xs = 24).
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
  return (
    <FrameCard
      variant={variant}
      elevation={elevation}
      pad={padded ? (padding ?? (variant === "raised" || variant === "glass" ? "lg" : "md")) : null}
      radius={radius}
      contentRadius={contentRadius}
      className={className}
    >
      {children}
    </FrameCard>
  );
}

function FrameCard({
  variant,
  elevation,
  pad,
  radius,
  contentRadius,
  className,
  children,
}: {
  variant: CardVariant;
  elevation: ShadowName;
  pad: CardPadding | null;
  radius?: CardRadius;
  contentRadius?: CardRadius;
  className: string;
  children: ReactNode;
}) {
  // Moldura de cartoes (sunken) nasce do filho lg; contentRadius nasce do filho dado.
  const child = contentRadius ? `var(--santo-radius-${contentRadius})` : variant === "sunken" && !radius ? RADIUS_TRACK_VAR : undefined;
  const frame = useNest({
    inset: pad ?? "none",
    edge: EDGE.has(variant),
    radius: radius ? `var(--santo-radius-${radius})` : undefined,
    child,
  });
  const style: CSSProperties = { ...frame.style };
  if (variant === "raised") style.boxShadow = `var(--santo-shadow-${elevation})`;
  return (
    <div className={`flex min-w-0 flex-col ${SURFACE[variant]} ${pad ? PADDING[pad] : ""} ${className}`} style={style}>
      <NestScope inner={frame.inner}>{children}</NestScope>
    </div>
  );
}

/**
 * Borda dupla (regra do Pedro): moldura no tom do chao (surface/sunken) com um
 * PAINEL raised recuado e sombra curta. Cabecalho e rodape ficam na moldura,
 * fora do painel; o conteudo vive no painel. Aninhamento (nest.tsx): UM recuo
 * (space/xs + o fio) nos quatro lados e entre cabecalho, painel e rodape;
 * painel = moldura − recuo (lg por padrao, e a moldura nasce dele).
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
  const frame = useNest({
    inset: "xs",
    edge: true,
    radius: radius ? `var(--santo-radius-${radius})` : undefined,
    child: radius ? undefined : RADIUS_TRACK_VAR,
  });
  const pad = padded ? (padding ?? "lg") : null;
  // O painel e moldura de novo: o conteudo dele recebe painel − padding − fio.
  const panelInner = nestInner(frame.inner, nestInset(pad ?? "none", true));
  const panelStyle: CSSProperties = {
    borderRadius: frame.inner,
    ["--santo-inner-radius" as string]: panelInner,
  };
  return (
    <div
      className={`flex min-w-0 flex-col ${SURFACE.double} ${className}`}
      style={{
        ...frame.style,
        // Recuo, fio e sombra vem do santo-frame (tokens de superficie; somem sem moldura).
        gap: `calc(${frame.inset})`,
      }}
    >
      <NestScope inner={frame.inner}>
        {/* Faixas da moldura: no mesmo recuo do painel (mesma largura, mesmo gap). */}
        {header && <div className="flex min-w-0 items-center gap-sm">{header}</div>}
        <div className={`santo-frame-panel flex min-h-0 min-w-0 flex-1 flex-col ${pad ? PADDING[pad] : ""}`} style={panelStyle}>
          <NestScope inner={panelInner}>{children}</NestScope>
        </div>
        {footer &&
          (footerFlush ? (
            // Mesma largura e raio do painel.
            <div className="flex min-w-0">{footer}</div>
          ) : (
            <div className="flex min-w-0 items-center gap-sm">{footer}</div>
          ))}
      </NestScope>
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
