"use client";

import { useState } from "react";
import { CardGrid, EmptyState, GoalsCard, Icon, InvestCard, LimitCard, StatCard, TransactionsCard, type Transaction } from "@/lib/ui";
import { Block } from "./_block";

/**
 * Financas: o sistema em uso real. A tela so compoe blocos de lib/ui
 * (StatCard, GoalsCard, InvestCard, LimitCard, TransactionsCard) com dado —
 * nenhum cartao e montado aqui (lib:check, regra D).
 */

const CONTRIBUTIONS = [420, 380, 510, 460, 590, 650];
const MONTHS = ["mai", "jun", "jul", "ago", "set", "out"];
const BALANCE = [18.2, 19.1, 18.7, 20.4, 21.9, 21.3, 23.0, 24.3];

const GOALS = [
  { name: "Reserva de emergência", saved: 13000, target: 20000 },
  { name: "Viagem de fim de ano", saved: 4200, target: 8000 },
];

const ORDER_TYPES = [
  { value: "mercado", label: "A mercado" },
  { value: "limitada", label: "Limitada" },
  { value: "agendada", label: "Agendada" },
];

const CURRENCIES = [
  { value: "BRL", label: "BRL" },
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
];

const TRANSACTIONS: Transaction[] = [
  { title: "Salário", category: "Receita", date: "15 out.", amount: 8200 },
  { title: "Mercado Bom Preço", category: "Alimentação", date: "14 out.", amount: -312.4 },
  { title: "Aluguel", category: "Moradia", date: "10 out.", amount: -2400 },
  { title: "Reembolso viagem", category: "Trabalho", date: "08 out.", amount: 640 },
  { title: "Streaming", category: "Assinaturas", date: "05 out.", amount: -39.9 },
];

export const FINANCAS_BLOCKS = [
  { id: "financas-contribuicoes", label: "Contribuições" },
  { id: "financas-metas", label: "Metas" },
  { id: "financas-saldo", label: "Saldo" },
  { id: "financas-faixa", label: "Distribuir faixa" },
  { id: "financas-investir", label: "Investir" },
  { id: "financas-limite", label: "Limite diário" },
  { id: "financas-transacoes", label: "Transações" },
];

/** Visualizacao Financas: grade unica; cada cartao com a altura do seu conteudo. */
export function Overview() {
  const [order, setOrder] = useState("mercado");
  const [amount, setAmount] = useState("1.000,00");
  const [currency, setCurrency] = useState("BRL");
  const [limit, setLimit] = useState(2500);

  return (
    <CardGrid>
      <Block id="financas-contribuicoes">
        <StatCard
          title="Contribuições"
          meta="6 meses"
          label="Próximo aporte"
          value="650"
          unit="R$ por mês · 5 nov."
          trend={{ kind: "bars", values: CONTRIBUTIONS, labels: MONTHS, label: "Aportes por mês" }}
          details={[
            { label: "Plano", value: "Mensal" },
            { label: "No ano", value: `R$ ${CONTRIBUTIONS.reduce((a, b) => a + b, 0).toLocaleString("pt-BR")}` },
          ]}
          action={{ label: "Contribuir agora" }}
        />
      </Block>
      <Block id="financas-metas">
        <GoalsCard goals={GOALS} onAdd={() => {}} />
      </Block>
      <Block id="financas-saldo">
        <StatCard
          label="Saldo disponível"
          value="24.318,52"
          unit="R$ · 8 semanas"
          delta={{ label: "Pendente", intent: "warning", dot: true }}
          trend={{ kind: "spark", values: BALANCE, labels: BALANCE.map((_, i) => `sem. ${i + 1}`), label: "Saldo, 8 semanas" }}
          details={[
            { label: "Em conta", value: "R$ 21.118,52" },
            { label: "A receber", value: "R$ 3.200,00" },
            { label: "Bloqueado", value: "R$ 0,00" },
          ]}
        />
      </Block>
      <Block id="financas-faixa">
        <EmptyState className="justify-center" icon={<Icon.Plus size={16} />} title="Distribuir faixa" action={{ label: "Criar faixa" }} />
      </Block>
      <Block id="financas-investir">
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
      </Block>
      <Block id="financas-limite">
        <LimitCard
          value={limit}
          onChange={setLimit}
          min={500}
          max={10000}
          currencies={CURRENCIES}
          currency={currency}
          onCurrencyChange={setCurrency}
        />
      </Block>
      <Block id="financas-transacoes" className="md:col-span-2 2xl:col-span-3">
        <TransactionsCard transactions={TRANSACTIONS} />
      </Block>
    </CardGrid>
  );
}
