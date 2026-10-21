"use client";

import { useState } from "react";
import { Button, Card, CardHeader, Chip, Field, Icon, Input, Table, Tag, type Column } from "@/lib/ui";

type Linha = { key: string; item: string; status: "Pago" | "Pendente"; valor: string };

const LINHAS: Linha[] = [
  { key: "1", item: "Plano anual", status: "Pago", valor: "R$ 1.188" },
  { key: "2", item: "Mentoria", status: "Pendente", valor: "R$ 490" },
  { key: "3", item: "Workshop", status: "Pago", valor: "R$ 120" },
];

const COLUNAS: Column<Linha>[] = [
  { key: "item", header: "Item", render: (l) => l.item },
  { key: "status", header: "Status", render: (l) => <Tag intent={l.status === "Pago" ? "success" : "warning"} dot>{l.status}</Tag> },
  { key: "valor", header: "Valor", numeric: true, render: (l) => l.valor },
];

const FILTROS = ["Todos", "Pagos", "Pendentes"] as const;

/**
 * Componentes reais da lib sob o rascunho: o que muda de raio, espaço, tipo e
 * altura de controle aparece aqui como apareceria num produto.
 */
export function AmostraComponentes() {
  const [filtro, setFiltro] = useState<(typeof FILTROS)[number]>("Todos");
  return (
    <Card padding="md">
      <CardHeader title="Pedidos" meta={<Tag>3</Tag>} action={<Button size="sm" leading={<Icon.Plus size={16} />}>Novo</Button>} />
      <div className="flex flex-wrap gap-2xs">
        {FILTROS.map((f) => (
          <Chip key={f} active={f === filtro} onClick={() => setFiltro(f)}>
            {f}
          </Chip>
        ))}
      </div>
      <Table columns={COLUNAS} rows={LINHAS} />
      <Field label="Cupom">
        <Input placeholder="SANTO10" />
      </Field>
      <div className="flex flex-wrap gap-xs">
        <Button variant="primary">Finalizar</Button>
        <Button>Salvar rascunho</Button>
      </div>
    </Card>
  );
}
