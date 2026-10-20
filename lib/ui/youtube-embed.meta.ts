import type { ComponentMeta } from "./registry.types";

export const youtubeEmbedMeta: ComponentMeta[] = [
  {
    name: "YouTubeEmbed",
    slug: "youtube-embed",
    category: "aplicacao",
    tier: "marketing",
    source: "youtube-embed.tsx",
    description:
      "Vídeo do YouTube embutido (nocookie, 16:9) por id ou URL. resumeAt liga a camada “retomar” da VSL; ao escolher, toca do ponto certo.",
    related: ["landing-page", "landing-hero"],
  },
];
