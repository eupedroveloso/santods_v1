import type { ReactNode } from "react";
import { Divider } from "./card";
import { CodeBlock } from "./code-block";
import { Table, type CellRow, type Column } from "./data";

/*
 * Markdown -> componentes da lib, sem dependencia: cobre o que os docs do
 * SantoDS usam (titulos, paragrafos, listas aninhadas, tabelas, codigo cercado,
 * citacao, regra horizontal, comentario HTML ignorado; inline: `codigo`,
 * **negrito**, *italico*, [link](url)). Nao e um parser CommonMark completo.
 */

type Block =
  | { kind: "heading"; level: number; text: string; id: string }
  | { kind: "paragraph"; text: string }
  | { kind: "code"; lang: string; code: string }
  | { kind: "quote"; blocks: Block[] }
  | { kind: "list"; ordered: boolean; start: number; items: Block[][] }
  | { kind: "table"; header: string[]; rows: string[][] }
  | { kind: "rule" };

const FENCE = /^(\s*)(`{3,}|~{3,})\s*([\w-]*)/;
const HEADING = /^(#{1,6})\s+(.*?)\s*#*\s*$/;
const RULE = /^\s{0,3}([-*_])(\s*\1){2,}\s*$/;
// So "-" e "*": o gerador escreve "+ 288 atributos" como texto dentro de item.
const MARKER = /^(\s*)([-*]|(\d+)[.)])\s+(.*)$/;
const TABLE_SEP = /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/;

const indentOf = (line: string) => line.length - line.trimStart().length;

/** Ancora de titulo: minusculas, sem acento, hifens. */
export function headingId(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[`*_[\]()]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const cells = (line: string) =>
  line
    .trim()
    .replace(/^\|/, "")
    .replace(/(?<!\\)\|$/, "")
    .split(/(?<!\\)\|/)
    .map((c) => c.trim().replace(/\\\|/g, "|"));

function startsBlock(line: string, next?: string) {
  return (
    HEADING.test(line) ||
    FENCE.test(line) ||
    RULE.test(line) ||
    /^\s*>/.test(line) ||
    MARKER.test(line) ||
    /^\s*<!--/.test(line) ||
    (line.trim().startsWith("|") && next !== undefined && TABLE_SEP.test(next))
  );
}

function parse(lines: string[], ids: Map<string, number>): Block[] {
  const out: Block[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }

    // Comentario HTML: some (marcadores de origem do gerador).
    if (/^\s*<!--/.test(line)) {
      while (i < lines.length && !lines[i].includes("-->")) i++;
      i++;
      continue;
    }

    const fence = FENCE.exec(line);
    if (fence) {
      const close = new RegExp(`^\\s*${fence[2][0]}{${fence[2].length},}\\s*$`);
      const body: string[] = [];
      i++;
      while (i < lines.length && !close.test(lines[i])) body.push(lines[i++]);
      i++;
      const pad = fence[1].length;
      out.push({ kind: "code", lang: fence[3], code: body.map((l) => l.slice(Math.min(pad, indentOf(l)))).join("\n") });
      continue;
    }

    const heading = HEADING.exec(line);
    if (heading) {
      const text = heading[2];
      const base = headingId(text) || "secao";
      const n = ids.get(base) ?? 0;
      ids.set(base, n + 1);
      out.push({ kind: "heading", level: heading[1].length, text, id: n ? `${base}-${n}` : base });
      i++;
      continue;
    }

    if (RULE.test(line)) {
      out.push({ kind: "rule" });
      i++;
      continue;
    }

    if (/^\s*>/.test(line)) {
      const body: string[] = [];
      while (i < lines.length && /^\s*>/.test(lines[i])) body.push(lines[i++].replace(/^\s*>\s?/, ""));
      out.push({ kind: "quote", blocks: parse(body, ids) });
      continue;
    }

    if (line.trim().startsWith("|") && i + 1 < lines.length && TABLE_SEP.test(lines[i + 1])) {
      const header = cells(line);
      const rows: string[][] = [];
      i += 2;
      while (i < lines.length && lines[i].trim().startsWith("|")) rows.push(cells(lines[i++]));
      out.push({ kind: "table", header, rows });
      continue;
    }

    const marker = MARKER.exec(line);
    if (marker) {
      // Item = a linha do marcador + tudo que vem recuado alem dele (continuacao,
      // sublista, codigo). Cada item vira blocos de novo, ja sem o recuo.
      const base = marker[1].length;
      const ordered = marker[3] !== undefined;
      const items: Block[][] = [];
      while (i < lines.length) {
        const m = MARKER.exec(lines[i]);
        if (!m || m[1].length !== base || (m[3] !== undefined) !== ordered) break;
        const content = base + m[2].length + 1;
        const body = [m[4]];
        i++;
        while (i < lines.length) {
          const l = lines[i];
          if (!l.trim()) {
            const next = lines.slice(i + 1).find((x) => x.trim());
            if (next !== undefined && indentOf(next) > base) {
              body.push("");
              i++;
              continue;
            }
            break;
          }
          if (indentOf(l) <= base) break;
          body.push(l.slice(Math.min(content, indentOf(l))));
          i++;
        }
        items.push(parse(body, ids));
        while (i < lines.length && !lines[i].trim()) {
          const next = lines.slice(i).find((x) => x.trim());
          const nm = next !== undefined ? MARKER.exec(next) : null;
          if (nm && nm[1].length === base) i++;
          else break;
        }
      }
      out.push({ kind: "list", ordered, start: ordered ? Number(marker[3]) : 1, items });
      continue;
    }

    const para: string[] = [line.trim()];
    i++;
    while (i < lines.length && lines[i].trim() && !startsBlock(lines[i], lines[i + 1])) para.push(lines[i++].trim());
    out.push({ kind: "paragraph", text: para.join(" ") });
  }
  return out;
}

