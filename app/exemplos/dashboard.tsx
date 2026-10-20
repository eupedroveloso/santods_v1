"use client";

import { useState } from "react";
import {
  CardGrid,
  Button,
  DashboardHeader,
  Card,
  CardHeader,
  Count,
  Field,
  Icon,

  Input,
  KeyValue,
  ListRow,
  MiniBars,
  NumberField,
  Ring,
  Segmented,
  Sparkline,
  Stat,
  Tag,
  TransactionRow,
} from "@/lib/ui";
import { Block } from "./_block";

/**
 * Dashboard (1a passada; a 2a, com os graficos do andar Graficos, vem na juncao).
 * BLOCAGEM POR FILEIRA (skill santo-ui-craft §10.4): cada fileira e uma grade
 * fixa com stretch, irmaos de conteudo equivalente e nenhum buraco:
 *   1. KPIs — 4 Stat do mesmo molde (1 col; 2 em sm; 4 em xl).
 *   2. Operacao — Limite | Investir | Metas, cada um com cabecalho, conteudo,
 *      resumo e UMA acao ancorada no fim (1; 2 em md com Metas largo; 3 em xl).
 *   3. Transacoes — sempre largura total.
 * Um acento por cartao: a micro-viz OU a acao primaria leva brand.
 */

const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

/* --------------------------------------------------------------- KPIs */

const BALANCE = [18.2, 19.1, 18.7, 20.4, 21.9, 21.3, 23.0, 24.3];
const CONTRIBUTIONS = [420, 380, 510, 460, 590, 650];
const YIELD = [0.7, 0.8, 0.82, 0.79, 0.85, 0.87, 0.86];

function Kpis() {
  return (
    <CardGrid columns={{ sm: 2, xl: 4 }} gap="md" masonry={false} stretch>
      <Card>
        <Stat
          label="Saldo disponível"
          value="24.318"
          unit="R$ · 8 semanas"
          action={<Tag intent="success">+6,2%</Tag>}
          viz={<Sparkline values={BALANCE} area label="Saldo, 8 semanas" />}
        />
      </Card>
      <Card>
        <Stat
          label="Próximo aporte"
          value="650"
          unit="R$ · 5 nov."
          action={<Tag>Mensal</Tag>}
          viz={<MiniBars values={CONTRIBUTIONS} highlight={CONTRIBUTIONS.length - 1} size="md" label="Aportes por mês" />}
        />
      </Card>
      <Card>
        <Stat
          label="Metas"
          value="57"
          unit="% do total · 2 metas"
          action={<Tag intent="success">no prazo</Tag>}
          viz={<Ring value={57} tone="brand" size="md" label="Metas: 57% do total" />}
        />
      </Card>
      <Card>
        <Stat
          label="Rendimento"
          value="0,86"
          unit="% no mês · Selic"
          action={<Tag intent="success">+0,04</Tag>}
          viz={<Sparkline values={YIELD} label="Rendimento, 7 meses" />}
        />
      </Card>
    </CardGrid>
  );
}

/* ----------------------------------------------------------- Operacao */

const CURRENCIES = [
  { value: "BRL", label: "BRL" },
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
];

function PaymentLimitCard() {
  const [currency, setCurrency] = useState("BRL");
  const [limit, setLimit] = useState(2500);
  return (
    <Card>
      <CardHeader title="Limite diário" action={<Segmented value={currency} onChange={setCurrency} options={CURRENCIES} />} />
      <Stat label="Por dia" value={limit.toLocaleString("pt-BR")} unit={`${currency} · de 500 a 10.000`} />
      <NumberField label="Limite diário" value={limit} onChange={setLimit} min={500} max={10000} step={100} />
      <Card variant="well">
        <KeyValue label="Usado hoje" value="R$ 312,40" />
      </Card>
      {/* mt-auto: fileira de irmaos equivalentes (stretch) — a acao ancora no fim. */}
      <Button block className="mt-auto">
        Salvar limite
      </Button>
    </Card>
  );
}

