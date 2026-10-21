"use client";

import type { ShadowName } from "@/lib/tokens";
import { Button, IconButton } from "./button";
import { Card, CardFooter, CardHeader, Divider, Stat, type CardVariant } from "./card";
import { Count, Tag } from "./chip";
import * as Icon from "./icons";
import { IconTile } from "./icon-tile";
import { LineChart } from "./chart";
import { MiniBars } from "./mini-bars";
import { Ring } from "./ring";
import { Sparkline } from "./sparkline";
import type { DemoMap } from "./registry.types";

const VARIANTS = ["raised", "sunken", "outlined", "dashed", "double"];
const ELEVATIONS = ["none", "xs", "sm", "md", "lg", "xl", "2xl"];
const SERIES = [6, 5, 4, 14, 8, 7, 9, 8, 10, 9];

/** Corpo comum das variantes: titulo + meta, grafico, acao. */
function Body({ title }: { title: string }) {
  return (
    <>
      <CardHeader
        title={title}
        meta={<Count>10</Count>}
        action={
          <IconButton size="sm" variant="ghost" label="Mais opções">
            <Icon.More size={16} />
          </IconButton>
        }
      />
      <LineChart values={SERIES} />
    </>
  );
}

export const cardDemos: DemoMap = {
  card: {
    playground: {
      controls: [
        { kind: "select", prop: "variant", label: "Variante", options: VARIANTS, initial: "raised" },
        { kind: "select", prop: "elevation", label: "Elevação", options: ELEVATIONS, initial: "sm" },
        { kind: "text", prop: "title", label: "Título", initial: "Meta diária" },
      ],
      layout: "stretch",
      Preview: ({ values: v }) => {
        const variant = v.variant as CardVariant;
        const width = "mx-auto w-full max-w-(--santo-dimension-space-384)";
        if (variant === "double")
          return (
            <Card
              variant="double"
              className={width}
              header={<CardHeader title={v.title as string} meta={<Count>10</Count>} />}
              footer={
                <CardFooter>
                  <Button>Cancelar</Button>
                  <Button variant="primary">Salvar</Button>
                </CardFooter>
              }
            >
              <LineChart values={SERIES} />
            </Card>
          );
        return (
          <Card variant={variant} elevation={v.elevation as ShadowName} className={width}>
            <Body title={v.title as string} />
          </Card>
        );
      },
      code: (v) =>
        v.variant === "double"
            ? `<Card
  variant="double"
  header={<CardHeader title="${v.title}" meta={<Count>10</Count>} />}
  footer={<CardFooter>…</CardFooter>}
>
  …
</Card>`
            : `<Card${v.variant !== "raised" ? ` variant="${v.variant}"` : ""}${v.elevation !== "sm" && v.variant === "raised" ? ` elevation="${v.elevation}"` : ""}>
  <CardHeader title="${v.title}" meta={<Count>10</Count>} action={<IconButton variant="ghost" …/>} />
  <LineChart values={valores} />
</Card>`,
    },
    demos: [
      {
        title: "Níveis tonais e raio concêntrico",
        layout: "stretch",
        code: `<Card variant="sunken" padding="sm">   // moldura: raio = filho (lg) + sm
  <Card>                                  // cartão: vira lg dentro da moldura
    <CardHeader title="Pedidos" meta={<Count>128</Count>} />
    <MiniBars …/>                          // sem caixa em volta (nada de poço)
  </Card>
</Card>`,
        Preview: () => (
          <Card variant="sunken" padding="sm" className="mx-auto w-full max-w-(--santo-dimension-space-448)">
            <Card>
              <CardHeader title="Pedidos" meta={<Count>128</Count>} />
              <MiniBars values={[4, 6, 5, 9, 8, 12, 10]} highlight={-1} size="md" label="Pedidos por dia" className="text-icon-brand" />
            </Card>
          </Card>
        ),
      },
      {
        title: "Vidro",
        layout: "stretch",
        code: `// Vidro só sobre fundo que mostre o efeito (imagem, gradiente) e em superfície pequena.
<div className="santo-gradient-brand …">
  <Card variant="glass">
    <CardHeader title="Saldo" meta={<Count>3</Count>} />
    <MiniBars …/>
  </Card>
</div>`,
        Preview: () => (
          // Fundo com forma: o desfoque do vidro só se lê com algo atrás.
          <div className="santo-gradient-brand relative mx-auto flex w-full max-w-(--santo-dimension-space-448) items-center justify-center overflow-hidden rounded-xl p-2xl">
            <span aria-hidden className="absolute -left-md top-md size-5xl rounded-full bg-accent-solid-default" />
            <span aria-hidden className="absolute -right-sm bottom-sm size-4xl rounded-full bg-success-solid-default" />
            <Card variant="glass" className="relative w-full">
              <CardHeader title="Saldo" meta={<Count>3</Count>} />
              <MiniBars values={[4, 6, 5, 9, 8, 12, 10]} highlight={-1} size="md" label="Saldo por dia" className="text-text-primary" />
            </Card>
          </div>
        ),
      },
    ],
  },
  "card-header": {
    demos: [
      {
        title: "Título + meta",
        layout: "stretch",
        code: `<CardHeader
  leading={<IconTile><Icon.ArrowTrendUpIcon size={16} /></IconTile>}
  title="Pagamentos"
  meta={<Count>12</Count>}
  action={<IconButton size="sm" variant="ghost" label="Mais"><Icon.More size={16} /></IconButton>}
/>`,
        Preview: () => (
          <Card className="mx-auto w-full max-w-(--santo-dimension-space-384)">
            <CardHeader
              leading={<IconTile><Icon.ArrowTrendUpIcon size={16} /></IconTile>}
              title="Pagamentos"
              meta={<Count>12</Count>}
              action={
                <IconButton size="sm" variant="ghost" label="Mais">
                  <Icon.More size={16} />
                </IconButton>
              }
            />
          </Card>
        ),
      },
    ],
  },
  "card-footer": {
    demos: [
      {
        title: "Básico",
        layout: "stretch",
        code: `<CardFooter><Button>Cancelar</Button><Button variant="primary">Salvar</Button></CardFooter>`,
        Preview: () => (
          <Card className="mx-auto w-full max-w-(--santo-dimension-space-384)">
            <CardHeader title="Plano" />
            <CardFooter>
              <Button>Cancelar</Button>
              <Button variant="primary">Salvar</Button>
            </CardFooter>
          </Card>
        ),
      },
    ],
  },
  stat: {
    playground: {
      controls: [
        { kind: "select", prop: "viz", label: "Micro-viz", options: ["sparkline", "barras", "anel", "nenhuma"], initial: "sparkline" },
        { kind: "select", prop: "size", label: "Tamanho", options: ["sm", "md", "lg"], initial: "md" },
      ],
      Preview: ({ values: v }) => {
        const viz =
          v.viz === "sparkline" ? (
            <Sparkline values={SERIES} size="md" area label="Receita nos últimos 10 dias" />
          ) : v.viz === "barras" ? (
            <MiniBars values={[4, 6, 5, 9, 8, 12, 10]} highlight={-1} size="md" label="Receita por dia" />
          ) : v.viz === "anel" ? (
            <Ring value={72} size="md" tone="brand" label="72% da meta" />
          ) : undefined;
        return (
          <Card className="w-full max-w-(--santo-dimension-space-320)">
            <Stat
              size={v.size as "sm" | "md" | "lg"}
              label="Receita"
              value="15.231"
              unit="R$ no mês"
              delta={<Tag intent="success">+20,1%</Tag>}
              viz={viz}
            />
          </Card>
        );
      },
      code: (v) => `<Stat
  label="Receita"
  value="15.231"
  unit="R$ no mês"
  delta={<Tag intent="success">+20,1%</Tag>}${v.size !== "md" ? `
  size="${v.size}"` : ""}${v.viz === "nenhuma" ? "" : `
  viz={${v.viz === "sparkline" ? "<Sparkline values={serie} area />" : v.viz === "barras" ? "<MiniBars values={serie} highlight={-1} />" : '<Ring value={72} tone="brand" label="72% da meta" />'}}`}
/>`,
    },
    demos: [],
  },
  divider: {
    demos: [
      {
        title: "Básico",
        layout: "stretch",
        code: `<Divider />
<Divider label="ou continue com" />
<Divider orientation="vertical" />`,
        Preview: () => (
          <div className="santo-body-small-regular mx-auto flex w-full max-w-(--santo-dimension-space-320) flex-col gap-sm text-text-secondary">
            <span>Acima</span>
            <Divider />
            <span>Abaixo</span>
            <Divider label="ou continue com" />
            <div className="flex h-lg items-center gap-sm">
              <span>Esquerda</span>
              <Divider orientation="vertical" />
              <span>Direita</span>
            </div>
          </div>
        ),
      },
    ],
  },
};
