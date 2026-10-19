import type { Metadata } from "next";
import { getCollection, listCollections } from "@/lib/docs/catalog";
import { Count, LinkCard, Tag } from "@/lib/ui";
import { DocHeader, DocPage, SectionLabel } from "../_docs/page-header";
import { groupAnchor } from "../_docs/links";

export const metadata: Metadata = {
  title: "Tokens · SantoDS",
  description: "As coleções de variáveis do Figma, com valor por modo, var CSS e classe Tailwind.",
};

export default function TokensPage() {
  const collections = listCollections();
  const total = collections.reduce((n, c) => n + c.count, 0);

  return (
    <DocPage>
      <DocHeader
        crumbs={[{ label: "Docs", href: "/" }, { label: "Tokens" }]}
        title="Tokens"
        divided
        actions={
          <div className="flex flex-wrap items-center gap-2xs">
            <Tag>{total} variáveis</Tag>
            <Tag>{collections.length} coleções</Tag>
          </div>
        }
      />

      <section className="flex flex-col gap-sm">
        <SectionLabel>Coleções</SectionLabel>
        <div className="grid gap-md sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((c) => {
            const groups = getCollection(c.slug)?.groups ?? [];
            return (
              <LinkCard
                key={c.slug}
                title={c.name}
                meta={<Count>{c.count}</Count>}
                href={c.route}
                // Mesmo numero de atalhos em todo card: 3 grupos + "todos", para os irmaos terem a mesma altura.
                links={[
                  ...groups.slice(0, 3).map((g) => ({ label: g.name, href: `${c.route}#${groupAnchor(g.name)}` })),
                  { label: `Todos os ${groups.length} grupos`, href: c.route },
                ]}
              />
            );
          })}
        </div>
      </section>
    </DocPage>
  );
}
