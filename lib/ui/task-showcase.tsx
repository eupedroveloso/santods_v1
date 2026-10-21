"use client";

import { useId, useState, type FormEvent, type ReactNode } from "react";
import { Button, IconButton } from "./button";
import { Card } from "./card";
import { CardGrid } from "./card-grid";
import { ChatComposer } from "./chat";
import { Count, Tag } from "./chip";
import { Avatar, AvatarGroup, Table } from "./data";
import { portrait } from "./demo-people";
import { Disclosure } from "./disclosure";
import { Field, Input, SearchInput } from "./input";
import * as Icon from "./icons";
import { NavItem, NavSection, SidebarNav } from "./nav";
import { Progress } from "./progress";
import { Segmented } from "./segmented";
import { Sparkline } from "./sparkline";

export type TaskPreviewTask = {
  id: string;
  title: string;
  description: string;
  category: string;
  status: "todo" | "doing" | "review" | "done";
  due: string;
  comments: number;
  attachments: number;
  progress?: number;
  people: { name: string; src?: string; alt?: string; avifSrc?: string }[];
};

const TEAM = [
  portrait("erica", 24),
  portrait("sena", 24),
  portrait("leo", 24),
  portrait("clara", 24),
];

/** Conteúdo de demonstração, substituível por tarefas do produto apresentado. */
export const TASK_PREVIEW_TASKS: TaskPreviewTask[] = [
  { id: "pesquisa", title: "Ouvir quem usa", description: "Reunir descobertas das conversas com nossos clientes.", category: "Pesquisa", status: "todo", due: "Hoje", comments: 8, attachments: 3, people: [TEAM[0], TEAM[3]] },
  { id: "conteudo", title: "Uma boa primeira impressão", description: "Revisar os textos da nova experiência de boas-vindas.", category: "Conteúdo", status: "todo", due: "22 out.", comments: 3, attachments: 1, people: [TEAM[2]] },
  { id: "painel", title: "Dar vida ao novo painel", description: "Transformar o protótipo em uma experiência que funciona.", category: "Produto", status: "doing", due: "Hoje", comments: 12, attachments: 5, progress: 64, people: [TEAM[1], TEAM[2]] },
  { id: "campanha", title: "Preparar o próximo lançamento", description: "Conectar a ideia, a campanha e as pessoas certas.", category: "Marketing", status: "doing", due: "24 out.", comments: 6, attachments: 2, progress: 38, people: [TEAM[0]] },
  { id: "acesso", title: "Um acesso mais simples", description: "Conferir os últimos detalhes do fluxo de entrada.", category: "Design", status: "review", due: "23 out.", comments: 5, attachments: 4, progress: 92, people: [TEAM[0], TEAM[2]] },
  { id: "guia", title: "Todo mundo na mesma página", description: "O guia do projeto já está pronto para compartilhar.", category: "Equipe", status: "done", due: "Concluída", comments: 4, attachments: 2, progress: 100, people: [TEAM[1], TEAM[0]] },
];

const COLUMNS = [
  { id: "todo", label: "A fazer", icon: Icon.ListIcon },
  { id: "doing", label: "Em andamento", icon: Icon.Play },
  { id: "review", label: "Em revisão", icon: Icon.Search },
  { id: "done", label: "Concluído", icon: Icon.Check },
] as const;

function People({ people = TEAM }: { people?: TaskPreviewTask["people"] }) {
  return <AvatarGroup>{people.map((person) => <Avatar key={person.name} {...person} size={24} />)}</AvatarGroup>;
}

function ProductMark({ name, compact = false }: { name: string; compact?: boolean }) {
  return <span className="santo-body-small-semibold inline-flex items-center gap-xs text-text-primary"><span className="text-icon-brand"><Icon.Layers size={20} /></span>{name}{!compact && <span className="santo-caption-small-medium text-text-tertiary">workspace</span>}</span>;
}

