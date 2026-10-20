import { listCollections, listEffectStyles, listIdentities, listTextStyles } from "@/lib/docs/catalog";
import { figmaSource } from "@/lib/tokens";
import { Card, CardGrid, componentsByTier, DownloadList, EmptyState, Icon, LinkCard, Overline, type DownloadItem } from "@/lib/ui";
import { DocHeader, DocPage } from "./_docs/page-header";
import { listContext } from "./_docs/contexto";
import { FIGMA_URL, groupAnchor } from "./_docs/links";

export default function DocsHome() {
  const files: DownloadItem[] = listContext().map((d) => ({
    href: d.href,
    viewHref: d.page,
    title: d.titulo,
    size: d.tamanho,
    featured: d.pacote,
  }));
  const collections = listCollections();
  const textStyles = listTextStyles();
  const effects = listEffectStyles();
  const identities = listIdentities();

  return (
    <DocPage>
      <DocHeader
        title="Documentação"
      />

      <CardGrid columns={{ md: 2, xl: 3 }} gap="md" masonry={false} stretch>
        <LinkCard
          icon={<Icon.Palette size={20} />}
          title="Tokens"
          href="/tokens"
          links={collections.map((c) => ({ label: `${c.name} · ${c.count}`, href: c.route }))}
        />
        <LinkCard
          icon={<Icon.Type size={20} />}
          title="Estilos"
          href="/estilos"
          links={[
            { label: `Tipografia · ${textStyles.length}`, href: "/estilos/tipografia" },
            { label: `Efeitos · ${effects.length}`, href: "/estilos/efeitos" },
            { label: "Raio", href: `/tokens/semantic#${groupAnchor("radius")}` },
            { label: "Espaçamento", href: `/tokens/semantic#${groupAnchor("space")}` },
          ]}
        />
        <LinkCard
          icon={<Icon.Grid size={20} />}
          title="Componentes"
          href="/componentes"
          links={componentsByTier().map((t) => ({
            label: `${t.label} · ${t.items.length}`,
            href: `/componentes#${t.id}`,
          }))}
        />
        <LinkCard
          icon={<Icon.IdCard size={20} />}
          title="Identidades"
          href="/identidades"
          links={identities.map((i) => ({ label: i.name, href: `/identidades#${i.slug}` }))}
        />
        <LinkCard
          icon={<Icon.Layers size={20} />}
          title="Overview"
          href="/exemplos"
          links={[{ label: "Ver as telas", href: "/exemplos" }]}
        />
        <LinkCard
          icon={<Icon.Figma size={20} />}
          title="Figma"
          links={[{ label: `Abrir ${figmaSource.fileName}`, href: FIGMA_URL }]}
        />
      </CardGrid>

      <section id="contexto" className="flex scroll-mt-6xl flex-col gap-md">
        <Overline>Contexto do sistema</Overline>
        <Card>
          {files.length > 0 ? (
            <DownloadList items={files} />
          ) : (
            <EmptyState icon={<Icon.File size={16} />} title="O contexto ainda não foi gerado" />
          )}
        </Card>
      </section>
    </DocPage>
  );
}
