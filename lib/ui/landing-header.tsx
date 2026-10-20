"use client";

import Link from "next/link";
import { useState } from "react";
import { BrandLogo } from "./brand-logo";
import { buttonClass, type ButtonVariant } from "./button-class";
import { IconButton } from "./button";
import { Close, Menu, User } from "./icons";
import { RADIUS_CONTROL, RADIUS_TRACK } from "./radius";

/**
 * Raio do painel flutuante pela regua: filhos de canto (CTA, botoes) sao controle
 * (md, 8) com folga p-xs (8) -> painel = 8 + 8 = 16 = radius/xl. Sem capsula.
 */
const RADIUS_PANEL = "rounded-xl";

export type LandingNavLink = { label: string; href: string; active?: boolean };

/**
 * Topo da landing em PAINEL FLUTUANTE (Pedro): descolado do topo por space/sm,
 * largura total (margem a margem, so o afastamento lateral space/md), surface/raised + border/subtle + shadow/md, raio xl
 * (= controle md + folga xs, concentrico; sem capsula). Logo da marca a
 * esquerda; menu central num trilho sunken (raio lg) com itens em pastilha de
 * controle (ativo eleva); a direita o Login (IconButton) e o CTA de acesso
 * (Button primario, cor de marca). Sticky mantendo o afastamento. Abaixo de md,
 * o mesmo painel com logo + menu, e a gaveta abre DENTRO dele. Entra na
 * LandingPage pelo slot `header`.
 *
 * `offset`: dentro da documentacao, gruda abaixo da topbar da doc (size/56).
 */
export function LandingHeader({
  brand,
  links,
  loginHref,
  cta,
  ctaHref,
  offset = false,
  variant = "floating",
  productName,
  homeHref = "#",
  ctaVariant = "primary",
}: {
  /** Id da marca da logo. Sem ele, a marca ativa do documento (troca com o seletor). */
  brand?: string;
  links: LandingNavLink[];
  loginHref?: string;
  /** Texto do CTA: "Entrar no VTSD". */
  cta: string;
  ctaHref: string;
  offset?: boolean;
  /**
   * `floating` (padrao): painel sticky flutuante. `inline`: a mesma barra sem
   * painel nem sticky, para morar DENTRO de um cartao (HeroCard).
   */
  variant?: "floating" | "inline";
  /** Nome do produto junto da marca ativa, sem introduzir outra identidade. */
  productName?: string;
  homeHref?: string;
  ctaVariant?: ButtonVariant;
}) {
  const inline = variant === "inline";
  const [open, setOpen] = useState(false);
  // Item do menu: pastilha de controle (h size/32, raio md) sobre o trilho sunken
  // (p-2xs, raio lg = md + 2xs): ativo eleva (raised + shadow-xs), hover tonaliza.
  const item = (l: LandingNavLink, block = false) => (
    <Link
      key={l.href}
      href={l.href}
      aria-current={l.active ? "page" : undefined}
      onClick={() => setOpen(false)}
      className={`santo-body-small-medium santo-transition-elevation flex items-center ${RADIUS_CONTROL} ${productName ? "px-xs" : "px-sm"} ${
        block ? "h-(--santo-dimension-size-40) w-full" : "h-(--santo-dimension-size-32)"
      } ${
        l.active
          ? "bg-surface-raised text-text-primary shadow-xs"
          : "text-text-secondary hover:bg-neutral-subtle-default hover:text-text-primary"
      }`}
    >
      {l.label}
    </Link>
  );
  return (
    // Faixa sticky transparente: so o afastamento (space/sm do topo, space/md nas
    // laterais); quem tem superficie e o painel flutuante dentro dela.
    <div
      className={
        inline
          ? "text-left"
          : `pointer-events-none sticky ${offset ? "top-(--santo-dimension-size-56)" : "top-0"} z-(--santo-layer-sticky) px-md pt-sm text-left md:px-xl`
      }
    >
      <div
        className={
          inline
            ? "flex w-full flex-col p-xs"
            : `santo-animate-fade-in pointer-events-auto flex w-full flex-col border-thin border-border-subtle bg-surface-raised p-xs shadow-md ${RADIUS_PANEL}`
        }
      >
        <div className="flex h-(--santo-dimension-size-40) items-center gap-md">
          {/* Celular: a variante reduzida (mark); a partir de md, a logo completa. */}
          <Link href={homeHref} aria-label={productName ? `${productName} — início` : "Início"} className={`flex shrink-0 items-center gap-xs ${RADIUS_CONTROL} pl-xs`}>
            <span className={productName ? "flex" : "flex md:hidden"}>
              <BrandLogo brand={brand} size={24} variant="mark" />
            </span>
            <span className={productName ? "hidden" : "hidden md:flex"}>
              <BrandLogo brand={brand} size={24} />
            </span>
            {productName && <span className="santo-body-large-semibold text-text-primary">{productName}</span>}
          </Link>
          <nav aria-label="Menu da página" className={`mx-auto hidden items-center gap-3xs ${RADIUS_TRACK} bg-surface-sunken p-2xs md:flex`}>
            {links.map((l) => item(l))}
          </nav>
          <div className="ml-auto flex items-center gap-xs md:ml-0">
            {loginHref && (
              <Link href={loginHref} aria-label="Login" title="Login" className={buttonClass({ variant: "ghost", size: "md", icon: true })}>
                <User size={16} />
              </Link>
            )}
            {/* Wrapper: o inline-flex do buttonClass venceria um `hidden` no proprio link. */}
            <span className="hidden md:inline-flex">
              <Link href={ctaHref} className={buttonClass({ variant: ctaVariant, size: "md" })}>
                {cta}
              </Link>
            </span>
            <IconButton
              className="md:hidden"
              label={open ? "Fechar menu" : "Abrir menu"}
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <Close size={16} /> : <Menu size={16} />}
            </IconButton>
          </div>
        </div>
        {open && (
          // Gaveta dentro do proprio painel: ele cresce para baixo.
          <div className="santo-animate-slide-in-down flex flex-col gap-3xs pt-sm md:hidden">
            <nav aria-label="Menu da página" className={`flex flex-col gap-3xs ${RADIUS_TRACK} bg-surface-sunken p-2xs`}>
              {links.map((l) => item(l, true))}
            </nav>
            <Link href={ctaHref} onClick={() => setOpen(false)} className={`mt-xs ${buttonClass({ variant: ctaVariant, size: "lg", block: true })}`}>
              {cta}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
