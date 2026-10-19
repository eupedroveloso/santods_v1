import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buttonClass, CATEGORY_LABEL, CodeBlock, components, getComponent, Icon, Tag, TIER_LABEL } from "@/lib/ui";
import { ComponentDemos } from "../../_docs/component-demos";
import { FIGMA_URL } from "../../_docs/links";
import { DocHeader, DocPage } from "../../_docs/page-header";

// So existem as paginas do registry; qualquer outro slug e 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return components.map((c) => ({ nome: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/componentes/[nome]">): Promise<Metadata> {
  const meta = getComponent((await params).nome);
  return meta ? { title: meta.name, description: meta.description } : {};
}

export default async function ComponentPage({ params }: PageProps<"/componentes/[nome]">) {
  const { nome } = await params;
  const meta = getComponent(nome);
  if (!meta) notFound();

  const index = components.indexOf(meta);
  const prev = components[index - 1];
  const next = components[index + 1];
  const related = (meta.related ?? []).map(getComponent).filter((c) => c !== undefined);
  const importLine = `import { ${meta.name} } from "@/lib/ui";`;

  return (
    <DocPage>
      <DocHeader
        crumbs={[
          { label: "Docs", href: "/" },
          { label: "Componentes", href: "/componentes" },
          { label: meta.name },
        ]}
        title={meta.name}
        divided
      >
        <div className="flex flex-wrap items-center gap-2xs">
          <Tag intent={meta.tier === "primitivo" ? "neutral" : "brand"}>{TIER_LABEL[meta.tier]}</Tag>
          <Tag>{CATEGORY_LABEL[meta.category]}</Tag>
          {meta.figma?.nodeId ? (
            <a
              href={`${FIGMA_URL}?node-id=${meta.figma.nodeId.replaceAll(":", "-")}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-full hover:underline"
            >
              <Tag intent="success">
                <Icon.Figma size={12} />
                Figma: {meta.figma.name}
                <Icon.ArrowUpRight size={12} />
              </Tag>
            </a>
          ) : meta.figma ? (
            <Tag intent="success">
              <Icon.Figma size={12} />
              Figma: {meta.figma.name}
            </Tag>
          ) : (
            <Tag intent="warning">
              <Icon.Figma size={12} />
              Sem par no Figma
            </Tag>
          )}
          <Tag>
            <Icon.Code size={12} />
            lib/ui/{meta.source}
          </Tag>
        </div>
      </DocHeader>



      <ComponentDemos slug={meta.slug} />

      <section className="flex flex-col gap-sm">
        <h2 className="santo-body-small-semibold text-text-primary">Uso</h2>
        <CodeBlock code={importLine} title={meta.source} />
      </section>

      {related.length > 0 && (
        <section className="flex flex-col gap-sm">
          <h2 className="santo-body-small-semibold text-text-primary">Relacionados</h2>
          <div className="flex flex-wrap gap-2xs">
            {related.map((r) => (
              <Link key={r.slug} href={`/componentes/${r.slug}`} className={buttonClass({ size: "sm" })}>
                {r.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* mt-auto: em pagina curta o rodape encosta no fim da UI; em pagina longa vem depois do conteudo. */}
      <nav
        aria-label="Outros componentes"
        className="mt-auto flex items-center justify-between gap-sm border-t-thin border-border-subtle pt-lg"
      >
        {prev ? (
          <Link href={`/componentes/${prev.slug}`} className={buttonClass({ variant: "ghost" })}>
            <Icon.ChevronLeft size={16} />
            {prev.name}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link href={`/componentes/${next.slug}`} className={buttonClass({ variant: "ghost" })}>
            {next.name}
            <Icon.ChevronRight size={16} />
          </Link>
        )}
      </nav>
    </DocPage>
  );
}
