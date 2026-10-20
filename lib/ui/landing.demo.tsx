"use client";

import { PEOPLE as DEMO_PEOPLE, photo } from "./demo-people";
import { LandingHero, LandingOffer, LandingPage, SocialProofRow } from "./landing";
import { LandingHeader } from "./landing-header";
import type { DemoMap } from "./registry.types";

const PEOPLE = (["erica", "pedro", "sena"] as const).map((p) => ({ name: DEMO_PEOPLE[p].name, src: photo(p) }));

export const landingDemos: DemoMap = {
  "landing-page": {
    playground: {
      controls: [{ kind: "select", prop: "brand", label: "Marca", options: ["vtsd", "santo"], initial: "vtsd" },
        { kind: "boolean", prop: "fullBleed", label: "Largura total", initial: false },
      ],
      layout: "stretch",
      Preview: ({ values: v }) => (
        <LandingPage
          brand={v.brand as string}
          framed
          fullBleed={v.fullBleed as boolean}
          className="w-full"
          header={
            <LandingHeader
              brand={v.brand as string}
              links={[
                { label: "Início", href: "#lp-inicio", active: true },
                { label: "Método", href: "#lp-metodo" },
                { label: "Suporte", href: "#lp-suporte" },
              ]}
              loginHref="#lp-login"
              cta="Entrar"
              ctaHref="#lp-entrar"
            />
          }
        >
          <LandingHero
            brand={v.brand as string}
            headline="Uma página, uma promessa"
            highlight="uma promessa"
            lead="Os blocos funcionam em qualquer marca"
            leadHighlight="qualquer marca"
          />
          <LandingOffer people={PEOPLE} proof="+90 mil alunos" cta="Quero começar agora" rating={4.5} ratingLabel="4,9/5" />
        </LandingPage>
      ),
      code: (v) => `<LandingPage brand="${v.brand}" framed header={<LandingHeader brand="${v.brand}" links={…} cta="Entrar" ctaHref="…" />}>
  <LandingHero brand="${v.brand}" … />
  <YouTubeEmbed … />
  <LandingOffer … />
</LandingPage>`,
    },
    demos: [],
  },
  "landing-hero": {
    demos: [
      {
        title: "Abertura completa",
        layout: "stretch",
        code: `<LandingHero
  brand="vtsd" proof={{ people: pessoas, text: "+ de 20 mil alunos já vendem todo dia" }}
  headline="Crie um produto … com 45 agentes de IA …" highlight="45 agentes de IA"
  subheadline="…" lead="Nessa aula … 3 detalhes …" leadHighlight="3 detalhes" caption="Assista a aula…" />`,
        Preview: () => (
          <LandingPage brand="vtsd" className="w-full">
            <LandingHero
              brand="vtsd"
              proof={{ people: PEOPLE, text: "+ de 20 mil alunos já vendem todo dia" }}
              headline="Crie um produto digital com 45 agentes de IA"
              highlight="45 agentes de IA"
              subheadline="O passo a passo para sair do zero, sem audiência."
              lead="Nessa aula você vai descobrir 3 detalhes que fazem vender"
              leadHighlight="3 detalhes"
              caption="Assista a aula:"
            />
          </LandingPage>
        ),
      },
    ],
  },
  "social-proof-row": {
    playground: {
      controls: [
        { kind: "select", prop: "tone", label: "Tom", options: ["text", "overline"], initial: "text" },
        { kind: "text", prop: "text", label: "Texto", initial: "+ de 20 mil alunos já vendem todo dia" },
      ],
      Preview: ({ values: v }) => <SocialProofRow people={PEOPLE} text={v.text as string} tone={v.tone as "text" | "overline"} />,
      code: (v) => `<SocialProofRow people={pessoas} text="${v.text}"${v.tone !== "text" ? ` tone="${v.tone}"` : ""} />`,
    },
    demos: [],
  },
  "landing-offer": {
    demos: [
      {
        title: "Prova, CTA e avaliação",
        layout: "stretch",
        code: `<LandingOffer people={pessoas} proof="+90 mil alunos" cta="Quero vender todos os dias" rating={4.5} ratingLabel="4,9/5" />`,
        Preview: () => (
          <LandingPage brand="vtsd" className="w-full">
            <LandingOffer people={PEOPLE} proof="+90 mil alunos" cta="Quero vender todos os dias" rating={4.5} ratingLabel="4,9/5" />
          </LandingPage>
        ),
      },
    ],
  },
};
