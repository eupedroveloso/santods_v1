"use client";

import { useState } from "react";
import {
  CalendarCard,
  DailyGoalCard,
  MemberRow,
  PreferencesCard,
  ShareCard,
  SignUpCard,
  TeamCard,
  UpgradePlanCard,
  type AuthProvider,
  type Member,
} from "./account-cards";
import { PEOPLE, photo } from "./demo-people";
import { jsx } from "./demo-kit";
import type { DemoMap } from "./registry.types";

const narrow = "mx-auto w-full max-w-(--santo-dimension-space-384)";

const ROLES = [
  { value: "Dona", label: "Dona" },
  { value: "Pessoa desenvolvedora", label: "Pessoa desenvolvedora" },
  { value: "Financeiro", label: "Financeiro" },
];
const ACCESS = [
  { value: "Pode editar", label: "Pode editar" },
  { value: "Pode ver", label: "Pode ver" },
];

const person = (id: keyof typeof PEOPLE, role: string): Member => ({
  name: PEOPLE[id].name,
  email: `${id}@exemplo.com`,
  avatarSrc: photo(id),
  role,
});
const TEAM = [person("erica", "Dona"), person("pedro", "Pessoa desenvolvedora"), person("sena", "Financeiro")];
const withRole = (list: Member[], email: string, role: string) => list.map((m) => (m.email === email ? { ...m, role } : m));

const PROVIDERS: Record<string, AuthProvider[]> = { ambos: ["github", "google"], github: ["github"], nenhum: [] };

