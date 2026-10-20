"use client";

import Image from "next/image";
import { useActiveBrand } from "./use-active-brand";

/** Altura pela escala dimension/size/*. Classe literal para o Tailwind gerar. */
const HEIGHT = {
  20: "h-(--santo-dimension-size-20)",
  24: "h-(--santo-dimension-size-24)",
  28: "h-(--santo-dimension-size-28)",
  32: "h-(--santo-dimension-size-32)",
} as const;

export type BrandLogoSize = keyof typeof HEIGHT;

/**
 * Logos por id de marca (o mesmo de brand/id e do atributo data-brand).
 * `light` vai sobre fundo claro, `dark` sobre fundo escuro; `ratio` = largura /
 * altura do arquivo original. Assets em public/brand — a cor da marca vem no
 * SVG (asset isento), nunca em JSX.
 */
// SantoDS: assinatura sem o selo de versão, que ficava ilegível nas alturas de UI.
// O SVG preserva a marca inteira; a prancheta termina após o desenho, sem sobra lateral.
type LogoFile = { light: string; dark: string; ratio: number };

/*
 * `mark`: a variante REDUZIDA (simbolo compacto) para espaco curto — header no
 * celular, trilho, favicon. Marca sem mark registrada usa a logo completa
 * (hoje o Santo ainda nao tem mark: falta o asset).
 */
const LOGOS: Record<string, { alt: string; full: LogoFile; mark?: LogoFile }> = {
  santo: { alt: "SantoDS v1", full: { light: "/brand/santods-logo.svg", dark: "/brand/santods-logo-dark.svg", ratio: 417 / 92 } },
  vtsd: {
    alt: "Venda Todo Santo Dia",
    full: { light: "/brand/vtsd-logo.svg", dark: "/brand/vtsd-logo-dark.svg", ratio: 120 / 32 },
    mark: { light: "/brand/vtsd-mark.svg", dark: "/brand/vtsd-mark-dark.svg", ratio: 48 / 21 },
  },
};

/** Arquivo da logo (claro/escuro) de uma marca e variante, ou null se a marca nao tem logo. */
export function brandLogoFile(brand: string, variant: "full" | "mark" = "full"): (LogoFile & { alt: string }) | null {
  const l = LOGOS[brand];
  if (!l) return null;
  return { alt: l.alt, ...((variant === "mark" ? l.mark : undefined) ?? l.full) };
}

export type BrandId = "santo" | "vtsd";

/** As marcas com logo registrada — para seletor de marca e identidades. */
export const BRAND_LOGOS = Object.keys(LOGOS) as BrandId[];

/** A marca tem a variante reduzida (mark)? */
export const hasBrandMark = (id: string) => Boolean(LOGOS[id]?.mark);

/** Marcas que ja tem a variante reduzida (mark). */
export const BRAND_MARKS = Object.keys(LOGOS).filter((k) => LOGOS[k].mark) as BrandId[];

export const hasBrandLogo = (id: string): id is BrandId => id in LOGOS;

/**
 * Logo oficial de uma marca do DS, por id. Use no topo de app/documentacao e na
 * ficha da identidade. Sem `brand`, segue a marca ativa (troca com o seletor).
 * Marca sem logo registrada nao renderiza nada.
 *
 * Duas imagens por marca (fundo claro e escuro); as classes
 * santo-show-light/dark (lib/ui/controls.css) mostram so uma por tema — Auto
 * pelo sistema e o data-theme da raiz — sem JS e sem piscar. A escondida sai da
 * arvore de acessibilidade pelo display:none, entao o leitor anuncia uma vez so.
 * Nao ponha utilitario de display nas <img>: santo-show-* mora em
 * @layer components e um utilitario venceria o display:none.
 *
 * width/height do <img> ja sao o tamanho final: sem CSS, a logo nunca aparece gigante.
 */
export function BrandLogo({
  brand,
  size = 24,
  priority = false,
  variant = "full",
  fallbackSize,
  className = "",
}: {
  /** Id da marca (brand/id): `santo`, `vtsd`. Sem ele, a marca ATIVA do documento (seletor de marca). */
  brand?: string;
  /** Altura em degrau de dimension/size. */
  size?: BrandLogoSize;
  /** Logo acima da dobra (topbar): carrega primeiro. */
  priority?: boolean;
  /** `full` (padrao) ou `mark` (reduzida; sem mark registrada, cai na completa). */
  variant?: "full" | "mark";
  /** Com `mark`: altura usada quando a marca NAO tem mark e cai na logo completa (mais larga) — mantem o peso visual. */
  fallbackSize?: BrandLogoSize;
  className?: string;
}) {
  const active = useActiveBrand(BRAND_LOGOS[0]);
  const id = brand ?? active;
  const logo = brandLogoFile(id, variant);
  if (!logo) return null;
  if (variant === "mark" && fallbackSize && !hasBrandMark(id)) size = fallbackSize;
  const width = Math.round(size * logo.ratio);
  const img = `${HEIGHT[size]} w-auto`;
  return (
    <span className={`inline-flex shrink-0 items-center ${className}`}>
      <Image src={logo.light} alt={logo.alt} width={width} height={size} unoptimized priority={priority} className={`santo-show-light ${img}`} />
      <Image src={logo.dark} alt={logo.alt} width={width} height={size} unoptimized className={`santo-show-dark ${img}`} />
    </span>
  );
}
