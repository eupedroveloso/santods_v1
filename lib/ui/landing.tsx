import Link from "next/link";
import type { ReactNode } from "react";
import { buttonClass } from "./button-class";
import { BrandLogo } from "./brand-logo";
import { CtaButton } from "./cta-button";
import { Avatar, AvatarGroup } from "./data";
import { Overline } from "./overline";
import { Rating } from "./rating";

/**
 * Pagina de venda (landing de VSL): o fundo e so a superficie de pagina (Pedro:
 * nada de miniaturas desfocadas), o `header` de ponta a ponta e uma COLUNA
 * central (container/lg) onde os blocos empilham centrados — o video ocupa a
 * largura da coluna; texto e oferta se limitam por dentro. `brand` grava data-brand: a pagina inteira resolve as
 * vars da marca (cor, Sora, raio) sem depender da marca ativa no documento.
 * `framed` desenha a moldura (raio xl + santo-edge) para mostrar a pagina
 * dentro de outra, como em /exemplos.
 */
export function LandingPage({
  children,
  brand,
  framed = false,
  fullBleed = false,
  header,
  overlay,
  className = "",
}: {
  children: ReactNode;
  /** Id de brand/id: `vtsd`, `santo`. Sem ele, herda a marca do documento. */
  brand?: string;
  framed?: boolean;
  /**
   * Coluna de largura total: o que nao se limita sozinho (o video) vai de margem
   * a margem da pagina, so com o padding lateral de pagina (space/md; space/xl a
   * partir de md). Hero e oferta continuam estreitos (eles se limitam por dentro).
   */
  fullBleed?: boolean;
  /** Barra do topo (LandingHeader), fora da coluna, de ponta a ponta. */
  header?: ReactNode;
  /** Camada flutuante da pagina (SocialProofToast `placement="frame"`). */
  overlay?: ReactNode;
  className?: string;
}) {
  return (
    <section
      data-brand={brand}
      className={`relative isolate overflow-clip bg-surface-page font-sans text-text-primary ${framed ? "santo-edge rounded-xl" : ""} ${className}`}
    >
      {header}
      {/* Coluna container/lg: o video vai largo; texto e oferta se limitam a md/sm por dentro. */}
      <div
        className={`relative mx-auto flex w-full flex-col items-center gap-2xl px-md py-3xl text-center md:py-4xl ${
          fullBleed ? "md:px-xl" : "max-w-(--santo-dimension-container-lg)"
        }`}
      >
        {children}
      </div>
      {overlay}
    </section>
  );
}

/** Divide o titulo e pinta o trecho `highlight` na cor de marca. */
function withHighlight(text: string, highlight?: string) {
  if (!highlight) return text;
  const at = text.indexOf(highlight);
  if (at < 0) return text;
  return (
    <>
      {text.slice(0, at)}
      {/* whitespace-nowrap: o trecho em cor nunca quebra no meio. */}
      <span className="whitespace-nowrap text-text-brand">{highlight}</span>
      {text.slice(at + highlight.length)}
    </>
  );
}

export type LandingPerson = { name: string; src?: string };

/**
 * Linha de prova social: ate 3 avatares (AvatarGroup, de preferencia com foto)
 * e um texto curto ao lado, centrados. `tone="text"` para frase
 * ("+ de 20 mil alunos já vendem todo dia", acima da headline) e
 * `tone="overline"` para rotulo em caixa alta ("+90 MIL ALUNOS", junto do CTA).
 */
export function SocialProofRow({
  people = [],
  text,
  tone = "text",
}: {
  /** Ate 3 pessoas (Pedro: tres fotos bastam). */
  people?: LandingPerson[];
  text?: string;
  tone?: "text" | "overline";
}) {
  if (people.length === 0 && !text) return null;
  return (
    <div className="flex flex-wrap items-center justify-center gap-sm">
      {people.length > 0 && (
        <AvatarGroup>
          {people.slice(0, 3).map((p) => (
            <Avatar key={p.name} name={p.name} src={p.src} size={32} />
          ))}
        </AvatarGroup>
      )}
      {text &&
        (tone === "overline" ? (
          <Overline className="text-text-primary">{text}</Overline>
        ) : (
          <span className="santo-body-small-medium text-text-secondary">{text}</span>
        ))}
    </div>
  );
}

/**
 * Abertura da landing (de cima para baixo): logo da marca, prova social
 * (`proof`: avatares + frase, SocialProofRow), headline com um
 * trecho em cor de marca, subheadline, um paragrafo de chamada (`lead`, com
 * destaque opcional em text-brand) e a legenda do video. Centrado, limitado a
 * container/md. Headline: heading-4 (36) a partir de md, heading-6 (24) abaixo,
 * tracking-tight e balance; o trecho em cor nao quebra. Lead em body-large
 * semibold (um degrau abaixo do titulo, acima do corpo), legenda em body-small.
 * Sem tarja de fundo solido (Pedro): destaque e so cor de texto.
 */
