import type { ComponentMeta } from "./registry.types";

/* Blocos: sem `figma` — so existem no codigo (codeOnly), par pendente. */
export const accountCardsMeta: ComponentMeta[] = [
  {
    name: "DailyGoalCard",
    slug: "daily-goal-card",
    category: "blocos",
    tier: "semantico",
    source: "account-cards.tsx",
    description:
      "Alvo numérico curto ajustado em degraus (créditos, minutos): anel com o valor entre menos e mais, teto em overline e ação. Bloco pronto, alimentado por dado; a tela só compõe.",
    related: ["ring", "goals-card"],
  },
  {
    name: "PreferencesCard",
    slug: "preferences-card",
    category: "blocos",
    tier: "semantico",
    source: "account-cards.tsx",
    description:
      "Liga/desliga com efeito ao salvar (cookies, notificações): SettingRow + Switch por hairline, contagem do que está ligado, ação. Bloco pronto, alimentado por dado; a tela só compõe.",
    related: ["setting-row", "switch"],
  },
  {
    name: "UpgradePlanCard",
    slug: "upgrade-plan-card",
    category: "blocos",
    tier: "semantico",
    source: "account-cards.tsx",
    description:
      "Checkout de plano: dados e cartão em campos-poço, plano em RadioGroup, cupom, aceite, resumo que muda com o plano e ações. Bloco pronto, alimentado por dado; a tela só compõe.",
    related: ["radio-group", "field", "key-value"],
  },
  {
    name: "SignUpCard",
    slug: "sign-up-card",
    category: "blocos",
    tier: "semantico",
    source: "account-cards.tsx",
    description:
      "Criar conta ou entrar: provedores lado a lado, \"ou continue com\", e-mail e senha, ação primária. Bloco pronto, alimentado por dado; a tela só compõe.",
    related: ["field", "divider"],
  },
  {
    name: "MemberRow",
    slug: "member-row",
    category: "blocos",
    tier: "semantico",
    source: "account-cards.tsx",
    description:
      "Pessoa com papel ou permissão: avatar, nome, e-mail e Select à direita.",
    related: ["team-card", "share-card", "list-row"],
  },
  {
    name: "TeamCard",
    slug: "team-card",
    category: "blocos",
    tier: "semantico",
    source: "account-cards.tsx",
    description:
      "Equipe: contagem e avatares sobrepostos no canto, MemberRow com papel editável. Bloco pronto, alimentado por dado; a tela só compõe.",
    related: ["member-row", "avatar-group"],
  },
  {
    name: "ShareCard",
    slug: "share-card",
    category: "blocos",
    tier: "semantico",
    source: "account-cards.tsx",
    description:
      "Compartilhar documento ou pasta: link somente leitura com copiar, e quem tem acesso com a permissão. Bloco pronto, alimentado por dado; a tela só compõe.",
    related: ["member-row", "input"],
  },
  {
    name: "CalendarCard",
    slug: "calendar-card",
    category: "blocos",
    tier: "semantico",
    source: "account-cards.tsx",
    description:
      "Mês inteiro como bloco de painel (agenda, reserva, período); range marca intervalo. Bloco pronto, alimentado por dado; a tela só compõe.",
    related: ["calendar"],
  },
];
