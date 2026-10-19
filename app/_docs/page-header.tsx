import type { ReactNode } from "react";
import { Breadcrumb, Divider, type Crumb } from "@/lib/ui";

/**
 * Coluna de conteudo das paginas de docs: ocupa toda a largura que sobra ao
 * lado da sidebar (o max-w de leitura fica so no paragrafo do DocHeader) e toda
 * a altura da <main>, para um rodape com mt-auto encostar no fim.
 */
export function DocPage({ children }: { children: ReactNode }) {
  return <div className="flex w-full min-w-0 flex-1 flex-col gap-3xl">{children}</div>;
}

/**
 * Topo de toda pagina de docs: barra de trilha fixa + titulo grande.
 *
 * A trilha e uma barra propria, sticky logo abaixo da topbar (size/56), de
 * ponta a ponta da coluna de conteudo. Ela sai como IRMA do <header>, filha
 * direta do DocPage: sticky so segura enquanto o pai esta na tela, e o
 * DocPage dura a pagina inteira. As margens negativas anulam o padding da
 * <main> (px-md / lg:px-3xl, pt-2xl) para a barra encostar nas bordas;
 * -mb-lg aproxima o titulo (o gap do DocPage e 3xl).
 * Camada docked: acima do conteudo, abaixo de topbar, gaveta e ⌘K.
 */
export function DocHeader({
  crumbs,
  title,
  description,
  actions,
  divided,
  children,
}: {
  crumbs?: Crumb[];
  title: string;
  description?: ReactNode;
  /** Controles na linha do titulo, a direita, alinhados pela base (alternancia, filtro). */
  actions?: ReactNode;
  /** Divider depois do cabecalho; o conteudo comeca a gap-lg dele (nao o 3xl do DocPage). */
  divided?: boolean;
  /** Linha extra abaixo do titulo: tags, atalhos. */
  children?: ReactNode;
}) {
  return (
    <>
      {crumbs && (
        <div className="sticky top-(--santo-dimension-size-56) z-(--santo-layer-docked) -mx-md -mt-2xl -mb-xl border-b-thin border-border-subtle bg-surface-page px-md py-xs lg:-mx-3xl lg:px-3xl">
          <Breadcrumb items={crumbs} />
        </div>
      )}
      <header className={`flex flex-col gap-sm ${divided ? "-mb-lg" : ""}`}>
        <div className="flex flex-wrap items-end justify-between gap-sm">
          <h1 className="santo-heading-5-semibold">{title}</h1>
          {actions}
        </div>
        {/* Medida de linha: container/sm (640px), o menor container — ~75 caracteres em
            body. Falta um token de medida de linha — previsto na F0. */}
        {description && (
          // Subtitulo em body (16px), um degrau acima do corpo da pagina (body-small,
          // 14px, como na ref do shadcn). Hierarquia: h1 30 > subtitulo 16 > corpo 14 > caption 12.
          <p className="santo-body-regular max-w-(--santo-dimension-container-sm) text-text-secondary">{description}</p>
        )}
        {children}
        {divided && <Divider className="mt-sm" />}
      </header>
    </>
  );
}

/** Rotulo cinza pequeno, acima de um grupo de itens. */
export function SectionLabel({ children }: { children: ReactNode }) {
  return <span className="santo-caption-medium text-text-tertiary">{children}</span>;
}

/** Titulo de secao com ancora (scroll-margin para nao sumir sob a topbar). */
export function SectionTitle({
  id,
  title,
  count,
  description,
}: {
  id?: string;
  title: string;
  count?: number;
  description?: ReactNode;
}) {
  return (
    <div id={id} className="flex scroll-mt-6xl flex-col gap-3xs">
      <h2 className="santo-heading-6-semibold flex items-baseline gap-xs">
        {title}
        {count !== undefined && <span className="santo-caption-medium tabular-nums text-text-tertiary">{count}</span>}
      </h2>
      {description && <p className="santo-body-small-regular text-text-secondary">{description}</p>}
    </div>
  );
}
