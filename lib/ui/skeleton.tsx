import type { ReactNode } from "react";

/*
 * Formas de esqueleto: o vocabulario das ilustracoes de componente (lib/thumbs)
 * e de qualquer placeholder de carregamento. Monocromatico de proposito — so a
 * paleta neutra, por tokens de bg/neutral, icon, border e surface. A unica forma
 * com enfase e o tom `emphasis` (acao primaria): cinza medio, um degrau acima
 * de `strong` — nunca preto nem neutro quase preto (regra do Pedro).
 *
 * Anatomia anti-generico (skill santo-ui-craft): profundidade por tom, nao por
 * contorno; controle compacto em pastilha; campo e poco; ativo e pastilha elevada.
 * Gramatica completa em .claude/skills/santo-vitrine/SKILL.md.
 */

/**
 * Tom de preenchimento, do mais apagado ao de enfase. `raised` e a cor do
 * cartao: forma clara sobre a forma de enfase (punho de switch, aba ativa).
 * `sunken` e o nivel 2 (poco, trilho): mais fundo que o cartao nos dois temas
 * — e o que deixa a pastilha elevada parecer elevada tambem no escuro.
 */
export type SkeletonTone = "sunken" | "raised" | "soft" | "base" | "strong" | "emphasis";

/* Carregamento: brilho que corre por cima do tom (lib/ui/motion.css). */
const SHIMMER = "santo-animate-shimmer";

const TONE: Record<SkeletonTone, string> = {
  sunken: "bg-surface-sunken",
  raised: "bg-surface-raised",
  soft: "bg-neutral-subtle-default",
  base: "bg-neutral-subtle-hover",
  strong: "bg-neutral-subtle-active",
  /* icon/tertiary: neutral/400 no claro, neutral/500 no escuro. */
  emphasis: "bg-icon-tertiary",
};

/**
 * Largura pela escala de espaco; `fill` ocupa o que sobra numa linha flex;
 * `fit` abraca o conteudo (trilho de nav, de abas).
 */
export type SkeletonWidth = "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "full" | "fill" | "fit";

const WIDTH: Record<SkeletonWidth, string> = {
  "2xs": "w-md",
  xs: "w-lg",
  sm: "w-2xl",
  md: "w-4xl",
  lg: "w-6xl",
  xl: "w-7xl",
  "2xl": "w-8xl",
  full: "w-full",
  fill: "min-w-0 flex-1",
  fit: "w-fit",
};

/** Altura de bloco pela escala de espaco. */
export type SkeletonHeight = "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full";

const HEIGHT: Record<SkeletonHeight, string> = {
  "2xs": "h-2xs",
  xs: "h-xs",
  sm: "h-sm",
  md: "h-md",
  lg: "h-lg",
  xl: "h-xl",
  "2xl": "h-2xl",
  "3xl": "h-3xl",
  "4xl": "h-4xl",
  "5xl": "h-5xl",
  full: "h-full",
};

/**
 * Linha de texto. `lg` e titulo, `md` corpo, `sm` metadado. Um bloco de texto
 * e uma barra `strong` em cima e barras `base` mais curtas embaixo.
 */
function Bar({
  w = "md",
  size = "md",
  tone = "base",
  animated = false,
}: {
  w?: SkeletonWidth;
  size?: "sm" | "md" | "lg";
  tone?: SkeletonTone;
  /** Placeholder de carregamento: brilho correndo. Nunca nas thumbs. */
  animated?: boolean;
}) {
  const h = { sm: "h-2xs", md: "h-xs", lg: "h-sm" }[size];
  return (
    <span className={`block min-w-0 shrink rounded-xs ${h} ${WIDTH[w]} ${TONE[tone]} ${animated ? SHIMMER : ""}`} />
  );
}

/**
 * Area cheia: imagem, painel, bolha, celula, tecla. E flex: aceita filhos e
 * `className` so para layout (flex-col, gap, padding, alinhamento) — nunca
 * aparencia. Sem `h`, a altura vem dos filhos. `outline` poe a hairline
 * subtle — so em amostra de cor ou onde o tom nao separa. `elevated` e a
 * pastilha/painel nivel 1 sobre trilho: tom raised + shadow-xs.
 */
