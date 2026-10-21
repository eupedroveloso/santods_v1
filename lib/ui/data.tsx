import { Children } from "react";
import type { ReactNode } from "react";
import { AvatarImage } from "./avatar-image";
import { Check } from "./icons";
import { RADIUS_CONTROL_END, RADIUS_CONTROL_START } from "./radius";

/**
 * Exibicao de dado: avatar e tabela (o calendario mora em calendar.tsx).
 * Tudo que o preview precisa para parecer produto, sem virar produto.
 *
 * Sem "use client" de proposito: a tabela sem selecao renderiza no servidor
 * (tabela de 100 tokens nao precisa ir como JS para o navegador). Selecao e
 * acoes por linha usam funcoes, entao so existem quando quem monta e cliente.
 */

export function Avatar({
  name,
  size = 32,
  src,
  avifSrc,
  alt,
  className = "",
}: {
  name: string;
  size?: 24 | 32 | 40;
  /** Foto (quadrada). Sem src, ou se falhar, aparecem as iniciais. */
  src?: string;
  /** Fonte AVIF opcional; src continua sendo o WebP de fallback. */
  avifSrc?: string;
  /** Texto alternativo da foto; padrao: o nome. */
  alt?: string;
  className?: string;
}) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  const text = size === 24 ? "santo-caption-small-semibold" : "santo-caption-semibold";
  const letters = <span aria-hidden={src ? true : undefined}>{initials}</span>;
  return (
    <span
      title={name}
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-neutral-subtle-active text-text-secondary ${text} ${className}`}
      style={{ width: `var(--santo-dimension-size-${size})`, height: `var(--santo-dimension-size-${size})` }}
    >
      {src ? <AvatarImage key={`${src}:${avifSrc ?? ""}`} src={src} avifSrc={avifSrc} alt={alt ?? name} size={size} fallback={letters} /> : letters}
    </span>
  );
}

/**
 * Avatares sobrepostos (quem esta num documento, num time). Cada um ganha um
 * anel da cor da superficie, para o recorte ler sobre qualquer fundo.
 */
export function AvatarGroup({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center ${className}`}>
      {Children.map(children, (child, i) => (
        <span
          className={`inline-flex rounded-full ${i > 0 ? "-ml-xs" : ""}`}
          style={{ boxShadow: "0 0 0 var(--santo-border-thick) var(--santo-color-surface-raised)" }}
        >
          {child}
        </span>
      ))}
    </span>
  );
}

export type Column<T> = {
  key: string;
  header: ReactNode;
  /** Alinha a direita — use para numero. */
  numeric?: boolean;
  /**
   * Como desenhar a celula a partir da linha. Sem `render`, a celula e
   * `row[key]` ja renderizada (ReactNode). Isso so importa quando as linhas
   * atravessam do servidor para um componente cliente que monta a tabela —
   * funcao nao atravessa essa fronteira, elemento sim. Num Server Component a
   * tabela aceita `render` normalmente.
   */
  render?: (row: T) => ReactNode;
  /**
   * Largura da coluna, degrau de dimension/space (px). Com `layout="fixed"`,
   * colunas sem largura repartem o resto — e tabelas empilhadas com as mesmas
   * larguras alinham coluna a coluna.
   */
  width?: ColumnWidth;
};

export type ColumnWidth = 48 | 56 | 64 | 72 | 80 | 88 | 96 | 104 | 112 | 120 | 128 | 144 | 160 | 176 | 192 | 208 | 224 | 240 | 256 | 288 | 320 | 384;

/** Linha com celulas ja renderizadas, por chave de coluna. `key` vira a chave React. */
export type CellRow = { key: string } & Record<string, ReactNode>;

const cellOf = <T,>(column: Column<T>, row: T): ReactNode =>
  column.render ? column.render(row) : ((row as Record<string, ReactNode>)[column.key] ?? null);

const keyOf = (row: unknown, index: number) => {
  const key = (row as { key?: unknown }).key;
  return typeof key === "string" ? key : String(index);
};

/**
 * Tabela compacta (skill santo-ui-craft, secao 8): cabecalho TONAL (faixa
 * surface/sunken em pastilha larga, sem borda), linhas separadas por hairline,
 * numero a direita com tabular-nums, hover tonal. Sem borda por celula.
 *
 * `selected` liga a coluna de selecao; `rowAction` acrescenta a coluna de acoes
 * no fim. `layout="fixed"` trava a largura das colunas (Column.width) e faz o
 * texto longo quebrar em vez de vazar.
 */
