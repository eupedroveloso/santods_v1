"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { thumbs } from "@/lib/thumbs";
import { CardGrid, Count, LinkCard, SearchInput, Segmented, TableOfContents, type ComponentTier, type TocItem } from "@/lib/ui";
import { DocHeader, SectionLabel } from "./page-header";

export type IndexItem = { slug: string; name: string };
export type IndexCategory = { id: string; label: string; items: IndexItem[] };
export type IndexTier = { id: ComponentTier; label: string; count: number; categories: IndexCategory[] };

/*
 * O nivel ativo vive na hash (#primitivo, #semantico, #semantico-dado): link
 * direto e "voltar" funcionam, e a ancora de categoria mantem o nivel.
 */
const subscribe = (cb: () => void) => {
  window.addEventListener("hashchange", cb);
  return () => window.removeEventListener("hashchange", cb);
};
const readTier = (): ComponentTier => (window.location.hash.startsWith("#semantico") ? "semantico" : "primitivo");
const anchor = (tier: string, cat: string) => `${tier}-${cat}`;
const fold = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

/** Indice de /componentes: abas por nivel, busca por nome e indice lateral da pagina. */
export function ComponentIndex({ tiers }: { tiers: IndexTier[] }) {
  const tier = useSyncExternalStore(subscribe, readTier, () => "primitivo" as ComponentTier);
  const [query, setQuery] = useState("");
  const q = fold(query.trim());

  // Com busca, os dois niveis; sem busca, so o da aba.
  const sections = useMemo(() => {
    const pick = q ? tiers : tiers.filter((t) => t.id === tier);
    return pick.flatMap((t) =>
      t.categories
        .map((c) => ({ ...c, tier: t.id, items: c.items.filter((i) => !q || fold(i.name).includes(q)) }))
        .filter((c) => c.items.length > 0),
    );
  }, [tiers, tier, q]);

  // Ancora de categoria do outro nivel: a secao so existe depois da troca de
  // aba, entao a rolagem acontece aqui, quando ela ja esta na pagina.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (id.includes("-")) document.getElementById(id)?.scrollIntoView();
  }, [tier]);

  // Indice: nivel > categoria, dos dois niveis (clicar numa categoria do outro
  // nivel troca a aba, porque a ancora carrega o nivel).
  const toc: TocItem[] = tiers.flatMap((t) => [
    { id: t.id, href: `#${t.id}`, label: t.label, level: 1 as const, count: t.count },
    ...t.categories.map((c) => ({ id: anchor(t.id, c.id), label: c.label, count: c.items.length })),
  ]);

  return (
    <>
      <DocHeader
        crumbs={[{ label: "Docs", href: "/" }, { label: "Componentes" }]}
        title="Componentes"
        divided
        actions={
          <Segmented
            size="md"
            value={tier}
            onChange={(t) => {
              setQuery("");
              window.location.hash = t;
            }}
            options={tiers.map((t) => ({
              value: t.id,
              label: (
                <span className="flex items-center gap-2xs">
                  {t.label}
                  <Count>{t.count}</Count>
                </span>
              ),
            }))}
          />
        }
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
          {sections.map((s) => (
            <section key={anchor(s.tier, s.id)} id={anchor(s.tier, s.id)} className="flex scroll-mt-6xl flex-col gap-sm">
              <SectionLabel>{s.label}</SectionLabel>
              <CardGrid minItem="space-192" gap="md" masonry={false}>
                {s.items.map((c) => {
                  const Thumb = thumbs[c.slug];
                  return (
                    <LinkCard
                      key={c.slug}
                      size="sm"
                      title={c.name}
                      href={`/componentes/${c.slug}`}
                      media={Thumb ? <Thumb /> : undefined}
                    />
                  );
                })}
              </CardGrid>
            </section>
          ))}
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