function TaskTile({ task, onComplete }: { task: TaskPreviewTask; onComplete: () => void }) {
  return (
    <Card padding="sm" radius="md" elevation="xs" className="gap-sm">
      <div className="flex items-center justify-between gap-xs">
        <Tag intent={task.status === "done" ? "success" : "brand"}>{task.category}</Tag>
        <IconButton size="sm" label={task.status === "done" ? `Reabrir ${task.title}` : `Concluir ${task.title}`} onClick={onComplete}><Icon.Check size={12} /></IconButton>
      </div>
      <div className="flex flex-col gap-2xs">
        <h4 className="santo-body-small-semibold text-text-primary">{task.title}</h4>
        <p className="santo-caption-regular text-text-secondary">{task.description}</p>
      </div>
      {task.progress !== undefined && <Progress value={task.progress} label={`Progresso de ${task.title}`} />}
      <div className="flex items-center justify-between gap-xs border-t-thin border-border-subtle pt-xs">
        <People people={task.people} />
        <span className="santo-caption-small-medium inline-flex items-center gap-2xs text-text-tertiary"><Icon.File size={12} />{task.attachments}<span className="sr-only">anexos,</span><Icon.Menu size={12} />{task.comments}<span className="sr-only">comentários</span></span>
      </div>
      <span className="santo-caption-small-medium inline-flex items-center gap-2xs text-text-tertiary"><Icon.Grid size={12} />{task.due}</span>
    </Card>
  );
}

/**
 * Demonstre um produto de tarefas com conteúdo real de interface: quatro
 * colunas, pessoas, prazos e progresso. A busca filtra, a visão alterna e as
 * tarefas podem ser criadas, concluídas e reabertas localmente. `sidebar` inclui
 * a navegação do app para uma segunda cena de produto, como o onboarding.
 */
