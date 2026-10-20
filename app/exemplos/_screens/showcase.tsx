"use client";

import { useState } from "react";
import {
  ActivityCard,
  AppFrame,
  CalendarCard,
  CardGrid,
  ChartCard,
  ChatCard,
  DailyGoalCard,
  Icon,
  PaymentsCard,
  PreferencesCard,
  ShareCard,
  SignUpCard,
  StatCard,
  TeamCard,
  Ticker,
  UpgradePlanCard,
  type Member,
  type Payment,
} from "@/lib/ui";
import { PEOPLE, photo } from "@/lib/ui/demo-people";
import { Block } from "../_block";

/**
 * Telas de exemplo do preview.
 *
 * Composicoes densas de proposito — formulario, tabela, conversa, painel —
 * porque grade de swatch esconde problema de contraste que um formulario
 * expoe na hora. Regra dura (Pedro): a tela SO compoe blocos de lib/ui com
 * dado. Nenhum cartao e montado aqui; o lib:check (regra D) cobra.
 */

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

const person = (id: keyof typeof PEOPLE, role: string): Member => ({
  name: PEOPLE[id].name,
  email: `${id}@exemplo.com`,
  avatarSrc: photo(id),
  role,
});

const PAYMENTS: Payment[] = [
  { id: "1", status: "Pago", email: "ken99@exemplo.com", amount: "R$ 316,00" },
  { id: "2", status: "Pago", email: "abe45@exemplo.com", amount: "R$ 242,00" },
  { id: "3", status: "Processando", email: "monserrat44@exemplo.com", amount: "R$ 837,00" },
  { id: "4", status: "Falhou", email: "carmella@exemplo.com", amount: "R$ 721,00" },
  { id: "5", status: "Pendente", email: "jason78@exemplo.com", amount: "R$ 450,00" },
];

const WEEK = ["seg", "ter", "qua", "qui", "sex", "sáb", "dom"];

/** Troca o papel/permissao de uma pessoa numa lista. */
const withRole = (list: Member[], email: string, role: string) => list.map((m) => (m.email === email ? { ...m, role } : m));

/**
 * Cartoes: composicoes densas no vocabulario anti-generico. Cada cartao e um
 * bloco de lib/ui (nivel 1, raised); um acento por cartao.
 */
