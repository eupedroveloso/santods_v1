import type { ReactNode } from "react";
import { Card } from "./card";
import { CardGrid } from "./card-grid";
import { ChatBubble } from "./chat";
import { Avatar, AvatarGroup } from "./data";
import { MiniBars } from "./mini-bars";
import { Overline } from "./overline";
import { Rating } from "./rating";
import { Ring } from "./ring";
import { Skeleton as S } from "./skeleton";
import { Sparkline } from "./sparkline";
import { ThumbFrame } from "./thumb-frame";

/* ================================================================ HeroCard */

/**
 * Hero em CARTAO (padrao "hero em cartao", santo-ui-craft): a abertura da
 * landing inteira dentro de um cartao grande em superficie de marca
 * (bg/brand/subtle — texto em text/primary passa AA; o solido reprova, D1), raio
 * xl (teto de cartao), com a margem da pagina em volta. De cima para baixo: o
 * `header` (LandingHeader variant="inline"), o conteudo (LandingHero, video) e
 * a `rating` no pe. Largura total da coluna da LandingPage.
 */
export function HeroCard({
  header,
  rating,
  children,
}: {
  /** Opcional: LandingHeader variant="inline". O padrao da landing e o header FLUTUANTE fixo no slot da LandingPage; sem header, o cartao comeca no titulo com respiro no topo. */
  header?: ReactNode;
  /** Avaliacao no pe do cartao: nota (0..5) + texto. */
  rating?: { value: number; label: string };
  children: ReactNode;
}) {
  return (
    <section
      className={`flex w-full flex-col items-center gap-xl overflow-clip rounded-xl bg-brand-subtle-default p-xs pb-xl md:gap-2xl md:pb-2xl ${header ? "" : "pt-xl md:pt-3xl"}`}
    >
      {header && <div className="w-full">{header}</div>}
      <div className="flex w-full flex-col items-center gap-xl px-md md:gap-2xl">{children}</div>
      {rating && <Rating value={rating.value} label={rating.label} />}
    </section>
  );
}

/* =========================================================== ShowcaseStrip */

export type ShowcaseItem =
  | { kind: "stat"; label: string; value: string; unit?: string; trend?: number[] }
  | { kind: "bars"; label: string; values: number[] }
  | { kind: "ring"; label: string; value: number }
  | { kind: "chat"; text: string }
  | { kind: "photo"; src: string; name: string };

/** Degraus de "arco": as pontas descem, o meio sobe — perspectiva leve, so com tokens. */
const LIFT = ["md:translate-y-xl", "md:translate-y-md", "md:translate-y-xs", "md:translate-y-0", "md:translate-y-xs", "md:translate-y-md", "md:translate-y-xl"];

function Tile({ item }: { item: ShowcaseItem }) {
  switch (item.kind) {
    case "stat":
      return (
        <>
          <span className="santo-caption-medium text-text-secondary">{item.label}</span>
          <span className="santo-heading-6-bold tabular-nums text-text-primary">{item.value}</span>
          {item.unit && <span className="santo-caption-regular text-text-tertiary">{item.unit}</span>}
          {item.trend && (
            <span className="text-icon-brand">
              <Sparkline values={item.trend} area fluid size="sm" />
            </span>
          )}
        </>
      );
    case "bars":
      return (
        <>
          <span className="santo-caption-medium text-text-secondary">{item.label}</span>
          <span className="text-icon-brand">
            <MiniBars values={item.values} highlight={item.values.length - 1} size="md" />
          </span>
        </>
      );
    case "ring":
      return (
        <div className="flex flex-col items-center gap-xs">
          <Ring value={item.value} tone="brand" size="lg" label={`${item.label}: ${item.value}%`}>
            <span className="santo-caption-semibold tabular-nums">{item.value}%</span>
          </Ring>
          <span className="santo-caption-medium text-text-secondary">{item.label}</span>
        </div>
      );
    case "chat":
      return <ChatBubble>{item.text}</ChatBubble>;
    case "photo":
      return (
        <div className="flex flex-col items-center gap-xs">
          <Avatar name={item.name} src={item.src} size={40} />
          <span className="santo-caption-medium text-text-primary">{item.name}</span>
        </div>
      );
  }
}

/**
 * Vitrine de produto dentro do hero: 5 a 7 cartoes pequenos de app (metrica com
 * tendencia, barras, anel, conversa, foto) em ARCO leve — o meio sobe, as
 * pontas descem (translate por token, sem rotacao solta). Alimentada por dado.
 * Abaixo de md vira faixa rolavel na horizontal (snap), sem o arco.
 */
