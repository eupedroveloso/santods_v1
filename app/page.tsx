import { listCollections, listEffectStyles, listIdentities, listTextStyles } from "@/lib/docs/catalog";
import { figmaSource } from "@/lib/tokens";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { Card, CardGrid, componentsByTier, DownloadList, EmptyState, Icon, LinkCard, Overline, type DownloadItem } from "@/lib/ui";
import { DocHeader, DocPage } from "./_docs/page-header";
import { FIGMA_URL, groupAnchor } from "./_docs/links";

type ContextEntry = { arquivo: string; titulo: string; descricao?: string; tamanho?: number };

/**
 * Indice do contexto do sistema (gerado pelo Compasso em public/contexto),
 * lido no build. Sem o arquivo, null: a secao mostra o estado vazio.
 */
async function contextFiles(): Promise<DownloadItem[] | null> {
  try {
    const raw = await readFile(join(process.cwd(), "public/contexto/indice.json"), "utf8");
    const entries = JSON.parse(raw) as ContextEntry[];
    return entries.map((e) => ({
      href: `/contexto/${e.arquivo}`,
      title: e.titulo,
      description: e.descricao,
      size: e.tamanho,
      featured: e.arquivo.endsWith(".txt"),
    }));
  } catch {
    return null;
  }
}

export default async function DocsHome() {
  const files = await contextFiles();
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
        <div className="flex flex-col gap-xs">
          <Overline>Contexto do sistema</Overline>
          <p className="santo-body-regular max-w-(--santo-dimension-container-sm) text-pretty text-text-secondary">
            O SantoDS inteiro em texto: tokens, componentes, regras e como montar a documentação. Para replicar o
            sistema em outro projeto ou dar contexto a um agente.
          </p>
        </div>
        <Card>
          {files && files.length > 0 ? (
            <DownloadList items={files} />
          ) : (
            <EmptyState icon={<Icon.File size={16} />} title="O contexto ainda não foi gerado" />
          )}
        </Card>
      </section>
    </DocPage>
  );
}
