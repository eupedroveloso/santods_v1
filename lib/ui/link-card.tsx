import Link from "next/link";
import type { ReactNode } from "react";
import { Card } from "./card";
import { IconTile } from "./icon-tile";
import { ChevronRight } from "./icons";

export type CardLink = { label: string; href: string };

/**
 * Cartao de entrada para uma secao: icone, titulo, apoio e atalhos.
 *
 * Use em pagina indice (home de documentacao, painel de configuracoes) para
 * apontar caminhos. Cada atalho e uma linha inteira clicavel com chevron —
 * alvo grande, e o chevron diz "isto leva a outro lugar" sem precisar de verbo.
 */
export function LinkCard({
  icon,
  title,
  description,
  href,
  links,
  media,
  meta,
  size = "md",
  className = "",
}: {
  icon?: ReactNode;
  title: string;
  /** Na mesma linha do titulo, a direita: <Count>, Tag. Titulo + meta, sem subhead. */
  meta?: ReactNode;
  description?: ReactNode;
  /** Torna o titulo um link para a secao inteira. */
  href?: string;
  links?: CardLink[];
  /**
   * Ilustracao no topo, de ponta a ponta do cartao (sem padding), com o titulo
   * embaixo — a vitrine do indice de componentes (lib/thumbs).
   */
  media?: ReactNode;
  /** sm: cartao de grade densa (vitrine) — titulo body-small, corpo com p-sm. */
  size?: "sm" | "md";
  className?: string;
}) {
  const body = (
    <>
      {icon && (
        <IconTile>{icon}</IconTile>
      )}
      <div className="flex flex-col gap-3xs">
        <div className="flex min-w-0 items-center justify-between gap-xs">
          <h3 className={`min-w-0 truncate ${size === "sm" ? "santo-body-small-semibold" : "santo-body-large-semibold"}`}>
            {href ? (
              <Link href={href} className="hover:underline">
                {title}
              </Link>
            ) : (
              title
            )}
          </h3>
          {meta && <span className="flex shrink-0 items-center gap-2xs">{meta}</span>}
        </div>
        {description && <p className="santo-body-small-regular text-text-secondary">{description}</p>}
      </div>
      {links && links.length > 0 && (
        <ul className="-mx-xs flex flex-col gap-3xs">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="santo-body-small-medium flex items-center justify-between gap-xs rounded-md px-xs py-2xs text-text-secondary transition-colors ease-(--santo-motion-easing-standard) duration-(--santo-motion-duration-fast) hover:bg-neutral-subtle-default hover:text-text-primary"
              >
                <span className="min-w-0 truncate">{l.label}</span>
                <ChevronRight size={16} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
  if (media) {
    return (
      <Card padded={false} className={`overflow-hidden ${className}`}>
        {media}
        <div className={`flex flex-1 flex-col ${size === "sm" ? "gap-xs p-sm" : "gap-md p-lg"}`}>{body}</div>
      </Card>
    );
  }
  return <Card className={className}>{body}</Card>;
}
