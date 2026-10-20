import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Trilho vertical estreito de ícones.
 *
 * Use como primeira coluna de uma aplicação com várias áreas: o trilho troca de
 * área, o painel ao lado (SidebarNav) mostra as seções da área. É chão (nível
 * 0, `surface/sunken`) em cápsula; o item ativo é a pílula elevada (raised +
 * sombra). Itens são círculos de `size/40` dentro de `space/2xs`: o raio do item
 * fica concêntrico ao do trilho. `footer` vem logo depois dos itens (conta,
 * ajustes), separado por `space/xs`.
 *
 * Altura = conteúdo + padding (`h-fit`), nunca esticado pela coluna: sem faixa
 * vazia no trilho (princípio 4 do Pedro). Quem posiciona é o pai.
 */
export function RailNav({
  children,
  footer,
  label = "Navegação principal",
  className = "",
}: {
  children: ReactNode;
  footer?: ReactNode;
  /** Rotulo acessivel do <nav>. */
  label?: string;
  className?: string;
}) {
  return (
    <nav
      aria-label={label}
      className={`flex h-fit w-fit flex-col items-center gap-2xs rounded-full bg-surface-sunken p-2xs ${className}`}
    >
      {children}
      {footer && <div className="flex flex-col items-center gap-2xs pt-xs">{footer}</div>}
    </nav>
  );
}

/**
 * Item do trilho: só ícone. O nome sai no `title` (dica do navegador) e no
 * aria-label. `dot` marca novidade com um ponto em brand — sem número; se a
 * contagem importa, ela mora no painel, num Count.
 */
export function RailItem({
  icon,
  label,
  active = false,
  dot = false,
  href,
  onClick,
}: {
  /** O icone (Icon.*). */
  icon: ReactNode;
  label: string;
  active?: boolean;
  dot?: boolean;
  /** Vira link — o certo quando o item troca de pagina. */
  href?: string;
  onClick?: () => void;
}) {
  const name = dot ? `${label}, há novidades` : label;
  const className = `relative grid size-(--santo-dimension-size-40) shrink-0 cursor-pointer place-items-center rounded-full santo-transition-elevation ${
    active
      ? "bg-surface-raised text-icon-primary shadow-xs"
      : "text-icon-tertiary hover:bg-neutral-subtle-hover hover:text-icon-secondary"
  }`;
  const content = (
    <>
      <span aria-hidden className="grid place-items-center">
        {icon}
      </span>
      {dot && (
        // Borda na cor do fundo do item: recorta o ponto do icone.
        <span
          aria-hidden
          className={`absolute top-2xs right-2xs size-xs rounded-full border-thick bg-brand-solid-default ${
            active ? "border-surface-raised" : "border-surface-sunken"
          }`}
        />
      )}
    </>
  );
  if (href) {
    return (
      <Link
        href={href}
        onClick={onClick}
        title={label}
        aria-label={name}
        aria-current={active ? "page" : undefined}
        className={className}
      >
        {content}
      </Link>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={name}
      aria-current={active ? "page" : undefined}
      className={className}
    >
      {content}
    </button>
  );
}
