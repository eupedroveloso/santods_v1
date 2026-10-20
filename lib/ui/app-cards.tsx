"use client";

import { useState, type ReactNode } from "react";
import { IconButton } from "./button";
import { Card, CardHeader } from "./card";
import { Count } from "./chip";
import { AreaChart, BarChart, LineChart, type ChartSeries } from "./chart";
import { ChatAttachment, ChatBubble, ChatComposer, ChatHeader, TypingIndicator } from "./chat";
import { Avatar } from "./data";
import { Fab } from "./fab";
import { ActivityItem, Marker } from "./feed";
import { NavItem, NavSection, NavSub, NavUser, SidebarNav } from "./nav";
import { RailItem, RailNav } from "./rail-nav";
import { Segmented, type Segment } from "./segmented";

/*
 * Blocos de aplicacao: conversa, atividade, grafico com periodo e a moldura
 * de app (trilho + painel + conteudo). Alimentados por dado; a tela so
 * compoe (lib:check, regra D).
 */

/* ---------------------------------------------------------------- conversa */

export type ChatMessage = {
  from?: "me" | "them";
  text?: string;
  /** Anexo no lugar do texto. */
  attachment?: { name: string; size: string };
  time?: string;
  reactions?: [string, number][];
};

/**
 * Conversa num cartao: cabecalho com a pessoa e o status, bolhas, "digitando"
 * e o composer em campo-poco com enviar inline. Use para suporte, chat de
 * time, comentario em tempo real. Enviar acrescenta a mensagem a lista.
 */
export function ChatCard({
  person,
  messages: initial,
  actions = [],
  typing = false,
  placeholder = "Escreva sua mensagem…",
  onSend,
  padding,
  className = "",
}: {
  person: { name: string; avatarSrc?: string; status?: string };
  messages: ChatMessage[];
  /** Acoes ghost no cabecalho (ligar, video, adicionar). */
  actions?: { icon: ReactNode; label: string; onClick?: () => void }[];
  /** Mostra o indicador de digitacao no fim. */
  typing?: boolean;
  placeholder?: string;
  onSend?: (text: string) => void;
  /** Densidade do cartao (md quando divide espaco com outros painéis). */
  padding?: "sm" | "md" | "lg";
  className?: string;
}) {
  const [messages, setMessages] = useState(initial);
  const [draft, setDraft] = useState("");
  return (
    <Card padding={padding} className={className}>
      <ChatHeader
        name={person.name}
        avatarSrc={person.avatarSrc}
        status={person.status}
        actions={
          actions.length > 0 && (
            <span className="flex gap-2xs">
              {actions.map((a) => (
                <IconButton key={a.label} size="sm" variant="ghost" label={a.label} onClick={a.onClick}>
                  {a.icon}
                </IconButton>
              ))}
            </span>
          )
        }
      />
      <div className="flex flex-col gap-sm">
        {messages.map((m, i) => (
          <ChatBubble key={i} from={m.from} time={m.time} reactions={m.reactions}>
            {m.attachment ? <ChatAttachment name={m.attachment.name} size={m.attachment.size} /> : m.text}
          </ChatBubble>
        ))}
        {typing && <TypingIndicator />}
      </div>
      <ChatComposer
        value={draft}
        onChange={setDraft}
        placeholder={placeholder}
        onSend={(text) => {
          if (!text.trim()) return;
          setMessages((list) => [...list, { from: "me", text }]);
          setDraft("");
          onSend?.(text);
        }}
      />
    </Card>
  );
}

/* ---------------------------------------------------------------- atividade */

export type Activity = {
  who: string;
  avatarSrc?: string;
  when: string;
  what: ReactNode;
  /** Pastilha de contexto: icone + rotulo. */
  marker?: { icon?: ReactNode; label: string };
  /** Aba em que o item aparece (alem de "tudo"). */
  kind?: string;
};

/**
 * Feed de atividade com filtro: titulo com contagem, abas em Segmented,
 * itens "quem / o que / quando" com pastilha de contexto e a acao principal
 * em FAB estendido no fim. Use para historico de time, notificacoes.
 */
export function ActivityCard<T extends string>({
  title = "Atividade",
  items,
  tabs,
  action,
  padding,
  className = "",
}: {
  title?: string;
  items: Activity[];
  /** Abas de filtro; a primeira mostra tudo, as demais filtram por `kind`. */
  tabs?: Segment<T>[];
  /** Acao principal flutuante: "Nova mensagem". */
  action?: { icon: ReactNode; label: string; onClick?: () => void };
  padding?: "sm" | "md" | "lg";
  className?: string;
}) {
  const [tab, setTab] = useState<T | undefined>(tabs?.[0]?.value);
  const all = tab === tabs?.[0]?.value;
  const shown = all || !tab ? items : items.filter((i) => i.kind === tab);
  return (
    <Card padding={padding} className={className}>
      <CardHeader title={title} meta={<Count>{shown.length}</Count>} />
      {tabs && tab !== undefined && <Segmented value={tab} onChange={setTab} options={tabs} />}
      <div className="flex flex-col">
        {shown.map((a, i) => (
          <ActivityItem
            key={i}
            who={a.who}
            avatarSrc={a.avatarSrc}
            when={a.when}
            what={a.what}
            marker={a.marker && <Marker icon={a.marker.icon}>{a.marker.label}</Marker>}
          />
        ))}
      </div>
      {action && <Fab className="self-end" extended icon={action.icon} label={action.label} onClick={action.onClick} />}
    </Card>
  );
}