/** Titulos de nivel 2 do texto, na ordem — para o indice "Nesta pagina" (TableOfContents). */
export function markdownHeadings(source: string, level = 2) {
  const walk = (blocks: Block[]): { id: string; label: string }[] =>
    blocks.flatMap((b) =>
      b.kind === "heading" && b.level === level
        ? [{ id: b.id, label: b.text.replace(/[`*]/g, "") }]
        : b.kind === "quote"
          ? walk(b.blocks)
          : [],
    );
  return walk(parse(source.split("\n"), new Map()));
}

const INLINE = /(`+)([\s\S]+?)\1|\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)\s]+)\)|(?<![\w*])[*_]([^*_\s](?:[^*_]*?[^*_\s])?)[*_](?![\w*])/g;

/** `cell`: dentro de tabela o codigo nao quebra (a coluna cresce e a tabela rola), so a prosa quebra. */
function inline(text: string, key = "i", cell = false): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  const re = new RegExp(INLINE.source, "g");
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const k = `${key}-${m.index}`;
    if (m[2] !== undefined) {
      out.push(
        // Codigo inline: mono em poco, raio radius/xs (code inline nao e pastilha, como no CopyCode).
        <code
          key={k}
          className={`santo-code-sm rounded-xs bg-surface-sunken px-3xs text-text-primary ${cell ? "whitespace-nowrap" : ""}`}
        >
          {m[2].trim()}
        </code>,
      );
    } else if (m[3] !== undefined) {
      out.push(
        <strong key={k} className="font-semibold text-text-primary">
          {inline(m[3], k, cell)}
        </strong>,
      );
    } else if (m[4] !== undefined) {
      const external = /^https?:/.test(m[5]);
      out.push(
        <a
          key={k}
          href={m[5]}
          className="text-text-brand underline decoration-from-font underline-offset-2 hover:text-text-primary"
          {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
        >
          {inline(m[4], k, cell)}
        </a>,
      );
    } else {
      out.push(<em key={k}>{inline(m[6], k, cell)}</em>);
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/** Titulo por nivel: h1 heading-5 (o h1 da pagina e do DocHeader), h2 heading-6, h3 body-large, h4+ body. */
const HEADING_CLASS = [
  "santo-heading-5-semibold",
  "santo-heading-6-semibold",
  "santo-body-large-semibold",
  "santo-body-semibold",
  "santo-body-small-semibold",
  "santo-body-small-semibold",
];
/** Respiro acima do titulo por nivel: a secao abre com mais ar do que a subsecao. */
const HEADING_SPACE = ["pt-xl", "pt-lg", "pt-sm", "pt-2xs", "pt-2xs", "pt-2xs"];

function render(blocks: Block[]): ReactNode[] {
  return blocks.map((b, i) => {
    switch (b.kind) {
      case "heading": {
        const H = `h${Math.min(6, b.level + 1)}` as "h2";
        return (
          <H
            key={i}
            id={b.id}
            className={`${HEADING_CLASS[b.level - 1]} ${i === 0 ? "" : HEADING_SPACE[b.level - 1]} scroll-mt-6xl text-text-primary`}
          >
            {inline(b.text)}
          </H>
        );
      }
      case "paragraph":
        return (
          <p key={i} className="text-pretty">
            {inline(b.text)}
          </p>
        );
      case "code":
        return <CodeBlock key={i} code={b.code} title={b.lang || "texto"} />;
      case "quote":
        return (
          <blockquote key={i} className="flex flex-col gap-sm rounded-lg bg-surface-sunken px-md py-sm text-text-secondary">
            {render(b.blocks)}
          </blockquote>
        );
      case "rule":
        return <Divider key={i} className="my-sm" />;
      case "table": {
        const columns: Column<CellRow>[] = b.header.map((h, c) => ({ key: `c${c}`, header: inline(h, "h", true) }));
        const rows: CellRow[] = b.rows.map((r, ri) => ({
          key: String(ri),
          ...Object.fromEntries(b.header.map((_, c) => [`c${c}`, inline(r[c] ?? "", `c${c}`, true)])),
        }));
        return <Table key={i} columns={columns} rows={rows} />;
      }
      case "list": {
        const L = b.ordered ? "ol" : "ul";
        return (
          <L
            key={i}
            start={b.ordered && b.start !== 1 ? b.start : undefined}
            className={`flex flex-col gap-2xs pl-lg ${b.ordered ? "list-decimal" : "list-disc"} marker:text-text-tertiary`}
          >
            {b.items.map((item, k) => {
              // Item curto (um paragrafo + sublista) fica justo; item com varios blocos respira.
              const simple = item.filter((x) => x.kind === "paragraph").length <= 1;
              return (
                <li key={k} className={`pl-3xs ${simple ? "" : "flex flex-col gap-sm"}`}>
                  {simple
                    ? item.map((x, xi) =>
                        x.kind === "paragraph" ? (
                          <span key={xi}>{inline(x.text)}</span>
                        ) : (
                          <div key={xi} className="pt-2xs">
                            {render([x])}
                          </div>
                        ),
                      )
                    : render(item)}
                </li>
              );
            })}
          </L>
        );
      }
    }
  });
}

/**
 * Texto em Markdown desenhado com a lib: titulos nas classes santo-* (com
 * ancora, para o TableOfContents via `markdownHeadings`), paragrafo em
 * body (leitura) ou body-small (`size="sm"`), listas aninhadas, tabela com Table, codigo cercado em CodeBlock,
 * citacao em poco (surface/sunken) e regra horizontal com Divider. Server
 * component: renderiza no build, sem JS no cliente alem do copiar do CodeBlock.
 *
 * Use para documento de texto (contexto do sistema, guias). Nao e editor nem
 * CommonMark completo: HTML cru nao passa (comentario some).
 */
export function MarkdownView({
  source,
  size = "md",
  className = "",
}: {
  source: string;
  /**
   * `md` (padrao): leitura densa — body (16px) com entrelinha type/leading/28 e
   * blocos a space/lg; use numa coluna de medida de leitura (DocPage reading).
   * `sm`: body-small e blocos a space/md, para trecho dentro de cartao ou demo.
   */
  size?: "sm" | "md";
  className?: string;
}) {
  const blocks = parse(source.replace(/\r\n?/g, "\n").split("\n"), new Map());
  const text = size === "md" ? "santo-body-regular leading-28 gap-lg" : "santo-body-small-regular gap-md";
  return (
    <div className={`${text} flex min-w-0 flex-col wrap-break-word text-text-secondary ${className}`}>
      {render(blocks)}
    </div>
  );
}
