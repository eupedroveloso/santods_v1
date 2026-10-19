"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Count } from "./chip";

export type TocItem = {
  /** id do elemento na pagina (a ancora). */
  id: string;
  label: ReactNode;
  /** 1 = grupo (tier, colecao), 2 = item dentro do grupo. */
  level?: 1 | 2;
  count?: number;
  /** href proprio; padrao "#id". */
  href?: string;
};

/**
 * Indice da pagina ("nesta pagina"), na coluna direita: grupos e itens, com o
 * item visivel marcado por uma linha de brand a esquerda — nao por pastilha.
 * Acompanha a rolagem sozinho (posicao das secoes pelos ids dos itens).
 * Use em pagina longa com secoes ancoradas: componentes, tokens, estilos.
 */
export function TableOfContents({
  items,
  title = "Nesta página",
  className = "",
}: {
  items: TocItem[];
  title?: ReactNode;
  className?: string;
}) {
  const [active, setActive] = useState<string | null>(null);
  // Ativo = a ultima secao cujo topo ja passou da linha de leitura (logo abaixo
  // da topbar e da trilha sticky); no fim da pagina, a ultima. Calculado na
  // rolagem — com IntersectionObserver, uma secao alta continuava "cruzando"
  // a faixa enquanto as seguintes entravam, e o indice travava nela.
  // Sem lista de dependencias de proposito: as secoes podem entrar e sair da
  // pagina sem os itens mudarem (aba que troca o conteudo).
  useEffect(() => {
    const root = getComputedStyle(document.documentElement);
    const px = (name: string) => parseFloat(root.getPropertyValue(name)) || 0;
    // topbar (size/56) + trilha (~space/3xl) + respiro (space/md)
    const line = px("--santo-dimension-size-56") + px("--santo-space-3xl") + px("--santo-space-md");
    let frame = 0;
    const update = () => {
      frame = 0;
      const els = items
        .map((i) => document.getElementById(i.id))
        .filter((el): el is HTMLElement => el !== null);
      if (!els.length) return;
      const atEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      let current = els[0].id;
      if (atEnd) current = els[els.length - 1].id;
      else for (const el of els) if (el.getBoundingClientRect().top - line <= 0) current = el.id;
      setActive((prev) => (prev === current ? prev : current));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  });

  return (
    <nav aria-label="Nesta página" className={`flex flex-col gap-xs ${className}`}>
      <span className="santo-caption-medium text-text-tertiary">{title}</span>
      <ul className="flex flex-col border-l-thin border-border-subtle">
        {items.map((item) => {
          const on = active === item.id;
          const group = (item.level ?? 2) === 1;
          return (
            <li key={item.id}>
              <a
                href={item.href ?? `#${item.id}`}
                aria-current={on ? "location" : undefined}
                className={`-ml-px flex items-center justify-between gap-xs border-l-(length:--santo-border-thick) py-3xs pr-xs transition-colors ease-(--santo-motion-easing-standard) duration-(--santo-motion-duration-fast) ${
                  group ? "santo-body-small-semibold pl-sm" : "santo-body-small-regular pl-lg"
                } ${
                  on
                    ? "border-border-brand text-text-primary"
                    : "border-transparent text-text-tertiary hover:text-text-secondary"
                } ${group && !on ? "text-text-secondary" : ""}`}
              >
                <span className="min-w-0 truncate">{item.label}</span>
                {item.count !== undefined && <Count>{item.count}</Count>}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
