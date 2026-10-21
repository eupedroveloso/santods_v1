import type { TextStyleEntry } from "@/lib/docs/catalog.types";
import { CopyCode, Tag } from "@/lib/ui";

/**
 * Uma linha de text style: amostra na propria classe santo-*, nome, classe para
 * copiar e os dados em badge (familia, peso, tamanho/entrelinha, tracking).
 * Usada em /estilos/tipografia e no Estudio, que passa o estilo com os valores
 * derivados do rascunho (a amostra segue a var CSS do escopo em volta).
 */
export function StyleRow({ style: s, sample }: { style: TextStyleEntry; sample: string }) {
  return (
    <div id={s.slug} className="flex scroll-mt-6xl flex-col gap-sm border-t-thin border-border-subtle py-md first:border-t-0 first:pt-0 last:pb-0">
      <p className={`${s.className} truncate text-text-primary`}>{sample}</p>
      <div className="flex flex-wrap items-center gap-x-md gap-y-xs">
        <span className="santo-body-small-medium text-text-primary">{s.name}</span>
        <CopyCode value={s.className} label={`Copiar classe ${s.className}`} />
        {/* Dados em badge; o token de origem de cada valor fica no title. Tracking sem token sai em warning. */}
        <span className="flex flex-wrap items-center gap-2xs tabular-nums">
          <span title={s.tokens.fontFamily}><Tag>{s.family}</Tag></span>
          <span title={s.tokens.fontWeight}><Tag>{s.fontStyle} {s.fontWeight}</Tag></span>
          <span title={`${s.tokens.fontSize} / ${s.tokens.lineHeight}`}><Tag>{s.fontSize}/{s.lineHeight}<span className="santo-caption-small-medium text-text-tertiary">px</span></Tag></span>
          <span title={s.tokens.letterSpacing ?? "Tracking sem token"}>
            <Tag intent={s.tokens.letterSpacing === null ? "warning" : "neutral"}>{s.letterSpacing}<span className="santo-caption-small-medium text-text-tertiary">%</span></Tag>
          </span>
        </span>
      </div>
    </div>
  );
}
