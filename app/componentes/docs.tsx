"use client";

import { useState } from "react";
import { CATEGORY_LABEL, FONT_CATALOG } from "@/lib/fonts/catalog";
import {
  ActivityItem,
  AreaChart,
  Avatar,
  BarChart,
  Button,
  Calendar,
  Card,
  CardHeader,
  ChatBubble,
  ChatHeader,
  Checkbox,
  Chip,
  ColorRow,
  Count,
  Disclosure,
  Divider,
  Field,
  Icon,
  IconButton,
  Input,
  LineChart,
  Marker,
  NavItem,
  NavSection,
  NavUser,
  NumberField,
  Pagination,
  Radio,
  SearchInput,
  Segmented,
  Select,
  SettingRow,
  SidebarNav,
  StackedAreaChart,
  Stat,
  Swatch,
  SwatchPicker,
  Switch,
  Table,
  TabBar,
  Tag,
  Textarea,
  Ticker,
  TypingIndicator,
  type Column,
} from "@/lib/ui";

/**
 * Documentacao viva: cada bloco monta o componente de verdade, no tema atual.
 * Se um componente quebrar, esta pagina quebra junto — que e o objetivo.
 */

function Spec({
  name,
  when,
  children,
}: {
  name: string;
  /** Uma frase sobre QUANDO usar. Nao sobre o que faz. */
  when: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-sm">
      <div className="flex flex-col gap-3xs">
        <h3 className="santo-heading-6-semibold">{name}</h3>
        <p className="santo-body-small-regular max-w-[68ch] text-text-secondary">{when}</p>
      </div>
      <div className="flex flex-col gap-md rounded-xl border-thin border-border-subtle bg-surface-raised p-lg">
        {children}
      </div>
    </section>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-lg">
      <div className="flex items-baseline gap-sm border-b-thin border-border-subtle pb-2xs">
        <h2 className="santo-heading-5-semibold">{title}</h2>
      </div>
      <div className="flex flex-col gap-xl">{children}</div>
    </section>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap items-center gap-sm">{children}</div>;
}

export function ComponentsDocs() {
  const [checked, setChecked] = useState(true);
  const [radio, setRadio] = useState("a");
  const [on, setOn] = useState(true);
  const [seg, setSeg] = useState<"claro" | "escuro">("claro");
  const [tab, setTab] = useState<"um" | "dois" | "tres">("um");
  const [chip, setChip] = useState("cores");
  const [open, setOpen] = useState(true);
  const [num, setNum] = useState(16);
  const [color, setColor] = useState("#6a2fe3");
  const [linked, setLinked] = useState(false);
  const [rows, setRows] = useState<Set<string>>(new Set(["1"]));
  const [role, setRole] = useState("dona");
  const [fonte, setFonte] = useState("Albert Sans");

  const columns: Column<{ id: string; nome: string; valor: string }>[] = [
    { key: "nome", header: "Nome", render: (r) => r.nome },
    { key: "valor", header: "Valor", numeric: true, render: (r) => r.valor },
  ];
  const data = [
    { id: "1", nome: "Assinatura pro", valor: "R$ 316,00" },
    { id: "2", nome: "Créditos extras", valor: "R$ 242,00" },
  ];

  return (
    <div className="flex flex-col gap-3xl">
      <Group title="Ação">
        <Spec
          name="Button"
          when="Primary para a ação principal da região — uma só. Secondary para apoio, subtle para preenchimento suave, ghost em barra de ferramentas, danger para destruir."
        >
          <Row>
            <Button variant="primary">Primária</Button>
            <Button variant="secondary">Secundária</Button>
            <Button variant="subtle">Suave</Button>
            <Button variant="ghost">Fantasma</Button>
            <Button variant="danger">Destrutiva</Button>
            <Button variant="secondary" disabled>Desabilitada</Button>
          </Row>
          <Row>
            <Button size="sm" variant="secondary">sm · 32</Button>
            <Button size="md" variant="secondary">md · 40</Button>
            <Button size="lg" variant="secondary">lg · 48</Button>
          </Row>
          <Row>
            <Button variant="primary" leading={<Icon.Plus size={16} />}>Com ícone</Button>
            <Button variant="secondary" trailing={<Icon.ChevronDown size={16} />}>Menu</Button>
          </Row>
        </Spec>

        <Spec name="IconButton" when="Botão quadrado só com ícone. O label é obrigatório e vira aria-label.">
          <Row>
            <IconButton label="Buscar"><Icon.Search size={16} /></IconButton>
            <IconButton variant="secondary" label="Copiar"><Icon.Copy size={16} /></IconButton>
            <IconButton variant="subtle" label="Adicionar"><Icon.Plus size={16} /></IconButton>
            <IconButton variant="primary" label="Salvar"><Icon.Save size={16} /></IconButton>
            <IconButton label="Desfazer" disabled><Icon.Undo size={16} /></IconButton>
          </Row>
        </Spec>
      </Group>

      <Group title="Entrada">
        <Spec name="Input · Textarea · Select" when="Campo de uma linha, texto longo e escolha. O Select nunca é o nativo: o do sistema ignora tema e não consegue mostrar cada opção com aparência própria — que é o que faz um seletor de fontes ser útil.">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-md">
            <Field label="Nome"><Input placeholder="Maria Souza" /></Field>
            <Field label="Hex" hint="Aceita 6 ou 8 dígitos."><Input mono defaultValue="#6a2fe3" /></Field>
            <Field label="E-mail" error="Endereço incompleto."><Input invalid defaultValue="maria@" /></Field>
            <Field label="Bloqueado"><Input disabled placeholder="Indisponível" /></Field>
            <Field label="Papel">
              <Select
                value={role}
                onChange={setRole}
                label="Papel"
                options={[
                  { value: "dona", label: "Dona", hint: "Controle total" },
                  { value: "editora", label: "Editora", hint: "Edita, não cobra" },
                  { value: "leitora", label: "Leitora", hint: "Só visualiza", disabled: true },
                ]}
              />
            </Field>
            <Field label="Com busca (32 opções)">
              <Select
                value={fonte}
                onChange={setFonte}
                label="Família tipográfica"
                searchable
                options={FONT_CATALOG.map((f) => ({
                  value: f.family,
                  label: f.family,
                  group: CATEGORY_LABEL[f.category],
                  labelStyle: { fontFamily: `"${f.family}", sans-serif` },
                }))}
              />
            </Field>
          </div>
          <Field label="Descrição" optional><Textarea placeholder="Conte o que aconteceu." /></Field>
          <SearchInput placeholder="Buscar token…" />
        </Spec>

        <Spec name="NumberField" when="Quando o valor é numérico e explorar importa: o slider procura, o campo acerta. Os dois editam o mesmo valor.">
          <div className="max-w-(--santo-dimension-container-sm)">
            <NumberField label="Raio" value={num} onChange={setNum} min={0} max={64} unit="px" />
          </div>
          <p className="santo-caption-regular text-text-tertiary">
            Valor atual: <code className="santo-code-sm">{num}px</code>
          </p>
        </Spec>

        <Spec name="Checkbox · Radio · Switch" when="Chave quando o efeito é imediato. Caixa quando existe um botão Salvar depois.">
          <Checkbox checked={checked} onChange={setChecked} label="Aceito os termos" description="Você pode revogar quando quiser." />
          <Row>
            <Radio checked={radio === "a"} onChange={() => setRadio("a")} label="Starter" description="Para começar." />
            <Radio checked={radio === "b"} onChange={() => setRadio("b")} label="Pro" description="Mais espaço." />
          </Row>
          <SettingRow
            title="Cookies funcionais"
            description="Guardam suas preferências entre visitas."
            control={<Switch checked={on} onChange={setOn} label="Cookies funcionais" />}
          />
        </Spec>
      </Group>

      <Group title="Cor">
        <Spec name="Swatch · SwatchPicker · ColorPicker" when="Amostra com xadrez atrás para alfa parcial. Clicar abre o seletor completo: saturação × brilho, matiz, alfa, conta-gotas e campos HEX/RGB/HSL.">
          <Row>
            <Swatch color="var(--santo-color-bg-brand-solid-default)" />
            <Swatch color="var(--santo-color-bg-accent-solid-default)" />
            <Swatch color="#100d1666" title="Com alfa" />
            <Swatch color="var(--santo-color-bg-success-solid-default)" size="sm" />
            <Swatch color="var(--santo-color-bg-danger-solid-default)" size="xs" round />
          </Row>
          <Row>
            <SwatchPicker color={color} onChange={setColor} label="Cor de exemplo" />
            <code className="santo-code-sm text-text-secondary">{color}</code>
          </Row>
        </Spec>

        <Spec name="ColorRow" when="A linha do editor de tokens. O rótulo tem largura fixa — é isso que alinha uma coluna de dezenas de linhas.">
          <ColorRow
            label="solid/default"
            title="color/bg/brand/solid/default"
            resolved={linked ? "var(--santo-palette-brand-600)" : color}
            value={linked ? "palette/brand/600" : color}
            linked={linked}
            linkOptions={["palette/brand/500", "palette/brand/600", "palette/brand/700"]}
            onChangeHex={setColor}
            onChangeLink={() => undefined}
            onToggleLink={() => setLinked((l) => !l)}
            dirty
            onReset={() => setColor("#6a2fe3")}
          />
        </Spec>
      </Group>

      <Group title="Estrutura">
        <Spec name="Card · CardHeader · Stat" when="Uma superfície, um assunto. Sempre com borda além da sombra: no modo escuro a sombra some e o cartão sumiria no fundo.">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-md">
            <Card><Stat label="Receita" value="R$ 15.231,89" delta="+20,1% no mês" /></Card>
            <Card elevation="md">
              <CardHeader
                title="Com ação"
                description="O canto superior direito aceita botão, tag ou menu."
                action={<IconButton size="sm" label="Mais"><Icon.More size={16} /></IconButton>}
              />
            </Card>
          </div>
          <Row>
            {(["none", "xs", "sm", "md", "lg", "xl", "2xl"] as const).map((e) => (
              <span key={e} className="flex flex-col items-center gap-2xs">
                <span className="size-3xl rounded-lg border-thin border-border-subtle bg-surface-raised" style={{ boxShadow: `var(--santo-shadow-${e})` }} />
                <code className="santo-code-sm text-text-tertiary">{e}</code>
              </span>
            ))}
          </Row>
        </Spec>

        <Spec name="Segmented · TabBar · Chip" when="Segmented para 2 a 4 opções em que a comparação importa. TabBar para trocar de vista. Chip para filtro e para abas de editor.">
          <Row>
            <Segmented value={seg} onChange={setSeg} options={[{ value: "claro", label: <Icon.Sun size={16} />, title: "Claro" }, { value: "escuro", label: <Icon.Moon size={16} />, title: "Escuro" }]} />
            <Segmented size="md" value={tab} onChange={setTab} options={[{ value: "um", label: "3 meses" }, { value: "dois", label: "30 dias" }, { value: "tres", label: "7 dias" }]} />
          </Row>
          <TabBar value={tab} onChange={setTab} options={[{ value: "um", label: "Foundations" }, { value: "dois", label: "Cards" }, { value: "tres", label: "Aplicação" }]} />
          <Row>
            {["cores", "tipografia", "dimensões"].map((c) => (
              <Chip key={c} active={chip === c} onClick={() => setChip(c)}>{c}</Chip>
            ))}
          </Row>
          <Row>
            <Tag intent="brand">brand</Tag>
            <Tag intent="accent">accent</Tag>
            <Tag intent="success">success</Tag>
            <Tag intent="warning">warning</Tag>
            <Tag intent="danger">danger</Tag>
            <Tag intent="info">info</Tag>
            <Tag intent="neutral">neutral</Tag>
            <Count>345</Count>
          </Row>
        </Spec>

        <Spec name="Disclosure" when="Grupo colapsável. O gatilho é pastilha que abraça o texto — faixa de ponta a ponta empilhada vira zebra ilegível.">
          <Disclosure label="superfície" open={open} onToggle={() => setOpen((o) => !o)} count={5} badge={2} hint="Fundo da página, cartões e overlays.">
            <Row>
              <Swatch color="var(--santo-color-surface-page)" />
              <Swatch color="var(--santo-color-surface-raised)" />
              <Swatch color="var(--santo-color-surface-sunken)" />
            </Row>
          </Disclosure>
        </Spec>
      </Group>

      <Group title="Dado">
        <Spec name="Table · Pagination" when="Tabela compacta. selected liga a coluna de seleção, rowAction a de ações — as duas são opcionais.">
          <Table
            columns={columns}
            rows={data}
            getKey={(r) => r.id}
            selected={rows}
            onToggleRow={(k) => setRows((s) => { const n = new Set(s); if (n.has(k)) n.delete(k); else n.add(k); return n; })}
            onToggleAll={() => setRows((s) => (s.size === data.length ? new Set() : new Set(data.map((d) => d.id))))}
            rowAction={() => <IconButton size="sm" label="Mais ações"><Icon.More size={16} /></IconButton>}
          />
          <Pagination summary={`${rows.size} de ${data.length} selecionada(s).`} canNext />
        </Spec>

        <Spec name="Gráficos" when="SVG puro, pintado por token, sem biblioteca. Existem para o preview mostrar como o tema se comporta em dado.">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-lg">
            <div className="flex flex-col gap-2xs"><LineChart values={[4, 7, 5, 9, 8, 12, 10]} /><code className="santo-code-sm text-text-tertiary">LineChart</code></div>
            <div className="flex flex-col gap-2xs"><AreaChart values={[4, 7, 5, 9, 8, 12, 10]} /><code className="santo-code-sm text-text-tertiary">AreaChart</code></div>
            <div className="flex flex-col gap-2xs"><BarChart values={[4, 7, 5, 9, 8, 12, 10]} /><code className="santo-code-sm text-text-tertiary">BarChart</code></div>
          </div>
          <StackedAreaChart
            series={[
              { values: [3, 6, 4, 8, 5, 9, 6], color: "var(--santo-color-icon-accent)" },
              { values: [6, 10, 7, 13, 9, 15, 11], color: "var(--santo-color-icon-primary)" },
            ]}
            labels={["seg", "ter", "qua", "qui", "sex", "sáb", "dom"]}
          />
        </Spec>

        <Spec name="Avatar · Calendar" when="Iniciais em círculo. O calendário é estático — existe para mostrar densidade de texto pequeno e estados de seleção.">
          <Row>
            <Avatar name="Maria Souza" size={24} />
            <Avatar name="Pedro Veloso" size={32} />
            <Avatar name="Alex Ribeiro" size={40} />
          </Row>
          <div className="max-w-(--santo-dimension-space-320)">
            <Calendar month="Junho" year={2026} startWeekday={1} days={30} selected={[8, 9, 10]} today={13} />
          </div>
        </Spec>
      </Group>

      <Group title="Aplicação">
        <Spec name="SidebarNav" when="Navegação lateral. O item ativo usa bg/neutral/solid — sólido, porque num painel claro o preenchimento sutil some.">
          <div className="max-w-(--santo-dimension-space-256) rounded-lg border-thin border-border-subtle p-sm">
            <SidebarNav>
              <NavItem emphasis icon={<Icon.Plus size={16} />}>Criar</NavItem>
              <NavSection>
                <NavItem icon={<Icon.Palette size={16} />} active>Painel</NavItem>
                <NavItem icon={<Icon.TrendUp size={16} />}>Análises</NavItem>
              </NavSection>
              <NavSection title="Documentos">
                <NavItem icon={<Icon.Code size={16} />}>Biblioteca</NavItem>
              </NavSection>
            </SidebarNav>
            <Divider className="my-sm" />
            <NavUser name="Pedro Veloso" email="pedro@exemplo.com" />
          </div>
        </Spec>

        <Spec name="Chat" when="Bolha recebida em neutral/subtle, enviada em brand/solid com text/on-brand. Esse par garante contraste dos dois lados sem escolher cinza na mão.">
          <div className="flex max-w-(--santo-dimension-container-sm) flex-col gap-md">
            <ChatHeader name="Alex Ribeiro" status="Online" />
            <Divider />
            <ChatBubble time="08:56">Conseguiu olhar o deck?</ChatBubble>
            <ChatBubble from="me" time="09:01" reactions={[["❤️", 1]]}>Me dá 30 min.</ChatBubble>
            <TypingIndicator />
          </div>
        </Spec>

        <Spec name="ActivityItem · Ticker" when="Feed de quem/o quê/quando, com pastilha de contexto. O horário alinhado à direita permite varrer a coluna de tempo.">
          <ActivityItem
            who="Lucia Antunes"
            when="há 9 min"
            what={<>concluiu o <strong className="text-text-primary">Sprint 12</strong></>}
            marker={<Marker icon={<Icon.Check size={12} />}>Todas as tarefas feitas</Marker>}
          />
          <Ticker items={[{ symbol: "SDCN", name: "Shadcn", value: "R$ 120.748,00", delta: 1.25 }, { symbol: "ACME", name: "Acme", value: "R$ 84.231,50", delta: -0.42 }]} />
        </Spec>
      </Group>

      <Group title="Ícones">
        <Spec name="Icon.*" when="Grade de 24, traço 1.5, currentColor. O tamanho vem de dimension/icon/* — nunca um número solto.">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(88px,1fr))] gap-md">
            {Object.entries(Icon).map(([name, Cmp]) => {
              const C = Cmp as (p: { size?: 24 }) => React.ReactElement;
              return (
                <span key={name} className="flex flex-col items-center gap-2xs text-text-secondary">
                  <C size={24} />
                  <code className="santo-code-sm text-text-tertiary">{name}</code>
                </span>
              );
            })}
          </div>
        </Spec>
      </Group>
    </div>
  );
}
