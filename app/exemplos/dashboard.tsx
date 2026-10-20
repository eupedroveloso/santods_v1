"use client";

import { useState } from "react";
import {
  CardGrid,
  Button,
  DashboardHeader,
  GoalsCard,
  Icon,
  InvestCard,
  LimitCard,
  Segmented,
  StatCard,
  TransactionsCard,
  type Transaction,
} from "@/lib/ui";
import { Block } from "./_block";

/**
 * Dashboard: so compoe blocos de lib/ui (lib:check, regra D).
 * BLOCAGEM POR FILEIRA (skill santo-ui-craft §10.4): cada fileira e uma grade
 * fixa com stretch, irmaos de conteudo equivalente e nenhum buraco:
 *   1. KPIs — 4 StatCard do mesmo molde (1 col; 2 em sm; 4 em xl).
 *   2. Operacao — Limite | Investir | Metas, cada um com cabecalho, conteudo,
 *      resumo e a acao ancorada no fim (1; 2 em md com Metas largo; 3 em xl).
 *   3. Transacoes — sempre largura total.
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

export const DASHBOARD_BLOCKS = [
  { id: "dashboard-kpis", label: "Indicadores" },
  { id: "dashboard-limite", label: "Limite diário" },
  { id: "dashboard-investir", label: "Investir" },
  { id: "dashboard-metas", label: "Metas" },
  { id: "dashboard-transacoes", label: "Transações" },
];

const PERIODS = [
  { value: "7d", label: "7 dias" },
  { value: "30d", label: "30 dias" },
  { value: "12m", label: "12 meses" },
];

export function DashboardScreen() {
  const [period, setPeriod] = useState("30d");
  return (
    <div className="flex flex-col gap-md">
      <DashboardHeader
        title="Dashboard"
        meta="Atualizado há 2 min"
        filter={<Segmented value={period} onChange={setPeriod} options={PERIODS} />}
        action={
          <Button variant="primary" leading={<Icon.Plus size={16} />}>
            Nova transação
          </Button>
        }
      />
      <Block id="dashboard-kpis">
        <Kpis />
      </Block>
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
