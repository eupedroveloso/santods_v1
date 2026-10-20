import { buttonClass } from "./button-class";
import { Divider } from "./card";
import { Download, File } from "./icons";
import { IconTile } from "./icon-tile";

export type DownloadItem = {
  /** URL do arquivo (mesma origem): vira <a href download>. */
  href: string;
  title: string;
  description?: string;
  /** Tamanho em bytes. */
  size?: number;
  /** Item de destaque (o pacote completo): vai no topo, com acao primaria. */
  featured?: boolean;
};

/** "8,5 KB", "274,9 KB", "1,2 MB" — base 1024, uma casa. */
export function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  const kb = n / 1024;
  if (kb < 1024) return `${kb.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} KB`;
  return `${(kb / 1024).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} MB`;
}

function Row({ item }: { item: DownloadItem }) {
  const name = item.href.split("/").pop() ?? item.title;
  return (
    <div className="flex items-start gap-sm py-sm">
      <IconTile tone={item.featured ? "brand" : "plain"}>
        <File size={16} />
      </IconTile>
      <div className="flex min-w-0 flex-1 flex-col gap-3xs">
        <span className="flex min-w-0 flex-wrap items-baseline gap-x-xs">
          <span className="santo-body-small-semibold text-text-primary">{item.title}</span>
          <span className="santo-code-sm text-text-tertiary">{name}</span>
        </span>
        {item.description && (
          <span className="santo-caption-regular line-clamp-2 text-text-secondary">{item.description}</span>
        )}
      </div>
      {item.size !== undefined && (
        <span className="santo-caption-medium hidden shrink-0 pt-2xs tabular-nums text-text-tertiary sm:block">
          {formatBytes(item.size)}
        </span>
      )}
      {item.featured ? (
        <a href={item.href} download className={`shrink-0 ${buttonClass({ variant: "primary", size: "sm" })}`}>
          <Download size={16} />
          Baixar
        </a>
      ) : (
        <a
          href={item.href}
          download
          aria-label={`Baixar ${item.title}`}
          title={`Baixar ${name}`}
          className={`shrink-0 ${buttonClass({ variant: "ghost", size: "sm", icon: true })}`}
        >
          <Download size={16} />
        </a>
      )}
    </div>
  );
}

/**
 * Lista de arquivos para baixar (contexto do sistema, materiais): o item de
 * DESTAQUE (pacote completo) no topo, com acao primaria; depois um arquivo por
 * linha — icone de documento, titulo + nome do arquivo, descricao curta (ate 2
 * linhas), tamanho e o botao de download (atributo download). Linhas separadas
 * por hairline (Divider), sem caixa em volta de item. Alimentada por dado.
 */
export function DownloadList({ items }: { items: DownloadItem[] }) {
  const featured = items.filter((i) => i.featured);
  const rest = items.filter((i) => !i.featured);
  return (
    <div className="flex flex-col">
      {featured.map((i) => (
        <Row key={i.href} item={i} />
      ))}
      {featured.length > 0 && rest.length > 0 && <Divider />}
      {rest.map((i, k) => (
        <div key={i.href}>
          {k > 0 && <Divider />}
          <Row item={i} />
        </div>
      ))}
    </div>
  );
}