export function Table<T>({
  columns,
  rows,
  getKey = keyOf,
  className = "",
  selected,
  onToggleRow,
  onToggleAll,
  rowAction,
  layout = "auto",
  flush = false,
}: {
  columns: Column<T>[];
  rows: T[];
  /**
   * Padrao: `row.key`, senao o indice. Com `selected`, passe sempre: chave por
   * indice faz a selecao trocar de linha quando a ordem muda.
   */
  getKey?: (row: T, index: number) => string;
  className?: string;
  /** Chaves selecionadas. Passar (mesmo vazio) liga a coluna de selecao. */
  selected?: Set<string>;
  onToggleRow?: (key: string) => void;
  onToggleAll?: () => void;
  rowAction?: (row: T) => ReactNode;
  /** fixed: table-layout fixo, larguras de Column.width, texto quebra. */
  layout?: "auto" | "fixed";
  /**
   * Realce de linha. Padrao (inset): pastilha suave com raio aninhado, para a
   * tabela dentro de Card com padding. `flush`: tabela que ocupa o Card
   * inteiro (padded=false) — realce reto, cabecalho em faixa reta, e o
   * contêiner recorta os cantos com o raio do Card.
   */
  flush?: boolean;
}) {
  const fixed = layout === "fixed";
  const wrap = fixed ? "break-words" : "whitespace-nowrap";
  const selectable = selected !== undefined;
  const allSelected = selectable && rows.length > 0 && rows.every((r, i) => selected.has(getKey(r, i)));

  return (
    <div
      className={`overflow-x-auto scrollbar-bare ${className}`}
      style={flush ? { borderRadius: "var(--santo-inner-radius)" } : undefined}
    >
      <table className={`w-full border-separate border-spacing-0 ${fixed ? "table-fixed" : ""}`}>
        <colgroup>
          {selectable && <col className="w-(--santo-dimension-space-48)" />}
          {columns.map((c) => (
            <col key={c.key} style={c.width ? { width: `var(--santo-dimension-space-${c.width})` } : undefined} />
          ))}
          {rowAction && <col className="w-(--santo-dimension-space-56)" />}
        </colgroup>
        <thead>
          {/* Faixa tonal: o fundo e das celulas, pontas no raio de controle (nao e capsula). */}
          <tr className="santo-caption-semibold text-text-secondary">
            {selectable && (
              <th scope="col" className={`${flush ? "" : RADIUS_CONTROL_START} bg-surface-sunken px-sm py-xs`}>
                <CheckCell checked={allSelected} onChange={() => onToggleAll?.()} label="Selecionar todas as linhas" />
              </th>
            )}
            {columns.map((c, ci) => (
              <th
                key={c.key}
                scope="col"
                className={`bg-surface-sunken px-sm py-xs ${wrap} ${c.numeric ? "text-right" : "text-left"} ${
                  ci === 0 && !selectable ? `${flush ? "" : RADIUS_CONTROL_START} pl-md` : ""
                } ${ci === columns.length - 1 && !rowAction ? `${flush ? "" : RADIUS_CONTROL_END} pr-md` : ""}`}
              >
                {c.header}
              </th>
            ))}
            {rowAction && <th scope="col" className={`${flush ? "" : RADIUS_CONTROL_END} bg-surface-sunken px-sm py-xs`} />}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const key = getKey(row, i);
            const last = i === rows.length - 1;
            const cell = `${last ? "" : "border-b-thin border-border-subtle"} px-sm py-sm`;
            return (
              <tr
                key={key}
                data-selected={selectable && selected.has(key) ? "" : undefined}
                className={flush ? "santo-row-flush" : "santo-row"}
              >
                {selectable && (
                  <td className={cell}>
                    <CheckCell
                      checked={selected.has(key)}
                      onChange={() => onToggleRow?.(key)}
                      label={`Selecionar linha ${i + 1}`}
                    />
                  </td>
                )}
                {columns.map((c, ci) => (
                  <td
                    key={c.key}
                    className={`santo-body-small-regular ${cell} ${fixed ? "break-words" : ""} ${c.numeric ? "text-right tabular-nums" : "text-left"} ${
                      ci === 0 && !selectable ? "pl-md" : ""
                    } ${ci === columns.length - 1 && !rowAction ? "pr-md" : ""}`}
                  >
                    {cellOf(c, row)}
                  </td>
                ))}
                {rowAction && <td className={`${cell} text-right`}>{rowAction(row)}</td>}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/** Caixa de selecao enxuta, so para dentro da tabela. */
function CheckCell({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`santo-focus-field grid size-md cursor-pointer place-items-center rounded-xs border-thin transition-colors ease-(--santo-motion-easing-standard) duration-(--santo-motion-duration-fast) ${
        checked
          ? "border-border-brand bg-brand-solid-default text-text-on-brand"
          : "border-border-default bg-input-default hover:border-border-strong"
      }`}
    >
      {checked && <Check size={12} />}
    </button>
  );
}
