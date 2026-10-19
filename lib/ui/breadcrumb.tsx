import Link from "next/link";
import { ChevronRight } from "./icons";

export type Crumb = { label: string; href?: string };

/**
 * Trilha de onde a pessoa esta.
 *
 * Use no topo de pagina que mora dentro de uma hierarquia (Docs › Componentes ›
 * Button). O ultimo item e a pagina atual: nao e link e ganha `aria-current`.
 * Em pagina de primeiro nivel, nao use — a trilha de um item so e ruido.
 */
export function Breadcrumb({ items, className = "" }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Trilha" className={className}>
      <ol className="santo-body-small-regular flex flex-wrap items-center gap-2xs text-text-tertiary">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-2xs">
              {i > 0 && <ChevronRight size={12} />}
              {item.href && !last ? (
                <Link
                  href={item.href}
                  className="transition-colors ease-(--santo-motion-easing-standard) duration-(--santo-motion-duration-fast) hover:text-text-primary"
                >
                  {item.label}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className={last ? "text-text-primary" : ""}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
