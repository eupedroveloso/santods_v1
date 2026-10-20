import Link from "next/link";
import type { ReactNode } from "react";
import { Avatar } from "./data";
import { BrandLogo } from "./brand-logo";
import { Card } from "./card";
import { CardGrid } from "./card-grid";
import { buttonClass } from "./button-class";
import { LandingHero, SocialProofRow, type LandingPerson } from "./landing";
import { Rating } from "./rating";
import { ArrowUpRight, Check, Code, User, TrendUp } from "./icons";

type Action = { label: string; href: string };

/** Abertura de produto: atmosfera de marca, preview recortado e funções flutuantes. */
export function ProductHero({
  header,
  headline,
  secondLine,
  description,
  primary,
  secondary,
  preview,
  roles = ["Analista", "Desenvolvimento", "Pessoas", "Design"],
}: {
  header: ReactNode;
  headline: string;
  secondLine: string;
  description: string;
  primary: Action;
  secondary: Action;
  preview: ReactNode;
  roles?: string[];
}) {
  const rolePositions = ["left-xs top-0 md:left-xl", "right-xs top-xs md:right-xl", "left-0 top-(--santo-dimension-space-128)", "right-0 top-(--santo-dimension-space-160)"];
  const roleIcons = [TrendUp, Code, User, Check];
  return (
    <section className="relative isolate w-full overflow-hidden rounded-b-xl" style={{ background: "linear-gradient(to bottom, var(--santo-color-surface-page), var(--santo-color-bg-brand-subtle-default))" }}>
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10" style={{ backgroundImage: "radial-gradient(ellipse at 5% 60%, var(--santo-color-surface-raised), transparent 45%), radial-gradient(ellipse at 95% 45%, var(--santo-color-surface-raised), transparent 40%)" }} />
      <div className="mx-auto w-full max-w-(--santo-dimension-container-lg) px-md pt-md md:px-xl">{header}</div>
      <div className="mx-auto flex w-full max-w-(--santo-dimension-container-lg) flex-col items-center gap-3xl px-md pt-3xl md:gap-xl md:px-xl md:pt-3xl">
        <LandingHero headline={headline} secondLine={secondLine} subheadline={description} actions={{ primary, secondary }} primaryFirst size="display" />
        <div className="relative w-full pt-xl">
          {/* Nuvens: formas geométricas com cores de superfície, sem raster ou cor fixa. */}
          <div aria-hidden className="pointer-events-none absolute -left-xl top-0 h-(--santo-dimension-space-128) w-(--santo-dimension-space-256) rounded-full" style={{ background: "radial-gradient(ellipse, var(--santo-color-surface-raised), transparent 70%)" }} />
          <div aria-hidden className="pointer-events-none absolute -right-xl top-sm h-(--santo-dimension-space-160) w-(--santo-dimension-space-320) rounded-full" style={{ background: "radial-gradient(ellipse, var(--santo-color-surface-raised), transparent 70%)" }} />
          <div role="img" aria-label="Prévia do produto: um quadro com tarefas, pessoas e quatro etapas de trabalho" className="relative mx-auto max-h-(--santo-dimension-space-288) w-full max-w-(--santo-dimension-container-lg) overflow-hidden px-xs pt-xs md:max-h-(--santo-dimension-space-320)">
            <div inert aria-hidden>{preview}</div>
          </div>
          <div aria-hidden className="pointer-events-none absolute inset-0 hidden md:block">
            {roles.slice(0, 4).map((role, i) => {
              const RoleIcon = roleIcons[i];
              return <span key={role} className={`santo-caption-medium absolute inline-flex items-center gap-2xs rounded-md bg-surface-raised px-xs py-2xs text-text-secondary shadow-sm ${rolePositions[i]}`}><span className="text-icon-brand"><RoleIcon size={12} /></span>{role}</span>;
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export type LandingTestimonial = {
  quote: string;
  person: LandingPerson;
  role: string;
  result: string;
};

/** Prova de uso em histórias curtas: resultado, citação e autoria no mesmo cartão. */
export function TestimonialGrid({ items }: { items: LandingTestimonial[] }) {
  return (
    <CardGrid columns={{ md: 3 }} gap="md" masonry={false} className="w-full">
      {items.map((item) => (
        <Card key={item.person.name} padding="lg" className="text-left">
          <Rating value={5} />
          <p className="santo-heading-6-semibold text-text-primary">{item.result}</p>
          <blockquote className="santo-body-small-regular text-pretty text-text-secondary">“{item.quote}”</blockquote>
          <div className="flex items-center gap-sm pt-xs">
            <Avatar {...item.person} size={40} />
            <div className="flex min-w-0 flex-col gap-3xs">
              <span className="santo-body-small-semibold text-text-primary">{item.person.name}</span>
              <span className="santo-caption-regular text-text-tertiary">{item.role}</span>
            </div>
          </div>
        </Card>
      ))}
    </CardGrid>
  );
}

/** Fecha uma landing de produto com próxima ação, prova social e destinos do rodapé. */
export function LandingClosing({
  productName,
  title,
  description,
  primary,
  people = [],
  proof,
  links,
  contact,
}: {
  productName: string;
  title: string;
  description: string;
  primary: Action;
  people?: LandingPerson[];
  proof?: string;
  links: Action[];
  contact: Action;
}) {
  return (
    <div className="w-full">
      <section className="flex flex-col items-center gap-lg rounded-xl bg-brand-subtle-default px-lg py-3xl text-center md:px-3xl md:py-4xl" style={{ backgroundImage: "radial-gradient(ellipse at top right, var(--santo-color-surface-raised), transparent 65%)" }}>
        <SocialProofRow people={people} text={proof} />
        <h2 className="santo-heading-5-bold max-w-(--santo-dimension-container-sm) text-balance text-text-primary">{title}</h2>
        <p className="santo-body-small-regular max-w-(--santo-dimension-container-sm) text-pretty text-text-secondary">{description}</p>
        <Link href={primary.href} className={buttonClass({ variant: "primary", size: "lg" })}>{primary.label}<ArrowUpRight size={16} /></Link>
        <span className="santo-caption-regular text-text-tertiary">Sem cartão. Sem compromisso. Com o seu time.</span>
      </section>
      <footer className="flex flex-col gap-xl pb-xl pt-3xl text-left">
        <div className="flex flex-wrap items-center justify-between gap-lg">
          <span className="santo-body-large-semibold flex items-center gap-xs text-text-primary"><BrandLogo size={24} variant="mark" />{productName}</span>
          <nav aria-label="Rodapé do produto" className="flex flex-wrap gap-md">
            {links.map((link) => <Link key={link.href} href={link.href} className="santo-body-small-medium text-text-secondary hover:text-text-brand">{link.label}</Link>)}
          </nav>
          <Link href={contact.href} className={buttonClass({ variant: "contrast", size: "md" })}>{contact.label}<ArrowUpRight size={16} /></Link>
        </div>
        <div className="santo-caption-regular flex flex-wrap justify-between gap-sm border-t-thin border-border-subtle pt-lg text-text-tertiary">
          <span>© 2026 {productName}. Cada entrega começa com um passo.</span>
          <span>Organização para trabalhar melhor, juntos.</span>
        </div>
      </footer>
    </div>
  );
}
