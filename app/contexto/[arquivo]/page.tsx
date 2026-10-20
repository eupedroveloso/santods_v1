import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buttonClass, Card, DownloadList, formatBytes, Icon, MarkdownView, markdownHeadings } from "@/lib/ui";
import { DocHeader, DocPage } from "../../_docs/page-header";
import { listContext, readContext } from "../../_docs/contexto";

/** So existem os arquivos do indice; qualquer outro slug e 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return listContext().map((d) => ({ arquivo: d.slug }));
}

const find = (slug: string) => listContext().find((d) => d.slug === slug);

export async function generateMetadata({ params }: PageProps<"/contexto/[arquivo]">): Promise<Metadata> {
  const doc = find((await params).arquivo);
  return { title: doc ? `${doc.titulo} · Contexto` : "Contexto" };
}

export default async function ContextDocPage({ params }: PageProps<"/contexto/[arquivo]">) {
  const doc = find((await params).arquivo);
  if (!doc) notFound();

  // O titulo do documento ja e o h1 do DocHeader: sai a primeira linha "# ...".
  const source = doc.pacote ? "" : readContext(doc).replace(/^\s*# .*\n/, "");
  const toc = doc.pacote ? [] : markdownHeadings(source);
  const parts = doc.pacote ? listContext().filter((d) => !d.pacote) : [];

  return (
    <DocPage
      layout="reading"
      crumbs={[{ label: "Docs", href: "/" }, { label: "Contexto", href: "/#contexto" }, { label: doc.titulo }]}
      toc={toc}
    >
      <DocHeader
        title={doc.titulo}
        description={
          doc.pacote ? `Os ${parts.length} documentos abaixo num único arquivo, para colar numa conversa ou guardar.` : undefined
        }
        divided
        actions={
          <div className="flex flex-wrap items-center gap-sm">
            <span className="santo-code-sm text-text-tertiary">{doc.arquivo}</span>
            {doc.tamanho !== undefined && (
              <span className="santo-caption-medium tabular-nums text-text-tertiary">{formatBytes(doc.tamanho)}</span>
            )}
            <a href={doc.href} download className={buttonClass({ variant: "primary", size: "sm" })}>
              <Icon.Download size={16} />
              Baixar
            </a>
          </div>
        }
      />

      {doc.pacote ? (
        <Card>
          <DownloadList
            items={parts.map((d) => ({ href: d.href, viewHref: d.page, title: d.titulo, size: d.tamanho }))}
          />
        </Card>
      ) : (
        <MarkdownView source={source} />
      )}
    </DocPage>
  );
}
