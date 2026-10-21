"use client";

import { useRouter, useSelectedLayoutSegment } from "next/navigation";
import type { ReactNode } from "react";
import type { EffectStyleEntry, TextStyleEntry } from "@/lib/docs/catalog.types";
import type { Derivado } from "@/lib/tokens/estudio.mjs";
import { googleFontUrl } from "@/lib/fonts/catalog";
import { ESTILOS, estiloLabel, isEstilo, type EstiloId } from "@/lib/estudio/estilos";
import { passosDe, type Registros } from "@/lib/estudio/rascunho";
import {
  ArrowsLeftRightIcon,
  CircleHalfStrokeIcon,
  FontIcon,
  ListIcon,
  PaletteIcon,
  SlidersIcon,
  VectorSquareIcon,
} from "@/lib/icons";
import { AppSidebar, Divider, EditorFrame, EmptyState, Icon, IconButton, Overline, SaveIndicator, Select } from "@/lib/ui";
import { Auditoria } from "./auditoria";
import { ClaroEscuro } from "./claro-escuro";
import { DocControles, DocCor, DocEspaco, DocRaio, DocSombra, DocTipografia } from "./docs";
import { PainelAjustes, PainelControles, PainelCor, PainelEspaco, PainelRaio, PainelSombra, PainelTipografia, type Aba } from "./paineis";
import { useRascunho } from "./use-rascunho";

const ICONE: Record<EstiloId, (p: { size?: 16 | 20 }) => ReactNode> = {
  cor: PaletteIcon,
  tipografia: FontIcon,
  raio: VectorSquareIcon,
  sombra: CircleHalfStrokeIcon,
  espaco: ArrowsLeftRightIcon,
  controles: SlidersIcon,
};

/** Abas do painel por estilo: Cor não tem passos (a rampa é derivada inteira); Controles não tem base. */
const ABAS: Record<EstiloId, Aba[]> = {
  cor: ["base", "presets"],
  tipografia: ["presets", "base", "passos"],
  raio: ["presets", "base", "passos"],
  sombra: ["presets", "base", "passos"],
  espaco: ["presets", "base", "passos"],
  controles: ["presets", "passos"],
};

export type EditorProps = {
  sistema: { id: string; nome: string; slug: string };
  sistemas: { nome: string; slug: string }[];
  registros: Registros;
  estilosTexto: TextStyleEntry[];
  efeitos: EffectStyleEntry[];
  /** derivar() do estado inicial, feito no servidor (ver useRascunho). */
  derivadoInicial?: Derivado;
};

/**
 * Editor do Estúdio. Mora no layout de /estudio/<sistema>: trocar de estilo
 * não remonta, então o rascunho, o histórico e o autosave atravessam os
 * estilos. O estilo ativo é o segmento da rota.
 */
