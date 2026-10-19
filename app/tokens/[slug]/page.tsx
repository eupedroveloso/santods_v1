import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCollection, listCollections } from "@/lib/docs/catalog";
import { Card, Count, TableOfContents, Tag, type TocItem } from "@/lib/ui";
import { DocHeader, DocPage, SectionLabel } from "../../_docs/page-header";
import { groupAnchor } from "../../_docs/links";
import { TokenTable } from "../_parts/token-table";

/** So existem as colecoes do snapshot; qualquer outro slug e 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return listCollections().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/tokens/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollection(slug);
  return { title: collection ? `${collection.name} · Tokens · SantoDS` : "Tokens · SantoDS" };
}

export default async function CollectionPage({ params }: PageProps<"/tokens/[slug]">) {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) notFound();

  const toc: TocItem[] = collection.groups.map((g) => ({ id: groupAnchor(g.name), label: g.name, count: g.variables.length }));

  return (
    <DocPage>
      <DocHeader
        crumbs={[{ label: "Docs", href: "/" }, { label: "Tokens", href: "/tokens" }, { label: collection.name }]}
        title={collection.name}
        divided
        actions={
          <div className="flex flex-wrap items-center gap-2xs">
            <Tag>{collection.count} variáveis</Tag>
            {collection.modes.map((m) => (
              <Tag key={m} intent={m === collection.defaultMode ? "brand" : "neutral"}>
                {m === collection.defaultMode ? `${m} · padrão` : m}
              </Tag>
            ))}
          </div>
        }
      />

      <div className="flex gap-xl">
        <div className="flex min-w-0 flex-1 flex-col gap-3xl">
          {collection.groups.map((group) => (
            <section key={group.name} id={groupAnchor(group.name)} className="flex scroll-mt-6xl flex-col gap-sm">
              <span className="flex items-center gap-xs">
                <SectionLabel>{group.name}</SectionLabel>
                <Count>{group.variables.length}</Count>
              </span>
              <Card padding="sm">
                <TokenTable variables={group.variables} modes={collection.modes} />
              </Card>
            </section>
          ))}

        </div>
        <aside className="hidden w-(--santo-dimension-space-224) shrink-0 lg:block">
          <div className="sticky top-[calc(var(--santo-dimension-size-56)+var(--santo-space-4xl))]">
            <TableOfContents items={toc} />
          </div>
        </aside>
      </div>
    </DocPage>
  );
}
