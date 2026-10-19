import type { Metadata } from "next";
import { listTextStyles } from "@/lib/docs/catalog";
import type { TextStyleEntry } from "@/lib/docs/catalog.types";
import { CopyCode, TableOfContents, Tag, type TocItem } from "@/lib/ui";
import { DocHeader, DocPage } from "../../_docs/page-header";
import { groupAnchor, rolesOf, TYPE_GROUPS } from "../_parts/groups";
import { TypeAccordion, type RoleGroup } from "../_parts/type-accordion";

export const metadata: Metadata = {
  title: "Tipografia · Estilos · SantoDS",
  description: "Os text styles do Figma, renderizados com a própria classe santo-*.",
};

const SAMPLE = "Uma base única que se adapta a cada produto";
const CODE_SAMPLE = "color: var(--santo-color-text-primary);";

export default function TipografiaPage() {
  const styles = listTextStyles();

  const groups: RoleGroup[] = TYPE_GROUPS.flatMap((g) => {
    const roles = rolesOf(styles, g.match);
    if (roles.length === 0) return [];
    const sample = g.id === "code" ? CODE_SAMPLE : SAMPLE;
    return [
      {
        id: g.id,
        label: g.label,
        count: roles.reduce((n, r) => n + r.items.length, 0),
        roles: roles.map(({ role, items }) => ({
          role,
          count: items.length,
          // Amostra do cabecalho no peso regular do papel, quando existe.
          sampleClass: (items.find((s) => s.fontWeight === 400) ?? items[0]).className,
          slugs: items.map((s) => s.slug),
          content: items.map((s) => <StyleRow key={s.slug} style={s} sample={sample} />),
        })),
      },
    ];
  });

  const toc: TocItem[] = groups.flatMap((g) => [
    { id: groupAnchor(g.id), label: g.label, level: 1 as const, count: g.count },
    ...g.roles.map((r) => ({ id: r.role, label: r.role, level: 2 as const, count: r.count })),
  ]);

  return (
    <DocPage>
      <DocHeader
        crumbs={[{ label: "Docs", href: "/" }, { label: "Estilos", href: "/estilos" }, { label: "Tipografia" }]}
        title="Tipografia"
        divided
        actions={
          <div className="flex flex-wrap items-center gap-2xs">
            <Tag>{styles.length} text styles</Tag>
          </div>
        }
      />

      <div className="flex gap-xl">
        <div className="min-w-0 flex-1">
          <TypeAccordion groups={groups} />
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

function StyleRow({ style: s, sample }: { style: TextStyleEntry; sample: string }) {
  return (
    <div id={s.slug} className="flex scroll-mt-6xl flex-col gap-sm border-t-thin border-border-subtle py-md first:border-t-0 first:pt-0 last:pb-0">
      <p className={`${s.className} truncate text-text-primary`}>{sample}</p>
      <div className="flex flex-wrap items-center gap-x-md gap-y-xs">
        <span className="santo-body-small-medium text-text-primary">{s.name}</span>
        <CopyCode value={s.className} label={`Copiar classe ${s.className}`} />
        {/* Dados em badge; o token de origem de cada valor fica no title. Tracking sem token sai em warning. */}
        <span className="flex flex-wrap items-center gap-2xs tabular-nums">
          <span title={s.tokens.fontFamily}><Tag>{s.family}</Tag></span>
          <span title={s.tokens.fontWeight}><Tag>{s.fontStyle} {s.fontWeight}</Tag></span>
          <span title={`${s.tokens.fontSize} / ${s.tokens.lineHeight}`}><Tag>{s.fontSize}/{s.lineHeight}<span className="santo-caption-small-medium text-text-tertiary">px</span></Tag></span>
          <span title={s.tokens.letterSpacing ?? "Tracking sem token"}>
            <Tag intent={s.tokens.letterSpacing === null ? "warning" : "neutral"}>{s.letterSpacing}<span className="santo-caption-small-medium text-text-tertiary">%</span></Tag>
          </span>
        </span>
      </div>
    </div>
  );
}
