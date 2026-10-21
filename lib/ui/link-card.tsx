import Link from "next/link";
import type { ReactNode } from "react";
import { Card } from "./card";
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
   * Ilustracao no topo, recuada como painel (mesmo recuo nos quatro lados), com
   * o titulo embaixo na mesma margem — a vitrine do indice de componentes (lib/thumbs).
   */
  media?: ReactNode;
  /** sm: cartao de grade densa (vitrine) — titulo body-small, corpo com p-sm. */
  size?: "sm" | "md";
  className?: string;
}) {
  const body = (
    <>
      {/* Icone sem caixa (regra do Pedro), alinhado a coluna do titulo. */}
      {icon && <span className="flex text-icon-secondary">{icon}</span>}
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
        // Linha de altura FIXA (size/40), igual em todo cartao, com gap constante: a
        // lista nunca estica nem encolhe para preencher. Num indice esticado (CardGrid
        // stretch) quem iguala a fileira e o CARTAO; a sobra fica no fim (excecao de
        // navegacao, santo-ui-craft secao 12, item 11).
        <ul className="-mx-xs flex flex-col gap-3xs">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="santo-body-small-medium flex h-(--santo-dimension-size-40) items-center justify-between gap-xs rounded-md px-xs text-text-secondary transition-colors ease-(--santo-motion-easing-standard) duration-(--santo-motion-duration-fast) hover:bg-neutral-subtle-default hover:text-text-primary"
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
    // Aninhamento: o cartao e moldura de recuo xs (igual nos quatro lados e entre
    // a ilustracao e a faixa do nome); a ilustracao recorta no raio interno.
    return (
      <Card padding="xs" className={className}>
        <div className="santo-nested overflow-hidden">{media}</div>
        <div className={`flex flex-1 flex-col ${size === "sm" ? "gap-xs" : "gap-md"}`}>{body}</div>
      </Card>
    );
  }
  return <Card className={className}>{body}</Card>;
}