export function Editor({ sistema, sistemas, registros: inicial, estilosTexto, efeitos, derivadoInicial }: EditorProps) {
  const router = useRouter();
  const segmento = useSelectedLayoutSegment();
  const estilo: EstiloId = segmento && isEstilo(segmento) ? segmento : "cor";
  const r = useRascunho(sistema, inicial, derivadoInicial);
  const Glyph = ICONE[estilo];
  const href = (slug: string, e: EstiloId = estilo) => `/estudio/${slug}/${e}`;
  const preview = r.preview;
  const passos = preview ? passosDe(preview.spec) : null;
  const editar = (fn: Parameters<typeof r.editar>[1]) => r.editar(estilo, fn);

  const trocaSistema = (
    <Select
      label="Sistema"
      value={sistema.slug}
      onChange={(slug) => router.push(href(slug))}
      options={sistemas.map((s) => ({ value: s.slug, label: s.nome }))}
    />
  );

  const painel = (aba: Aba) => {
    if (!passos) return null;
    const props = { registro: r.registros[estilo], passos, editar, aba };
    switch (estilo) {
      case "raio":
        return <PainelRaio {...props} />;
      case "espaco":
        return <PainelEspaco {...props} />;
      case "tipografia":
        return <PainelTipografia {...props} />;
      case "cor":
        return <PainelCor {...props} />;
      case "sombra":
        return <PainelSombra {...props} />;
      case "controles":
        return <PainelControles {...props} />;
    }
  };
  const corAncora = preview?.salvo.draft.cor;
  const ancora = corAncora?.origem === "marca" ? `palette/brand/${corAncora.ancora}` : undefined;

  return (
    <>
      {/* Único caminho do preview: o CSS do emit para o escopo [data-brand='rascunho'] (contrato, §4).
          Vem no SSR: o primeiro render usa a derivação do servidor, então o texto casa na hidratação. */}
      {preview && <style id="estudio-rascunho">{preview.css}</style>}
      {preview?.familias.map((f) => {
        const url = googleFontUrl(f);
        return url ? <link key={f} rel="stylesheet" href={url} precedence="default" /> : null;
      })}
      <EditorFrame
        className="h-[calc(100dvh-var(--santo-dimension-size-56))]"
        navLabel="Estilos"
        nav={
          <>
            {trocaSistema}
            <Divider />
            <AppSidebar
              label="Estúdio"
              showRail={false}
              surface="sunken"
              groups={[
                { items: [{ label: "Todos os sistemas", href: "/estudio", icon: <ListIcon size={16} /> }] },
                {
                  title: "Estilos",
                  items: ESTILOS.map((e) => {
                    const EGlyph = ICONE[e.id];
                    return { label: e.label, href: href(sistema.slug, e.id), icon: <EGlyph size={16} />, active: e.id === estilo };
                  }),
                },
              ]}
            />
          </>
        }
        mobileNav={
          <>
            {trocaSistema}
            <Select
              label="Estilo"
              value={estilo}
              onChange={(e) => router.push(href(sistema.slug, e))}
              options={ESTILOS.map((e) => ({ value: e.id, label: e.label }))}
            />
          </>
        }
        panel={
          <>
            <PainelAjustes key={estilo} abas={ABAS[estilo]} problems={r.estado.problems}>
              {painel}
            </PainelAjustes>
            {/* Em Cor a auditoria vira o destaque do centro; nos outros estilos fica no painel. */}
            {preview && estilo !== "cor" && <Auditoria auditoria={preview.auditoria} />}
          </>
        }
      >
        <header className="flex items-end justify-between gap-sm">
          <div className="flex min-w-0 flex-col gap-2xs">
            <Overline>{sistema.nome}</Overline>
            <h1 className="santo-heading-5-semibold text-text-primary">{estiloLabel(estilo)}</h1>
          </div>
          <div className="flex shrink-0 items-center gap-2xs">
            <SaveIndicator state={r.estado.save} title={r.estado.problems.join("\n") || undefined} />
            <IconButton size="sm" label="Desfazer" disabled={!r.podeDesfazer} onClick={r.desfazer}>
              <Icon.Undo size={16} />
            </IconButton>
            <IconButton size="sm" label="Refazer" disabled={!r.podeRefazer} onClick={r.refazer}>
              <Icon.Redo size={16} />
            </IconButton>
          </div>
        </header>

        {preview && passos ? (
          <>
            {/* O centro inteiro vive sob o rascunho: raio, espaço e tipo da própria doc mudam junto. */}
            <div data-brand="rascunho" className="flex flex-col gap-xl">
              {estilo === "raio" && <DocRaio spec={preview.spec} passos={passos} />}
              {estilo === "espaco" && <DocEspaco spec={preview.spec} passos={passos} />}
              {estilo === "tipografia" && (
                <DocTipografia estilos={estilosTexto} passos={passos} tipografia={preview.salvo.draft.tipografia} />
              )}
              {estilo === "cor" && <DocCor spec={preview.spec} auditoria={preview.auditoria} ancora={ancora} />}
              {estilo === "sombra" && <DocSombra efeitos={efeitos} passos={passos} />}
              {estilo === "controles" && <DocControles passos={passos} />}
            </div>
            <section className="flex flex-col gap-sm">
              <Overline>Claro e escuro</Overline>
              <ClaroEscuro css={preview.css} familias={preview.familias} />
            </section>
          </>
        ) : (
          <EmptyState icon={<Glyph size={20} />} title={`Escala de ${estiloLabel(estilo)}`} />
        )}
      </EditorFrame>
    </>
  );
}
