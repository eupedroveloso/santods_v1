"use client";

import { useState } from "react";
import { IconButton } from "./button";
import { PEOPLE, photo } from "./demo-people";
import { Card, Divider } from "./card";
import { ChatAttachment, ChatBubble, ChatComposer, ChatHeader, TypingIndicator } from "./chat";
import { jsx } from "./demo-kit";
import * as Icon from "./icons";
import type { DemoMap } from "./registry.types";

function ComposerDemo() {
  const [text, setText] = useState("");
  return (
    <Card className="mx-auto w-full max-w-(--santo-dimension-space-384)">
      <ChatBubble from="me" time="09:41">
        {"Subi o deck revisado."}
      </ChatBubble>
      <ChatComposer value={text} onChange={setText} onSend={() => setText("")} onAttach={() => {}} />
    </Card>
  );
}

export const chatDemos: DemoMap = {
  "chat-bubble": {
    playground: {
      controls: [
        { kind: "select", prop: "from", label: "De quem", options: ["them", "me"], initial: "me" },
        { kind: "text", prop: "children", label: "Mensagem", initial: "Me dá 30 min que eu vejo com calma." },
        { kind: "boolean", prop: "time", label: "Horário", initial: true },
        { kind: "boolean", prop: "reactions", label: "Reações", initial: true },
      ],
      layout: "stretch",
      Preview: ({ values: v }) => (
        <div className="mx-auto flex w-full max-w-(--santo-dimension-space-384) flex-col">
          <ChatBubble
            from={v.from as "me" | "them"}
            time={v.time ? "09:01" : undefined}
            reactions={v.reactions ? [["❤️", 1], ["👍", 2]] : undefined}
          >
            {v.children as string}
          </ChatBubble>
        </div>
      ),
      code: (v) =>
        jsx(
          "ChatBubble",
          {
            from: v.from as string,
            time: v.time ? "09:01" : undefined,
            reactions: v.reactions ? `{[["❤️", 1], ["👍", 2]]}` : undefined,
          },
          v.children as string,
          { from: "them" },
        ),
    },
    demos: [
      {
        title: "Conversa",
        layout: "stretch",
        code: `<ChatBubble time="08:56">Conseguiu olhar o deck?</ChatBubble>
<ChatBubble from="me" time="09:01" reactions={[["❤️", 1]]}>Me dá 30 min.</ChatBubble>
<TypingIndicator />`,
        Preview: () => (
          <div className="mx-auto flex w-full max-w-(--santo-dimension-space-384) flex-col gap-md">
            <ChatBubble time="08:56">Conseguiu olhar o deck da campanha?</ChatBubble>
            <ChatBubble from="me" time="09:01" reactions={[["❤️", 1]]}>
              Me dá 30 min.
            </ChatBubble>
            <ChatBubble from="me" time="10:15">
              <ChatAttachment name="Deck_Q4_revisado.pdf" size="4,8 MB" />
            </ChatBubble>
            <TypingIndicator />
          </div>
        ),
      },
    ],
  },
  "chat-header": {
    demos: [
      {
        title: "Básico",
        layout: "stretch",
        code: `<ChatHeader
  name="Sena Rocha"
  avatarSrc="/brand/avatar-sena-96.webp"
  status="Online"
  actions={<IconButton size="sm" label="Ligar"><Icon.ArrowUpRight size={16} /></IconButton>}
/>`,
        Preview: () => (
          <div className="mx-auto flex w-full max-w-(--santo-dimension-space-384) flex-col gap-md">
            <ChatHeader
              name={PEOPLE.sena.name}
              avatarSrc={photo("sena", 40)}
              status="Online"
              actions={
                <IconButton size="sm" label="Ligar">
                  <Icon.ArrowUpRight size={16} />
                </IconButton>
              }
            />
            <Divider />
          </div>
        ),
      },
    ],
  },
  "chat-attachment": {
    demos: [
      {
        title: "Básico",
        code: `<ChatBubble from="me">
  <ChatAttachment name="Deck_Q4_revisado.pdf" size="4,8 MB" />
</ChatBubble>`,
        Preview: () => (
          <ChatBubble from="me">
            <ChatAttachment name="Deck_Q4_revisado.pdf" size="4,8 MB" />
          </ChatBubble>
        ),
      },
    ],
  },
  "chat-composer": {
    demos: [
      {
        title: "Básico",
        layout: "stretch",
        code: `<ChatComposer value={texto} onChange={setTexto} onSend={enviar} onAttach={anexar} />`,
        Preview: ComposerDemo,
      },
    ],
  },
  "typing-indicator": {
    demos: [
      {
        title: "Básico",
        code: `<TypingIndicator />`,
        Preview: () => <TypingIndicator />,
      },
    ],
  },
};