/* ------------------------------------------------------- grafico com periodo */

export type ChartRange<T extends string> = Segment<T> & { series: ChartSeries[]; labels: string[] };

/**
 * Grafico grande num cartao, com periodo: titulo + total (`meta`) + periodos
 * em Segmented, e o grafico (area, linha ou barra) direto no cartao — sem
 * poco, que e so de campo e codigo. Use para a serie principal de um painel
 * (visitantes, receita). Trocar o periodo troca series e eixo juntos.
 */
export function ChartCard<T extends string>({
  title,
  meta,
  ranges,
  initialRange,
  kind = "area",
  stacked = false,
  format,
  className = "",
}: {
  title: string;
  /** Total ao lado do titulo, em Count: "12,4 mil". */
  meta?: string;
  ranges: ChartRange<T>[];
  initialRange?: T;
  kind?: "area" | "line" | "bar";
  /** Area ou barra empilhada. */
  stacked?: boolean;
  format?: (v: number) => string;
  className?: string;
}) {
  const [range, setRange] = useState<T>(initialRange ?? ranges[0].value);
  const current = ranges.find((r) => r.value === range) ?? ranges[0];
  const props = { series: current.series, labels: current.labels, label: `${title}, ${String(current.label)}`, format, height: 192 as const };
  return (
    <Card className={className}>
      <CardHeader
        title={title}
        meta={meta ? <Count>{meta}</Count> : undefined}
        action={ranges.length > 1 && <Segmented value={range} onChange={setRange} options={ranges} />}
      />
      {kind === "line" ? (
        <LineChart {...props} />
      ) : kind === "bar" ? (
        <BarChart {...props} mode={stacked ? "stacked" : "grouped"} />
      ) : (
        <AreaChart {...props} stacked={stacked} />
      )}
    </Card>
  );
}

/* ---------------------------------------------------------- moldura de app */

export type AppRailEntry = { icon: ReactNode; label: string; active?: boolean; dot?: boolean; onClick?: () => void };
export type AppNavEntry = {
  id: string;
  label: string;
  icon?: ReactNode;
  count?: number;
  active?: boolean;
  /** Subitens com conector de arvore. */
  children?: { id: string; label: string }[];
};

/**
 * Moldura de aplicacao: chao rebaixado (nivel 0) com trilho de icones, um
 * painel de navegacao opcional (secao + itens em arvore + pessoa) e o
 * conteudo. Use para mostrar uma tela de app inteira dentro de uma pagina
 * (painel, caixa de entrada). `layout="split"` poe os filhos lado a lado no
 * desktop (feed | conversa); `stack` empilha (KPIs em cima, grafico embaixo).
 */
export function AppFrame({
  rail,
  user,
  nav,
  activeSub,
  onSubChange,
  layout = "stack",
  children,
  className = "",
}: {
  rail: AppRailEntry[];
  user: { name: string; email?: string; avatarSrc?: string };
  /** Painel de navegacao ao lado do trilho (desktop largo). */
  nav?: { title: string; items: AppNavEntry[] };
  activeSub?: string;
  onSubChange?: (id: string) => void;
  layout?: "stack" | "split";
  children: ReactNode;
  className?: string;
}) {
  const split = layout === "split";
  return (
    <Card variant="sunken" padding="md" className={className}>
      <div className={`flex gap-md ${split ? "flex-col lg:flex-row lg:items-start" : "items-start"}`}>
        <RailNav className={split ? "hidden lg:flex" : "hidden md:flex"} footer={<Avatar name={user.name} src={user.avatarSrc} />}>
          {rail.map((r) => (
            <RailItem key={r.label} icon={r.icon} label={r.label} active={r.active} dot={r.dot} onClick={r.onClick} />
          ))}
        </RailNav>
        {nav && (
          <Card padding="md" className="hidden w-(--santo-dimension-space-224) shrink-0 lg:flex">
            <SidebarNav>
              <NavSection title={nav.title}>
                {nav.items.map((it) => (
                  <NavGroup key={it.id} item={it} activeSub={activeSub} onSubChange={onSubChange} />
                ))}
              </NavSection>
            </SidebarNav>
            {user.email && (
              <div>
                <NavUser name={user.name} email={user.email} avatarSrc={user.avatarSrc} />
              </div>
            )}
          </Card>
        )}
        <div className={`flex min-w-0 flex-1 gap-md ${split ? "flex-col lg:flex-row lg:items-start" : "flex-col"}`}>{children}</div>
      </div>
    </Card>
  );
}

function NavGroup({
  item,
  activeSub,
  onSubChange,
}: {
  item: AppNavEntry;
  activeSub?: string;
  onSubChange?: (id: string) => void;
}) {
  return (
    <>
      <NavItem icon={item.icon} count={item.count} active={item.active}>
        {item.label}
      </NavItem>
      {item.children && (
        <NavSub>
          {item.children.map((c) => (
            <NavItem key={c.id} sub active={activeSub === c.id} onClick={() => onSubChange?.(c.id)}>
              {c.label}
            </NavItem>
          ))}
        </NavSub>
      )}
    </>
  );
}