export function TaskAppPreview({
  productName = "Compasso",
  projectName = "Um novo jeito de trabalhar",
  tasks = TASK_PREVIEW_TASKS,
  variant = "board",
  className = "",
}: {
  productName?: string;
  projectName?: string;
  tasks?: TaskPreviewTask[];
  variant?: "board" | "sidebar";
  className?: string;
}) {
  const [view, setView] = useState("quadro");
  const [query, setQuery] = useState("");
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [added, setAdded] = useState<TaskPreviewTask[]>([]);
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [area, setArea] = useState("Projetos");
  const shown = [...tasks, ...added].map((task) => ({
    ...task,
    status: completed[task.id] === undefined ? task.status : completed[task.id] ? "done" as const : "todo" as const,
    progress: completed[task.id] === undefined ? task.progress : completed[task.id] ? 100 : task.status === "done" ? 0 : task.progress,
  })).filter((task) => `${task.title} ${task.category} ${task.description}`.toLocaleLowerCase("pt-BR").includes(query.toLocaleLowerCase("pt-BR")));
  const toggle = (task: TaskPreviewTask) => setCompleted((current) => ({ ...current, [task.id]: task.status !== "done" }));
  const create = (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim()) return;
    setAdded((current) => [...current, { id: `nova-${current.length}`, title: title.trim(), description: "Uma nova ideia para construir junto com o time.", category: "Equipe", status: "todo", due: "Sem prazo", comments: 0, attachments: 0, people: [TEAM[0]] }]);
    setTitle("");
    setCreating(false);
  };
  return (
    <div className={`santo-edge overflow-hidden rounded-lg bg-surface-raised text-left shadow-lg ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-sm border-b-thin border-border-subtle px-md py-sm">
        <ProductMark name={productName} />
        <span className="santo-caption-small-medium hidden items-center gap-lg text-text-tertiary sm:flex"><span className="text-text-primary">Visão geral</span><span>Meu trabalho</span><span>Equipe</span></span>
        <People />
      </div>
      <div className="flex min-w-0 bg-surface-page">
        {variant === "sidebar" && (
          <aside className="w-(--santo-dimension-space-144) shrink-0 border-r-thin border-border-subtle bg-surface-page px-xs py-md">
            <SidebarNav label={`Áreas do ${productName}`}><NavSection>{["Projetos", "Minhas tarefas", "Calendário", "Documentos"].map((name) => <NavItem key={name} active={area === name} onClick={() => setArea(name)} icon={name === "Projetos" ? <Icon.Grid size={16} /> : <Icon.File size={16} />}>{name}</NavItem>)}</NavSection></SidebarNav>
            <p className="santo-caption-small-medium px-sm pt-xl text-text-tertiary">ESPAÇOS DO TIME</p>
            <div className="flex flex-col gap-sm px-sm pt-sm"><span className="santo-caption-medium text-text-secondary">Produto</span><span className="santo-caption-medium text-text-secondary">Comunicação</span><span className="santo-caption-medium text-text-secondary">Pessoas</span></div>
          </aside>
        )}
        <div className="flex min-w-0 flex-1 flex-col gap-md p-md">
          <div className="flex flex-wrap items-center justify-between gap-sm"><div className="flex flex-col gap-3xs"><span className="santo-caption-small-medium text-text-tertiary">{variant === "sidebar" ? area : "Equipe de produto"} / Outubro</span><h3 className="santo-body-large-semibold text-text-primary">{projectName}</h3></div><Button size="sm" variant="primary" onClick={() => setCreating((current) => !current)} leading={<Icon.Plus size={12} />}>Nova tarefa</Button></div>
          <div className="flex flex-wrap items-center gap-sm"><Segmented value={view} onChange={setView} options={[{ value: "quadro", label: "Quadro" }, { value: "lista", label: "Lista" }]} /><SearchInput size="sm" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Encontrar uma tarefa" aria-label="Encontrar uma tarefa na demonstração" /></div>
          {creating && <form onSubmit={create} className="flex flex-wrap items-end gap-xs"><div className="min-w-0 flex-1"><Field label="Nome da tarefa"><Input size="sm" value={title} onChange={(event) => setTitle(event.target.value)} autoFocus placeholder="O que vamos fazer?" /></Field></div><Button type="submit" size="sm" variant="primary" disabled={!title.trim()}>Criar</Button></form>}
          <div className="scrollbar-bare overflow-x-auto pb-xs">
            {view === "quadro" ? (
              <div className="grid grid-cols-4 items-start gap-sm" style={{ minWidth: "calc(var(--santo-dimension-space-192) * 4 + var(--santo-space-sm) * 3)" }}>
                {COLUMNS.map((column) => {
                  const entries = shown.filter((task) => task.status === column.id);
                  const Glyph = column.icon;
                  return <section key={column.id} className="flex min-w-0 flex-col gap-sm"><div className="flex items-center gap-xs px-2xs"><span className={column.id === "doing" ? "text-icon-brand" : "text-icon-tertiary"}><Glyph size={12} /></span><h4 className="santo-caption-semibold min-w-0 flex-1 text-text-secondary">{column.label}</h4><Count>{entries.length}</Count></div>{entries.map((task) => <TaskTile key={task.id} task={task} onComplete={() => toggle(task)} />)}{entries.length === 0 && <p className="santo-caption-regular px-xs py-md text-text-tertiary">Tudo em dia por aqui.</p>}</section>;
                })}
              </div>
            ) : <div className="flex min-w-(--santo-dimension-space-384) flex-col">{shown.map((task) => <div key={task.id} className="flex items-center gap-sm border-b-thin border-border-subtle py-sm last:border-0"><IconButton size="sm" label={`Alternar conclusão de ${task.title}`} onClick={() => toggle(task)}><Icon.Check size={16} /></IconButton><span className="santo-body-small-medium min-w-0 flex-1 text-text-primary">{task.title}</span><Tag intent={task.status === "done" ? "success" : "neutral"}>{COLUMNS.find((column) => column.id === task.status)?.label}</Tag><People people={task.people} /></div>)}</div>}
          </div>
          <p className="santo-caption-small-regular text-text-tertiary" role="status">{shown.length} {shown.length === 1 ? "tarefa" : "tarefas"} no espaço do time · cada ideia tem um próximo passo</p>
        </div>
      </div>
    </div>
  );
}

function FeatureSurface({ title, count, children, className = "" }: { title: string; count?: number; children: ReactNode; className?: string }) {
  return <Card variant="sunken" radius="xl" padding="md" className={`gap-lg text-left ${className}`}><div className="flex items-center justify-between gap-xs"><h3 className="santo-body-large-semibold text-text-primary">{title}</h3>{count !== undefined && <Count>{count}</Count>}</div>{children}</Card>;
}

export type TaskBentoProject = { name: string; people: TaskPreviewTask["people"] };
export type TaskBentoState = { name: string; count: number };
export type TaskBentoMessage = TaskPreviewTask["people"][number] & { text: string };

const BENTO_STATES: TaskBentoState[] = [
  { name: "Próximas ideias", count: 9 },
  { name: "Em movimento", count: 8 },
  { name: "Prontas para o mundo", count: 7 },
];
const BENTO_PROJECTS: TaskBentoProject[] = [
  { name: "Experiência", people: [TEAM[0], TEAM[1]] },
  { name: "Marca", people: [TEAM[2], TEAM[3]] },
  { name: "Lançamento", people: [TEAM[1], TEAM[2]] },
];
const BENTO_MESSAGES: TaskBentoMessage[] = [
  { ...TEAM[0], text: "A primeira versão já está no quadro. O que acham?" },
  { ...TEAM[1], text: "Gostei! Juntei as descobertas da pesquisa no mesmo lugar." },
  { ...TEAM[2], text: "Perfeito. Vamos revisar juntos amanhã?" },
];
const STATE_TONES = ["bg-brand-solid-default", "bg-neutral-solid-default", "bg-neutral-subtle-active"];

/** Cinco recursos em uma composição editorial: organização, automação, conversa, progresso e equipe. */
export function TaskFeatureBento({ projects = BENTO_PROJECTS, states: stateData = BENTO_STATES, initialMessages = BENTO_MESSAGES, className = "" }: {
  projects?: TaskBentoProject[];
  states?: TaskBentoState[];
  initialMessages?: TaskBentoMessage[];
  className?: string;
}) {
  const [automatic, setAutomatic] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(initialMessages);
  const states = stateData.map((item, index) => ({ ...item, tone: STATE_TONES[index % STATE_TONES.length] }));
  const total = states.reduce((count, item) => count + item.count, 0);
  return (
    <CardGrid columns={{ md: 3 }} masonry={false} stretch gap="md" className={`w-full ${className}`}>
      <FeatureSurface title="Cada ideia no seu lugar" count={total} className="h-full">
        <div className="flex items-baseline gap-xs"><span className="santo-heading-6-bold text-text-primary tabular-nums">{total}</span><span className="santo-caption-regular text-text-secondary">tarefas, uma visão</span></div>
        <div className="flex flex-col gap-sm">{states.map((item) => <div key={item.name} className="santo-caption-medium flex items-center gap-xs text-text-secondary"><span aria-hidden className={`size-2xs shrink-0 rounded-full ${item.tone}`} /><span className="min-w-0 flex-1">{item.name}</span><span className="tabular-nums">{item.count}</span></div>)}</div>
        <div className="flex h-xs gap-3xs overflow-hidden rounded-xs" role="img" aria-label={states.map((item) => `${item.count} ${item.name}`).join(", ")}>{states.map((item) => <span key={item.name} className={`h-full ${item.tone}`} style={{ flex: Math.max(0, item.count) }} />)}</div>
      </FeatureSurface>
      <FeatureSurface title="O próximo passo acontece" className="h-full">
        <Tag intent="brand" className="self-start"><Icon.Sparkles size={12} />Uma rotina a menos</Tag>
        <Card radius="md" padding="sm" elevation="xs">
          <span className="santo-caption-small-medium text-text-tertiary">TAREFA APROVADA</span>
          <span className="santo-body-small-semibold text-text-primary">Atribuir ao próximo responsável</span>
          <div className="flex items-center gap-sm"><People people={[TEAM[0]]} /><span className="santo-caption-medium text-text-secondary">Érica Nunes</span><Icon.ArrowRightIcon size={12} /></div>
        </Card>
        <Button size="sm" variant={automatic ? "secondary" : "primary"} onClick={() => setAutomatic((current) => !current)} leading={automatic ? <Icon.Check size={12} /> : <Icon.Plus size={12} />}>{automatic ? "Automação ativada" : "Ativar atribuição"}</Button>
        <span className="santo-caption-small-regular text-text-tertiary" role="status">{automatic ? "Érica receberá a próxima tarefa aprovada." : "Você escolhe a regra. O time ganha tempo."}</span>
      </FeatureSurface>
      <FeatureSurface title="A conversa acompanha a ideia" count={messages.length} className="h-full md:row-span-2">
        <div className="flex items-center gap-sm"><People /><span className="santo-caption-medium text-text-secondary">Time de produto</span></div>
        <div className="flex flex-col gap-lg">{messages.map((item, index) => <div key={index} className="flex items-start gap-xs"><Avatar name={item.name} src={item.src} alt={item.alt} avifSrc={item.avifSrc} size={24} /><div className="flex min-w-0 flex-1 flex-col gap-xs"><div className="flex flex-wrap items-baseline gap-xs"><span className="santo-caption-semibold text-text-primary">{item.name}</span><span className="santo-caption-small-regular text-text-tertiary">{index < 3 ? "Agora há pouco" : "Agora"}</span></div><p className="santo-body-small-regular text-text-secondary">{item.text}</p>{index === 0 && <div className="flex items-center gap-xs border-t-thin border-border-subtle pt-xs text-icon-brand"><Icon.File size={16} /><span className="santo-caption-medium text-text-brand">Pesquisa de outubro.pdf</span></div>}</div></div>)}</div>
        <ChatComposer value={message} onChange={setMessage} onSend={(text) => { setMessages((current) => [...current, { ...TEAM[0], text: text.trim() }]); setMessage(""); }} placeholder="Entre na conversa…" />
      </FeatureSurface>
      <FeatureSurface title="O progresso fica visível" className="h-full">
        <div className="flex items-baseline justify-between gap-sm"><span className="santo-heading-6-bold text-text-primary tabular-nums">78<span className="santo-body-small-medium text-text-tertiary">%</span></span><Tag intent="brand"><Icon.TrendUp size={12} />12% na semana</Tag></div>
        <div className="text-icon-brand"><Sparkline values={[2, 3, 3, 5, 4, 6, 8, 7, 10, 12]} area fluid size="lg" label="Evolução ilustrativa das entregas" /></div>
      </FeatureSurface>
      <FeatureSurface title="Cada pessoa, uma contribuição" className="h-full">
        <Table layout="fixed" columns={[{ key: "name", header: "Projeto" }, { key: "people", header: "Time", width: 64, render: (project: typeof projects[number]) => <People people={project.people} /> }]} rows={projects} />
      </FeatureSurface>
    </CardGrid>
  );
}

export type TaskMetricItem = { value: string; label: string; detail: string };
const METRICS: TaskMetricItem[] = [
  { value: "32%", label: "menos trabalho repetido", detail: "O tempo volta para as boas ideias." },
  { value: "2,4×", label: "mais conexão no time", detail: "Cada pessoa entende o próximo passo." },
  { value: "96%", label: "de clareza nas prioridades", detail: "O que importa aparece primeiro." },
  { value: "8 mil", label: "ideias em movimento", detail: "De times pequenos a grandes planos." },
];

/** Números de uma narrativa de marketing em quatro cartões com alturas alternadas. */
export function TaskMetrics({ items = METRICS, className = "" }: { items?: TaskMetricItem[]; className?: string }) {
  return <CardGrid columns={{ sm: 2, md: 4 }} masonry={false} gap="md" className={`w-full ${className}`}>{items.map((item, index) => (
    <Card key={item.label} padding="md" className={`self-end justify-between text-left ${index % 2 ? "h-(--santo-dimension-space-176)" : "h-(--santo-dimension-space-208) bg-linear-to-br from-brand-subtle-default to-surface-raised"}`}>
      <div className="flex items-start justify-between gap-xs"><span className="santo-heading-4-bold tracking-tight text-text-primary tabular-nums">{item.value}</span><span className="text-icon-brand"><Icon.ArrowUpRight size={16} /></span></div>
      <div className="flex flex-col gap-xs"><h3 className="santo-body-small-semibold text-text-primary">{item.label}</h3><p className="santo-caption-regular text-text-secondary">{item.detail}</p></div>
    </Card>
  ))}</CardGrid>;
}

export type TaskOnboardingStep = { title: string; description: string };
const STEPS: TaskOnboardingStep[] = [
  { title: "Um espaço com a sua cara", description: "Entre, escolha o nome do time e dê lugar à primeira ideia." },
  { title: "Convide quem faz acontecer", description: "As pessoas certas, com tudo o que precisam no mesmo lugar." },
  { title: "Encontre seu ritmo", description: "Veja o trabalho avançar e ajuste o caminho junto com a equipe." },
];

/** App recortado à esquerda e três passos à direita, começando por duas pequenas cenas de entrada. */
export function TaskOnboarding({ productName = "Compasso", steps = STEPS, className = "" }: { productName?: string; steps?: TaskOnboardingStep[]; className?: string }) {
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [started, setStarted] = useState(false);
  const emailId = useId();
  return (
    <CardGrid columns={{ md: 2 }} masonry={false} gap="2xl" className={`w-full text-left ${className}`}>
      <div className="h-(--santo-dimension-space-384) overflow-hidden rounded-xl bg-linear-to-br from-brand-subtle-hover to-brand-subtle-default p-md pt-xl md:p-lg md:pt-2xl">
        <div aria-hidden inert style={{ width: "calc(var(--santo-dimension-space-384) + var(--santo-dimension-space-256))" }}><TaskAppPreview productName={productName} variant="sidebar" projectName={step === 1 ? "Nosso primeiro projeto juntos" : step === 2 ? "As ideias começam a ganhar vida" : "Tudo começa com uma boa ideia"} /></div>
      </div>
      <div className="flex flex-col gap-sm">{steps.map((item, index) => (
        <Card key={item.title} padded={false} variant={step === index ? "raised" : "sunken"} radius="xl">
          <Disclosure variant="row" open={step === index} onToggle={() => setStep(index)} label={<span className="flex items-center gap-sm"><Count tone={step === index ? "brand" : "neutral"}>{String(index + 1).padStart(2, "0")}</Count><span className="santo-body-small-semibold text-text-primary">{item.title}</span></span>}>
            <p className="santo-body-small-regular text-text-secondary">{item.description}</p>
            {index === 0 ? (
              <CardGrid columns={{ base: 2 }} masonry={false} gap="sm">
                <div className="flex min-w-0 flex-col gap-sm rounded-lg bg-surface-page p-2xs"><ProductMark name={productName} compact /><span className="santo-caption-semibold text-text-primary">Bom ter você por aqui.</span><Button size="sm" variant="secondary" onClick={() => setStarted(true)} leading={<Icon.Google size={12} />}>Google</Button><span className="santo-caption-small-regular text-text-tertiary">Seu time começa com você.</span></div>
                <form className="flex min-w-0 flex-col gap-sm rounded-lg bg-surface-page p-2xs" onSubmit={(event) => { event.preventDefault(); if (email.trim()) setStarted(true); }}><span className="santo-caption-semibold text-text-primary">Crie o seu espaço</span><Field label="E-mail"><Input id={emailId} type="email" value={email} onChange={(event) => { setEmail(event.target.value); setStarted(false); }} placeholder="voce@time.com" required size="sm" /></Field><Button size="sm" variant="primary" type="submit" leading={started ? <Icon.Check size={12} /> : undefined}>{started ? "Pronto!" : "Começar"}</Button></form>
              </CardGrid>
            ) : <div className="flex items-center gap-sm"><People /><span className="santo-caption-medium text-text-secondary">{index === 1 ? "Um convite, muitas possibilidades." : "Uma visão compartilhada do progresso."}</span></div>}
            {index === 0 && started && <p className="santo-caption-regular text-text-brand" role="status">Bom começo! Agora é hora de convidar seu time.</p>}
          </Disclosure>
        </Card>
      ))}</div>
    </CardGrid>
  );
}
