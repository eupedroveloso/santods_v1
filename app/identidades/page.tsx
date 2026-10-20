import type { Metadata } from "next";
import Link from "next/link";
import {
  getCollection,
  listCollections,
  listIdentities,
} from "@/lib/docs/catalog";
import { BrandCard, CardGrid } from "@/lib/ui";
import {
  DocHeader,
  DocPage,
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

/** Degrau da Palette para o qual color/surface/page aponta num modo de tema (Light/Dark). */
function pageStep(theme: "Light" | "Dark") {
  return variableIn("color", "color/surface/page")?.values.find((v) => v.mode === theme)?.alias ?? null;
}

/** Var e hex de um degrau da Palette num modo de marca. */
function paletteColor(name: string | null, mode: string) {
  const v = name ? variableIn("palette", name) : null;
  return { cssVar: v?.cssVar ?? "", value: v?.values.find((m) => m.mode === mode)?.css ?? "—" };
}

export default function IdentidadesPage() {
  const identities = listIdentities();
  const brand = getCollection("brand");
  const light = pageStep("Light");
  const dark = pageStep("Dark");
  const sources = listCollections().filter((c) => ["brand", "palette"].includes(c.slug));

  return (
    <DocPage>
      <DocHeader crumbs={[{ label: "Docs", href: "/" }, { label: "Identidades" }]} title="Identidades" divided />

      <section className="flex flex-col gap-md">
        <CardGrid columns={{ base: 1 }} masonry={false}>
          {identities.map((identity) => {
            const brandColor = identity.palette.find((p) => p.family === "brand");
            return (
              <BrandCard
                key={identity.slug}
                brand={identity.id}
                name={identity.name}
                isDefault={identity.mode === brand?.defaultMode}
                font={identity.families.sans}
                color={{ cssVar: brandColor?.cssVar ?? "", value: brandColor?.value ?? "—" }}
                neutrals={{ light: paletteColor(light, identity.mode), dark: paletteColor(dark, identity.mode) }}
                radius={{ cssVar: identity.radiusBase.cssVar, value: identity.radiusBase.css }}
              />
            );
          })}
        </CardGrid>
      </section>

      <p className="santo-caption-regular flex flex-wrap items-center gap-sm">
        {sources.map((c) => (
          <Link key={c.slug} href={c.route} className="text-text-link-default hover:text-text-link-hover hover:underline">
            {c.name}
          </Link>
        ))}
      </p>
    </DocPage>
  );
}
