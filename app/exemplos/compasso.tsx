import {
  LandingClosing,
  LandingHeader,
  LandingPage,
  LogoStrip,
  ProductHero,
  SectionIntro,
  TaskAppPreview,
  TaskFeatureBento,
  TaskMetrics,
  TaskOnboarding,
  TestimonialGrid,
  type LandingTestimonial,
} from "@/lib/ui";
import { photo, portrait } from "@/lib/ui/demo-people";
import { LANDING, LANDING_BLOCKS } from "./_anchors";

const NAV = [
  { label: "Produto", href: `#${LANDING.home}` },
  ...LANDING_BLOCKS.filter((block) => block.id !== LANDING.contact).map((block) => ({ label: block.label, href: `#${block.id}` })),
];

const STORIES: LandingTestimonial[] = [
  { result: "A semana ganhou clareza.", quote: "A gente abria a segunda-feira procurando atualizações. Hoje o quadro mostra o que importa e a conversa começa pelas ideias.", person: portrait("clara", 40), role: "Líder de design · Mosaico" },
  { result: "Um time, de verdade.", quote: "Produto e desenvolvimento passaram a olhar para o mesmo plano. Cada entrega tem contexto, responsável e um próximo passo visível.", person: { name: "Rafael Lima", src: photo("pedro") }, role: "Produto · Órbita" },
  { result: "Menos idas e vindas.", quote: "O combinado não se perde mais no meio das mensagens. Até quem acabou de chegar consegue entender o projeto e contribuir.", person: portrait("leo", 40), role: "Operações · Nimbo" },
];

const CONTENT_WIDTH = "max-w-[calc(var(--santo-dimension-container-md)+var(--santo-dimension-space-128))]";
const SECTION = `mx-auto flex w-full ${CONTENT_WIDTH} scroll-mt-6xl flex-col items-center gap-xl px-md py-3xl md:gap-xl md:px-xl md:py-4xl`;

/** Composição por dados: toda interface e toda superfície vêm de blocos da lib. */
export function CompassoScreen() {
  return (
    <LandingPage rhythm="product" className="flex-1">
      <ProductHero
        header={<LandingHeader variant="inline" productName="Compasso" homeHref={`#${LANDING.home}`} links={NAV} cta="Vamos conversar" ctaHref={`#${LANDING.contact}`} ctaVariant="contrast" />}
        headline="Menos ruído na rotina."
        secondLine="Mais espaço para realizar."
        description="Planeje com clareza. Trabalhe junto. Faça o que importa."
        primary={{ label: "Organizar meu time", href: `#${LANDING.steps}` }}
        secondary={{ label: "Explorar o produto", href: `#${LANDING.resources}` }}
        roles={["Analista", "Desenvolvimento", "Pessoas & cultura", "Design"]}
        preview={<TaskAppPreview productName="Compasso" projectName="Lançamento Aurora" />}
      />
      <div className={`mx-auto w-full ${CONTENT_WIDTH} px-md md:px-xl`}>
        <LogoStrip variant="partners" label="Para equipes que fazem boas ideias acontecerem." names={["Arco", "Nimbo", "Órbita", "Mosaico"]} />
      </div>
      <div id={LANDING.resources} className={SECTION}>
        <SectionIntro lines={[["Tudo o que o time precisa."], ["No lugar onde o trabalho acontece."]]} description="Do primeiro rascunho à última revisão, cada detalhe encontra seu lugar." />
        <TaskFeatureBento />
      </div>
      <div id={LANDING.results} className={SECTION}>
        <SectionIntro lines={[["Seu time encontra o ritmo."], ["Os resultados acompanham."]]} description="Menos tarefas invisíveis. Mais acordos claros e entregas que fazem a diferença." />
        <TaskMetrics />
      </div>
      <div id={LANDING.steps} className={SECTION}>
        <SectionIntro lines={[["Um começo simples."], ["Três passos para sair do lugar."]]} description="Monte seu espaço, convide as pessoas e transforme o próximo plano em movimento." />
        <TaskOnboarding productName="Compasso" />
      </div>
      <div id={LANDING.stories} className={SECTION}>
        <SectionIntro lines={[["Gente que trabalha junto."], ["Histórias que vão além do quadro."]]} description="Quando o trabalho fica mais claro, sobra espaço para criar coisas melhores." />
        <TestimonialGrid items={STORIES} />
      </div>
      <div id={LANDING.contact} className={`mx-auto w-full ${CONTENT_WIDTH} scroll-mt-6xl px-md pt-xl md:px-xl`}>
        <LandingClosing
          productName="Compasso"
          title="Seu próximo projeto merece um novo compasso."
          description="Reúna as ideias, combine o próximo passo e descubra como é bom ver o trabalho acontecer junto."
          primary={{ label: "Montar meu primeiro quadro", href: `#${LANDING.steps}` }}
          people={STORIES.map((story) => story.person)}
          proof="Mais clareza para cada pessoa do time"
          links={NAV.slice(1)}
          contact={{ label: "Falar com a equipe", href: "mailto:ola@compasso.example" }}
        />
      </div>
    </LandingPage>
  );
}
