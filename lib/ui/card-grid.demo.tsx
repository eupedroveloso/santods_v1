"use client";

import { Button } from "./button";
import { Card, CardHeader, Stat } from "./card";
import { CardGrid, type CardGridColumns } from "./card-grid";
import { Count, Tag } from "./chip";
import { KeyValue } from "./key-value";
import { LinkCard } from "./link-card";
import { MiniBars } from "./mini-bars";
import { Sparkline } from "./sparkline";
import type { DemoMap } from "./registry.types";

const SERIES = [6, 5, 4, 14, 8, 7, 9, 8, 10, 9];

export const cardGridDemos: DemoMap = {
  "card-grid": {
    playground: {
      controls: [{ kind: "select", prop: "cols", label: "Colunas (md+)", options: ["1", "2", "3"], initial: "3" }],
      layout: "stretch",
      Preview: ({ values: v }) => (
        <CardGrid columns={{ md: Number(v.cols) as CardGridColumns }} gap="md" className="w-full">
          <Card>
            <Stat
              label="Receita"
              value="15.231"
              unit="R$ no mês"
              action={<Tag intent="success">+20,1%</Tag>}
              viz={<Sparkline values={SERIES} area label="Receita, 10 dias" />}
            />
          </Card>
          <Card>
            <Stat
              label="Exercício"
              value="42"
              unit="min hoje"
              viz={<MiniBars values={[30, 25, 20, 55, 38, 34, 42]} highlight={6} size="md" label="Minutos por dia" />}
            />
            <Card variant="well" padding="md">
              <KeyValue label="Média" value="35 min" />
              <KeyValue label="Recorde" value="55 min" />
            </Card>
          </Card>
          <Card>
            <CardHeader title="Plano" meta={<Count>Pro</Count>} />
            <Button block>Assinar</Button>
          </Card>
        </CardGrid>
      ),
      code: (v) => `<CardGrid columns={{ md: ${v.cols} }} gap="md">
  <Card>…</Card>   {/* masonry: cada cartão na altura do conteúdo, */}
  <Card>…</Card>   {/* empilhado na coluna sem vão */}
</CardGrid>`,
    },
    demos: [
      {
        title: "Grade fixa com spans",
        layout: "stretch",
        code: `<CardGrid columns={{ md: 3 }} gap="md" masonry={false}>
  <Card>…</Card>  <Card>…</Card>  <Card>…</Card>
  <Card className="md:col-span-2">…</Card>  <Card>…</Card>
</CardGrid>`,
        Preview: () => (
          <CardGrid columns={{ md: 3 }} gap="md" masonry={false} className="w-full">
            <Card padding="md">
              <Stat size="sm" label="Receita" value="48,2" unit="R$ mil" />
            </Card>
            <Card padding="md">
              <Stat size="sm" label="Clientes" value="1.204" unit="ativos" />
            </Card>
            <Card padding="md">
              <Stat size="sm" label="Ticket" value="40" unit="R$ médio" />
            </Card>
            <Card padding="md" className="md:col-span-2">
              <CardHeader title="Atividade" meta={<Count>3</Count>} />
            </Card>
            <Card padding="md">
              <CardHeader title="Conta" />
            </Card>
          </CardGrid>
        ),
      },
      {
        title: "Índice (stretch)",
        layout: "stretch",
        code: `<CardGrid columns={{ md: 3 }} gap="md" masonry={false} stretch>
  <LinkCard title="Tipografia" links={…4} />
  <LinkCard title="Efeitos" links={…7} />   {/* a fileira fica na altura do maior; */}
  <LinkCard title="Movimento" links={…3} /> {/* os links do curto esticam, sem buraco */}
</CardGrid>`,
        Preview: () => (
          <CardGrid columns={{ md: 3 }} gap="md" masonry={false} stretch className="w-full">
            <LinkCard title="Tipografia" links={["Heading", "Body", "Caption", "Code"].map((l) => ({ label: l, href: `#${l}` }))} />
            <LinkCard title="Efeitos" links={["none", "xs", "sm", "md", "lg", "xl", "2xl"].map((l) => ({ label: l, href: `#e-${l}` }))} />
            <LinkCard title="Movimento" links={["Duração", "Curva", "Receitas"].map((l) => ({ label: l, href: `#m-${l}` }))} />
          </CardGrid>
        ),
      },
      {
        title: "Auto-fill",
        layout: "stretch",
        code: `<CardGrid minItem="space-192" gap="md" masonry={false}>…</CardGrid>`,
        Preview: () => (
          <CardGrid minItem="space-192" gap="md" masonry={false} className="w-full">
            {["Pedidos", "Clientes", "Ticket", "Retenção"].map((label, i) => (
              <Card key={label} padding="md">
                <Stat size="sm" label={label} value={String((i + 1) * 128)} />
              </Card>
            ))}
          </CardGrid>
        ),
      },
    ],
  },
};
