"use client";

import { useState } from "react";
import {
  ActivityItem,
  Avatar,
  AvatarGroup,
  Button,
  Calendar,
  Card,
  CardHeader,
  Count,
  ChatAttachment,
  ChatBubble,
  ChatComposer,
  ChatHeader,
  Checkbox,
  Divider,
  Fab,
  ListRow,
  Overline,
  Field,
  Icon,
  IconButton,
  Input,
  KeyValue,
  MiniBars,
  Marker,
  NavItem,
  NavSection,
  NavSub,
  NavUser,
  Pagination,
  RadioGroup,
  RailItem,
  RailNav,
  Ring,
  Segmented,
  Select,
  SettingRow,
  SidebarNav,
  Sparkline,
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
import { PEOPLE, photo } from "@/lib/ui/demo-people";
import { Block } from "../_block";

/**
 * Telas de exemplo do preview.
 *
 * Sao composicoes densas de proposito — formulario, tabela, conversa, painel.
 * Grade de swatch esconde problema de contraste que um formulario expoe na
 * hora; e para isso que estas telas existem.
 */

/** Grade unica: cartoes irmaos da mesma fileira tem a mesma altura. */
function CardGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-lg md:grid-flow-dense md:grid-cols-2 2xl:grid-cols-3">{children}</div>;
}

/* ------------------------------------------------------------------ CARDS */

const TEAM_ROLES = [
  { value: "Dona", label: "Dona" },
  { value: "Pessoa desenvolvedora", label: "Pessoa desenvolvedora" },
  { value: "Financeiro", label: "Financeiro" },
];

const ACCESS_LEVELS = [
  { value: "Pode editar", label: "Pode editar" },
  { value: "Pode ver", label: "Pode ver" },
  { value: "Pode comentar", label: "Pode comentar" },
];

/**
 * Cartoes: composicoes densas no vocabulario anti-generico. Cada cartao e
 * nivel 1 (raised); listas e campos internos sao pocos; um acento por cartao.
 */
