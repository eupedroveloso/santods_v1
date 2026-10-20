"use client";

import { useMemo, useState } from "react";
import { thumbs } from "@/lib/thumbs";
import { CardGrid, Count, LinkCard, SearchInput, TableOfContents, type ComponentTier, type TocItem } from "@/lib/ui";
import { DocHeader, SectionLabel } from "./page-header";

export type IndexItem = { slug: string; name: string };
export type IndexCategory = { id: string; label: string; items: IndexItem[] };
export type IndexTier = { id: ComponentTier; label: string; count: number; categories: IndexCategory[] };

const anchor = (tier: string, cat: string) => `${tier}-${cat}`;
const fold = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

/** Índice com três camadas visíveis, busca por nome e âncoras estáveis. */
export function ComponentIndex({ tiers }: { tiers: IndexTier[] }) {
  const [query, setQuery] = useState("");
  const q = fold(query.trim());

  const sections = useMemo(() => tiers.map((tier) => ({
    ...tier,
    categories: tier.categories.map((category) => ({
      ...category,
      items: category.items.filter((item) => !q || fold(item.name).includes(q)),
    })).filter((category) => category.items.length > 0),
  })), [tiers, q]);

  const toc: TocItem[] = sections.filter((t) => t.categories.length > 0).flatMap((t) => [
    { id: t.id, href: `#${t.id}`, label: t.label, level: 1 as const, count: t.categories.reduce((total, category) => total + category.items.length, 0) },
    ...t.categories.map((c) => ({ id: anchor(t.id, c.id), label: c.label, count: c.items.length })),
  ]);

  return (
    <>
      <DocHeader
        crumbs={[{ label: "Docs", href: "/" }, { label: "Componentes" }]}
        title="Componentes"
        divided
      />
    <div className="flex flex-col gap-lg">
      {/* No celular a coluna lateral some; o filtro aparece aqui. */}
      <div className="flex w-full lg:hidden">
        <SearchInput
          size="sm"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filtrar…"
          aria-label="Filtrar componentes"
        />
      </div>

      <div className="flex gap-xl">
        <div className="flex min-w-0 flex-1 flex-col gap-xl">
          {sections.map((tier) => tier.categories.length > 0 && (
            <section key={tier.id} id={tier.id} className="flex scroll-mt-6xl flex-col gap-lg">
              <h2 className="santo-heading-5-semibold flex items-center gap-xs text-text-primary">
                {tier.label}
                <Count>{tier.categories.reduce((total, category) => total + category.items.length, 0)}</Count>
              </h2>
              {tier.categories.map((category) => (
                <section key={category.id} id={anchor(tier.id, category.id)} className="flex scroll-mt-6xl flex-col gap-sm">
                  <SectionLabel>{category.label}</SectionLabel>
                  <CardGrid minItem="space-192" gap="md" masonry={false} stretch>
                    {category.items.map((component) => {
                      const Thumb = thumbs[component.slug];
                      return (
                        <LinkCard
                          key={component.slug}
                          size="sm"
                          title={component.name}
                          href={`/componentes/${component.slug}`}
                          media={Thumb ? <Thumb /> : undefined}
                        />
                      );
                    })}
                  </CardGrid>
                </section>
              ))}
            </section>
          ))}
          {sections.every((tier) => tier.categories.length === 0) && (
            <p className="santo-body-small-regular text-text-secondary" role="status">Nenhum componente encontrado.</p>
          )}
        </div>

        {/* Coluna unica e presa: filtro em cima, indice embaixo, mesma largura e margem. */}
        <aside className="hidden w-(--santo-dimension-space-224) shrink-0 lg:block">
          <div className="sticky top-[calc(var(--santo-dimension-size-56)+var(--santo-space-4xl))] flex flex-col gap-md">
            <div className="flex">
              <SearchInput
                size="sm"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Filtrar…"
                aria-label="Filtrar componentes"
              />
            </div>
            <TableOfContents items={toc} />
          </div>
        </aside>
      </div>
    </div>
    </>
  );
}
