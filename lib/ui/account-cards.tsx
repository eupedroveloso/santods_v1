"use client";

import { useState, type ReactNode } from "react";
import { Button, IconButton } from "./button";
import { Calendar } from "./calendar";
import { Card, CardHeader, Divider } from "./card";
import { Count, Tag } from "./chip";
import { Avatar, AvatarGroup } from "./data";
import * as Icon from "./icons";
import { Field, Input, Textarea } from "./input";
import { KeyValue } from "./key-value";
import { ListRow } from "./list-row";
import { Select, type SelectOption } from "./listbox";
import { Overline } from "./overline";
import { RadioGroup, type RadioCardOption } from "./radio-group";
import { Ring } from "./ring";
import { Checkbox, SettingRow, Switch } from "./toggle";

/*
 * Blocos de conta, time e preferencia: cartoes prontos alimentados por dado,
 * montados so com a lib. A tela so compoe (lib:check, regra D). Itens
 * separados por espaco ou Divider; poco so em campo (Pedro, 2026-10-19).
 */

/* ------------------------------------------------------------- meta diaria */

/**
 * Meta com passo: anel no centro com o valor, menos/mais nos lados, teto em
 * overline e a acao de salvar. Use para ajustar um alvo numerico curto em
 * degraus (creditos por dia, passos, minutos).
 */
export function DailyGoalCard({
  title = "Meta diária",
  meta,
  value,
  onChange,
  min = 0,
  max,
  step = 1,
  unit,
  submitLabel = "Definir meta",
  onSubmit,
  className = "",
}: {
  title?: string;
  /** Unidade ao lado do titulo, em Count: "créditos". */
  meta?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max: number;
  step?: number;
  /** Rotulo do teto: "por dia". */
  unit?: string;
  submitLabel?: string;
  onSubmit?: () => void;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader title={title} meta={meta ? <Count>{meta}</Count> : undefined} />
      <div className="flex items-center justify-between gap-md">
        <IconButton variant="secondary" label="Diminuir meta" onClick={() => onChange(Math.max(min, value - step))} disabled={value <= min}>
          <Icon.Minus size={16} />
        </IconButton>
        <Ring value={Math.min(100, (value / max) * 100)} label={title} detail={`${value} de ${max}`} tone="brand" size="lg">
          <span className="santo-body-semibold tabular-nums">{value}</span>
        </Ring>
        <IconButton variant="secondary" label="Aumentar meta" onClick={() => onChange(Math.min(max, value + step))} disabled={value >= max}>
          <Icon.Plus size={16} />
        </IconButton>
      </div>
      <Overline className="self-center">
        de {max}
        {unit ? ` ${unit}` : ""}
      </Overline>
      <Button block onClick={onSubmit}>
        {submitLabel}
      </Button>
    </Card>
  );
}

/* ------------------------------------------------------------- preferencias */

export type Preference = { id: string; title: string; checked: boolean; disabled?: boolean };

/**
 * Preferencias liga/desliga com efeito ao salvar: titulo com contagem do que
 * esta ligado, linhas de SettingRow com Switch separadas por hairline (sem
 * poco) e a acao. Use para consentimento de cookies, notificacoes, privacidade.
 */
export function PreferencesCard({
  title,
  items,
  onToggle,
  submitLabel = "Salvar preferências",
  onSubmit,
  className = "",
}: {
  title: string;
  items: Preference[];
  onToggle: (id: string, checked: boolean) => void;
  submitLabel?: string;
  onSubmit?: () => void;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader title={title} meta={<Count>{items.filter((i) => i.checked).length}</Count>} />
      <div className="flex flex-col">
        {items.map((it, i) => (
          <div key={it.id} className={i < items.length - 1 ? "border-b-thin border-border-subtle" : ""}>
            <SettingRow
              title={it.title}
              control={<Switch checked={it.checked} onChange={(v) => onToggle(it.id, v)} label={it.title} disabled={it.disabled} />}
            />
          </div>
        ))}
      </div>
      <Button block onClick={onSubmit}>
        {submitLabel}
      </Button>
    </Card>
  );
}

/* --------------------------------------------------------------------- plano */

export type PlanOption<T extends string> = RadioCardOption<T> & { price: string };

