import {
  BentoGrid,
  HeroCard,
  Icon,
  LandingHeader,
  LandingHero,
  LandingOffer,
  LandingPage,
  LogoStrip,
  SectionIntro,
  SocialProofToast,
  YouTubeEmbed,
  type BentoItem,
} from "@/lib/ui";
import { PEOPLE, photo } from "@/lib/ui/demo-people";

/**
 * Landing de VSL: so compoe blocos de lib/ui (regra D do lib:check), alimentados
 * por dado. Arquitetura (Pedro): header flutuante fixo -> hero em cartao (titulo em 2 linhas,
 * 2 acoes, video, avaliacao) -> faixa de logos ->
 * secao do metodo (intro + bento) -> oferta final. Segue a marca ativa da doc.
 */
const PEOPLE_ROW = [
  { name: PEOPLE.erica.name, src: photo("erica") },
  { name: PEOPLE.pedro.name, src: photo("pedro") },
  { name: PEOPLE.sena.name, src: photo("sena") },
];

const NAV = [
  { label: "Início", href: "#landing", active: true },
  { label: "Método", href: "#landing-metodo" },
  { label: "Para quem é", href: "#landing-para-quem" },
  { label: "Suporte", href: "#landing-suporte" },
];

const LOGOS = ["Hotmart", "Kiwify", "Eduzz", "Monetizze", "Braip", "Ticto", "Perfect Pay"];

const BENTO: BentoItem[] = [
  { kind: "illustration", value: "120+", caption: "aulas curtas, do zero à primeira venda" },
  {
    kind: "quote",
    value: "90 mil",
    caption: "alunos já passaram pelo método",
    people: PEOPLE_ROW,
    quote: "Vendi meu primeiro produto na mesma semana em que comecei.",
  },
  { kind: "brand", value: "520k+", caption: "produtos vendidos pelos alunos" },
  { kind: "inverse", label: "Agentes de IA", value: "45", caption: "fazendo o trabalho pesado por você" },
];

export function LandingScreen() {
  return (
    <LandingPage
      fullBleed
      className="flex-1"
      header={<LandingHeader links={NAV} loginHref="#landing-login" cta="Entrar" ctaHref="#landing-entrar" offset />}
      overlay={
        <SocialProofToast
          placement="frame"
          name={PEOPLE.sena.name.split(" ")[0]}
          avatarSrc={photo("sena", 40)}
          message="acabou de garantir o Venda Todo Santo Dia"
        />
      }
    >
      <HeroCard
        rating={{ value: 4.5, label: "Avaliado 4,9/5 por 20 mil alunos" }}
      >
        <LandingHero
          proof={{ people: PEOPLE_ROW, text: "+ de 20 mil alunos já vendem todo dia" }}
          headline="Crie um produto digital que vende em poucos dias"
          secondLine="com 45 agentes de IA fazendo o trabalho por você"
          subheadline="O passo a passo que mais de 90 mil pessoas usaram pra sair do zero, sem audiência e mesmo que você não queira aparecer"
          actions={{ secondary: { label: "Ver o método", href: "#landing-metodo" }, primary: { label: "Quero vender todos os dias", href: "#landing" } }}
        />
        <YouTubeEmbed video="https://www.youtube.com/watch?v=J4EUeLREgNk" title="Aula: a lógica por trás do Venda Todo Santo Dia" frame="double" />
      </HeroCard>
      <LogoStrip label="Alunos vendendo em" names={LOGOS} />
      <SectionIntro
        overline="O método"
        lines={[
          ["Do zero à primeira venda ", { icon: <Icon.Sparkles size={16} /> }, " com"],
          ["agentes que criam, publicam ", { icon: <Icon.TrendUp size={16} /> }],
          ["e vendem por você, todo dia"],
        ]}
      />
      <BentoGrid items={BENTO} />
      <LandingOffer people={PEOPLE_ROW} proof="+90 mil alunos" cta="Quero vender todos os dias" ctaHref="#landing" rating={4.5} ratingLabel="4,9/5" />
    </LandingPage>
  );
}