export function LandingHero({
  logo,
  brand,
  proof,
  headline,
  secondLine,
  highlight,
  actions,
  subheadline,
  lead,
  leadHighlight,
  caption,
}: {
  /** Logo pronta (slot). Prefira `brand`. */
  logo?: ReactNode;
  /** Id da marca: desenha a BrandLogo dela (size 28). */
  brand?: string;
  /** Prova social acima da headline (SocialProofRow em tom texto). */
  proof?: { people: LandingPerson[]; text: string };
  headline: string;
  /** Segunda linha da headline, em tom secundario (text/brand). */
  secondLine?: string;
  /** Duas acoes lado a lado: secundaria (Button lg) e primaria (CtaButton md, com seta). */
  actions?: { secondary?: { label: string; href: string }; primary: { label: string; href: string } };
  /** Trecho da headline em cor de marca: "45 agentes de IA". */
  highlight?: string;
  subheadline?: string;
  /** Paragrafo de chamada para o video, em heading-6. */
  lead?: string;
  /** Trecho do lead em cor de marca. */
  leadHighlight?: string;
  /** Legenda pequena antes do video. */
  caption?: string;
}) {
  return (
    // Ritmo: grupo de abertura (logo, prova) -> space/lg -> titulo + sub (space/sm,
    // um bloco so) -> space/xl -> lead + legenda (space/xs). Texto em medida de
    // leitura (container/sm); o titulo um pouco mais largo (container/md) com balance.
    <header className="flex w-full max-w-(--santo-dimension-container-md) flex-col items-center gap-lg">
      {(logo || brand || proof) && (
        <div className="flex flex-col items-center gap-sm">
          {logo ?? (brand && <BrandLogo brand={brand} size={28} priority />)}
          {proof && <SocialProofRow people={proof.people} text={proof.text} />}
        </div>
      )}
      <div className="flex flex-col items-center gap-sm">
        <h1 className="tracking-tight text-balance text-text-primary">
          <span className="santo-heading-6-bold block md:hidden">
            {withHighlight(headline, highlight)}
            {secondLine && <span className="block text-text-brand">{secondLine}</span>}
          </span>
          <span aria-hidden className="santo-heading-4-bold hidden md:block">
            {withHighlight(headline, highlight)}
            {secondLine && <span className="block text-text-brand">{secondLine}</span>}
          </span>
        </h1>
        {subheadline && (
          <p className="santo-body-large-regular max-w-(--santo-dimension-container-sm) text-pretty text-text-secondary">{subheadline}</p>
        )}
      </div>
      {actions && (
        <div className="flex flex-wrap items-center justify-center gap-sm">
          {actions.secondary && (
            <Link href={actions.secondary.href} className={buttonClass({ variant: "secondary", size: "lg" })}>
              {actions.secondary.label}
            </Link>
          )}
          <CtaButton size="md" intent="brand" href={actions.primary.href}>
            {actions.primary.label}
          </CtaButton>
        </div>
      )}
      {(lead || caption) && (
        <div className="mt-sm flex max-w-(--santo-dimension-container-sm) flex-col items-center gap-xs">
          {lead && <p className="santo-body-large-semibold text-balance text-text-primary">{withHighlight(lead, leadHighlight)}</p>}
          {caption && <p className="santo-body-small-regular text-text-tertiary">{caption}</p>}
        </div>
      )}
    </header>
  );
}

/**
 * Oferta da landing, logo abaixo do video: prova social (ate 3 avatares + a
 * contagem em overline), o CTA principal (CtaButton) e a avaliacao (Rating).
 * Um so CTA por pagina.
 */
export function LandingOffer({
  people = [],
  proof,
  cta,
  ctaHref,
  onCta,
  rating,
  ratingLabel,
}: {
  /** Ate 3 pessoas no grupo de avatares (Pedro: tres fotos bastam). */
  people?: LandingPerson[];
  /** "+90 MIL ALUNOS". */
  proof?: string;
  cta: string;
  ctaHref?: string;
  onCta?: () => void;
  /** Nota para as estrelas (0..5). */
  rating?: number;
  /** Texto da nota: "4,9/5". */
  ratingLabel?: string;
}) {
  return (
    <div className="flex w-full max-w-(--santo-dimension-container-sm) flex-col items-center gap-lg">
      <SocialProofRow people={people} text={proof} tone="overline" />
      <CtaButton href={ctaHref} onClick={onCta}>
        {cta}
      </CtaButton>
      {rating !== undefined && <Rating value={rating} label={ratingLabel} />}
    </div>
  );
}
