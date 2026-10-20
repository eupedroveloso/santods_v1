"use client";

import { PEOPLE, photo } from "./demo-people";
import * as Icon from "./icons";
import { BentoGrid, HeroCard, LogoStrip, SectionIntro, ShowcaseStrip, type BentoItem, type ShowcaseItem } from "./landing-sections";
import { LandingHeader } from "./landing-header";
import { LandingHero } from "./landing";
import type { DemoMap } from "./registry.types";

const SHOWCASE: ShowcaseItem[] = [
  { kind: "stat", label: "Vendas hoje", value: "R$ 4.820", unit: "+18%", trend: [3, 4, 3.5, 5, 6, 7.5] },
  { kind: "ring", label: "Meta do mês", value: 72 },
  { kind: "chat", text: "Primeira venda em 3 dias!" },
  { kind: "bars", label: "Pedidos", values: [4, 6, 5, 8, 11] },
  { kind: "photo", src: photo("erica", 40), name: PEOPLE.erica.name },
];

const BENTO: BentoItem[] = [
  { kind: "illustration", value: "120+", caption: "aulas curtas" },
  { kind: "quote", value: "90 mil", caption: "alunos", people: [{ name: PEOPLE.pedro.name, src: photo("pedro") }], quote: "Vendi na primeira semana." },
  { kind: "brand", value: "520k+", caption: "produtos vendidos" },
  { kind: "inverse", label: "Agentes de IA", value: "45", caption: "trabalhando por você" },
];

export const landingSectionsDemos: DemoMap = {
  "hero-card": {
    demos: [
      {
        title: "Hero completo",
        layout: "stretch",
        code: `<HeroCard header={<LandingHeader variant="inline" … />} rating={{ value: 4.5, label: "Avaliado 4,9/5" }}>
  <LandingHero headline="…" secondLine="…" actions={{ secondary, primary }} />
  <ShowcaseStrip items={itens} />
</HeroCard>`,
        Preview: () => (
          <HeroCard
            header={<LandingHeader variant="inline" links={[{ label: "Início", href: "#h-i", active: true }, { label: "Método", href: "#h-m" }]} cta="Entrar" ctaHref="#h-e" />}
            rating={{ value: 4.5, label: "Avaliado 4,9/5 por 20 mil alunos" }}
          >
            <LandingHero
              headline="Crie um produto digital que vende"
              secondLine="com agentes de IA fazendo o trabalho"
              actions={{ secondary: { label: "Ver o método", href: "#h-v" }, primary: { label: "Quero vender", href: "#h-q" } }}
            />
            <ShowcaseStrip items={SHOWCASE} />
          </HeroCard>
        ),
      },
    ],
  },
  "showcase-strip": {
    demos: [{ title: "Vitrine em arco", layout: "stretch", code: `<ShowcaseStrip items={itens} />`, Preview: () => <ShowcaseStrip items={SHOWCASE} /> }],
  },
  "logo-strip": {
    demos: [
      {
        title: "Faixa",
        layout: "stretch",
        code: `<LogoStrip label="Alunos vendendo em" names={["Hotmart", "Kiwify", "Eduzz"]} />`,
        Preview: () => <LogoStrip label="Alunos vendendo em" names={["Hotmart", "Kiwify", "Eduzz", "Monetizze", "Braip"]} />,
      },
    ],
  },
  "section-intro": {
    demos: [
      {
        title: "Título com ícones inline",
        layout: "stretch",
        code: `<SectionIntro overline="O método" lines={[["Do zero ", { icon: <Icon.Sparkles /> }, " à venda"], ["todo dia"]]} />`,
        Preview: () => (
          <div className="flex justify-center">
            <SectionIntro overline="O método" lines={[["Do zero à primeira ", { icon: <Icon.Sparkles size={16} /> }, " venda"], ["todo santo dia"]]} />
          </div>
        ),
      },
    ],
  },
  "bento-grid": {
    demos: [{ title: "Quatro cartões", layout: "stretch", code: `<BentoGrid items={itens} />`, Preview: () => <BentoGrid items={BENTO} /> }],
  },
};
