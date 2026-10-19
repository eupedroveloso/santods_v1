import type { Metadata } from "next";
import { componentsByTier } from "@/lib/ui";
import { ComponentIndex, type IndexTier } from "../_docs/component-index";
import { DocPage } from "../_docs/page-header";

export const metadata: Metadata = {
  title: "Componentes",
  description: "Documentação viva da biblioteca de componentes do SantoDS.",
};

export default function ComponentesPage() {
  const tiers: IndexTier[] = componentsByTier().map((t) => ({
    id: t.id,
    label: t.label,
    count: t.items.length,
    categories: t.categories.map((c) => ({
      id: c.id,
      label: c.label,
      items: c.items.map((i) => ({ slug: i.slug, name: i.name })),
    })),
  }));
  return (
    <DocPage>
      <ComponentIndex tiers={tiers} />
    </DocPage>
  );
}
