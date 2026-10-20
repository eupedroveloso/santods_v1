import type { Metadata } from "next";
import Link from "next/link";
import {
  getCollection,
  listCollections,
  listIdentities,
  type IdentityEntry,
} from "@/lib/docs/catalog";
import { Card, CardGrid, CardHeader, Tag, TokenSample } from "@/lib/ui";
import { SantoLogo } from "../_docs/logo";
import { BrandPreview } from "./brand-preview";
import {
  DocHeader,
  DocPage,
  SectionLabel,
  SectionTitle,
} from "../_docs/page-header";

export const metadata: Metadata = {
  title: "Identidades",
  description:
    "Uma identidade por produto da Ready To Go: paleta, tipografia, raio e sombra, lidos do Figma.",
};

/** Variavel do catalogo pelo nome do Figma, em qualquer colecao dada. */
function variableIn(slug: string, name: string) {
  return (
    getCollection(slug)
      ?.groups.flatMap((g) => g.variables)
      .find((v) => v.name === name) ?? null
  );
}

function radiusScale() {
  return (getCollection("semantic")?.groups ?? [])
    .flatMap((g) => g.variables)
    .filter((v) => v.name.startsWith("radius/") && v.name !== "radius/none");
}

export default function IdentidadesPage() {
  const identities = listIdentities();
  const radii = radiusScale();
  const sansVar = variableIn("brand", "brand/family/sans")?.cssVar;
  const monoVar = variableIn("brand", "brand/family/mono")?.cssVar;
  const brand = getCollection("brand");
  const sources = listCollections().filter((c) =>
    ["brand", "palette"].includes(c.slug),
  );

  return (
    <DocPage>
      <DocHeader
        crumbs={[{ label: "Docs", href: "/" }, { label: "Identidades" }]}
        title="Identidades"
      />

      <section className="flex flex-col gap-md">
        <SectionTitle
          id="produtos"
          title="Produtos"
          count={identities.length}
        />
        <CardGrid columns={{ base: 1 }}>
          {identities.map((identity) => (
            <IdentityCard
              key={identity.slug}
              identity={identity}
              radii={radii}
              sansVar={sansVar}
              monoVar={monoVar}
              isDefault={identity.mode === brand?.defaultMode}
            />
          ))}
        </CardGrid>
      </section>

      <p className="santo-caption-regular flex flex-wrap items-center gap-sm">
        {sources.map((c) => (
          <Link
            key={c.slug}
            href={c.route}
            className="text-text-link-default hover:text-text-link-hover hover:underline"
          >
            {c.name}
          </Link>
        ))}
      </p>
    </DocPage>
  );
}

function IdentityCard({
  identity,
  radii,
  sansVar,
  monoVar,
  isDefault,
}: {
  identity: IdentityEntry;
  radii: ReturnType<typeof radiusScale>;
  sansVar?: string;
  monoVar?: string;
  isDefault: boolean;
}) {
  const shadows = identity.shadows.filter((sh) => sh.name !== "none");
  return (
    // data-brand no cartao inteiro: paleta, fontes, raios e preview resolvem
    // as vars da identidade deste cartao, nao da marca ativa no documento.
    // E o seletor que o emit.mjs usara para cada modo de marca (F0).
    <div id={identity.slug} data-brand={identity.id} className="scroll-mt-6xl">
      <Card padded={false} className="overflow-hidden">
        <div className="flex flex-col gap-lg p-lg">
          {identity.id === "santo" && <SantoLogo size={32} />}
          <CardHeader
            title={identity.name}
            action={isDefault ? <Tag intent="brand">Padrão</Tag> : undefined}
          />

          <div className="flex flex-col gap-xs">
            <SectionLabel>Paleta</SectionLabel>
            <div className="flex flex-wrap gap-md">
              {identity.palette.map((p) => (
                <TokenSample
                  key={p.family}
                  variant="swatch"
                  value={`var(${p.cssVar})`}
                  label={<span className="capitalize">{p.family}</span>}
                  caption={p.value}
                />
              ))}
            </div>
          </div>

          {/* Cada painel com a altura do conteudo (sem margem morta). As amostras
              de raio e de sombra dividem as mesmas colunas, entao amostra e
              rotulo caem na mesma linha de base nas duas fileiras. */}
          <CardGrid columns={{ xl: 2 }}>
            <div className="flex flex-col gap-xs">
              <SectionLabel>Tipografia</SectionLabel>
              <Card variant="inset" padding="md">
                <div className="flex flex-col gap-3xs">
                  <span
                    className="santo-heading-4-semibold"
                    style={sansVar ? { fontFamily: `var(${sansVar})` } : undefined}
                  >
                    Aa Bb Cc 0123
                  </span>
                  <span className="santo-caption-regular text-text-secondary">{identity.families.sans}</span>
                </div>
                <div className="flex flex-col gap-3xs">
                  <span
                    className="santo-body-regular"
                    style={monoVar ? { fontFamily: `var(${monoVar})` } : undefined}
                  >
                    {"const santo = { id: 0 };"}
                  </span>
                  <span className="santo-caption-regular text-text-secondary">{identity.families.mono}</span>
                </div>
              </Card>
            </div>

            <div className="flex flex-col gap-xs">
              <SectionLabel>Raio e sombra</SectionLabel>
              <Card variant="inset" padding="md">
                {/* Raio e sombra em duas grades com o MESMO molde de colunas: amostra e
                    rotulo caem na mesma coluna nas duas fileiras, e a 375 viram 4 colunas. */}
                {[
                  radii.map((r) => ({ key: r.name, title: r.cssVar, label: r.leaf, sample: <TokenSample variant="radius" value={`var(${r.cssVar})`} /> })),
                  shadows.map((sh) => ({ key: sh.name, title: sh.cssVar, label: sh.name, sample: <TokenSample variant="shadow" value={`var(${sh.cssVar})`} /> })),
                ].map((row, i) => (
                  <CardGrid key={i} columns={{ base: 4, sm: 8 }} gap="md" masonry={false}>
                    {row.map((it) => (
                      <div key={it.key} className="flex flex-col items-start gap-xs" title={it.title}>
                        {it.sample}
                        <span className="santo-caption-small-regular text-text-tertiary">{it.label}</span>
                      </div>
                    ))}
                  </CardGrid>
                ))}
                <span className="santo-caption-regular text-text-secondary">
                  Raio base: <span className="santo-code-sm">{identity.radiusBase.css}</span>
                </span>
              </Card>
            </div>
          </CardGrid>
        </div>

        <div className="flex flex-col gap-xs border-t-thin border-border-subtle bg-surface-sunken p-lg">
          <SectionLabel>Preview</SectionLabel>
          <BrandPreview name={identity.name} />
        </div>
      </Card>
    </div>
  );
}