const ORDER_TYPES = [
  { value: "mercado", label: "A mercado" },
  { value: "limitada", label: "Limitada" },
  { value: "agendada", label: "Agendada" },
];

function BuyInvestmentCard() {
  const [order, setOrder] = useState("mercado");
  return (
    <Card>
      <CardHeader title="Investir" meta={<Tag>Tesouro Selic</Tag>} />
      <Field label="Valor">
        <Input mono inputMode="decimal" placeholder="R$ 0,00" defaultValue="1.000,00" />
      </Field>
      <Segmented size="md" block value={order} onChange={setOrder} options={ORDER_TYPES} />
      <Card variant="well">
        <KeyValue label="Corretagem" value="R$ 0,00" />
        <KeyValue label="Rentabilidade" value="10,4% a.a." />
      </Card>
      <Button variant="primary" block className="mt-auto">
        Revisar compra
      </Button>
    </Card>
  );
}

const GOALS = [
  { name: "Reserva de emergência", saved: 13000, target: 20000 },
  { name: "Viagem de fim de ano", saved: 4200, target: 8000 },
];

function SavingsGoalsCard() {
  return (
    <Card>
      <CardHeader title="Metas" meta={<Count>{GOALS.length}</Count>} />
      <div className="flex flex-col">
        {GOALS.map((g) => {
          const pct = Math.round((g.saved / g.target) * 100);
          const ring = (
            <Ring value={pct} label={`${g.name}: ${pct}%`} tone="brand" size="md">
              <span className="santo-caption-small-semibold tabular-nums">{pct}%</span>
            </Ring>
          );
          return (
            <ListRow
              key={g.name}
              divider
              leading={ring}
              title={g.name}
              meta={`${brl(g.saved)} de ${brl(g.target)}`}
            />
          );
        })}
      </div>
      <Card variant="well">
        <KeyValue label="Guardado no total" value={brl(GOALS.reduce((a, g) => a + g.saved, 0))} />
      </Card>
      <Button block className="mt-auto">
        Nova meta
      </Button>
    </Card>
  );
}

/* ---------------------------------------------------------- Transacoes */

type Transaction = { title: string; category: string; date: string; amount: number };

const TRANSACTIONS: Transaction[] = [
  { title: "Salário", category: "Receita", date: "15 out.", amount: 8200 },
  { title: "Mercado Bom Preço", category: "Alimentação", date: "14 out.", amount: -312.4 },
  { title: "Aluguel", category: "Moradia", date: "10 out.", amount: -2400 },
  { title: "Reembolso viagem", category: "Trabalho", date: "08 out.", amount: 640 },
  { title: "Streaming", category: "Assinaturas", date: "05 out.", amount: -39.9 },
];

function TransactionsCard() {
  return (
    <Card>
      <CardHeader
        title="Transações"
        meta={<Count>{TRANSACTIONS.length}</Count>}
        action={
          <Button size="sm" variant="ghost">
            Ver todas
          </Button>
        }
      />
      <div className="flex flex-col">
        {TRANSACTIONS.map((t, i) => (
          <TransactionRow
            key={t.title}
            title={t.title}
            category={t.category}
            date={t.date}
            amount={t.amount}
            onAction={() => {}}
            divider={i < TRANSACTIONS.length - 1}
          />
        ))}
      </div>
    </Card>
  );
}

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
          <PaymentLimitCard />
        </Block>
        <Block id="dashboard-investir" fill>
          <BuyInvestmentCard />
        </Block>
        <Block id="dashboard-metas" fill className="md:col-span-2 xl:col-span-1">
          <SavingsGoalsCard />
        </Block>
      </CardGrid>
      <Block id="dashboard-transacoes">
        <TransactionsCard />
      </Block>
    </div>
  );
}