export function CardsScreen() {
  const [goal, setGoal] = useState(350);
  const [roles, setRoles] = useState<Record<string, string>>({});
  const [access, setAccess] = useState<Record<string, string>>({});
  const [plan, setPlan] = useState<"starter" | "pro">("starter");
  const [terms, setTerms] = useState(false);
  const [emails, setEmails] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [essential, setEssential] = useState(true);
  const [functional, setFunctional] = useState(false);
  const [draft, setDraft] = useState("");
  const team = [
    { person: "erica" as const, role: "Dona" },
    { person: "pedro" as const, role: "Pessoa desenvolvedora" },
    { person: "sena" as const, role: "Financeiro" },
  ];
  const shared = ["sena", "erica"] as const;

  return (
    <CardGrid>
      <Block id="cartoes-receita">
        <Card>
          <Stat
            label="Receita total"
            value="15.231,89"
            unit="R$ no mês"
            action={<Tag intent="success">+20,1%</Tag>}
            viz={<Sparkline values={[12, 14, 13, 15, 14, 17, 16, 22, 28]} area label="Receita, 9 meses" />}
          />
        </Card>
      </Block>

      <Block id="cartoes-assinaturas">
        <Card>
          <Stat
            label="Assinaturas"
            value="2.350"
            unit="novas no mês"
            action={<Tag intent="success">+180,1%</Tag>}
            viz={<Sparkline values={[4, 6, 5, 9, 18, 12, 7, 9, 16, 11, 8]} area label="Assinaturas, 11 semanas" />}
          />
        </Card>
      </Block>

      <Block id="cartoes-exercicio">
        <Card>
          <Stat
            label="Exercício"
            value="42"
            unit="min hoje · 7 dias"
            viz={<MiniBars values={[30, 25, 20, 55, 38, 34, 42]} highlight={6} size="md" label="Minutos por dia" />}
          />
          <Card variant="well" padding="md" className="mt-auto">
            <KeyValue label="Média" value="35 min" />
            <KeyValue label="Recorde" value="55 min" />
            <KeyValue label="Sequência" value="6 dias" />
          </Card>
        </Card>
      </Block>

      <Block id="cartoes-meta">
        <Card>
          <CardHeader title="Meta diária" meta={<Count>créditos</Count>} />
          <div className="flex items-center justify-between gap-md">
            <IconButton variant="secondary" label="Diminuir meta" onClick={() => setGoal((g) => Math.max(50, g - 50))}>
              <Icon.Minus size={16} />
            </IconButton>
            <Ring value={Math.min(100, (goal / 500) * 100)} label={`Meta: ${goal} de 500`} tone="brand" size="lg">
              <span className="santo-body-semibold tabular-nums">{goal}</span>
            </Ring>
            <IconButton variant="secondary" label="Aumentar meta" onClick={() => setGoal((g) => Math.min(500, g + 50))}>
              <Icon.Plus size={16} />
            </IconButton>
          </div>
          <Overline className="self-center">de 500 por dia</Overline>
          <Button block className="mt-auto">
            Definir meta
          </Button>
        </Card>
      </Block>

      <Block id="cartoes-calendario">
        <Card className="justify-center">
          <Calendar mode="range" month="Junho" year={2026} selected={[8, 9, 10, 11, 12]} today={13} />
        </Card>
      </Block>

      <Block id="cartoes-cookies">
        <Card>
          <CardHeader title="Cookies" meta={<Count>2</Count>} />
          <Card variant="well" padding="md">
            <SettingRow
              title="Estritamente necessários"
              control={<Switch checked={essential} onChange={setEssential} label="Cookies necessários" disabled />}
            />
            <SettingRow
              title="Funcionais"
              control={<Switch checked={functional} onChange={setFunctional} label="Cookies funcionais" />}
            />
            <SettingRow
              title="Marketing"
              control={<Switch checked={marketing} onChange={setMarketing} label="Cookies de marketing" />}
            />
          </Card>
          <Button block className="mt-auto">
            Salvar preferências
          </Button>
        </Card>
      </Block>

      <Block id="cartoes-plano" className="md:row-span-2">
        <Card>
          <CardHeader title="Melhore seu plano" meta={<Tag intent="brand">Pro</Tag>} />
          <div className="flex gap-sm">
            <Field label="Nome" className="flex-1"><Input placeholder="Maria Souza" /></Field>
            <Field label="E-mail" className="flex-1"><Input type="email" placeholder="maria@exemplo.com.br" /></Field>
          </div>
          <Field label="Número do cartão"><Input mono placeholder="1234 1234 1234 1234" /></Field>
          <div className="flex gap-sm">
            <Field label="Validade" className="flex-1"><Input mono placeholder="MM/AA" /></Field>
            <Field label="CVC" className="flex-1"><Input mono placeholder="123" /></Field>
          </div>
          <RadioGroup
            label="Plano"
            columns={2}
            value={plan}
            onChange={setPlan}
            options={[
              { value: "starter", label: "Starter" },
              { value: "pro", label: "Pro" },
            ]}
          />
          <Field label="Cupom" optional><Input mono placeholder="SANTO10" /></Field>
          <Field label="Observações" optional><Textarea placeholder="Alguma coisa que devemos saber?" /></Field>
          <Checkbox checked={terms} onChange={setTerms} label="Aceito os termos e condições" />
          <Checkbox checked={emails} onChange={setEmails} label="Quero receber novidades por e-mail" />
          <Card variant="well" padding="md" className="mt-auto">
            <KeyValue label="Plano" value={plan === "pro" ? "Pro" : "Starter"} />
            <KeyValue label="Cobrança" value={plan === "pro" ? "R$ 49 / mês" : "Grátis"} />
            <KeyValue label="Próxima fatura" value="5 nov." />
          </Card>
          <div className="flex items-center justify-between gap-sm">
            <Button variant="ghost">Cancelar</Button>
            <Button variant="primary">Melhorar plano</Button>
          </div>
        </Card>
      </Block>

      <Block id="cartoes-conta">
        <Card>
          <CardHeader title="Criar uma conta" />
          <div className="flex gap-sm">
            <Button className="flex-1" leading={<Icon.Github size={16} />}>GitHub</Button>
            <Button className="flex-1" leading={<Icon.Google size={16} />}>Google</Button>
          </div>
          <Divider label="ou continue com" />
          <Field label="E-mail"><Input type="email" placeholder="m@exemplo.com" /></Field>
          <Field label="Senha"><Input type="password" placeholder="••••••••" /></Field>
          <Button variant="primary" block className="mt-auto">Criar conta</Button>
        </Card>
      </Block>

      <Block id="cartoes-conversa">
        <Card>
          <ChatHeader
            name={PEOPLE.erica.name}
            avatarSrc={photo("erica", 40)}
            status="Online"
            actions={
              <IconButton size="sm" label="Adicionar pessoa" variant="ghost">
                <Icon.Plus size={16} />
              </IconButton>
            }
          />
          <div className="flex flex-col gap-sm">
            <ChatBubble>Oi! Em que posso ajudar hoje?</ChatBubble>
            <ChatBubble from="me" reactions={[["❤️", 1]]}>
              Estou com problema para entrar na conta.
            </ChatBubble>
            <ChatBubble>Qual mensagem aparece?</ChatBubble>
            <ChatBubble from="me">Diz que a senha expirou.</ChatBubble>
            <TypingIndicator />
          </div>
          <ChatComposer
            className="mt-auto"
            value={draft}
            onChange={setDraft}
            onSend={() => setDraft("")}
            placeholder="Escreva sua mensagem…"
          />
        </Card>
      </Block>

      <Block id="cartoes-time">
        <Card>
          <CardHeader
            title="Time"
            meta={<Count>{team.length}</Count>}
            action={
              <AvatarGroup>
                {team.map((m) => (
                  <Avatar key={m.person} name={PEOPLE[m.person].name} src={photo(m.person, 24)} size={24} />
                ))}
              </AvatarGroup>
            }
          />
          <div className="flex flex-col">
            {team.map((m) => {
              const name = PEOPLE[m.person].name;
              const email = `${m.person}@exemplo.com`;
              return (
                <ListRow
                  key={email}
                  divider
                  leading={<Avatar name={name} src={photo(m.person)} />}
                  title={name}
                  meta={email}
                  trailing={
                    <Select
                      size="sm"
                      pill
                      value={roles[email] ?? m.role}
                      onChange={(v) => setRoles((r) => ({ ...r, [email]: v }))}
                      label={`Papel de ${name}`}
                      options={TEAM_ROLES}
                    />
                  }
                />
              );
            })}
          </div>
        </Card>
      </Block>

      <Block id="cartoes-compartilhar">
        <Card>
          <CardHeader title="Compartilhar" meta={<Count>{shared.length}</Count>} />
          <div className="flex gap-2xs">
            <Input readOnly value="https://exemplo.com/doc/santo-ds" mono className="flex-1" />
            <IconButton variant="secondary" label="Copiar link"><Icon.Copy size={16} /></IconButton>
          </div>
          <Overline>Com acesso</Overline>
          <div className="flex flex-col">
            {shared.map((person) => {
              const name = PEOPLE[person].name;
              const email = `${person}@exemplo.com`;
              return (
                <ListRow
                  key={email}
                  divider
                  leading={<Avatar name={name} src={photo(person)} />}
                  title={name}
                  meta={email}
                  trailing={
                    <Select
                      size="sm"
                      pill
                      value={access[email] ?? "Pode editar"}
                      onChange={(v) => setAccess((a) => ({ ...a, [email]: v }))}
                      label={`Permissão de ${name}`}
                      options={ACCESS_LEVELS}
                    />
                  }
                />
              );
            })}
          </div>
        </Card>
      </Block>

      <Block id="cartoes-pagamentos" className="md:col-span-2 2xl:col-span-3">
        <Card>
          <CardHeader title="Pagamentos" meta={<Count>{PAYMENTS.length}</Count>} />
          <PaymentsTable />
        </Card>
      </Block>
    </CardGrid>
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
          <IconButton size="sm" variant="ghost" label="Mais ações"><Icon.More size={16} /></IconButton>
        )}
      />
      <div>
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

