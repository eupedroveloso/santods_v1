import Image from "next/image";

/** Altura pela escala dimension/size/*. Classe literal para o Tailwind gerar. */
const HEIGHT = {
  24: "h-(--santo-dimension-size-24)",
  28: "h-(--santo-dimension-size-28)",
  32: "h-(--santo-dimension-size-32)",
} as const;

/** Proporcao do arquivo original (442x92). */
const RATIO = 442 / 92;

/**
 * Logo oficial do SantoDS (wordmark com o "v1"), asset de marca em public/brand.
 *
 * A cor e da marca e vem no arquivo; nao e token, por isso nao vira JSX. O "v1"
 * e preto no original e sumiria no escuro: ha um segundo arquivo, com os
 * MESMOS paths, so com o "v1" em branco. As classes santo-show-light/dark
 * (lib/ui/controls.css) mostram so uma por tema — Auto pelo sistema e o
 * data-theme do ThemeToggle — sem JS e sem piscar.
 *
 * As duas tem alt: a escondida sai da arvore de acessibilidade pelo
 * display:none, entao o leitor anuncia uma vez so — e a visivel sempre tem nome.
 * Nao ponha utilitario de display (block/flex) nestas <img>: santo-show-* mora
 * em @layer components e um utilitario venceria o display:none.
 *
 * width/height do <img> ja sao o tamanho final (nao os 442x92 do arquivo): se
 * o CSS ainda nao carregou, a logo nunca aparece gigante.
 */
export function SantoLogo({ size = 24, className = "" }: { size?: keyof typeof HEIGHT; className?: string }) {
  const width = Math.round(size * RATIO);
  const img = `${HEIGHT[size]} w-auto`;
  return (
    <span className={`inline-flex shrink-0 items-center ${className}`}>
      <Image
        src="/brand/santods-logo.svg"
        alt="SantoDS v1"
        width={width}
        height={size}
        unoptimized
        priority
        className={`santo-show-light ${img}`}
      />
      <Image
        src="/brand/santods-logo-dark.svg"
        alt="SantoDS v1"
        width={width}
        height={size}
        unoptimized
        className={`santo-show-dark ${img}`}
      />
    </span>
  );
}
