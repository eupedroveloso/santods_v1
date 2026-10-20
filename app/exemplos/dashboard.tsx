"use client";

import { useState } from "react";
import {
  BreakdownCard,
  CardGrid,
  ChartCard,
  DashboardHeader,
  GoalsCard,
  Icon,
  InvestCard,
  LimitCard,
  StatCard,
  TransactionsCard,
  type ChartRange,
  type Transaction,
} from "@/lib/ui";
import { Block } from "./_block";

/**
 * Dashboard: so compoe blocos de lib/ui (lib:check, regra D).
 * BLOCAGEM POR FILEIRA (skill santo-ui-craft §10.4): cada fileira e uma grade
 * fixa com stretch, irmaos de conteudo equivalente e nenhum buraco:
 *   1. KPIs — 4 StatCard do mesmo molde (1 col; 2 em sm; 4 em xl).
 *   2. Fluxo — ChartCard receita × despesa, largura total, periodo ligado ao
 *      filtro do cabecalho.
 *   3. Composicao — gastos por categoria (barras) | distribuicao (donut)
 *      (1 coluna; 2 em xl, onde as alturas casam).
 *   4. Operacao — Limite | Investir | Metas, cada um com cabecalho, conteudo,
 *      resumo e a acao ancorada no fim (1; 2 em md com Metas largo; 3 em xl).
 *   5. Transacoes — sempre largura total.
 * Um acento por cartao: a micro-viz OU a acao primaria leva brand.
 */

/* --------------------------------------------------------------- KPIs */

const BALANCE = [18.2, 19.1, 18.7, 20.4, 21.9, 21.3, 23.0, 24.3];
const CONTRIBUTIONS = [420, 380, 510, 460, 590, 650];
const YIELD = [0.7, 0.8, 0.82, 0.79, 0.85, 0.87, 0.86];

function Kpis() {
  return (
    <CardGrid columns={{ sm: 2, xl: 4 }} gap="md" masonry={false} stretch>
      <StatCard
        label="Saldo disponível"
        value="24.318"
        unit="R$ · 8 semanas"
        delta={{ label: "+6,2%", intent: "success" }}
        trend={{ kind: "spark", values: BALANCE, label: "Saldo, 8 semanas" }}
      />
      <StatCard
        label="Próximo aporte"
        value="650"
        unit="R$ · 5 nov."
        delta={{ label: "Mensal" }}
        trend={{ kind: "bars", values: CONTRIBUTIONS, highlight: CONTRIBUTIONS.length - 1, label: "Aportes por mês" }}
      />
      <StatCard
        label="Metas"
        value="57"
        unit="% do total · 2 metas"
        delta={{ label: "no prazo", intent: "success" }}
        trend={{ kind: "ring", value: 57, label: "Metas: 57% do total" }}
      />
      <StatCard
        label="Rendimento"
        value="0,86"
        unit="% no mês · Selic"
        delta={{ label: "+0,04", intent: "success" }}
        trend={{ kind: "spark", values: YIELD, area: false, label: "Rendimento, 7 meses" }}
      />
    </CardGrid>
  );
}

/* ----------------------------------------------------------- Operacao */

const CURRENCIES = [
  { value: "BRL", label: "BRL" },
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
];

function PaymentLimit() {
  const [currency, setCurrency] = useState("BRL");
  const [limit, setLimit] = useState(2500);
  return (
    <LimitCard
      value={limit}
      onChange={setLimit}
      min={500}
      max={10000}
      currencies={CURRENCIES}
      currency={currency}
      onCurrencyChange={setCurrency}
      notes={false}
      summary={[{ label: "Usado hoje", value: "R$ 312,40" }]}
    />
  );
}

const ORDER_TYPES = [
  { value: "mercado", label: "A mercado" },
  { value: "limitada", label: "Limitada" },
  { value: "agendada", label: "Agendada" },
];

function BuyInvestment() {
  const [order, setOrder] = useState("mercado");
  const [amount, setAmount] = useState("1.000,00");
  return (
    <InvestCard
      asset="Tesouro Selic"
      amount={amount}
      onAmountChange={setAmount}
      orderTypes={ORDER_TYPES}
      orderType={order}
      onOrderTypeChange={setOrder}
      summary={[
        { label: "Corretagem", value: "R$ 0,00" },
        { label: "Rentabilidade", value: "10,4% a.a." },
      ]}
    />
  );
}

const GOALS = [
  { name: "Reserva de emergência", saved: 13000, target: 20000 },
  { name: "Viagem de fim de ano", saved: 4200, target: 8000 },
];

/* ---------------------------------------------------------- Transacoes */

const TRANSACTIONS: Transaction[] = [
  { title: "Salário", category: "Receita", date: "15 out.", amount: 8200 },
  { title: "Mercado Bom Preço", category: "Alimentação", date: "14 out.", amount: -312.4 },
  { title: "Aluguel", category: "Moradia", date: "10 out.", amount: -2400 },
  { title: "Reembolso viagem", category: "Trabalho", date: "08 out.", amount: 640 },
  { title: "Streaming", category: "Assinaturas", date: "05 out.", amount: -39.9 },
];