export function CardsScreen() {
  const [goal, setGoal] = useState(350);
  const [plan, setPlan] = useState<"starter" | "pro">("starter");
  const [cookies, setCookies] = useState([
    { id: "essenciais", title: "Estritamente necessários", checked: true, disabled: true },
    { id: "funcionais", title: "Funcionais", checked: false },
    { id: "marketing", title: "Marketing", checked: false },
  ]);
  const [team, setTeam] = useState([person("erica", "Dona"), person("pedro", "Pessoa desenvolvedora"), person("sena", "Financeiro")]);
  const [shared, setShared] = useState([person("sena", "Pode editar"), person("erica", "Pode editar")]);

  return (
    <CardGrid>
      <Block id="cartoes-receita">
        <StatCard
          label="Receita total"
          value="15.231,89"
          unit="R$ no mês"
          delta={{ label: "+20,1%", intent: "success" }}
          trend={{ kind: "spark", values: [12, 14, 13, 15, 14, 17, 16, 22, 28], label: "Receita, 9 meses" }}
        />
      </Block>

      <Block id="cartoes-assinaturas">
        <StatCard
          label="Assinaturas"
          value="2.350"
          unit="novas no mês"
          delta={{ label: "+180,1%", intent: "success" }}
          trend={{ kind: "spark", values: [4, 6, 5, 9, 18, 12, 7, 9, 16, 11, 8], label: "Assinaturas, 11 semanas" }}
        />
      </Block>

      <Block id="cartoes-exercicio">
        <StatCard
          label="Exercício"
          value="42"
          unit="min hoje · 7 dias"
          trend={{ kind: "bars", values: [30, 25, 20, 55, 38, 34, 42], labels: WEEK, label: "Minutos por dia" }}
          details={[
            { label: "Média", value: "35 min" },
            { label: "Recorde", value: "55 min" },
            { label: "Sequência", value: "6 dias" },
          ]}
        />
      </Block>

      <Block id="cartoes-meta">
        <DailyGoalCard meta="créditos" value={goal} onChange={setGoal} min={50} max={500} step={50} unit="por dia" />
      </Block>

      <Block id="cartoes-calendario">
        <CalendarCard mode="range" month="Junho" year={2026} selected={[8, 9, 10, 11, 12]} today={13} />
      </Block>

      <Block id="cartoes-cookies">
        <PreferencesCard
          title="Cookies"
          items={cookies}
          onToggle={(id, checked) => setCookies((list) => list.map((c) => (c.id === id ? { ...c, checked } : c)))}
        />
      </Block>

      <Block id="cartoes-plano">
        <UpgradePlanCard
          plans={[
            { value: "starter", label: "Starter", price: "Grátis" },
            { value: "pro", label: "Pro", price: "R$ 49 / mês" },
          ]}
          plan={plan}
          onPlanChange={setPlan}
          nextInvoice="5 nov."
        />
      </Block>

      <Block id="cartoes-conta">
        <SignUpCard />
      </Block>

      <Block id="cartoes-conversa">
        <ChatCard
          person={{ name: PEOPLE.erica.name, avatarSrc: photo("erica", 40), status: "Online" }}
          actions={[{ icon: <Icon.Plus size={16} />, label: "Adicionar pessoa" }]}
          typing
          messages={[
            { text: "Oi! Em que posso ajudar hoje?" },
            { from: "me", text: "Estou com problema para entrar na conta.", reactions: [["❤️", 1]] },
            { text: "Qual mensagem aparece?" },
            { from: "me", text: "Diz que a senha expirou." },
          ]}
        />
      </Block>

      <Block id="cartoes-time">
        <TeamCard members={team} roles={TEAM_ROLES} onRoleChange={(email, role) => setTeam((l) => withRole(l, email, role))} />
      </Block>

      <Block id="cartoes-compartilhar">
        <ShareCard
          link="https://exemplo.com/doc/santo-ds"
          members={shared}
          access={ACCESS_LEVELS}
          onAccessChange={(email, access) => setShared((l) => withRole(l, email, access))}
        />
      </Block>

      <Block id="cartoes-pagamentos" className="md:col-span-2 2xl:col-span-3">
        <PaymentsCard payments={PAYMENTS} />
      </Block>
    </CardGrid>
  );
}

/* -------------------------------------------------------------- DASHBOARD */

const WEEKS = Array.from({ length: 14 }, (_, i) => `sem ${i + 1}`);

const VISITS = [
  { value: "3m", label: "3 meses", values: [8, 14, 9, 17, 11, 20, 12, 18, 10, 19, 13, 21, 11, 17] },
  { value: "30d", label: "30 dias", values: [11, 13, 12, 16, 14, 18, 17, 20, 19, 22, 21, 24, 23, 26] },
  { value: "7d", label: "7 dias", values: [18, 22, 19, 24, 21, 26, 25, 27, 24, 28, 26, 30, 29, 31] },
].map((r) => ({ value: r.value, label: r.label, labels: WEEKS, series: [{ name: "Visitantes", values: r.values.map((v) => v * 100) }] }));

/**
 * Painel: moldura de app (trilho + painel de secoes em arvore) com KPIs em
 * StatCard e o grafico principal em ChartCard.
 */
