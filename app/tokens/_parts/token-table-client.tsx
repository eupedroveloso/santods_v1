"use client";

import { Card, CopyCode, Icon, Swatch, Table, TokenSample, type Column } from "@/lib/ui";
import type { SlimMode, SlimVariable } from "./token-table";

/**
 * Desenho da tabela de tokens, no cliente, a partir das linhas enxutas que o
 * TokenTable (servidor) prepara. Ver o porque em token-table.tsx.
 */
export function TokenTableClient({ variables, modes }: { variables: SlimVariable[]; modes: string[] }) {
  // Larguras fixas por token: as tabelas empilhadas da pagina alinham coluna a coluna.
  // Cor so precisa do quadrado; o resto mostra barra/texto e pede a coluna larga.
  const colorOnly = variables.every((v) => v.type === "COLOR");
  const columns: Column<SlimVariable>[] = [
    { key: "preview", header: "Amostra", width: colorOnly ? 96 : 144, render: (v) => <Preview v={v} /> },
    {
      key: "name",
      header: "Nome no Figma",
      width: 224,
      render: (v) => (
        <span id={v.slug} className="santo-body-small-medium block scroll-mt-6xl text-text-primary">
          {v.name}
        </span>
      ),
    },
    ...modes.map((mode, i) => ({
      key: `mode-${mode}`,
      header: modes.length > 1 ? mode : "Valor",
      width: 144 as const,
      render: (v: SlimVariable) => (v.values[i] ? <ModeCell v={v} value={v.values[i]} mode={mode} /> : null),
    })),
    {
      key: "use",
      header: "Uso",
      render: (v) => (
        <span className="flex min-w-0 flex-col items-start gap-2xs">
          <CopyCode truncate value={v.cssVar} label={`Copiar ${v.cssVar}`} />
          {v.tailwind && <CopyCode truncate value={v.tailwind} label={`Copiar classe ${v.tailwind}`} />}
        </span>
      ),
    },
  ];
  return <Table layout="fixed" columns={columns} rows={variables} getKey={(v) => v.slug} />;
}

/** Valor num modo: amostra da cor daquele modo (se for cor), valor final e icone de alias (origem no title). */
function ModeCell({ v, value, mode }: { v: SlimVariable; value: SlimMode; mode: string }) {
  return (
    <span className="flex min-w-0 items-center gap-xs">
      {v.type === "COLOR" && <Swatch size="sm" color={value.css} title={`${v.name} · ${mode}`} />}
      <span className="santo-code-sm whitespace-nowrap text-text-primary" title={value.alias ?? undefined}>
        <Measure css={value.css} />
      </span>
      {value.alias && (
        <span className="text-icon-tertiary">
          <Icon.Link size={12} title={`Alias de ${value.alias}`} />
        </span>
      )}
    </span>
  );
}

/** Numero + unidade pequena (8px, 200ms, -0.04em): a unidade desce para caption/tertiary. */
function Measure({ css }: { css: string }) {
  const m = /^(-?[\d.]+)([a-z%]+)$/.exec(css);
  if (!m) return css;
  return (
    <>
      {m[1]}
      <span className="santo-caption-small-medium text-text-tertiary">{m[2]}</span>
    </>
  );
}

type PreviewKind = "color" | "radius" | "bar" | "line" | "size" | "weight" | "tracking" | "family" | "raw";

function kindOf(v: SlimVariable): PreviewKind {
  const n = v.name;
  if (v.type === "COLOR") return "color";
  if (n.startsWith("type/size/")) return "size";
  if (n.startsWith("type/weight/")) return "weight";
  if (n.startsWith("type/tracking/")) return "tracking";
  if (n.startsWith("brand/family/")) return "family";
  if (v.type !== "FLOAT") return "raw";
  if (/(^|\/)radius/.test(n)) return "radius";
  if (/(^|\/)(space|size|icon|container)\//.test(n)) return "bar";
  if (/(^|\/)border\/|^focus\/width/.test(n)) return "line";
  return "raw";
}

/** Amostra viva via TokenSample, num poco tonal: le a propria var CSS e segue o tema. */
function Preview({ v }: { v: SlimVariable }) {
  const value = `var(${v.cssVar})`;
  const kind = kindOf(v);
  if (kind === "raw") return <span className="santo-caption-regular text-text-disabled">—</span>;
  return (
    <Card
      variant="well"
      padding="sm"
      className={`h-(--santo-dimension-size-48) justify-center overflow-hidden ${kind === "color" ? "w-fit" : ""}`}
    >
      {kind === "color" && <TokenSample variant="swatch" value={value} />}
      {kind === "radius" && <TokenSample variant="radius" value={value} />}
      {/* Container (640px+) nao cabe na celula: escala 1:10. */}
      {kind === "bar" && <TokenSample variant="bar" value={value} scale={v.name.includes("container") ? 0.1 : undefined} />}
      {kind === "line" && <TokenSample variant="line" value={value} />}
      {kind === "size" && <TokenSample variant="text" property="fontSize" value={value} />}
      {kind === "weight" && <TokenSample variant="text" property="fontWeight" value={value} />}
      {kind === "family" && <TokenSample variant="text" property="fontFamily" value={value} />}
      {kind === "tracking" && <TokenSample variant="text" property="letterSpacing" sample="Santo DS" value={value} />}
    </Card>
  );
}