export function ShowcaseStrip({ items }: { items: ShowcaseItem[] }) {
  const offset = Math.floor((LIFT.length - items.length) / 2);
  return (
    <div className="scrollbar-bare -mx-md flex w-auto max-w-full snap-x snap-mandatory gap-sm overflow-x-auto px-md pb-xl md:mx-0 md:justify-center md:overflow-visible md:px-0">
      {items.map((item, i) => (
        <Card
          key={i}
          padding="sm"
          elevation="md"
          className={`w-(--santo-dimension-space-160) shrink-0 snap-center justify-center text-left ${LIFT[i + offset] ?? ""}`}
        >
          <Tile item={item} />
        </Card>
      ))}
    </div>
  );
}

/* ================================================================ LogoStrip */

/**
 * Faixa de logos (prova de mercado): nomes em cinza (text/tertiary, heading-6),
 * separados por hairline em cima e embaixo. Placeholder em texto ate haver
 * logos reais (asset de marca, nao componente). Abaixo de md, rola na horizontal.
 */
export function LogoStrip({ names, label, variant = "standard" }: { names: string[]; label?: string; variant?: "standard" | "partners" }) {
  if (variant === "partners") return (
    <div className="flex w-full flex-col items-center gap-lg py-xl lg:flex-row">
      {label && <p className="santo-body-small-medium shrink-0 text-balance text-text-secondary lg:w-(--santo-dimension-space-160) lg:text-left">{label}</p>}
      <ul className="flex w-full flex-wrap justify-center gap-xs">
        {names.map((name, i) => (
          <li key={name} className="santo-body-large-semibold flex h-(--santo-dimension-space-64) min-w-(--santo-dimension-space-128) flex-1 items-center justify-center gap-xs rounded-lg border-thin border-border-subtle text-text-tertiary">
            <span aria-hidden className={`size-sm border-thick border-current ${i % 2 ? "rounded-full" : "rounded-xs"}`} />
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
  return (
    <div className="flex w-full flex-col items-center gap-md border-t-thin border-b-thin border-border-subtle py-lg">
      {label && <Overline>{label}</Overline>}
      <ul className="scrollbar-bare flex w-full gap-2xl overflow-x-auto md:flex-wrap md:justify-center md:overflow-visible">
        {names.map((n) => (
          <li key={n} className="santo-heading-6-bold shrink-0 tracking-tight text-text-tertiary">
            {n}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ============================================================ SectionIntro */

/** Um trecho do titulo: texto, ou icone inline em pastilha tonal. */
export type IntroPart = string | { icon: ReactNode };

/**
 * Abertura de secao: overline com ponto ("• O MÉTODO") e titulo grande centrado
 * em linhas; a ULTIMA linha em text/secondary. Icones inline entre palavras
 * ficam numa pastilha tonal pequena (brand/subtle, raio de controle). heading-4
 * a partir de md, heading-6 abaixo.
 */
export function SectionIntro({ overline, lines, description }: { overline?: string; lines: IntroPart[][]; description?: string }) {
  const render = (line: IntroPart[], li: number) => (
    <span key={li} className={`block ${li === lines.length - 1 ? "text-text-secondary" : "text-text-primary"}`}>
      {line.map((part, pi) =>
        typeof part === "string" ? (
          <span key={pi}>{part}</span>
        ) : (
          <span
            key={pi}
            aria-hidden
            className="mx-2xs inline-grid size-(--santo-dimension-size-32) place-items-center rounded-md bg-brand-subtle-default align-middle text-icon-brand md:size-(--santo-dimension-size-40)"
          >
            {part.icon}
          </span>
        ),
      )}
    </span>
  );
  return (
    <header className="flex max-w-(--santo-dimension-container-md) flex-col items-center gap-md text-center">
      {overline && (
        <span className="flex items-center gap-xs">
          <span aria-hidden className="size-2xs rounded-full bg-brand-solid-default" />
          <Overline>{overline}</Overline>
        </span>
      )}
      <h2 className="tracking-tight text-balance">
        <span className="santo-heading-6-bold block md:hidden">{lines.map(render)}</span>
        <span className="santo-heading-4-bold hidden md:block">
          {lines.map(render)}
        </span>
      </h2>
      {description && <p className="santo-body-small-regular max-w-(--santo-dimension-container-sm) text-pretty text-text-secondary">{description}</p>}
    </header>
  );
}

/* =============================================================== Bento */

export type BentoItem =
  | { kind: "illustration"; value: string; caption: string }
  | { kind: "quote"; value: string; caption: string; people: { name: string; src?: string }[]; quote: string }
  | { kind: "brand"; value: string; caption: string }
  | { kind: "inverse"; label: string; value: string; caption?: string };

const SPAN: Record<BentoItem["kind"], string> = {
  // 3 colunas em xl: imagem alta a esquerda (2 linhas); escuro largo embaixo.
  illustration: "md:row-span-2",
  quote: "",
  brand: "",
  inverse: "md:col-span-2 xl:col-span-2",
};

function BentoCell({ item }: { item: BentoItem }) {
  const number = "santo-heading-3-bold tracking-tight tabular-nums";
  switch (item.kind) {
    case "illustration":
      // Ilustracao de componente do DS (gramatica santo-vitrine: ThumbFrame +
      // Skeleton, sem raster): um painel de dashboard em miniatura, ampliado
      // pela propria moldura (o desenho e vetorial e escala com a largura).
      return (
        <Card padded={false} className="overflow-hidden">
          <div className="flex flex-1 flex-col justify-center bg-surface-sunken">
            <ThumbFrame pad="sm">
              <div className="flex items-center justify-between gap-xs">
                <S.Bar w="sm" size="sm" />
                <S.Chip w="xs" badge>
                  <S.Bar w="2xs" size="sm" tone="strong" />
                </S.Chip>
              </div>
              <div className="flex items-end justify-between gap-xs">
                <S.Bar w="md" size="lg" tone="strong" />
                <div className="w-(--santo-dimension-space-64)">
                  <S.Line points={[2, 4, 3, 6, 5, 8, 9]} area spark />
                </div>
              </div>
              <S.Row>
                <S.Circle size="xs" tone="emphasis" />
                <S.Bar w="md" size="sm" />
              </S.Row>
              <S.Row divider={false}>
                <S.Circle size="xs" />
                <S.Bar w="sm" size="sm" />
              </S.Row>
            </ThumbFrame>
          </div>
          <div className="flex flex-col gap-3xs p-lg text-left">
            <span className={`${number} text-text-primary`}>{item.value}</span>
            <span className="santo-body-small-regular text-text-secondary">{item.caption}</span>
          </div>
        </Card>
      );
    case "quote":
      return (
        <Card className="text-left">
          <span className={`${number} text-text-primary`}>{item.value}</span>
          <span className="santo-body-small-regular text-text-secondary">{item.caption}</span>
          <AvatarGroup>
            {item.people.slice(0, 3).map((p) => (
              <Avatar key={p.name} name={p.name} src={p.src} size={32} />
            ))}
          </AvatarGroup>
          <blockquote className="santo-body-small-medium mt-auto text-text-primary">“{item.quote}”</blockquote>
        </Card>
      );
    case "brand":
      return (
        <div className="flex flex-col justify-end gap-3xs rounded-xl bg-brand-solid-default p-lg text-left text-text-on-brand shadow-sm">
          <span className={number}>{item.value}</span>
          <span className="santo-body-large-semibold">{item.caption}</span>
        </div>
      );
    case "inverse":
      return (
        <div className="flex flex-col justify-between gap-lg rounded-xl bg-surface-inverse p-lg text-left text-text-inverse shadow-sm">
          <Overline className="text-text-inverse">{item.label}</Overline>
          <div className="flex flex-col gap-3xs">
            <span className={number}>{item.value}</span>
            {item.caption && <span className="santo-body-small-regular">{item.caption}</span>}
          </div>
        </div>
      );
  }
}

/**
 * Grade BENTO (padrao "bento", santo-ui-craft): grade fixa com spans planejados e
 * fileiras que fecham — ilustracao de componente alta (2 linhas, esqueleto da vitrine, sem raster), metrica com depoimento, destaque
 * em cor de marca e um cartao escuro largo. 1 coluna no celular, 2 em md, 3 em
 * xl. Alimentada por dado (BentoItem).
 */
export function BentoGrid({ items }: { items: BentoItem[] }) {
  return (
    <CardGrid columns={{ md: 2, xl: 3 }} gap="md" masonry={false} stretch className="w-full">
      {items.map((item, i) => (
        <div key={i} className={`flex flex-col *:flex-1 ${SPAN[item.kind]}`}>
          <BentoCell item={item} />
        </div>
      ))}
    </CardGrid>
  );
}
