"use client";

import { buttonClass, Card, CardGrid, Icon, Overline, Segmented } from "@/lib/ui";
import { LARGURAS, TELAS, type TelaId } from "./telas-dados";
import { useEscala, useIframesRascunho } from "./use-iframes-rascunho";
import type { Preferencia } from "./use-preferencia";

export const TEMAS = [
  { id: "light", label: "Claro" },
  { id: "dark", label: "Escuro" },
] as const;

const tituloDe = (tela: TelaId) => TELAS.find((t) => t.id === tela)!.label;

/**
 * Um iframe de /estudio/preview. Na amostra: largura do pai e altura medida
 * (volta do iframe). Nas telas: o aparelho (largura × altura de tela) reduzido
 * por escala para caber, centrado; a caixa que recorta leva o raio interno da
 * moldura (--santo-inner-radius), então a moldura nasce do filho.
 */
export function Aparelho({
  tela,
  tema,
  largura,
  altura,
  escala,
  alturaAmostra,
  registrar,
  rolar,
}: {
  tela: TelaId;
  tema: "light" | "dark";
  largura: number;
  altura: number;
  escala: number;
  alturaAmostra?: number;
  registrar: (el: HTMLIFrameElement | null) => void;
  /** Preview grande: a amostra também rola dentro do iframe. */
  rolar?: boolean;
}) {
  const rotulo = `${tituloDe(tela)} do rascunho no tema ${tema === "dark" ? "escuro" : "claro"}`;
  const src = `/estudio/preview?tema=${tema}&tela=${tela}${rolar ? "&rolar=1" : ""}`;
  if (tela === "amostra" && !rolar)
    return (
      <iframe
        key={src}
        ref={registrar}
        src={src}
        title={rotulo}
        className="block w-full overflow-hidden rounded-(--santo-inner-radius)"
        style={{ height: alturaAmostra ? `${alturaAmostra}px` : "var(--santo-dimension-space-448)" }}
      />
    );
  return (
    <div className="shrink-0 overflow-hidden rounded-(--santo-inner-radius)" style={{ width: largura * escala, height: altura * escala }}>
      <iframe
        key={src}
        ref={registrar}
        src={src}
        title={rotulo}
        className="block origin-top-left"
        style={{ width: largura, height: altura, transform: `scale(${escala})` }}
      />
    </div>
  );
}

/** Abre a tela em aba nova; ela acompanha o rascunho ao vivo pelo BroadcastChannel. */
export function AbrirEmAba({ slug, tela }: { slug: string; tela: TelaId }) {
  return (
    <a
      href={`/estudio/${slug}/preview?tela=${tela}`}
      target="_blank"
      rel="noopener"
      aria-label="Abrir em tela cheia"
      title="Abrir em tela cheia"
      className={buttonClass({ variant: "ghost", size: "sm", icon: true })}
    >
      <Icon.Expand size={16} />
    </a>
  );
}

/**
 * Modo Docs: claro e escuro lado a lado, dois iframes com o seu
 * `<html data-theme>`, mostrando a amostra ou as telas reais de /exemplos sob o
 * rascunho. O grande (um tema só) é o modo Preview do editor.
 */
export function ClaroEscuro({
  css,
  fontes,
  sistema,
  pref,
  muda,
}: {
  css: string;
  fontes: string[];
  sistema: { id: string; slug: string };
  pref: Preferencia;
  muda: (p: Partial<Preferencia>) => void;
}) {
  const { registrar, alturas } = useIframesRascunho(css, fontes, `estudio:${sistema.id}`);
  const { caixa, medir } = useEscala();
  const aparelho = LARGURAS.find((l) => l.id === pref.largura)!;
  const escala = !caixa.largura ? 1 : Math.min(1, caixa.largura / aparelho.largura);

  return (
    <section className="flex flex-col gap-sm">
      <div className="flex flex-wrap items-center gap-xs">
        <Overline>Claro e escuro</Overline>
        <span className="ml-auto flex flex-wrap items-center gap-xs">
          <Segmented size="sm" value={pref.tela} onChange={(v) => muda({ tela: v })} options={TELAS.map((t) => ({ value: t.id, label: t.label }))} />
          {pref.tela !== "amostra" && (
            <Segmented size="sm" value={pref.largura} onChange={(v) => muda({ largura: v })} options={LARGURAS.map((l) => ({ value: l.id, label: l.label }))} />
          )}
          <AbrirEmAba slug={sistema.slug} tela={pref.tela} />
        </span>
      </div>
      <CardGrid columns={{ "2xl": 2 }} gap="md" masonry={false}>
        {TEMAS.map((t, i) => (
          // Raio aninhado: o conteúdo é colado no iframe (iframe = xl), e a moldura
          // nasce dele: xl + recuo xs. Mede no escopo do rascunho.
          <Card key={t.id} variant="sunken" padding="xs" contentRadius="xl">
            {/* Faixa do rótulo no mesmo recuo da moldura (gap = recuo, aninhamento). */}
            <Overline>{t.label}</Overline>
            <div ref={i === 0 ? medir : undefined} className="flex justify-center">
              <Aparelho
                tela={pref.tela}
                tema={t.id}
                largura={aparelho.largura}
                altura={aparelho.altura}
                escala={escala}
                alturaAmostra={alturas[`docs-${t.id}`]}
                registrar={registrar(`docs-${t.id}`)}
              />
            </div>
          </Card>
        ))}
      </CardGrid>
    </section>
  );
}