/* ------------------------------------------------------------- Graficos */

type Period = "7d" | "30d" | "12m";

const brl = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
/** Compacto para o donut: "24,3 mil" cabe no furo (a moeda ja esta no Count do titulo). */
const brlShort = (v: number) => `${(v / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} mil`;

/** Receita × despesa por periodo: os mesmos valores do filtro do cabecalho. */
const FLOW: ChartRange<Period>[] = [
  {
    value: "7d",
    label: "7 dias",
    labels: ["seg", "ter", "qua", "qui", "sex", "sáb", "dom"],
    series: [
      { name: "Receita", values: [820, 640, 910, 760, 1180, 540, 430] },
      { name: "Despesa", values: [410, 520, 380, 690, 450, 720, 310] },
    ],
  },
  {
    value: "30d",
    label: "30 dias",
    labels: ["sem 1", "sem 2", "sem 3", "sem 4", "sem 5"],
    series: [
      { name: "Receita", values: [3200, 4100, 3800, 5200, 4600] },
      { name: "Despesa", values: [2600, 2900, 3100, 2800, 3300] },
    ],
  },
  {
    value: "12m",
    label: "12 meses",
    labels: ["nov", "dez", "jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out"],
    series: [
      { name: "Receita", values: [14, 18, 12, 13, 15, 16, 17, 16, 19, 21, 20, 24].map((v) => v * 1000) },
      { name: "Despesa", values: [11, 15, 10, 11, 12, 12, 13, 12, 14, 15, 15, 16].map((v) => v * 1000) },
    ],
  },
];

const SPENDING = [
  { name: "Moradia", value: 2400 },
  { name: "Alimentação", value: 1310 },
  { name: "Transporte", value: 620 },
  { name: "Lazer", value: 480 },
  { name: "Assinaturas", value: 140 },
];

const ALLOCATION = [
  { name: "Tesouro Selic", value: 11200 },
  { name: "CDB", value: 6400 },
  { name: "Ações", value: 4100 },
  { name: "Reserva", value: 2600 },
];

export const DASHBOARD_BLOCKS = [
  { id: "dashboard-kpis", label: "Indicadores" },
  { id: "dashboard-fluxo", label: "Receita × despesa" },
  { id: "dashboard-gastos", label: "Gastos por categoria" },
  { id: "dashboard-carteira", label: "Carteira" },
  { id: "dashboard-limite", label: "Limite diário" },
  { id: "dashboard-investir", label: "Investir" },
  { id: "dashboard-metas", label: "Metas" },
  { id: "dashboard-transacoes", label: "Transações" },
];

const PERIODS: { value: Period; label: string }[] = [
  { value: "7d", label: "7 dias" },
  { value: "30d", label: "30 dias" },
  { value: "12m", label: "12 meses" },
];

export function DashboardScreen() {
  const [period, setPeriod] = useState<Period>("30d");
  return (
    <div className="flex flex-col gap-md">
      <DashboardHeader
        title="Dashboard"
        meta="Atualizado há 2 min"
        periods={PERIODS}
        period={period}
        onPeriodChange={setPeriod}
        primaryAction={{ label: "Nova transação", icon: <Icon.Plus size={16} /> }}
      />
      <Block id="dashboard-kpis">
        <Kpis />
      </Block>
      <Block id="dashboard-fluxo">
        <ChartCard title="Receita × despesa" meta="R$ 4,6 mil livres" kind="area" ranges={FLOW} range={period} format={brl} />
      </Block>
      {/* 2 colunas so em xl: abaixo, o donut estreito empilha a legenda e ficaria
          mais alto que as barras (margem morta). Empilhado, cada um vai largo. */}
      <CardGrid columns={{ xl: 2 }} gap="md" masonry={false} stretch>
        <Block id="dashboard-gastos" fill>
          <BreakdownCard title="Gastos por categoria" meta="R$ 4,9 mil" kind="bars" items={SPENDING} format={brl} />
        </Block>
        <Block id="dashboard-carteira" fill>
          <BreakdownCard title="Carteira" meta="R$ 24,3 mil" kind="donut" items={ALLOCATION} format={brlShort} centerLabel="R$ total" />
        </Block>
      </CardGrid>
      <CardGrid columns={{ md: 2, xl: 3 }} gap="md" masonry={false} stretch>
        <Block id="dashboard-limite" fill>
          <PaymentLimit />
        </Block>
        <Block id="dashboard-investir" fill>
          <BuyInvestment />
        </Block>
        <Block id="dashboard-metas" fill className="md:col-span-2 xl:col-span-1">
          <GoalsCard goals={GOALS} onAdd={() => {}} />
        </Block>
      </CardGrid>
      <Block id="dashboard-transacoes">
        <TransactionsCard transactions={TRANSACTIONS} onViewAll={() => {}} onAction={() => {}} />
      </Block>
    </div>
  );
}
