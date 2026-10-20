"use client";

import { ProductHero, TestimonialGrid, LandingClosing } from "./product-landing";
import { LandingHeader } from "./landing-header";
import { TaskAppPreview } from "./task-showcase";
import { photo } from "./demo-people";
import type { DemoMap } from "./registry.types";

export const productLandingDemos: DemoMap = {
  "product-hero": {
    demos: [{
      title: "Produto com preview do app",
      layout: "stretch",
      code: `<ProductHero header={<LandingHeader productName="Compasso" … />} headline="Menos ruído na rotina." secondLine="Mais espaço para realizar." description="…" primary={{ label: "Começar", href: "#passos" }} secondary={{ label: "Conhecer", href: "#recursos" }} preview={<TaskAppPreview />} />`,
      Preview: () => <ProductHero header={<LandingHeader variant="inline" productName="Compasso" links={[{ label: "Produto", href: "#produto" }, { label: "Recursos", href: "#recursos" }]} cta="Vamos conversar" ctaHref="#contato" ctaVariant="contrast" />} headline="Menos ruído na rotina." secondLine="Mais espaço para realizar." description="Um lugar para combinar prioridades, aproximar o time e transformar planos em entregas." primary={{ label: "Começar agora", href: "#passos" }} secondary={{ label: "Conhecer o produto", href: "#recursos" }} preview={<TaskAppPreview productName="Compasso" />} />,
    }],
  },
  "testimonial-grid": {
    demos: [{
      title: "Resultados de três equipes",
      layout: "stretch",
      code: `<TestimonialGrid items={[{ result: "Uma semana mais leve", quote: "Agora cada pessoa sabe qual é o próximo passo.", person: { name: "Marina Rocha", src: photo("erica") }, role: "Design · Linha" }]} />`,
      Preview: () => <TestimonialGrid items={[
        { result: "Uma semana mais leve", quote: "Agora cada pessoa sabe qual é o próximo passo. A reunião virou conversa sobre ideias, e não cobrança de status.", person: { name: "Marina Rocha", src: photo("erica") }, role: "Design · Linha" },
        { result: "Mais foco, juntos", quote: "Saímos das mensagens espalhadas para um quadro que todo mundo entende. O projeto anda sem depender de uma pessoa só.", person: { name: "Rafael Lima", src: photo("pedro") }, role: "Produto · Órbita" },
        { result: "Entregas com contexto", quote: "O arquivo, o combinado e quem decide ficam no mesmo lugar. É uma diferença pequena que muda o dia inteiro.", person: { name: "Caio Alves", src: photo("sena") }, role: "Operações · Nimbo" },
      ]} />,
    }],
  },
  "landing-closing": {
    demos: [{
      title: "Próxima ação e rodapé",
      layout: "stretch",
      code: `<LandingClosing productName="Compasso" title="Seu time no mesmo compasso." description="Uma rotina com menos ruído." primary={{ label: "Montar meu quadro", href: "#passos" }} links={links} contact={{ label: "Conversar", href: "mailto:ola@compasso.example" }} />`,
      Preview: () => <LandingClosing productName="Compasso" title="Seu time no mesmo compasso." description="Uma rotina com menos ruído e mais espaço para o que importa." primary={{ label: "Montar meu quadro", href: "#passos" }} proof="Seu próximo projeto começa aqui" links={[{ label: "Produto", href: "#produto" }, { label: "Recursos", href: "#recursos" }]} contact={{ label: "Conversar", href: "mailto:ola@compasso.example" }} />,
    }],
  },
};
