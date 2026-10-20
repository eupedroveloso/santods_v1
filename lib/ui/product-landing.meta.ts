import type { ComponentMeta } from "./registry.types";

export const productLandingMeta: ComponentMeta[] = [
  {
    name: "ProductHero",
    slug: "product-hero",
    category: "blocos",
    tier: "marketing",
    source: "product-landing.tsx",
    description: "Abertura de produto com LandingHeader, LandingHero, gradiente da marca ativa, formas difusas, funções flutuantes e slot de preview recortado na base.",
    related: ["landing-header", "landing-hero", "task-app-preview"],
  },
  {
    name: "TestimonialGrid",
    slug: "testimonial-grid",
    category: "blocos",
    tier: "marketing",
    source: "product-landing.tsx",
    description: "Histórias de uso em três cartões com resultado, avaliação, citação original e autoria com avatar; uma coluna no celular.",
    related: ["rating", "avatar", "section-intro"],
  },
  {
    name: "LandingClosing",
    slug: "landing-closing",
    category: "blocos",
    tier: "marketing",
    source: "product-landing.tsx",
    description: "Encerramento de landing com prova social, chamada tonal, CTA e rodapé de produto com marca ativa e navegação por dados.",
    related: ["social-proof-row", "brand-logo", "button"],
  },
];
