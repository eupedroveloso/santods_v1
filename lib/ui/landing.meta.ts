import type { ComponentMeta } from "./registry.types";

export const landingMeta: ComponentMeta[] = [
  {
    name: "LandingPage",
    slug: "landing-page",
    category: "blocos",
    tier: "semantico",
    source: "landing.tsx",
    description:
      "Moldura de página de venda: header no topo, superfície de página e coluna central (container/lg; fullBleed = largura total para o vídeo); brand grava data-brand para a página inteira.",
    related: ["landing-hero", "landing-offer", "social-proof-toast"],
  },
  {
    name: "LandingHeader",
    slug: "landing-header",
    category: "blocos",
    tier: "semantico",
    source: "landing-header.tsx",
    description:
      "Topo da landing em painel flutuante de largura total (raised, borda, sombra, raio xl concêntrico): logo, menu em trilho com ativo elevado, Login e CTA; sticky afastado do topo; gaveta dentro do painel no celular.",
    related: ["landing-page", "brand-logo", "button"],
  },
  {
    name: "LandingHero",
    slug: "landing-hero",
    category: "blocos",
    tier: "semantico",
    source: "landing.tsx",
    description:
      "Abertura de landing: logo, prova social (proof), headline com trecho em cor de marca, subheadline, parágrafo de chamada com destaque em cor de texto e legenda do vídeo.",
    related: ["landing-page", "youtube-embed"],
  },
  {
    name: "SocialProofRow",
    slug: "social-proof-row",
    category: "blocos",
    tier: "semantico",
    source: "landing.tsx",
    description:
      "Linha de prova social: até 3 avatares com foto + texto curto, centrados. Tom texto acima da headline, overline junto do CTA.",
    related: ["landing-hero", "landing-offer", "avatar-group"],
  },
  {
    name: "LandingOffer",
    slug: "landing-offer",
    category: "blocos",
    tier: "semantico",
    source: "landing.tsx",
    description:
      "Oferta abaixo do vídeo: até 3 avatares + contagem de alunos, o CTA principal e a avaliação.",
    related: ["cta-button", "rating", "landing-page"],
  },
];
