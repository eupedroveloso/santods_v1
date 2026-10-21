"use client";

import { useState } from "react";
import type { AuditRow } from "@/lib/tokens/contrast-audit.mjs";
import { Count, ListRow, Overline, Segmented, Swatch, Tag } from "@/lib/ui";

type Tema = "Light" | "Dark";

const curto = (nome: string) => nome.replace(/^color\//, "");
const razao = (n: number) => `${n.toFixed(2).replace(".", ",")} : 1`;

/**
 * Auditoria de contraste do rascunho (contrast-audit do Compasso): os pares
 * abaixo do mínimo no topo, em destaque; dívida conhecida (D1) em warning,
 * reprovação nova em danger. Os que passam ficam só na contagem.
 */
export function Auditoria({ auditoria }: { auditoria: Record<Tema, AuditRow[]> }) {
  const [tema, setTema] = useState<Tema>("Light");
  const linhas = auditoria[tema];
  const falhas = linhas.filter((l) => !l.pass).sort((a, b) => Number(a.knownDebt) - Number(b.knownDebt) || a.ratio - b.ratio);
  const total = (t: Tema) => auditoria[t].filter((l) => !l.pass).length;

  return (
    // Sem caixa: cabeçalho e pares direto sobre o chão do painel, separados por espaço.
    <section aria-label="Contraste" className="flex min-w-0 flex-col gap-md">
      <span className="flex min-w-0 flex-1 items-center justify-between gap-sm">
          <span className="flex items-center gap-xs">
            <Overline>Contraste</Overline>
            <Count tone={total("Light") + total("Dark") ? "neutral" : "brand"}>{`${linhas.length - falhas.length}/${linhas.length}`}</Count>
          </span>
          <Segmented
            size="sm"
            value={tema}
            onChange={setTema}
            options={[
              { value: "Light", label: `Claro ${total("Light")}` },
              { value: "Dark", label: `Escuro ${total("Dark")}` },
            ]}
          />
      </span>
      {falhas.length === 0 ? (
        <Tag intent="success" dot>
          Todos os pares passam
        </Tag>
      ) : (
        <div className="flex flex-col">
          {falhas.map((l) => (
            <ListRow
              key={`${l.fg}|${l.bg}`}
              leading={
                <span className="flex shrink-0 -space-x-2xs">
                  <Swatch size="sm" round color={l.bgHex} title={curto(l.bg)} />
                  <Swatch size="sm" round color={l.fgHex} title={curto(l.fg)} />
                </span>
              }
              title={<span title={`${curto(l.fg)} sobre ${curto(l.bg)}`}>{curto(l.fg)}</span>}
              meta={`sobre ${curto(l.bg)}`}
              trailing={
                <span className="flex flex-col items-end gap-3xs">
                  <Tag intent={l.knownDebt ? "warning" : "danger"}>{razao(l.ratio)}</Tag>
                  <span className="santo-caption-small-regular text-text-tertiary tabular-nums">{`mín. ${String(l.min).replace(".", ",")}`}</span>
                </span>
              }
            />
          ))}
        </div>
      )}
    </section>
  );
}