function Block({
  w = "full",
  h,
  tone = "soft",
  radius = "xs",
  outline = false,
  elevated = false,
  animated = false,
  children,
  className = "",
}: {
  w?: SkeletonWidth;
  h?: SkeletonHeight;
  tone?: SkeletonTone;
  radius?: "xs" | "full";
  outline?: boolean;
  elevated?: boolean;
  /** Placeholder de carregamento: brilho correndo. Nunca nas thumbs. */
  animated?: boolean;
  children?: ReactNode;
  className?: string;
}) {
  const r = radius === "full" ? "rounded-full" : "rounded-xs";
  return (
    <div
      className={`flex shrink-0 ${WIDTH[w]} ${h ? HEIGHT[h] : ""} ${r} ${TONE[elevated ? "raised" : tone]} ${
        outline ? "border-thin border-border-subtle" : ""
      } ${elevated ? "shadow-xs" : ""} ${animated ? SHIMMER : ""} ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * Avatar, ponto, icone abstrato. `ring` contorna na cor do cartao: e o que
 * separa avatares sobrepostos (AvatarGroup) sem precisar de outro tom.
 */
function Circle({
  size = "md",
  tone = "strong",
  ring = false,
}: {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  tone?: SkeletonTone;
  ring?: boolean;
}) {
  const s = { xs: "size-xs", sm: "size-sm", md: "size-md", lg: "size-lg", xl: "size-xl" }[size];
  return (
    <span
      className={`block shrink-0 rounded-full ${s} ${TONE[tone]} ${ring ? "border-thick border-surface-raised" : ""}`}
    />
  );
}

/**
 * Botao em pastilha. `primary` e a unica enfase do cartao; `soft` e o
 * secundario tonal (sem contorno). `square` vira botao de icone redondo.
 * `float` e o FAB: sombra grande de coisa que flutua.
 */
function Button({
  variant = "primary",
  size = "md",
  w,
  square = false,
  float = false,
}: {
  variant?: "primary" | "soft";
  size?: "sm" | "md";
  w?: SkeletonWidth;
  square?: boolean;
  float?: boolean;
}) {
  const look = { primary: "bg-icon-tertiary", soft: "bg-neutral-subtle-hover" }[variant];
  const box = square
    ? { sm: "size-md", md: "size-lg" }[size]
    : `${{ sm: "h-md", md: "h-lg" }[size]} ${WIDTH[w ?? (size === "sm" ? "sm" : "md")]}`;
  return <span className={`block shrink-0 rounded-xs ${box} ${look} ${float ? "shadow-lg" : ""}`} />;
}

/**
 * Campo-poco: tom rebaixado, sem contorno, placeholder dentro.
 * `leading`/`trailing` recebem outra forma (Circle, Chip, Button square) — as
 * acoes moram dentro do poco. Uma linha e pastilha, como o Input `well` da lib;
 * Raio do piso (xs) em uma linha e em multilinha: na escala da miniatura o controle cai no piso.
 */
function Field({
  w = "full",
  multiline = false,
  caret = false,
  placeholder = "sm",
  leading,
  trailing,
}: {
  w?: SkeletonWidth;
  multiline?: boolean;
  /** @deprecated Sem efeito: campo leva o piso xs (principio 5 do Pedro). */
  pill?: boolean;
  /** Cursor em enfase depois do placeholder: o protagonista de um campo. */
  caret?: boolean;
  placeholder?: SkeletonWidth | false;
  leading?: ReactNode;
  trailing?: ReactNode;
}) {
  return (
    <div
      className={`flex shrink-0 gap-2xs bg-surface-sunken ${multiline ? "px-xs" : "pr-3xs pl-xs"} rounded-xs ${
        WIDTH[w]
      } ${multiline ? "h-3xl items-start py-xs" : "h-lg items-center"}`}
    >
      {leading}
      {placeholder && <Bar w={placeholder} size="sm" tone="strong" />}
      {caret && <span className="block h-sm w-3xs shrink-0 rounded-xs bg-icon-tertiary" />}
      {trailing && <div className="ml-auto flex items-center gap-3xs">{trailing}</div>}
    </div>
  );
}

/**
 * Pastilha: tag, filtro, contador, tecla, trilho de switch. `align` decide
 * onde os filhos ficam (punho do switch: `start` desligado, `end` ligado).
 * `elevated` e a pastilha selecionada sobre trilho: raised + shadow-xs.
 */
function Chip({
  w = "sm",
  tone = "soft",
  elevated = false,
  align = "center",
  badge = false,
  children,
}: {
  /** Tag/Badge/Count: a unica forma em capsula fora do circulo (excecao do Pedro). */
  badge?: boolean;
  w?: SkeletonWidth;
  tone?: SkeletonTone;
  elevated?: boolean;
  align?: "start" | "center" | "end";
  children?: ReactNode;
}) {
  const look = elevated ? "bg-surface-raised shadow-xs" : TONE[tone];
  const justify = { start: "justify-start", center: "justify-center", end: "justify-end" }[align];
  return (
    <div className={`flex h-md shrink-0 items-center gap-3xs ${badge ? "rounded-full" : "rounded-xs"} px-3xs ${justify} ${WIDTH[w]} ${look}`}>
      {children}
    </div>
  );
}

/** Caixa de selecao (`square`) ou radio (`round`); `on` marca. */
function Check({ shape = "square", on = false }: { shape?: "square" | "round"; on?: boolean }) {
  const r = shape === "round" ? "rounded-full" : "rounded-xs";
  const look = on
    ? shape === "round"
      ? "border-heavy border-icon-tertiary bg-surface-raised"
      : "bg-icon-tertiary"
    : "border-thin border-border-default bg-surface-raised";
  return <span className={`block size-sm shrink-0 ${r} ${look}`} />;
}

/**
 * Linha de lista ou tabela: formas lado a lado com hairline embaixo. Na
 * ultima linha, `divider={false}`. `selected` e a opcao realcada de uma lista
 * (tom, raio do piso); `active` e o item de nav ativo: pastilha elevada, para
 * ficar sobre um trilho (Block tone="sunken").
 */
function Row({
  children,
  divider = true,
  selected = false,
  active = false,
}: {
  children: ReactNode;
  divider?: boolean;
  selected?: boolean;
  active?: boolean;
}) {
  const look = active
    ? "rounded-xs bg-surface-raised px-2xs shadow-xs"
    : selected
      ? "rounded-xs bg-neutral-subtle-default px-2xs"
      : "";
  return (
    <div
      className={`flex w-full items-center gap-xs ${look} ${divider ? "border-b-thin border-border-subtle py-2xs" : "py-2xs"}`}
    >
      {children}
    </div>
  );
}

/** Divisor de uma linha, horizontal ou vertical. `emphasis` quando ele e o protagonista (Divider). */
function Rule({ vertical = false, emphasis = false }: { vertical?: boolean; emphasis?: boolean }) {
  return (
    <span
      className={`block shrink-0 ${emphasis ? "border-icon-tertiary" : "border-border-subtle"} ${vertical ? "h-full self-stretch border-l-thin" : "w-full border-t-thin"}`}
    />
  );
}

const BAR_STEP = ["h-xs", "h-sm", "h-md", "h-lg", "h-xl", "h-2xl", "h-3xl", "h-4xl"] as const;

/**
 * Grafico de barras: cada valor e um degrau de 1 a 8 da escala de espaco.
 * `highlight` e o indice da barra em enfase.
 */
function Bars({ values, highlight }: { values: number[]; highlight?: number }) {
  return (
    <div className="flex h-4xl w-full items-end gap-2xs">
      {values.map((v, i) => (
        <span
          key={i}
          className={`block min-w-0 flex-1 rounded-xs ${BAR_STEP[Math.min(BAR_STEP.length, Math.max(1, v)) - 1]} ${
            i === highlight ? TONE.emphasis : TONE.strong
          }`}
        />
      ))}
    </div>
  );
}

/**
 * Grafico de linha: `points` de 0 (base) a 10 (topo), espacados por igual.
 * `area` preenche embaixo; `second` desenha uma segunda serie mais baixa.
 * `spark` e a micro-viz (Sparkline): baixa, sem eixo, colada num numero.
 */
function Line({
  points,
  area = false,
  second,
  spark = false,
}: {
  points: number[];
  area?: boolean;
  second?: number[];
  spark?: boolean;
}) {
  const path = (ps: number[]) =>
    ps.map((p, i) => `${i === 0 ? "M" : "L"}${(i / (ps.length - 1)) * 100},${40 - p * 4}`).join(" ");
  const fill = (ps: number[]) => `${path(ps)} L100,40 L0,40 Z`;
  return (
    <svg
      viewBox="0 0 100 40"
      preserveAspectRatio="none"
      className={`block w-full overflow-visible ${spark ? "h-lg" : "h-4xl"}`}
    >
      {area && <path d={fill(points)} fill="var(--santo-color-bg-neutral-subtle-default)" />}
      {second && area && <path d={fill(second)} fill="var(--santo-color-bg-neutral-subtle-active)" />}
      {second && (
        <path
          d={path(second)}
          fill="none"
          stroke="var(--santo-color-bg-neutral-subtle-active)"
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ strokeWidth: "var(--santo-border-thick)" }}
        />
      )}
      <path
        d={path(points)}
        fill="none"
        stroke="var(--santo-color-icon-tertiary)"
        vectorEffect="non-scaling-stroke"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ strokeWidth: "var(--santo-border-thick)" }}
      />
    </svg>
  );
}

/**
 * Micro-viz de barrinhas (MiniBars): pastilhas finas, so a destacada em enfase.
 * Valores de 1 a 4 na escala; ao lado de um numero, nunca com eixo.
 */
function MiniBars({ values, highlight }: { values: number[]; highlight?: number }) {
  const step = ["h-2xs", "h-xs", "h-sm", "h-md"] as const;
  return (
    <div className="flex h-md shrink-0 items-end gap-3xs">
      {values.map((v, i) => (
        <span
          key={i}
          className={`block w-2xs rounded-xs ${step[Math.min(step.length, Math.max(1, v)) - 1]} ${
            i === highlight ? TONE.emphasis : TONE.base
          }`}
        />
      ))}
    </div>
  );
}

/**
 * Anel de progresso (Ring): trilha no tom base, arco em enfase. `value` de 0
 * a 100. O tamanho segue a escala de size; o traco e border/heavy.
 * `segments` (porcentagens que somam ate 100) vira donut: a primeira fatia em
 * enfase, as outras alternando strong/base, com um vao entre elas.
 */
function Ring({ value = 65, size = "md", segments }: { value?: number; size?: "sm" | "md" | "lg"; segments?: number[] }) {
  const box = { sm: "size-lg", md: "size-xl", lg: "size-3xl" }[size];
  const c = 2 * Math.PI * 16;
  const arcs = segments ?? [Math.min(100, Math.max(0, value))];
  const tones = ["var(--santo-color-icon-tertiary)", "var(--santo-color-bg-neutral-subtle-active)", "var(--santo-color-bg-neutral-subtle-hover)"];
  return (
    // Giro de -90° DENTRO do SVG (<g transform>), nao por CSS: a miniatura vive num <foreignObject>,
    // e o WebKit desenha elemento com transform CSS ali dentro fora do lugar (o anel vazava do cartao).
    <svg viewBox="0 0 40 40" className={`block shrink-0 ${box}`}>
      <g transform="rotate(-90 20 20)">
      {!segments && (
        <circle
          cx="20"
          cy="20"
          r="16"
          fill="none"
          stroke="var(--santo-color-bg-neutral-subtle-hover)"
          style={{ strokeWidth: "var(--santo-border-heavy)" }}
        />
      )}
      {arcs.map((v, i) => {
        // Vao entre fatias: um degrau de traco (o mesmo border/heavy do anel) em comprimento de arco.
        const len = (c * v) / 100 - (segments ? 4 : 0);
        const offset = -(c * arcs.slice(0, i).reduce((a, b) => a + b, 0)) / 100;
        return (
          <circle
            key={i}
            cx="20"
            cy="20"
            r="16"
            fill="none"
            stroke={segments ? tones[i === 0 ? 0 : 1 + ((i - 1) % 2)] : "var(--santo-color-icon-tertiary)"}
            strokeLinecap={segments ? "butt" : "round"}
            strokeDasharray={`${Math.max(len, 0)} ${c}`}
            strokeDashoffset={offset}
            style={{ strokeWidth: "var(--santo-border-heavy)" }}
          />
        );
      })}
      </g>
    </svg>
  );
}

/**
 * Formas de esqueleto para ilustracao de componente e placeholder.
 *
 * Use para sugerir a anatomia de algo sem conteudo real: miniaturas do indice
 * de /componentes (sempre dentro de ThumbFrame) ou o estado "carregando" de
 * uma area. Nunca misture com texto, icone ou cor de marca — o esqueleto vale
 * pela forma, e uma palavra no meio vira a coisa que se le primeiro.
 * Como placeholder de carregamento, quem envolve leva role="status" e
 * aria-busy, e as formas ganham `animated` (santo-animate-shimmer).
 */
export const Skeleton = { Bar, Block, Circle, Button, Field, Chip, Check, Row, Rule, Bars, Line, MiniBars, Ring };
