import type { Metadata } from "next";
import { listEffectStyles, listMotion, listTextStyles } from "@/lib/docs/catalog";
import { CardGrid, Count, Icon, LinkCard } from "@/lib/ui";
import { DocHeader, DocPage, SectionLabel } from "../_docs/page-header";
import { groupAnchor, rolesOf, TYPE_GROUPS } from "./_parts/groups";

export const metadata: Metadata = {
  title: "Estilos · SantoDS",
  description: "Text styles e effect styles do Figma.",
};

export default function EstilosPage() {
  const text = listTextStyles();
  const effects = listEffectStyles();
  const motion = listMotion();

  return (
    <DocPage>
      <DocHeader
        crumbs={[{ label: "Docs", href: "/" }, { label: "Estilos" }]}
        title="Estilos"
        divided
      />

      <section className="flex flex-col gap-sm">
        <SectionLabel>Estilos</SectionLabel>
        <CardGrid columns={{ sm: 2, lg: 3 }} gap="md" masonry={false} stretch>
          <LinkCard
            icon={<Icon.Type size={16} />}
            title="Tipografia"
            meta={<Count>{text.length}</Count>}
            href="/estilos/tipografia"
            links={TYPE_GROUPS.filter((g) => rolesOf(text, g.match).length > 0).map((g) => ({
              label: g.label,
              href: `/estilos/tipografia#${groupAnchor(g.id)}`,
            }))}
          />
          <LinkCard
            icon={<Icon.Layers size={16} />}
            title="Efeitos"
            meta={<Count>{effects.length}</Count>}
            href="/estilos/efeitos"
            links={effects.map((e) => ({ label: e.name, href: `/estilos/efeitos#${e.slug}` }))}
          />
          <LinkCard
            icon={<Icon.BezierCurveIcon size={16} />}
            title="Movimento"
            meta={<Count>{motion.durations.length + motion.easings.length}</Count>}
            href={motion.route}
            links={[
              { label: "Duração", href: `${motion.route}#duracao` },
              { label: "Curva", href: `${motion.route}#curva` },
              { label: "Receitas", href: `${motion.route}#receitas` },
            ]}
          />
        </CardGrid>
      </section>
    </DocPage>
  );
}
