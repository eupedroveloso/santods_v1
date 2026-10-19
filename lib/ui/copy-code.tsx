import { CopyButton } from "./copy-button";

/**
 * Nome curto em fonte mono com botao de copiar ao lado: var CSS, classe,
 * nome de token.
 *
 * Use em linha de tabela ou ficha, onde a pessoa vai colar o valor no codigo.
 * Para trecho de varias linhas, use CodeBlock. Sem valor (null), mostra um
 * travessao em vez de um campo vazio — "nao existe" e informacao.
 *
 * Raio: code inline NAO e pilula (regra do Pedro). O chip vive dentro de uma
 * celula/linha sem padding proprio, entao pela formula do raio aninhado leva o
 * menor degrau, radius/xs. Pilula fica so para Tag, Chip, Count e Segmented.
 *
 * `truncate`: em coluna estreita (Table layout fixed), o chip encolhe e corta
 * com reticencias; o `title` mostra o valor inteiro, a copia copia o inteiro e
 * o botao nunca encolhe.
 */
export function CopyCode({ value, label, truncate }: { value: string | null; label?: string; truncate?: boolean }) {
  if (!value) return <span className="santo-caption-regular text-text-disabled">—</span>;
  return (
    <span className={`inline-flex items-center gap-3xs ${truncate ? "max-w-full min-w-0" : "whitespace-nowrap"}`}>
      {/* Mesma familia da janela de codigo (CodeBlock): sempre escura, Palette fixa. */}
      <code
        title={truncate ? value : undefined}
        className={`santo-code-sm rounded-xs bg-(--santo-palette-neutral-950) px-2xs py-3xs text-(--santo-palette-neutral-100) ${
          truncate ? "min-w-0 truncate" : ""
        }`}
      >
        {value}
      </code>
      <span className="shrink-0">
        <CopyButton value={value} label={label ?? `Copiar ${value}`} />
      </span>
    </span>
  );
}
