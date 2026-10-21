import type { ReactNode } from "react";
import { CopyButton } from "./copy-button";

/*
 * Janela de terminal (padrao do Pedro): sempre escura, nos dois temas — a
 * excecao aprovada a regra de nao usar preto. Cores pelos degraus fixos da
 * Palette (neutral/950 corpo, 900 barra, 800 borda, 100 texto, 400 apoio;
 * brand/300 palavra-chave, brand/400 prompt), porque os semanticos de
 * superficie invertem no escuro. DIVIDA DE TOKEN: propor color/surface/code
 * (e texto/destaque de codigo) no Figma.
 */

/** Realce minimo: palavra-chave e nome de tag JSX em brand claro; o resto em texto. */
function highlight(line: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(<\/?[A-Za-z][\w.]*)|\b(import|from|export|default|const|let|var|return|function|type|interface|await|async|new|if|else|true|false|null|undefined)\b/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line))) {
    if (m.index > last) out.push(line.slice(last, m.index));
    if (m[1]) {
      const bracket = m[1].startsWith("</") ? "</" : "<";
      out.push(bracket);
      out.push(
        <span key={m.index} className="text-(--santo-palette-brand-400)">
          {m[1].slice(bracket.length)}
        </span>,
      );
    } else {
      out.push(
        <span key={m.index} className="text-(--santo-palette-brand-300)">
          {m[0]}
        </span>,
      );
    }
    last = m.index + m[0].length;
  }
  if (last < line.length) out.push(line.slice(last));
  return out;
}

/**
 * Codigo para ler e copiar, em janela de terminal macOS: barra com os tres
 * pontos (danger, warning, success), titulo em mono no centro e copiar a
 * direita; corpo escuro com realce leve.
 *
 * Raio aninhado: dentro de um Card usa o raio interno que o Card expoe
 * (--santo-inner-radius); sozinho, radius/xl.
 */
export function CodeBlock({
  code,
  title = "terminal",
  prompt,
  className = "",
}: {
  code: string;
  /** Titulo da janela: nome do arquivo ou do componente. */
  title?: string;
  /** Marca a primeira linha com o prompt ">" (comando de terminal). */
  prompt?: boolean;
  className?: string;
}) {
  const lines = code.split("\n");
  return (
    <div
      className={`flex min-w-0 flex-col overflow-hidden border-thin border-(--santo-palette-neutral-800) bg-(--santo-palette-neutral-950) shadow-md ${className}`}
      style={{ borderRadius: "var(--santo-inner-radius, var(--santo-radius-xl))" }}
    >
      <div className="relative flex h-(--santo-dimension-size-36) shrink-0 items-center border-b-thin border-(--santo-palette-neutral-800) bg-(--santo-palette-neutral-900) px-sm">
        <span aria-hidden className="flex items-center gap-xs">
          <span className="size-xs rounded-full bg-danger-solid-default" />
          <span className="size-xs rounded-full bg-warning-solid-default" />
          <span className="size-xs rounded-full bg-success-solid-default" />
        </span>
        <span className="santo-code-sm pointer-events-none absolute inset-x-0 truncate px-5xl text-center text-(--santo-palette-neutral-400)">
          {title}
        </span>
        <span className="ml-auto">
          <CopyButton value={code} label="Copiar código" variant="ghost-inverse" />
        </span>
      </div>
      <pre
        tabIndex={0}
        aria-label={title}
        className="santo-code-sm overflow-x-auto p-md text-(--santo-palette-neutral-100)"
      >
        <code>
          {lines.map((line, i) => (
            <span key={i} className="block">
              {prompt && i === 0 && <span className="mr-xs text-(--santo-palette-brand-400)">&gt;</span>}
              {highlight(line)}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