export function DashboardScreen() {
  const [section, setSection] = useState("receita");

  return (
    <AppFrame
      rail={[
        { icon: <Icon.Grid size={20} />, label: "Painel", active: true },
        { icon: <Icon.TrendUp size={20} />, label: "Análises", dot: true },
        { icon: <Icon.Layers size={20} />, label: "Projetos" },
        { icon: <Icon.Book size={20} />, label: "Documentos" },
      ]}
      user={{ name: PEOPLE.pedro.name, email: "pedro@exemplo.com", avatarSrc: photo("pedro") }}
      nav={{
        title: "Acme Ltda.",
        items: [
          { id: "visao", label: "Visão geral", icon: <Icon.Grid size={16} /> },
          {
            id: "analises",
            label: "Análises",
            icon: <Icon.TrendUp size={16} />,
            count: 3,
            active: true,
            children: [
              { id: "receita", label: "Receita" },
              { id: "clientes", label: "Clientes" },
              { id: "retencao", label: "Retenção" },
            ],
          },
          { id: "projetos", label: "Projetos", icon: <Icon.Layers size={16} />, count: 12 },
          { id: "relatorios", label: "Relatórios", icon: <Icon.Book size={16} /> },
        ],
      }}
      activeSub={section}
      onSubChange={setSection}
    >
      <CardGrid columns={{ sm: 2 }} gap="md">
        <StatCard
          label="Receita total"
          value="1.250"
          unit="R$ mil · out."
          delta={{ label: "+12,5%", intent: "success" }}
          trend={{ kind: "spark", values: [8, 9, 8.5, 10, 9.8, 11, 12.5], label: "Receita, 7 meses" }}
        />
        <StatCard
          label="Novos clientes"
          value="1.234"
          unit="no mês"
          delta={{ label: "−20%", intent: "danger" }}
          trend={{ kind: "bars", values: [18, 22, 15, 19, 14, 12, 10], label: "Novos clientes por semana" }}
        />
        <StatCard
          label="Contas ativas"
          value="45.678"
          unit="contas"
          delta={{ label: "+12,5%", intent: "success" }}
          trend={{ kind: "spark", values: [40, 41, 41.5, 42.8, 43.1, 44.6, 45.7], label: "Contas ativas, 7 meses" }}
        />
        <StatCard
          label="Crescimento"
          value="4,5"
          unit="% ao mês · 72% da meta"
          delta={{ label: "+4,5%", intent: "success" }}
          trend={{ kind: "ring", value: 72, label: "Meta do trimestre" }}
        />
      </CardGrid>
      <ChartCard title="Visitantes" meta="12,4 mil" ranges={VISITS} initialRange="30d" />
    </AppFrame>
  );
}

/* ------------------------------------------------------------ APPLICATION */

const PERIODS = [
  { value: "1w", label: "1S" },
  { value: "1m", label: "1M" },
  { value: "1y", label: "1A" },
];

/**
 * Aplicacao: faixa de cotacoes + cartao de mercado ao lado de um app de 3
 * colunas (trilho | atividade | conversa) sobre o chao rebaixado.
 */