export const accountCardsDemos: DemoMap = {
  "daily-goal-card": {
    playground: {
      controls: [
        { kind: "select", prop: "step", label: "Passo", options: ["10", "50", "100"], initial: "50" },
        { kind: "text", prop: "meta", label: "Unidade", initial: "créditos" },
      ],
      layout: "stretch",
      Preview: function Preview({ values: v }) {
        const [goal, setGoal] = useState(350);
        return (
          <div className={narrow}>
            <DailyGoalCard meta={(v.meta as string) || undefined} value={goal} onChange={setGoal} min={50} max={500} step={Number(v.step)} unit="por dia" />
          </div>
        );
      },
      code: (v) =>
        jsx("DailyGoalCard", {
          meta: (v.meta as string) || undefined,
          value: "{meta}",
          onChange: "{setMeta}",
          min: "{50}",
          max: "{500}",
          step: `{${v.step}}`,
          unit: "por dia",
        }),
    },
    demos: [],
  },
  "preferences-card": {
    playground: {
      controls: [{ kind: "text", prop: "title", label: "Título", initial: "Cookies" }],
      layout: "stretch",
      Preview: function Preview({ values: v }) {
        const [items, setItems] = useState([
          { id: "essenciais", title: "Estritamente necessários", checked: true, disabled: true },
          { id: "funcionais", title: "Funcionais", checked: false },
          { id: "marketing", title: "Marketing", checked: false },
        ]);
        return (
          <div className={narrow}>
            <PreferencesCard
              title={(v.title as string) || "Cookies"}
              items={items}
              onToggle={(id, checked) => setItems((l) => l.map((i) => (i.id === id ? { ...i, checked } : i)))}
            />
          </div>
        );
      },
      code: (v) =>
        jsx("PreferencesCard", {
          title: (v.title as string) || "Cookies",
          items: `{[{ id: "funcionais", title: "Funcionais", checked: false }, …]}`,
          onToggle: "{alternar}",
        }),
    },
    demos: [],
  },
  "upgrade-plan-card": {
    playground: {
      controls: [{ kind: "text", prop: "badge", label: "Selo", initial: "Pro" }],
      layout: "stretch",
      Preview: function Preview({ values: v }) {
        const [plan, setPlan] = useState<"starter" | "pro">("starter");
        return (
          <div className={narrow}>
            <UpgradePlanCard
              badge={(v.badge as string) || undefined}
              plans={[
                { value: "starter", label: "Starter", price: "Grátis" },
                { value: "pro", label: "Pro", price: "R$ 49 / mês" },
              ]}
              plan={plan}
              onPlanChange={setPlan}
              nextInvoice="5 nov."
            />
          </div>
        );
      },
      code: (v) =>
        jsx("UpgradePlanCard", {
          badge: v.badge === "Pro" ? undefined : (v.badge as string),
          plans: `{[{ value: "starter", label: "Starter", price: "Grátis" }, …]}`,
          plan: "{plano}",
          onPlanChange: "{setPlano}",
          nextInvoice: "5 nov.",
        }),
    },
    demos: [],
  },
  "sign-up-card": {
    playground: {
      controls: [
        { kind: "select", prop: "providers", label: "Provedores", options: Object.keys(PROVIDERS), initial: "ambos" },
        { kind: "select", prop: "mode", label: "Ação", options: ["Criar conta", "Entrar"], initial: "Criar conta" },
      ],
      layout: "stretch",
      Preview: ({ values: v }) => (
        <div className={narrow}>
          <SignUpCard
            title={v.mode === "Entrar" ? "Entrar" : "Criar uma conta"}
            submitLabel={v.mode as string}
            providers={PROVIDERS[v.providers as string]}
          />
        </div>
      ),
      code: (v) =>
        jsx("SignUpCard", {
          title: v.mode === "Entrar" ? "Entrar" : undefined,
          submitLabel: v.mode === "Entrar" ? "Entrar" : undefined,
          providers: v.providers === "ambos" ? undefined : `{${JSON.stringify(PROVIDERS[v.providers as string])}}`,
          onSubmit: "{entrar}",
        }),
    },
    demos: [],
  },
  "member-row": {
    playground: {
      controls: [{ kind: "select", prop: "person", label: "Pessoa", options: ["erica", "pedro", "sena"], initial: "erica" }],
      layout: "stretch",
      Preview: function Preview({ values: v }) {
        const [role, setRole] = useState("Dona");
        const m = { ...person(v.person as "erica" | "pedro" | "sena", role) };
        return (
          <div className={narrow}>
            <MemberRow divider={false} member={m} options={ROLES} onRoleChange={setRole} />
          </div>
        );
      },
      code: () => jsx("MemberRow", { member: "{pessoa}", options: "{papeis}", onRoleChange: "{setPapel}" }),
    },
    demos: [],
  },
  "team-card": {
    playground: {
      controls: [{ kind: "select", prop: "count", label: "Pessoas", options: ["2", "3"], initial: "3" }],
      layout: "stretch",
      Preview: function Preview({ values: v }) {
        const [team, setTeam] = useState(TEAM);
        return (
          <div className={narrow}>
            <TeamCard members={team.slice(0, Number(v.count))} roles={ROLES} onRoleChange={(e, r) => setTeam((l) => withRole(l, e, r))} />
          </div>
        );
      },
      code: () => jsx("TeamCard", { members: "{time}", roles: "{papeis}", onRoleChange: "{trocarPapel}" }),
    },
    demos: [],
  },
  "share-card": {
    playground: {
      controls: [{ kind: "text", prop: "link", label: "Link", initial: "https://exemplo.com/doc/santo-ds" }],
      layout: "stretch",
      Preview: function Preview({ values: v }) {
        const [shared, setShared] = useState([person("sena", "Pode editar"), person("erica", "Pode ver")]);
        return (
          <div className={narrow}>
            <ShareCard
              link={v.link as string}
              members={shared}
              access={ACCESS}
              onAccessChange={(e, a) => setShared((l) => withRole(l, e, a))}
              onCopy={() => {}}
            />
          </div>
        );
      },
      code: (v) => jsx("ShareCard", { link: v.link as string, members: "{comAcesso}", access: "{permissoes}", onAccessChange: "{trocarPermissao}" }),
    },
    demos: [],
  },
  "calendar-card": {
    playground: {
      controls: [{ kind: "select", prop: "mode", label: "Seleção", options: ["single", "range"], initial: "range" }],
      layout: "stretch",
      Preview: ({ values: v }) => (
        <div className={narrow}>
          <CalendarCard
            key={v.mode as string}
            mode={v.mode as "single" | "range"}
            month="Junho"
            year={2026}
            selected={v.mode === "range" ? [8, 9, 10, 11, 12] : [10]}
            today={13}
          />
        </div>
      ),
      code: (v) =>
        jsx("CalendarCard", {
          mode: v.mode === "single" ? undefined : (v.mode as string),
          month: "Junho",
          year: "{2026}",
          selected: v.mode === "range" ? "{[8, 9, 10, 11, 12]}" : "{[10]}",
          today: "{13}",
        }),
    },
    demos: [],
  },
};
