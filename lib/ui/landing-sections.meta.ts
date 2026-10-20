import type { ComponentMeta } from "./registry.types";

export const landingSectionsMeta: ComponentMeta[] = [
  {
    name: "HeroCard",
    slug: "hero-card",
    category: "blocos",
    tier: "semantico",
    source: "landing-sections.tsx",
    description:
      "Hero em cartão: a abertura da landing dentro de um cartão grande em superfície de marca (brand/subtle, raio xl), com header inline, conteúdo e avaliação no pé.",
    related: ["landing-hero", "landing-header", "showcase-strip"],
  },
  {
    name: "ShowcaseStrip",
    slug: "showcase-strip",
    category: "blocos",
    tier: "semantico",
    source: "landing-sections.tsx",
    description:
      "Vitrine de produto no hero: 5 a 7 cartões pequenos de app (métrica, barras, anel, conversa, foto) em arco leve; faixa rolável no celular. Alimentada por dado.",
    related: ["hero-card"],
  },
  {
    name: "LogoStrip",
    slug: "logo-strip",
    category: "blocos",
    tier: "semantico",
    source: "landing-sections.tsx",
    description: "Faixa de logos (prova de mercado) em cinza entre hairlines; rola na horizontal no celular.",
    related: ["landing-page"],
  },
  {
    name: "SectionIntro",
    slug: "section-intro",
    category: "blocos",
    tier: "semantico",
    source: "landing-sections.tsx",
    description:
      "Abertura de seção: overline com ponto e título centrado em linhas, a última em tom secundário, com ícones inline em pastilha tonal.",
    related: ["bento-grid"],
  },
  {
    name: "BentoGrid",
    slug: "bento-grid",
    category: "blocos",
    tier: "semantico",
    source: "landing-sections.tsx",
    description:
      "Grade bento: grade fixa com spans planejados (ilustração de componente alta, métrica com depoimento, destaque em marca, cartão escuro largo) que fecha em todo breakpoint. Alimentada por dado.",
    related: ["section-intro", "card-grid"],
  },
];