export function ApplicationScreen() {
  const [period, setPeriod] = useState("1m");

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

      <CardGrid columns={{ "2xl": 3 }}>
        <Block id="aplicacao-mercado">
          <StatCard
            title="Mercado"
            badge="STO"
            ranges={PERIODS}
            range={period}
            onRangeChange={setPeriod}
            label="Cotação"
            value="120.748"
            unit="R$ · fechamento"
            delta={{ label: "+1,25%", intent: "success" }}
            trend={{ kind: "spark", values: [10, 16, 14, 11, 6, 12, 15, 18], label: "Cotação no período" }}
            details={[
              { label: "Valor de mercado", value: "R$ 119 mi" },
              { label: "Volume", value: "R$ 122 mi" },
            ]}
          />
        </Block>

        <Block id="aplicacao-app" className="2xl:col-span-2">
          <AppFrame
            layout="split"
            rail={[
              { icon: <Icon.Book size={20} />, label: "Conversas", active: true, dot: true },
              { icon: <Icon.Grid size={20} />, label: "Atividade" },
              { icon: <Icon.TrendUp size={20} />, label: "Mercado" },
            ]}
            user={{ name: PEOPLE.pedro.name, avatarSrc: photo("pedro") }}
          >
            <Block id="aplicacao-atividade" className="lg:w-(--santo-dimension-space-288) lg:shrink-0">
              <ActivityCard
                padding="md"
                tabs={[
                  { value: "tudo", label: "Tudo" },
                  { value: "tarefas", label: "Tarefas" },
                  { value: "reunioes", label: "Reuniões" },
                ]}
                action={{ icon: <Icon.Plus size={16} />, label: "Nova mensagem" }}
                items={[
                  {
                    who: PEOPLE.erica.name,
                    avatarSrc: photo("erica"),
                    when: "há 2 min",
                    kind: "reunioes",
                    what: (
                      <>
                        marcou uma call amanhã, das <strong>16h às 17h</strong>
                      </>
                    ),
                    marker: { icon: <Icon.Plus size={12} />, label: "Reunião de time" },
                  },
                  {
                    who: PEOPLE.pedro.name,
                    avatarSrc: photo("pedro"),
                    when: "há 9 min",
                    kind: "tarefas",
                    what: (
                      <>
                        concluiu o <strong>Sprint 12</strong>
                      </>
                    ),
                    marker: { icon: <Icon.Check size={12} />, label: "Sprint 12" },
                  },
                  {
                    who: PEOPLE.sena.name,
                    avatarSrc: photo("sena"),
                    when: "há 24 min",
                    kind: "tarefas",
                    what: (
                      <>
                        enviou um arquivo para <strong>Design</strong>
                      </>
                    ),
                    marker: { icon: <Icon.Figma size={12} />, label: "Home_v3.fig" },
                  },
                ]}
              />
            </Block>

            <Block id="aplicacao-conversa" className="min-w-0 flex-1">
              <ChatCard
                padding="md"
                person={{ name: PEOPLE.sena.name, avatarSrc: photo("sena", 40), status: "Online" }}
                actions={[
                  { icon: <Icon.ArrowUpRight size={16} />, label: "Ligar" },
                  { icon: <Icon.Expand size={16} />, label: "Chamada de vídeo" },
                ]}
                typing
                messages={[
                  { text: "Conseguiu olhar o deck da campanha do Q4 que mandei ontem?", time: "08:56" },
                  {
                    from: "me",
                    text: "Me dá 30–40 min que eu vejo com calma. Tem algo específico que você quer que eu olhe?",
                    time: "09:01",
                    reactions: [["❤️", 1]],
                  },
                  { text: "Principalmente a página de preços e a paleta nova.", time: "09:22" },
                  { from: "me", attachment: { name: "Deck_Q4_revisado.pdf", size: "4,8 MB" }, time: "10:15", reactions: [["👍", 1]] },
                ]}
              />
            </Block>
          </AppFrame>
        </Block>
      </CardGrid>
    </div>
  );
}

export const CARTOES_BLOCKS = [
  { id: "cartoes-receita", label: "Receita total" },
  { id: "cartoes-assinaturas", label: "Assinaturas" },
  { id: "cartoes-exercicio", label: "Exercício" },
  { id: "cartoes-meta", label: "Meta diária" },
  { id: "cartoes-calendario", label: "Calendário" },
  { id: "cartoes-cookies", label: "Cookies" },
  { id: "cartoes-plano", label: "Melhore seu plano" },
  { id: "cartoes-conta", label: "Criar uma conta" },
  { id: "cartoes-conversa", label: "Conversa" },
  { id: "cartoes-time", label: "Time" },
  { id: "cartoes-compartilhar", label: "Compartilhar" },
  { id: "cartoes-pagamentos", label: "Pagamentos" },
];

export const APLICACAO_BLOCKS = [
  { id: "aplicacao-mercado", label: "Mercado" },
  { id: "aplicacao-atividade", label: "Atividade" },
  { id: "aplicacao-conversa", label: "Conversa" },
];
