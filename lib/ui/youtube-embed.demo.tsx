"use client";

import { YouTubeEmbed } from "./youtube-embed";
import type { DemoMap } from "./registry.types";

export const youtubeEmbedDemos: DemoMap = {
  "youtube-embed": {
    playground: {
      controls: [
        { kind: "text", prop: "video", label: "Id ou URL", initial: "https://www.youtube.com/watch?v=J4EUeLREgNk" },
        { kind: "boolean", prop: "resume", label: "Camada “retomar”", initial: false },
        { kind: "select", prop: "frame", label: "Moldura", options: ["plain", "double"], initial: "double" },
      ],
      layout: "stretch",
      Preview: ({ values: v }) => (
        <div className="mx-auto w-full max-w-(--santo-dimension-container-md)">
          <YouTubeEmbed
            key={`${v.video}-${v.resume}`}
            video={v.video as string}
            title="Aula: a lógica por trás do Venda Todo Santo Dia"
            resumeAt={v.resume ? 95 : undefined}
            frame={v.frame as "plain" | "double"}
          />
        </div>
      ),
      code: (v) => `<YouTubeEmbed video="${v.video}" title="Aula…"${v.resume ? " resumeAt={95}" : ""}${v.frame === "double" ? ' frame="double"' : ""} />`,
    },
    demos: [],
  },
};
