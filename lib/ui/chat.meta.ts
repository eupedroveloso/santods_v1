import type { ComponentMeta } from "./registry.types";

export const chatMeta: ComponentMeta[] = [
  {
    name: "ChatHeader",
    slug: "chat-header",
    category: "aplicacao",
    tier: "semantico",
    source: "chat.tsx",
    description: "Cabeçalho da conversa: quem é, se está online e as ações.",
    related: ["chat-bubble"],
  },
  {
    name: "ChatBubble",
    slug: "chat-bubble",
    category: "aplicacao",
    tier: "semantico",
    source: "chat.tsx",
    description:
      "Mensagem. Recebida em neutral/subtle, enviada em brand/solid + text/on-brand — o par garante contraste dos dois lados.",
    related: ["chat-header", "chat-attachment", "typing-indicator"],
  },
  {
    name: "ChatAttachment",
    slug: "chat-attachment",
    category: "aplicacao",
    tier: "semantico",
    source: "chat.tsx",
    description: "Arquivo dentro de uma bolha enviada.",
    related: ["chat-bubble"],
  },
  {
    name: "ChatComposer",
    slug: "chat-composer",
    category: "aplicacao",
    tier: "semantico",
    source: "chat.tsx",
    description: "Campo de mensagem em poço com anexar e enviar inline.",
    related: ["chat-bubble", "chat-header"],
  },
  {
    name: "TypingIndicator",
    slug: "typing-indicator",
    category: "aplicacao",
    tier: "semantico",
    source: "chat.tsx",
    description: "Três pontos pulsando para quem está digitando.",
    related: ["chat-bubble"],
  },
];
