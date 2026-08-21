"use client";

import { useState } from "react";
import {
  ActivityItem,
  AreaChart,
  AxisLabels,
  Avatar,
  BarChart,
  Button,
  Calendar,
  Card,
  CardHeader,
  ChatAttachment,
  ChatBubble,
  ChatHeader,
  Checkbox,
  Divider,
  Field,
  Icon,
  IconButton,
  Input,
  LineChart,
  Marker,
  NavItem,
  NavSection,
  NavUser,
  Pagination,
  Radio,
  Segmented,
  Select,
  SettingRow,
  SidebarNav,
  StackedAreaChart,
  Stat,
  Switch,
  Table,
  Tag,
  Textarea,
  Ticker,
  TypingIndicator,
  type Column,
} from "@/lib/ui";

/**
 * Telas de exemplo do preview.
 *
 * Sao composicoes densas de proposito — formulario, tabela, conversa, painel.
 * Grade de swatch esconde problema de contraste que um formulario expoe na
 * hora; e para isso que estas telas existem.
 */

/** Mosaico de colunas: cada cartao com sua altura, sem esticar vizinho. */
function Masonry({ children }: { children: React.ReactNode }) {
  return (
    <div className="columns-1 gap-lg md:columns-2 xl:columns-3 [&>*]:mb-lg [&>*]:break-inside-avoid">
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ CARDS */

const TEAM_ROLES = [
  { value: "Dona", label: "Dona", hint: "Controle total, inclusive cobrança" },
  { value: "Pessoa desenvolvedora", label: "Pessoa desenvolvedora", hint: "Lê e escreve código" },
  { value: "Financeiro", label: "Financeiro", hint: "Só faturas e pagamentos" },
];

const ACCESS_LEVELS = [
  { value: "Pode editar", label: "Pode editar" },
  { value: "Pode ver", label: "Pode ver" },
  { value: "Pode comentar", label: "Pode comentar" },
];

export function CardsScreen() {
  const [goal, setGoal] = useState(350);
  const [roles, setRoles] = useState<Record<string, string>>({});
  const [access, setAccess] = useState<Record<string, string>>({});
  const [plan, setPlan] = useState<"starter" | "pro">("starter");
  const [terms, setTerms] = useState(false);
  const [emails, setEmails] = useState(true);
  const [essential, setEssential] = useState(true);
  const [functional, setFunctional] = useState(false);

  return (
    <Masonry>
      <Card>
        <Stat label="Receita total" value="R$ 15.231,89" delta="+20,1% em relação ao mês passado" />
        <LineChart values={[12, 14, 13, 15, 14, 17, 16, 22, 28]} />
      </Card>

      <Card>
        <Stat label="Assinaturas" value="+2.350" delta="+180,1% em relação ao mês passado" />
        <AreaChart values={[4, 6, 5, 9, 18, 12, 7, 9, 16, 11, 8]} />
      </Card>

      <Card>
        <Calendar month="Junho" year={2026} startWeekday={1} days={30} selected={[8, 9, 10, 11, 12]} today={13} />
      </Card>

      <Card>
        <CardHeader title="Meta diária" description="Defina quanto você quer entregar por dia." />
        <div className="flex items-center justify-between gap-md">
          <IconButton variant="secondary" label="Diminuir meta" onClick={() => setGoal((g) => Math.max(50, g - 50))}>
            <Icon.Minus size={16} />
          </IconButton>
          <div className="flex flex-col items-center gap-3xs">
            <span className="santo-heading-4-bold tabular-nums">{goal}</span>
            <span className="santo-caption-small-medium tracking-wide text-text-tertiary uppercase">
              créditos/dia
            </span>
          </div>
          <IconButton variant="secondary" label="Aumentar meta" onClick={() => setGoal((g) => g + 50)}>
            <Icon.Plus size={16} />
          </IconButton>
        </div>
        <BarChart values={[8, 12, 9, 14, 11, 16, 10, 13, 15, 9, 12, 17]} />
        <Button variant="subtle" block>Definir meta</Button>
      </Card>

      <Card>
        <CardHeader title="Minutos de exercício" description="Você está acima da sua média habitual." />
        <LineChart values={[6, 5, 4, 14, 8, 7, 9, 8, 10, 9]} height={64} />
        <AxisLabels labels={["seg", "ter", "qua", "qui", "sex", "sáb", "dom"]} />
      </Card>

      <Card>
        <CardHeader title="Melhore seu plano" description="Você está no plano gratuito. Suba para o pro e libere tudo." />
        <div className="flex gap-sm">
          <Field label="Nome" className="flex-1"><Input placeholder="Maria Souza" /></Field>
          <Field label="E-mail" className="flex-1"><Input type="email" placeholder="maria@exemplo.com.br" /></Field>
        </div>
        <Field label="Número do cartão"><Input mono placeholder="1234 1234 1234 1234" /></Field>
        <div className="flex gap-sm">
          <Field label="Validade" className="flex-1"><Input mono placeholder="MM/AA" /></Field>
          <Field label="CVC" className="flex-1"><Input mono placeholder="123" /></Field>
        </div>
        <div className="flex flex-col gap-2xs">
          <span className="santo-body-small-medium">Plano</span>
          <span className="santo-caption-regular text-text-secondary">Escolha o que cabe no seu momento.</span>
          <div className="grid grid-cols-2 gap-sm pt-2xs">
            {([
              { id: "starter", title: "Starter", body: "Para quem está começando." },
              { id: "pro", title: "Pro", body: "Mais recursos e espaço." },
            ] as const).map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPlan(p.id)}
                aria-pressed={plan === p.id}
                className={`cursor-pointer rounded-lg border-thin p-sm text-left transition-colors duration-(--santo-motion-duration-fast) ${
                  plan === p.id ? "border-border-brand bg-selected" : "border-border-subtle hover:bg-neutral-subtle-default"
                }`}
              >
                <Radio checked={plan === p.id} onChange={() => setPlan(p.id)} label={p.title} description={p.body} />
              </button>
            ))}
          </div>
        </div>
        <Field label="Observações" optional><Textarea placeholder="Alguma coisa que devemos saber?" /></Field>
        <Checkbox checked={terms} onChange={setTerms} label="Aceito os termos e condições" />
        <Checkbox checked={emails} onChange={setEmails} label="Quero receber novidades por e-mail" />
        <Divider />
        <div className="flex items-center justify-between gap-sm">
          <Button variant="secondary">Cancelar</Button>
          <Button variant="primary">Melhorar plano</Button>
        </div>
      </Card>

      <Card>
        <CardHeader title="Criar uma conta" description="Informe seu e-mail para começar." />
        <div className="flex gap-sm">
          <Button className="flex-1" leading={<Icon.Github size={16} />}>GitHub</Button>
          <Button className="flex-1" leading={<Icon.Google size={16} />}>Google</Button>
        </div>
        <div className="flex items-center gap-sm">
          <Divider className="flex-1" />
          <span className="santo-caption-small-medium tracking-wide text-text-tertiary uppercase">ou continue com</span>
          <Divider className="flex-1" />
        </div>
        <Field label="E-mail"><Input type="email" placeholder="m@exemplo.com" /></Field>
        <Field label="Senha"><Input type="password" placeholder="••••••••" /></Field>
        <Button variant="primary" block>Criar conta</Button>
      </Card>

      <Card>
        <CardHeader title="Time" description="Convide quem trabalha com você." />
        <div className="flex flex-col gap-sm">
          {[
            { name: "Sofia Dias", email: "sofia@exemplo.com", role: "Dona" },
            { name: "Jackson Lee", email: "jackson@exemplo.com", role: "Pessoa desenvolvedora" },
            { name: "Isabella Nunes", email: "isabella@exemplo.com", role: "Financeiro" },
          ].map((m) => (
            <div key={m.email} className="flex items-center gap-sm">
              <Avatar name={m.name} />
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="santo-body-small-semibold truncate">{m.name}</span>
                <span className="santo-caption-regular truncate text-text-tertiary">{m.email}</span>
              </span>
              <Select
                size="sm"
                pill
                value={roles[m.email] ?? m.role}
                onChange={(v) => setRoles((r) => ({ ...r, [m.email]: v }))}
                label={`Papel de ${m.name}`}
                options={TEAM_ROLES}
                className="shrink-0"
              />
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader title="Cookies" description="Escolha o que a gente pode guardar." />
        <SettingRow
          title="Estritamente necessários"
          description="Sem eles o site não funciona. Não dá para desligar."
          control={<Switch checked={essential} onChange={setEssential} label="Cookies necessários" disabled />}
        />
        <SettingRow
          title="Funcionais"
          description="Guardam suas preferências entre visitas."
          control={<Switch checked={functional} onChange={setFunctional} label="Cookies funcionais" />}
        />
        <Button variant="secondary" block>Salvar preferências</Button>
      </Card>

      <Card>
        <ChatHeader
          name="Sofia Dias"
          status="Online"
          actions={
            <IconButton size="sm" label="Adicionar pessoa" variant="subtle">
              <Icon.Plus size={16} />
            </IconButton>
          }
        />
        <Divider />
        <div className="flex flex-col gap-sm">
          <ChatBubble>Oi! Em que posso ajudar hoje?</ChatBubble>
          <ChatBubble from="me" reactions={[["❤️", 1]]}>
            Estou com problema para entrar na conta.
          </ChatBubble>
          <ChatBubble>Qual mensagem aparece?</ChatBubble>
          <ChatBubble from="me">Diz que a senha expirou.</ChatBubble>
          <TypingIndicator />
        </div>
        <div className="flex gap-2xs">
          <Input placeholder="Escreva sua mensagem…" className="flex-1" />
          <IconButton variant="primary" label="Enviar">
            <Icon.ArrowUpRight size={16} />
          </IconButton>
        </div>
      </Card>

      <Card>
        <CardHeader
          title="Compartilhar documento"
          description="Quem tiver o link consegue visualizar."
        />
        <div className="flex gap-2xs">
          <Input readOnly value="https://exemplo.com/doc/santo-ds" mono className="flex-1" />
          <Button variant="secondary" leading={<Icon.Copy size={16} />}>Copiar</Button>
        </div>
        <Divider />
        <span className="santo-body-small-medium">Com acesso</span>
        <div className="flex flex-col gap-sm">
          {[
            { name: "Olívia Martins", email: "olivia@exemplo.com" },
            { name: "Ethan Torres", email: "ethan@exemplo.com" },
          ].map((p) => (
            <div key={p.email} className="flex items-center gap-sm">
              <Avatar name={p.name} />
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="santo-body-small-semibold truncate">{p.name}</span>
                <span className="santo-caption-regular truncate text-text-tertiary">{p.email}</span>
              </span>
              <Select
                size="sm"
                pill
                value={access[p.email] ?? "Pode editar"}
                onChange={(v) => setAccess((a) => ({ ...a, [p.email]: v }))}
                label={`Permissão de ${p.name}`}
                options={ACCESS_LEVELS}
                className="shrink-0"
              />
            </div>
          ))}
        </div>
      </Card>

      <Card padded={false}>
        <div className="flex flex-col gap-3xs p-lg pb-sm">
          <h3 className="santo-heading-6-semibold">Pagamentos</h3>
          <p className="santo-body-small-regular text-text-secondary">Gerencie suas cobranças.</p>
        </div>
        <PaymentsTable />
      </Card>
    </Masonry>
  );
}

type Payment = { id: string; status: "Pago" | "Processando" | "Falhou" | "Pendente"; email: string; amount: string };

const PAYMENTS: Payment[] = [
  { id: "1", status: "Pago", email: "ken99@exemplo.com", amount: "R$ 316,00" },
  { id: "2", status: "Pago", email: "abe45@exemplo.com", amount: "R$ 242,00" },
  { id: "3", status: "Processando", email: "monserrat44@exemplo.com", amount: "R$ 837,00" },
  { id: "4", status: "Falhou", email: "carmella@exemplo.com", amount: "R$ 721,00" },
  { id: "5", status: "Pendente", email: "jason78@exemplo.com", amount: "R$ 450,00" },
];

const STATUS_INTENT = {
  Pago: "success",
  Processando: "info",
  Falhou: "danger",
  Pendente: "warning",
} as const;

function PaymentsTable() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const columns: Column<Payment>[] = [
    { key: "status", header: "Status", render: (r) => <Tag intent={STATUS_INTENT[r.status]}>{r.status}</Tag> },
    { key: "email", header: "E-mail", render: (r) => <span className="text-text-secondary">{r.email}</span> },
    { key: "amount", header: "Valor", numeric: true, render: (r) => r.amount },
  ];
  return (
    <>
      <Table
        columns={columns}
        rows={PAYMENTS}
        getKey={(r) => r.id}
        selected={selected}
        onToggleRow={(key) =>
          setSelected((s) => {
            const next = new Set(s);
            if (next.has(key)) next.delete(key);
            else next.add(key);
            return next;
          })
        }
        onToggleAll={() =>
          setSelected((s) => (s.size === PAYMENTS.length ? new Set() : new Set(PAYMENTS.map((p) => p.id))))
        }
        rowAction={() => (
          <IconButton size="sm" label="Mais ações"><Icon.More size={16} /></IconButton>
        )}
      />
      <div className="p-lg pt-sm">
        <Pagination
          summary={`${selected.size} de ${PAYMENTS.length} linha(s) selecionada(s).`}
          canPrevious={false}
          canNext
        />
      </div>
    </>
  );
}

/* -------------------------------------------------------------- DASHBOARD */

const NAV_MAIN = [
  { label: "Painel", icon: <Icon.Palette size={16} /> },
  { label: "Ciclo de vida", icon: <Icon.Reset size={16} /> },
  { label: "Análises", icon: <Icon.TrendUp size={16} /> },
  { label: "Projetos", icon: <Icon.Save size={16} /> },
  { label: "Time", icon: <Icon.Plus size={16} /> },
];

export function DashboardScreen() {
  const [range, setRange] = useState<"3m" | "30d" | "7d">("30d");

  const kpis = [
    { label: "Receita total", value: "R$ 1.250,00", delta: "+12,5%", up: true, note: "Em alta neste mês", sub: "Visitantes dos últimos 6 meses" },
    { label: "Novos clientes", value: "1.234", delta: "−20%", up: false, note: "Queda de 20% no período", sub: "Aquisição precisa de atenção" },
    { label: "Contas ativas", value: "45.678", delta: "+12,5%", up: true, note: "Boa retenção", sub: "Engajamento acima da meta" },
    { label: "Crescimento", value: "4,5%", delta: "+4,5%", up: true, note: "Desempenho estável", sub: "Dentro da projeção" },
  ];

  return (
    <div className="flex overflow-hidden rounded-xl border-thin border-border-subtle bg-surface-raised">
      <aside className="hidden w-(--santo-dimension-space-224) shrink-0 flex-col justify-between border-r-thin border-border-subtle p-sm lg:flex">
        <div className="flex flex-col gap-sm">
          <div className="flex items-center gap-2xs px-xs py-2xs">
            <Icon.Palette size={16} />
            <span className="santo-body-small-semibold">Acme Ltda.</span>
          </div>
          <SidebarNav>
            <NavItem emphasis icon={<Icon.Plus size={16} />}>Criar</NavItem>
            <NavSection>
              {NAV_MAIN.map((n, i) => (
                <NavItem key={n.label} icon={n.icon} active={i === 0}>{n.label}</NavItem>
              ))}
            </NavSection>
            <NavSection title="Documentos">
              <NavItem icon={<Icon.Code size={16} />}>Biblioteca</NavItem>
              <NavItem icon={<Icon.Save size={16} />}>Relatórios</NavItem>
              <NavItem icon={<Icon.More size={16} />}>Mais</NavItem>
            </NavSection>
          </SidebarNav>
        </div>
        <NavUser
          name="Pedro Veloso"
          email="pedro@exemplo.com"
          action={<IconButton size="sm" label="Opções da conta"><Icon.More size={16} /></IconButton>}
        />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-sm border-b-thin border-border-subtle px-lg py-sm">
          <IconButton size="sm" label="Recolher menu"><Icon.Expand size={16} /></IconButton>
          <Divider className="h-md w-px border-l-thin border-t-0" />
          <span className="santo-body-small-semibold">Documentos</span>
        </div>

        <div className="flex flex-col gap-lg p-lg">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-md">
            {kpis.map((k) => (
              <Card key={k.label} elevation="none" className="gap-sm">
                <div className="flex items-start justify-between gap-sm">
                  <span className="santo-body-small-regular text-text-secondary">{k.label}</span>
                  <Tag intent={k.up ? "success" : "danger"}>
                    <Icon.TrendUp size={12} />
                    {k.delta}
                  </Tag>
                </div>
                <span className="santo-heading-4-bold tabular-nums">{k.value}</span>
                <span className="santo-caption-medium">{k.note}</span>
                <span className="santo-caption-regular text-text-tertiary">{k.sub}</span>
              </Card>
            ))}
          </div>

          <Card elevation="none">
            <div className="flex flex-wrap items-start justify-between gap-sm">
              <div className="flex flex-col gap-3xs">
                <h3 className="santo-heading-6-semibold">Total de visitantes</h3>
                <p className="santo-body-small-regular text-text-secondary">Últimos 3 meses</p>
              </div>
              <Segmented
                size="md"
                value={range}
                onChange={setRange}
                options={[
                  { value: "3m", label: "3 meses" },
                  { value: "30d", label: "30 dias" },
                  { value: "7d", label: "7 dias" },
                ]}
              />
            </div>
            <StackedAreaChart
              height={64}
              series={[
                { values: [4, 9, 5, 11, 6, 14, 7, 12, 5, 13, 8, 15, 6, 12], color: "var(--santo-color-icon-accent)" },
                { values: [8, 14, 9, 17, 11, 20, 12, 18, 10, 19, 13, 21, 11, 17], color: "var(--santo-color-icon-primary)" },
              ]}
              labels={["31 mai", "4 jun", "8 jun", "12 jun", "16 jun", "20 jun", "24 jun", "29 jun"]}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ APPLICATION */

export function ApplicationScreen() {
  const [period, setPeriod] = useState<"1w" | "1m" | "1y">("1m");
  const [feedTab, setFeedTab] = useState<"tudo" | "tarefas" | "reunioes">("tudo");

  return (
    <div className="flex flex-col gap-lg">
      <Ticker
        items={[
          { symbol: "SDCN", name: "Shadcn", value: "R$ 120.748,00", delta: 1.25 },
          { symbol: "ACME", name: "Acme", value: "R$ 84.231,50", delta: -0.42 },
          { symbol: "TWKN", name: "Tweakn", value: "R$ 45.019,75", delta: 2.18 },
          { symbol: "VEGA", name: "Vega", value: "R$ 9.874,20", delta: -1.07 },
        ]}
      />

      <div className="grid grid-cols-1 items-start gap-lg xl:grid-cols-3">
        <Card>
          <CardHeader title="Mercado" />
          <Segmented
            size="md"
            className="w-full"
            value={period}
            onChange={setPeriod}
            options={[
              { value: "1w", label: "1 semana" },
              { value: "1m", label: "1 mês" },
              { value: "1y", label: "1 ano" },
            ]}
          />
          <div className="flex items-start justify-between gap-sm">
            <div className="flex flex-col gap-3xs">
              <span className="santo-heading-4-bold tabular-nums">R$ 120.748,00</span>
              <span className="santo-caption-regular text-text-tertiary">Shadcn Inc. (SDCN)</span>
            </div>
            <Tag intent="success">+1,25%</Tag>
          </div>
          <AreaChart values={[10, 16, 14, 11, 6, 12, 15]} height={64} />
          <AxisLabels labels={["jan", "fev", "mar", "abr", "mai", "jun"]} />
          <Divider />
          <div className="grid grid-cols-2 gap-sm">
            {[
              { label: "Valor de mercado", value: "R$ 119 mi" },
              { label: "Volume", value: "R$ 122 mi" },
            ].map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-3xs">
                <span className="santo-caption-regular text-text-tertiary">{s.label}</span>
                <span className="santo-body-semibold tabular-nums">{s.value}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Atividade" />
          <Input placeholder="Buscar…" />
          <Segmented
            size="md"
            className="w-full"
            value={feedTab}
            onChange={setFeedTab}
            options={[
              { value: "tudo", label: "Tudo" },
              { value: "tarefas", label: "Tarefas" },
              { value: "reunioes", label: "Reuniões" },
            ]}
          />
          <div className="flex flex-col divide-y divide-[var(--santo-color-border-subtle)]">
            <ActivityItem
              who="Natália Caldeira"
              when="há 2 min"
              what={<>marcou uma call amanhã, das <strong className="text-text-primary">16h às 17h</strong></>}
              marker={<Marker icon={<Icon.Plus size={12} />}>Reunião de time</Marker>}
            />
            <ActivityItem
              who="Lucia Antunes"
              when="há 9 min"
              what={<>concluiu o <strong className="text-text-primary">Sprint 12</strong></>}
              marker={<Marker icon={<Icon.Check size={12} />}>Todas as tarefas feitas</Marker>}
            />
            <ActivityItem
              who="Lucia Antunes"
              when="há 10 min"
              what={<>enviou um arquivo para <strong className="text-text-primary">Jurídico</strong></>}
              marker={<Marker icon={<Icon.Save size={12} />}>Relatorio.pdf</Marker>}
            />
            <ActivityItem
              who="Jackson Lee"
              when="há 24 min"
              what={<>enviou um arquivo para <strong className="text-text-primary">Design</strong></>}
              marker={<Marker icon={<Icon.Figma size={12} />}>Home_v3.fig</Marker>}
            />
          </div>
        </Card>

        <Card>
          <ChatHeader
            name="Alex Ribeiro"
            status="Online"
            actions={
              <span className="flex gap-2xs">
                <IconButton size="sm" label="Ligar"><Icon.ArrowUpRight size={16} /></IconButton>
                <IconButton size="sm" label="Chamada de vídeo"><Icon.Expand size={16} /></IconButton>
              </span>
            }
          />
          <Divider />
          <div className="flex flex-col gap-md">
            <ChatBubble time="08:56">
              Conseguiu olhar o deck da campanha do Q4 que mandei ontem?
            </ChatBubble>
            <ChatBubble from="me" time="09:01" reactions={[["❤️", 1]]}>
              Me dá 30–40 min que eu vejo com calma. Tem algo específico que você quer que eu olhe?
            </ChatBubble>
            <ChatBubble time="09:22">
              Principalmente a página de preços e a paleta nova. O marketing acha o verde “cara de cripto”.
            </ChatBubble>
            <ChatBubble from="me" time="10:15" reactions={[["👍", 1], ["👀", 1]]}>
              <ChatAttachment name="Deck_Q4_revisado.pdf" size="4,8 MB" />
            </ChatBubble>
            <ChatBubble time="10:28">
              Perfeito! Vi que você atualizou o esquema de cor. Ficou bem melhor.
            </ChatBubble>
            <TypingIndicator />
          </div>
        </Card>
      </div>
    </div>
  );
}