/**
 * Checkout de plano: dados da pessoa e do cartao em campos-poco, escolha do
 * plano em RadioGroup, cupom e observacao opcionais, aceite, resumo e acoes.
 * Use para upgrade ou assinatura. O resumo muda com o plano escolhido.
 */
export function UpgradePlanCard<T extends string>({
  title = "Melhore seu plano",
  badge = "Pro",
  plans,
  plan,
  onPlanChange,
  nextInvoice,
  submitLabel = "Melhorar plano",
  onSubmit,
  onCancel,
  className = "",
}: {
  title?: string;
  badge?: string;
  plans: PlanOption<T>[];
  plan: T;
  onPlanChange: (value: T) => void;
  /** Data da proxima fatura no resumo: "5 nov.". */
  nextInvoice?: string;
  submitLabel?: string;
  onSubmit?: () => void;
  onCancel?: () => void;
  className?: string;
}) {
  const [terms, setTerms] = useState(false);
  const [emails, setEmails] = useState(false);
  const current = plans.find((p) => p.value === plan);
  return (
    <Card className={className}>
      <CardHeader title={title} meta={badge ? <Tag intent="brand">{badge}</Tag> : undefined} />
      <div className="flex gap-sm">
        <Field label="Nome" className="flex-1">
          <Input placeholder="Maria Souza" />
        </Field>
        <Field label="E-mail" className="flex-1">
          <Input type="email" placeholder="maria@exemplo.com.br" />
        </Field>
      </div>
      <Field label="Número do cartão">
        <Input mono placeholder="1234 1234 1234 1234" />
      </Field>
      <div className="flex gap-sm">
        <Field label="Validade" className="flex-1">
          <Input mono placeholder="MM/AA" />
        </Field>
        <Field label="CVC" className="flex-1">
          <Input mono placeholder="123" />
        </Field>
      </div>
      <RadioGroup label="Plano" columns={2} value={plan} onChange={onPlanChange} options={plans} />
      <Field label="Cupom" optional>
        <Input mono placeholder="SANTO10" />
      </Field>
      <Field label="Observações" optional>
        <Textarea placeholder="Alguma coisa que devemos saber?" />
      </Field>
      <Checkbox checked={terms} onChange={setTerms} label="Aceito os termos e condições" />
      <Checkbox checked={emails} onChange={setEmails} label="Quero receber novidades por e-mail" />
      <Divider />
      <div className="flex flex-col gap-xs">
        <KeyValue label="Plano" value={String(current?.label ?? plan)} />
        <KeyValue label="Cobrança" value={current?.price ?? "—"} />
        {nextInvoice && <KeyValue label="Próxima fatura" value={nextInvoice} />}
      </div>
      <div className="flex items-center justify-between gap-sm">
        <Button variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={onSubmit} disabled={!terms}>
          {submitLabel}
        </Button>
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------- criar conta */

export type AuthProvider = "github" | "google";

const PROVIDER: Record<AuthProvider, { label: string; icon: ReactNode }> = {
  github: { label: "GitHub", icon: <Icon.Github size={16} /> },
  google: { label: "Google", icon: <Icon.Google size={16} /> },
};

/**
 * Cadastro: entrar com provedor (botoes lado a lado), divisor "ou continue
 * com", e-mail e senha em campo-poco, acao primaria. Use em tela de criar
 * conta ou entrar; `submitLabel` troca para "Entrar".
 */
export function SignUpCard({
  title = "Criar uma conta",
  providers = ["github", "google"],
  submitLabel = "Criar conta",
  onProvider,
  onSubmit,
  className = "",
}: {
  title?: string;
  providers?: AuthProvider[];
  submitLabel?: string;
  onProvider?: (provider: AuthProvider) => void;
  onSubmit?: (data: { email: string; password: string }) => void;
  className?: string;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <Card className={className}>
      <CardHeader title={title} />
      {providers.length > 0 && (
        <>
          <div className="flex gap-sm">
            {providers.map((p) => (
              <Button key={p} className="flex-1" leading={PROVIDER[p].icon} onClick={() => onProvider?.(p)}>
                {PROVIDER[p].label}
              </Button>
            ))}
          </div>
          <Divider label="ou continue com" />
        </>
      )}
      <Field label="E-mail">
        <Input type="email" placeholder="m@exemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} />
      </Field>
      <Field label="Senha">
        <Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
      </Field>
      <Button variant="primary" block onClick={() => onSubmit?.({ email, password })}>
        {submitLabel}
      </Button>
    </Card>
  );
}

/* ------------------------------------------------------------- pessoas */

export type Member = { name: string; email: string; avatarSrc?: string; role: string };

/**
 * Uma pessoa com papel: avatar, nome, e-mail e um Select de papel/permissao
 * a direita. Use em lista de time, de acesso compartilhado, de convidados.
 */
export function MemberRow({
  member,
  options,
  onRoleChange,
  roleLabel = "Papel",
  divider = true,
}: {
  member: Member;
  options: SelectOption<string>[];
  onRoleChange: (role: string) => void;
  /** Prefixo do rotulo acessivel do Select: "Papel de Erica". */
  roleLabel?: string;
  divider?: boolean;
}) {
  return (
    <ListRow
      divider={divider}
      leading={<Avatar name={member.name} src={member.avatarSrc} />}
      title={member.name}
      meta={member.email}
      trailing={
        <Select size="sm" pill value={member.role} onChange={onRoleChange} label={`${roleLabel} de ${member.name}`} options={options} />
      }
    />
  );
}

/**
 * Time: titulo com contagem e avatares sobrepostos no canto, uma MemberRow
 * por pessoa com o papel editavel. Use em configuracao de equipe.
 */
export function TeamCard({
  title = "Time",
  members,
  roles,
  onRoleChange,
  className = "",
}: {
  title?: string;
  members: Member[];
  roles: SelectOption<string>[];
  onRoleChange: (email: string, role: string) => void;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader
        title={title}
        meta={<Count>{members.length}</Count>}
        action={
          <AvatarGroup>
            {members.map((m) => (
              <Avatar key={m.email} name={m.name} src={m.avatarSrc} size={24} />
            ))}
          </AvatarGroup>
        }
      />
      <div className="flex flex-col">
        {members.map((m) => (
          <MemberRow key={m.email} member={m} options={roles} onRoleChange={(r) => onRoleChange(m.email, r)} />
        ))}
      </div>
    </Card>
  );
}

/**
 * Compartilhar: link em campo-poco somente leitura com copiar ao lado, e
 * quem tem acesso (MemberRow com a permissao). Use em documento, pasta,
 * painel compartilhavel.
 */
export function ShareCard({
  title = "Compartilhar",
  link,
  members,
  access,
  onAccessChange,
  onCopy,
  className = "",
}: {
  title?: string;
  link: string;
  members: Member[];
  access: SelectOption<string>[];
  onAccessChange: (email: string, access: string) => void;
  onCopy?: () => void;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader title={title} meta={<Count>{members.length}</Count>} />
      <div className="flex gap-2xs">
        <Input readOnly value={link} mono className="flex-1" aria-label="Link de compartilhamento" />
        <IconButton variant="secondary" label="Copiar link" onClick={() => (onCopy ? onCopy() : navigator.clipboard?.writeText(link))}>
          <Icon.Copy size={16} />
        </IconButton>
      </div>
      <Overline>Com acesso</Overline>
      <div className="flex flex-col">
        {members.map((m) => (
          <MemberRow
            key={m.email}
            member={m}
            options={access}
            roleLabel="Permissão"
            onRoleChange={(a) => onAccessChange(m.email, a)}
          />
        ))}
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------- calendario */

/**
 * Calendario num cartao: o mes inteiro como bloco de painel (agenda,
 * reserva, periodo de relatorio). `mode="range"` marca intervalo.
 */
export function CalendarCard({
  month,
  year,
  selected,
  today,
  mode = "single",
  onSelect,
  className = "",
}: {
  month: string;
  year: number;
  selected?: number[];
  today?: number;
  mode?: "single" | "range";
  onSelect?: (days: number[], view: { month: string; year: number }) => void;
  className?: string;
}) {
  return (
    <Card className={`items-center ${className}`}>
      <Calendar mode={mode} month={month} year={year} selected={selected} today={today} onSelect={onSelect} />
    </Card>
  );
}