const VISITS = {
  "3m": [8, 14, 9, 17, 11, 20, 12, 18, 10, 19, 13, 21, 11, 17],
  "30d": [11, 13, 12, 16, 14, 18, 17, 20, 19, 22, 21, 24, 23, 26],
  "7d": [18, 22, 19, 24, 21, 26, 25, 27, 24, 28, 26, 30, 29, 31],
};

/**
 * Painel: trilho de icones (nivel 0) + painel de secoes em arvore (nivel 1) +
 * conteudo. Cada KPI e numero + unidade com uma micro-visualizacao no acento.
 */
export function DashboardScreen() {
  const [range, setRange] = useState<"3m" | "30d" | "7d">("30d");
  const [section, setSection] = useState("receita");

  return (
    <Card variant="sunken" padding="md">
      <div className="flex gap-md">
        <RailNav
          className="hidden md:flex"
          footer={<Avatar name={PEOPLE.pedro.name} src={photo("pedro")} />}
        >
          <RailItem icon={<Icon.Grid size={20} />} label="Painel" active />
          <RailItem icon={<Icon.TrendUp size={20} />} label="Análises" dot />
          <RailItem icon={<Icon.Layers size={20} />} label="Projetos" />
          <RailItem icon={<Icon.Book size={20} />} label="Documentos" />
        </RailNav>

        <Card padding="md" className="hidden w-(--santo-dimension-space-224) shrink-0 lg:flex">
          <SidebarNav>
            <NavSection title="Acme Ltda.">
              <NavItem icon={<Icon.Grid size={16} />}>Visão geral</NavItem>
              <NavItem icon={<Icon.TrendUp size={16} />} count={3} active>
                Análises
              </NavItem>
              <NavSub>
                {[
                  { id: "receita", label: "Receita" },
                  { id: "clientes", label: "Clientes" },
                  { id: "retencao", label: "Retenção" },
                ].map((n) => (
                  <NavItem key={n.id} sub active={section === n.id} onClick={() => setSection(n.id)}>
                    {n.label}
                  </NavItem>
                ))}
              </NavSub>
              <NavItem icon={<Icon.Layers size={16} />} count={12}>
                Projetos
              </NavItem>
              <NavItem icon={<Icon.Book size={16} />}>Relatórios</NavItem>
            </NavSection>
          </SidebarNav>
          <div className="mt-auto">
            <NavUser name={PEOPLE.pedro.name} email="pedro@exemplo.com" avatarSrc={photo("pedro")} />
          </div>
        </Card>

        <div className="flex min-w-0 flex-1 flex-col gap-md">
          <div className="grid grid-cols-1 gap-md sm:grid-cols-2">
            <Card>
              <Stat
                label="Receita total"
                value="1.250"
                unit="R$ mil · out."
                action={<Tag intent="success">+12,5%</Tag>}
                viz={<Sparkline values={[8, 9, 8.5, 10, 9.8, 11, 12.5]} area label="Receita, 7 meses" />}
              />
            </Card>
            <Card>
              <Stat
                label="Novos clientes"
                value="1.234"
                unit="no mês"
                action={<Tag intent="danger">−20%</Tag>}
                viz={<MiniBars values={[18, 22, 15, 19, 14, 12, 10]} highlight={6} size="md" label="Novos clientes por semana" />}
              />
            </Card>
            <Card>
              <Stat
                label="Contas ativas"
                value="45.678"
                unit="contas"
                action={<Tag intent="success">+12,5%</Tag>}
                viz={<Sparkline values={[40, 41, 41.5, 42.8, 43.1, 44.6, 45.7]} area label="Contas ativas, 7 meses" />}
              />
            </Card>
            <Card>
              <Stat
                label="Crescimento"
                value="4,5"
                unit="% ao mês · 72% da meta"
                action={<Tag intent="success">+4,5%</Tag>}
                viz={<Ring value={72} label="Meta do trimestre: 72%" tone="brand" size="md" />}
              />
            </Card>
          </div>

          <Card className="flex-1">
            <CardHeader
              title="Visitantes"
              meta={<Count>12,4 mil</Count>}
              action={
                <Segmented
                  value={range}
                  onChange={setRange}
                  options={[
                    { value: "3m", label: "3 meses" },
                    { value: "30d", label: "30 dias" },
                    { value: "7d", label: "7 dias" },
                  ]}
                />
              }
            />
            <Card variant="well" padding="md" className="mt-auto">
              <StackedAreaChart
                height={64}
                series={[{ values: VISITS[range], color: "var(--santo-color-icon-brand)" }]}
                labels={["sem 1", "sem 2", "sem 3", "sem 4", "sem 5", "sem 6", "sem 7", "sem 8"]}
              />
            </Card>
          </Card>
        </div>
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------ APPLICATION */

/**
 * Aplicacao: faixa de cotacoes + KPI de mercado ao lado de um app de 3 colunas
 * (trilho | atividade | conversa) sobre o chao rebaixado. A acao principal
 * (Nova mensagem) e o FAB, no fluxo da coluna de atividade.
 */
export function ApplicationScreen() {
  const [period, setPeriod] = useState<"1w" | "1m" | "1y">("1m");
  const [feedTab, setFeedTab] = useState<"tudo" | "tarefas" | "reunioes">("tudo");
  const [draft, setDraft] = useState("");

  return (
    <div className="flex flex-col gap-lg">
      <Ticker
        items={[
          { symbol: "STO", name: "Santo", value: "R$ 120.748,00", delta: 1.25 },
          { symbol: "ACME", name: "Acme", value: "R$ 84.231,50", delta: -0.42 },
          { symbol: "TWKN", name: "Tweakn", value: "R$ 45.019,75", delta: 2.18 },
          { symbol: "VEGA", name: "Vega", value: "R$ 9.874,20", delta: -1.07 },
        ]}
      />

      <div className="grid grid-cols-1 gap-lg 2xl:grid-cols-3">
        <Block id="aplicacao-mercado">
          <Card>
            <CardHeader
              title="Mercado"
              meta={<Tag>STO</Tag>}
              action={
                <Segmented
                  value={period}
                  onChange={setPeriod}
                  options={[
                    { value: "1w", label: "1S" },
                    { value: "1m", label: "1M" },
                    { value: "1y", label: "1A" },
                  ]}
                />
              }
            />
            <Stat
              label="Cotação"
              value="120.748"
              unit="R$ · fechamento"
              action={<Tag intent="success">+1,25%</Tag>}
              viz={<Sparkline values={[10, 16, 14, 11, 6, 12, 15, 18]} area label="Cotação no período" />}
            />
            <Card variant="well" padding="md" className="mt-auto">
              <KeyValue label="Valor de mercado" value="R$ 119 mi" />
              <KeyValue label="Volume" value="R$ 122 mi" />
            </Card>
          </Card>
        </Block>

        <Card variant="sunken" padding="md" className="2xl:col-span-2">
          <div className="flex flex-col gap-md lg:flex-row">
            <RailNav className="hidden lg:flex" footer={<Avatar name={PEOPLE.pedro.name} src={photo("pedro")} />}>
              <RailItem icon={<Icon.Book size={20} />} label="Conversas" active dot />
              <RailItem icon={<Icon.Grid size={20} />} label="Atividade" />
              <RailItem icon={<Icon.TrendUp size={20} />} label="Mercado" />
            </RailNav>

            <Block id="aplicacao-atividade" className="lg:w-(--santo-dimension-space-288) lg:shrink-0">
              <Card padding="md">
                <CardHeader title="Atividade" meta={<Count>4</Count>} />
                <Segmented
                  value={feedTab}
                  onChange={setFeedTab}
                  options={[
                    { value: "tudo", label: "Tudo" },
                    { value: "tarefas", label: "Tarefas" },
                    { value: "reunioes", label: "Reuniões" },
                  ]}
                />
                <div className="flex flex-col">
                  <ActivityItem
                    who={PEOPLE.erica.name}
                    avatarSrc={photo("erica")}
                    when="há 2 min"
                    what={<>marcou uma call amanhã, das <strong>16h às 17h</strong></>}
                    marker={<Marker icon={<Icon.Plus size={12} />}>Reunião de time</Marker>}
                  />
                  <ActivityItem
                    who={PEOPLE.pedro.name}
                    avatarSrc={photo("pedro")}
                    when="há 9 min"
                    what={<>concluiu o <strong>Sprint 12</strong></>}
                    marker={<Marker icon={<Icon.Check size={12} />}>Sprint 12</Marker>}
                  />
                  <ActivityItem
                    who={PEOPLE.sena.name}
                    avatarSrc={photo("sena")}
                    when="há 24 min"
                    what={<>enviou um arquivo para <strong>Design</strong></>}
                    marker={<Marker icon={<Icon.Figma size={12} />}>Home_v3.fig</Marker>}
                  />
                </div>
                <Fab className="mt-auto self-end" extended icon={<Icon.Plus size={16} />} label="Nova mensagem" />
              </Card>
            </Block>

            <Block id="aplicacao-conversa" className="min-w-0 flex-1">
              <Card padding="md">
                <ChatHeader
                  name={PEOPLE.sena.name}
                  avatarSrc={photo("sena", 40)}
                  status="Online"
                  actions={
                    <span className="flex gap-2xs">
                      <IconButton size="sm" variant="ghost" label="Ligar"><Icon.ArrowUpRight size={16} /></IconButton>
                      <IconButton size="sm" variant="ghost" label="Chamada de vídeo"><Icon.Expand size={16} /></IconButton>
                    </span>
                  }
                />
                <div className="flex flex-col gap-md">
                  <ChatBubble time="08:56">
                    Conseguiu olhar o deck da campanha do Q4 que mandei ontem?
                  </ChatBubble>
                  <ChatBubble from="me" time="09:01" reactions={[["❤️", 1]]}>
                    Me dá 30–40 min que eu vejo com calma. Tem algo específico que você quer que eu olhe?
                  </ChatBubble>
                  <ChatBubble time="09:22">
                    Principalmente a página de preços e a paleta nova.
                  </ChatBubble>
                  <ChatBubble from="me" time="10:15" reactions={[["👍", 1]]}>
                    <ChatAttachment name="Deck_Q4_revisado.pdf" size="4,8 MB" />
                  </ChatBubble>
                  <TypingIndicator />
                </div>
                <ChatComposer
                  className="mt-auto"
                  value={draft}
                  onChange={setDraft}
                  onSend={() => setDraft("")}
                  placeholder="Escreva sua mensagem…"
                />
              </Card>
            </Block>
          </div>
        </Card>
      </div>
    </div>
  );
}


export const CARTOES_BLOCKS = [{"id": "cartoes-receita", "label": "Receita total"}, {"id": "cartoes-assinaturas", "label": "Assinaturas"}, {"id": "cartoes-exercicio", "label": "Exercício"}, {"id": "cartoes-meta", "label": "Meta diária"}, {"id": "cartoes-calendario", "label": "Calendário"}, {"id": "cartoes-cookies", "label": "Cookies"}, {"id": "cartoes-plano", "label": "Melhore seu plano"}, {"id": "cartoes-conta", "label": "Criar uma conta"}, {"id": "cartoes-conversa", "label": "Conversa"}, {"id": "cartoes-time", "label": "Time"}, {"id": "cartoes-compartilhar", "label": "Compartilhar"}, {"id": "cartoes-pagamentos", "label": "Pagamentos"}];

export const APLICACAO_BLOCKS = [{"id": "aplicacao-mercado", "label": "Mercado"}, {"id": "aplicacao-atividade", "label": "Atividade"}, {"id": "aplicacao-conversa", "label": "Conversa"}];
