import type { Metadata } from "next";
import { listMotion } from "@/lib/docs/catalog";
import type { MotionDuration, MotionEasing } from "@/lib/docs/catalog.types";
import { Card, CopyCode, Count, Table, TableOfContents, Tag, TokenSample, type Column, type TocItem } from "@/lib/ui";
import { DocHeader, DocPage, SectionLabel } from "../../_docs/page-header";
import { MotionRecipes, ReducedMotionSwitch } from "../_parts/motion-recipes";
import { RECIPES } from "../_parts/recipes";

export const metadata: Metadata = {
  title: "Movimento · Estilos · SantoDS",
  description: "Tokens de duração e curva do Figma.",
};

/** Ancora no padrao do slug de variavel: motion-duration-fast, motion-easing-standard. */
const anchor = (kind: "duration" | "easing", slug: string) => `motion-${kind}-${slug}`;

/** Larguras minimas por token: as duas tabelas empilhadas alinham coluna com coluna. */
/** Nome do token e valor em pilula na mesma linha (titulo + meta). */
const TOKEN = "flex scroll-mt-6xl flex-wrap items-center gap-xs";
/** Var CSS e classe empilhadas numa coluna: cabe ao lado do indice sem rolar. */
const USE = "flex min-w-0 flex-col items-start gap-2xs";
const SAMPLE = "flex items-center";

const durationColumns: Column<MotionDuration>[] = [
  {
    key: "sample",
    header: "Amostra",
    width: 128,
    render: (d) => (
      <span className={SAMPLE}>
        <TokenSample variant="duration" value={`var(${d.cssVar})`} />
      </span>
    ),
  },
  {
    key: "token",
    header: "Token",
    width: 384,
    render: (d) => (
      <span id={anchor("duration", d.slug)} className={TOKEN}>
        <span className="santo-body-small-medium whitespace-nowrap">{d.name}</span>
        <Tag>
          {d.ms}
          <span className="santo-caption-small-medium text-text-tertiary">ms</span>
        </Tag>
      </span>
    ),
  },
  {
    key: "use",
    header: "Uso",
    render: (d) => (
      <span className={USE}>
        <CopyCode truncate value={d.cssVar} label={`Copiar ${d.cssVar}`} />
        <CopyCode truncate value={d.tailwind} label={`Copiar classe ${d.tailwind}`} />
      </span>
    ),
  },
];

const easingColumns: Column<MotionEasing>[] = [
  {
    key: "sample",
    header: "Amostra",
    width: 128,
    render: (e) => (
      <span className={SAMPLE}>
        {e.bezier ? (
          <TokenSample variant="easing" value={`var(${e.cssVar})`} bezier={e.bezier} />
        ) : (
          <span className="santo-caption-regular text-text-disabled">—</span>
        )}
      </span>
    ),
  },
  {
    key: "token",
    header: "Token",
    width: 384,
    render: (e) => (
      <span id={anchor("easing", e.slug)} className={TOKEN}>
        <span className="santo-body-small-medium whitespace-nowrap">{e.name}</span>
        <Tag>{e.css}</Tag>
      </span>
    ),
  },
  {
    key: "use",
    header: "Uso",
    render: (e) => (
      <span className={USE}>
        <CopyCode truncate value={e.cssVar} label={`Copiar ${e.cssVar}`} />
        <CopyCode truncate value={e.tailwind} label={`Copiar classe ${e.tailwind ?? ""}`} />
      </span>
    ),
  },
];

export default function MovimentoPage() {
  const { durations, easings } = listMotion();
  const toc: TocItem[] = [
    { id: "duracao", label: "Duração", count: durations.length },
    { id: "curva", label: "Curva", count: easings.length },
    { id: "receitas", label: "Receitas", count: RECIPES.length },
  ];

  return (
    <DocPage>
      <DocHeader
        crumbs={[{ label: "Docs", href: "/" }, { label: "Estilos", href: "/estilos" }, { label: "Movimento" }]}
        title="Movimento"
        divided
        actions={
          <div className="flex flex-wrap items-center gap-md">
            <span className="flex flex-wrap items-center gap-2xs">
              <Tag>{durations.length} durações</Tag>
              <Tag>{easings.length} curvas</Tag>
            </span>
            <ReducedMotionSwitch />
          </div>
        }
      />

      <div className="flex gap-xl">
        <div className="flex min-w-0 flex-1 flex-col gap-3xl">
          <section id="duracao" className="flex scroll-mt-6xl flex-col gap-sm">
            <span className="flex items-center gap-xs">
              <SectionLabel>Duração</SectionLabel>
              <Count>{durations.length}</Count>
            </span>
            <Card padding="sm">
              <Table layout="fixed" columns={durationColumns} rows={durations} getKey={(d) => d.slug} />
            </Card>
          </section>

          <section id="curva" className="flex scroll-mt-6xl flex-col gap-sm">
            <span className="flex items-center gap-xs">
              <SectionLabel>Curva</SectionLabel>
              <Count>{easings.length}</Count>
            </span>
            <Card padding="sm">
              <Table layout="fixed" columns={easingColumns} rows={easings} getKey={(e) => e.slug} />
            </Card>
          </section>

          <section id="receitas" className="flex scroll-mt-6xl flex-col gap-sm">
            <span className="flex items-center gap-xs">
              <SectionLabel>Receitas</SectionLabel>
              <Count>{RECIPES.length}</Count>
            </span>
            <MotionRecipes />
          </section>
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
