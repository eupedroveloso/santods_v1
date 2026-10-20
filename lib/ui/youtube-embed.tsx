"use client";

import { useState, type ReactNode } from "react";
import { Play, Undo } from "./icons";
import { RADIUS_TRACK, RADIUS_TRACK_VAR } from "./radius";

/** Id de 11 caracteres a partir de id puro, watch?v=, youtu.be/, /embed/ ou /shorts/. */
export function parseYouTubeId(input: string): string | null {
  const s = input.trim();
  if (/^[\w-]{11}$/.test(s)) return s;
  try {
    const url = new URL(s);
    const v = url.searchParams.get("v");
    if (v && /^[\w-]{11}$/.test(v)) return v;
    const m = url.pathname.match(/\/(?:embed|shorts|live)\/([\w-]{11})|^\/([\w-]{11})$/);
    return m ? (m[1] ?? m[2]) : null;
  } catch {
    return null;
  }
}

/** Uma acao da camada "retomar": circulo outline com icone + texto, em linha. */
function ResumeAction({ icon, children, onClick }: { icon: ReactNode; children: ReactNode; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="santo-body-large-semibold flex cursor-pointer items-center gap-sm text-text-on-brand">
      <span aria-hidden className="grid size-(--santo-dimension-size-48) place-items-center rounded-full border-thick border-current">
        {icon}
      </span>
      {children}
    </button>
  );
}

/**
 * Video do YouTube embutido (youtube-nocookie.com), 16:9, com o raio da familia
 * de superficie interna (RADIUS_TRACK, lg). `video` aceita o id ou qualquer URL
 * do YouTube. iframe com title (obrigatorio, acessivel), loading lazy e tela
 * cheia.
 *
 * `resumeAt` liga a camada "retomar" (VSL): uma superficie em cor de marca por
 * cima com "Continuar assistindo?" / "Assistir do inicio?". Ao escolher, a
 * camada some e o iframe carrega ja tocando (autoplay) do ponto certo. Sem
 * `resumeAt`, o iframe carrega direto.
 */
function YouTubeEmbedInner({
  video,
  title,
  resumeAt,
  resumeTitle = "Você já começou a assistir esse vídeo",
  frame: frameVariant = "plain",
  className = "",
}: {
  /** Id (J4EUeLREgNk) ou URL do YouTube. */
  video: string;
  /** Nome acessivel do iframe: o que o video e. */
  title: string;
  /** Segundos ja assistidos: liga a camada "retomar". */
  resumeAt?: number;
  resumeTitle?: string;
  /**
   * `plain` (padrao): o video com raio de trilho e sombra. `double`: BORDA DUPLA
   * (como o Card double) — moldura sunken com recuo space/xs + fio, painel do
   * video em radius/lg e moldura = lg + xs + fio (concentrico pela regua).
   */
  frame?: "plain" | "double";
  className?: string;
}) {
  const id = parseYouTubeId(video);
  const [start, setStart] = useState<number | null>(resumeAt === undefined ? 0 : null);
  // aspect-video: 16:9. Na camada "retomar" (sem iframe) nao ha overflow-hidden,
  // entao o aspect-ratio cresce com o conteudo quando ele nao cabe (celular).
  // Na borda dupla o painel e a pastilha elevada da moldura: sombra curta.
  const box = `relative aspect-video w-full ${RADIUS_TRACK} ${frameVariant === "double" ? "shadow-xs" : "shadow-lg"} ${className}`;
  const frame = `${box} overflow-hidden`;
  if (!id) {
    return (
      <div className={`${frame} santo-body-small-regular grid place-items-center bg-surface-sunken text-text-tertiary`}>
        Vídeo inválido
      </div>
    );
  }
  if (start === null) {
    return (
      <div className={`${box} flex flex-col items-center justify-center gap-lg bg-brand-solid-default p-lg text-center text-text-on-brand`}>
        <p className="santo-heading-6-bold max-w-(--santo-dimension-container-sm)">{resumeTitle}</p>
        <div className="flex flex-wrap items-center justify-center gap-x-2xl gap-y-md">
          <ResumeAction icon={<Play size={20} />} onClick={() => setStart(resumeAt ?? 0)}>
            Continuar assistindo?
          </ResumeAction>
          <ResumeAction icon={<Undo size={20} />} onClick={() => setStart(0)}>
            Assistir do início?
          </ResumeAction>
        </div>
      </div>
    );
  }
  const autoplay = resumeAt !== undefined;
  const src = `https://www.youtube-nocookie.com/embed/${id}?rel=0&playsinline=1${start ? `&start=${Math.floor(start)}` : ""}${autoplay ? "&autoplay=1" : ""}`;
  return (
    <div className={`${frame} bg-surface-inverse`}>
      <iframe
        src={src}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        className="absolute inset-0 size-full border-0"
      />
    </div>
  );
}

/**
 * Video do YouTube embutido (youtube-nocookie.com), 16:9. `video` aceita o id
 * ou qualquer URL do YouTube. iframe com title (obrigatorio), loading lazy e
 * tela cheia. `resumeAt` liga a camada "retomar" (VSL). `frame="double"` poe o
 * video numa moldura de borda dupla.
 */
export function YouTubeEmbed(props: Parameters<typeof YouTubeEmbedInner>[0]) {
  if (props.frame !== "double") return <YouTubeEmbedInner {...props} />;
  const { className = "", ...rest } = props;
  return (
    <div
      className={`santo-edge w-full bg-surface-sunken p-xs ${className}`}
      style={{
        borderRadius: `calc(${RADIUS_TRACK_VAR} + var(--santo-space-xs) + var(--santo-border-thin))`,
        boxShadow: "var(--santo-shadow-sm)",
      }}
    >
      <YouTubeEmbedInner {...rest} />
    </div>
  );
}
