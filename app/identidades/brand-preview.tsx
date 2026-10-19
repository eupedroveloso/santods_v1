"use client";

import { useState } from "react";
import {
  Avatar,
  Button,
  Card,
  CardHeader,
  Chip,
  Count,
  Fab,
  Field,
  Icon,
  IconButton,
  Input,
  Kbd,
  ListRow,
  RailItem,
  RailNav,
  Ring,
  Segmented,
  SettingRow,
  Sparkline,
  Stat,
  Switch,
  Tag,
  type Intent,
} from "@/lib/ui";
import { PEOPLE, photo, type Person } from "@/lib/ui/demo-people";

/**
 * Preview de uma identidade: um app da marca em miniatura (skill
 * santo-ui-craft). Chao rebaixado com trilho de icones; cartoes tonais com KPI
 * e micro-visualizacao, lista hairline, formulario com poco e um FAB. Vive
 * dentro do data-brand do cartao, entao tudo aqui herda a marca da identidade.
 */

const INTENTS: { intent: Intent; label: string }[] = [
  { intent: "brand", label: "Marca" },
  { intent: "success", label: "Ativo" },
  { intent: "warning", label: "Pendente" },
  { intent: "danger", label: "Falhou" },
  { intent: "info", label: "Novo" },
];

const ACTIVITY: { person: Person; what: string; when: string; intent: Intent; status: string }[] = [
  { person: "erica", what: "Landing de outubro", when: "há 2 min", intent: "success", status: "Publicada" },
  { person: "pedro", what: "Deck do Q4", when: "há 1 h", intent: "warning", status: "Revisão" },
  { person: "sena", what: "Material de vendas", when: "ontem", intent: "info", status: "Rascunho" },
];

export function BrandPreview({ name }: { name: string }) {
  const [plan, setPlan] = useState("mensal");
  const [notify, setNotify] = useState(true);
  const [chip, setChip] = useState("Todos");

  return (
    <Card variant="sunken" padding="md">
      <div className="flex gap-md">
        <RailNav className="hidden sm:flex" footer={<Avatar name={PEOPLE.pedro.name} src={photo("pedro")} />}>
          <RailItem icon={<Icon.Grid size={20} />} label="Painel" active />
          <RailItem icon={<Icon.Layers size={20} />} label="Projetos" dot />
          <RailItem icon={<Icon.Book size={20} />} label="Materiais" />
        </RailNav>

        <div className="grid min-w-0 flex-1 grid-cols-1 gap-md md:grid-cols-2 xl:grid-cols-12">
          <Card className="xl:col-span-4">
            <Stat
              label="Receita"
              value="48,2"
              unit="R$ mil · 72% da meta"
              action={<Tag intent="success">+12%</Tag>}
              viz={<Ring value={72} label="Meta do mês: 72%" tone="brand" size="md" />}
            />
          </Card>

          <Card className="xl:col-span-4">
            <Stat
              label="Clientes"
              value="1.204"
              unit="ativos"
              viz={<Sparkline values={[980, 1010, 1060, 1040, 1110, 1150, 1204]} area label="Clientes, 7 meses" />}
            />
          </Card>

          <Card className="md:col-span-2 xl:col-span-4">
            <CardHeader title="Tipografia" />
            <span className="santo-heading-4-semibold">{name}</span>
            <span className="santo-body-large-semibold">Pronto para lançar</span>
            <span className="santo-caption-regular text-text-tertiary">Landing · materiais · slides</span>
          </Card>

          <Card className="md:col-span-2 xl:col-span-7">
            <CardHeader title="Atividade" meta={<Count>{ACTIVITY.length}</Count>} />
            <div className="flex flex-col">
              {ACTIVITY.map((a) => (
                <ListRow
                  key={a.what}
                  divider
                  leading={<Avatar name={PEOPLE[a.person].name} src={photo(a.person)} />}
                  title={a.what}
                  meta={`${PEOPLE[a.person].name} · ${a.when}`}
                  trailing={<Tag intent={a.intent}>{a.status}</Tag>}
                />
              ))}
            </div>
            <Fab className="mt-auto self-end" extended icon={<Icon.Plus size={16} />} label="Novo projeto" />
          </Card>

          <Card className="md:col-span-2 xl:col-span-5">
            <CardHeader title="Conta" />
            <Field label="E-mail">
              <Input type="email" placeholder="voce@exemplo.com" />
            </Field>
            <Segmented
              value={plan}
              onChange={setPlan}
              options={[
                { value: "mensal", label: "Mensal" },
                { value: "anual", label: "Anual" },
              ]}
            />
            <Card variant="well" padding="md">
              <SettingRow
                title="Notificações"
                control={<Switch checked={notify} onChange={setNotify} label="Notificações" />}
              />
            </Card>
            <div className="mt-auto flex gap-xs">
              <Button variant="ghost" className="flex-1">
                Cancelar
              </Button>
              <Button variant="primary" className="flex-1">
                Salvar
              </Button>
            </div>
          </Card>

          <Card className="md:col-span-2 xl:col-span-12">
            <CardHeader
              title="Interface"
              action={
                <span className="flex items-center gap-2xs">
                  <Kbd>⌘</Kbd>
                  <Kbd>K</Kbd>
                </span>
              }
            />
            <div className="flex flex-wrap items-center gap-xs">
              {INTENTS.map((t) => (
                <Tag key={t.intent} intent={t.intent}>
                  {t.label}
                </Tag>
              ))}
              {["Todos", "Abertos", "Fechados"].map((c) => (
                <Chip key={c} active={chip === c} onClick={() => setChip(c)}>
                  {c}
                </Chip>
              ))}
              <Button size="sm">
                Secundário
              </Button>
              <Button size="sm" variant="ghost">
                Ghost
              </Button>
              <IconButton size="sm" variant="secondary" label="Adicionar">
                <Icon.Plus size={16} />
              </IconButton>
            </div>
          </Card>
        </div>
      </div>
    </Card>
  );
}
