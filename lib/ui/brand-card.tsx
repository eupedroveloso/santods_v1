import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { BrandLogo } from "./brand-logo";
import { Card, Divider } from "./card";
import { Tag } from "./chip";
import { Overline } from "./overline";
import { Swatch } from "./swatch";

export type BrandCardColor = {
  /** A var CSS do token (`--santo-palette-brand-600`): a amostra e viva. Sem ela, a amostra usa `value`. */
  cssVar?: string;
  /** Hex resolvido para esta marca — dado, em mono. */
  value: string;
};

/**
 * Grade fixa da ficha (a partir de md): logo space/224 | tipografia space/160 |
 * cor space/128 | neutros space/192 | raio space/96. Larguras por token, iguais
 * em toda ficha: divisores e rotulos alinham entre fichas empilhadas.
 */
const COL = {
  font: "md:w-(--santo-dimension-space-160)",
  color: "md:w-(--santo-dimension-space-128)",
  neutrals: "md:w-(--santo-dimension-space-192)",
  radius: "md:w-(--santo-dimension-space-96)",
} as const;

/** Amostra: a var quando existe (marca com CSS emitido), senao o valor (sistema do Estudio). */
const viva = (c: BrandCardColor) => (c.cssVar ? `var(${c.cssVar})` : c.value);

/**
 * Linha de conteudo de toda celula (e da ficha de acao): altura minima de um
 * controle md, entao fichas irmas (identidade, sistema, criar) medem o mesmo.
 */
const ROW = "flex min-h-(--santo-control-height-md) min-w-0 items-center gap-sm";

/** Uma celula da linha: Overline pequeno em cima e o conteudo, centrado na vertical, sem caixa. */
function Cell({ title, col, children }: { title: string; col: keyof typeof COL; children: ReactNode }) {
  return (
    <div className={`flex min-w-0 shrink-0 flex-col justify-center gap-2xs ${COL[col]}`}>
      <Overline>{title}</Overline>
      <div className={ROW}>{children}</div>
    </div>
  );
}

/** Valor em mono; trunca com reticencias (o title guarda o inteiro). */
function Hex({ children }: { children: string }) {
  return (
    <span title={children} className="santo-code-sm min-w-0 truncate text-text-tertiary">
      {children}
    </span>
  );
}

/**
 * Ficha de identidade de uma marca do DS em UMA LINHA compacta (Pedro): a
 * celula inicial com a logo pequena (+ Tag Padrao; o nome nao se repete, vai no
 * aria-label) e, separadas por
 * Divider vertical, Tipografia ("Aa" na familia sans + nome), Cor de marca
 * (Swatch md + hex), Neutros (claro e escuro lado a lado, com hex) e Raio
 * principal (amostra pequena + valor). Overline em cada celula, alinhamento ao
 * centro, gap constante, nada de caixa em volta. Abaixo de md as celulas
 * quebram em 2 por linha (grade de 2, sem divisores).
 *
 * `data-brand` no cartao: as amostras resolvem as vars DESTA marca, nao da
 * marca ativa no documento. Os valores (hex, px) vem do catalogo, por marca.
 */
export function BrandCard({
  brand,
  name,
  isDefault = false,
  font,
  fontStack,
  color,
  neutrals,
  radius,
  mark,
  meta,
  href,
  actions,
  actionsVisible = false,
}: {
  /** Id de brand/id: grava data-brand e escolhe a logo. Sem ele (sistema do Estudio), as amostras usam os valores. */
  brand?: string;
  /** brand/name: rotulo acessivel da ficha (nao e escrito; a logo ja mostra). */
  name: string;
  isDefault?: boolean;
  /** Familia sans (brand/family/sans). */
  font: string;
  /** Cor de marca (o degrau do bg/brand/solid). */
  color: BrandCardColor;
  /** Neutro de superficie (surface/page) no claro e no escuro. */
  neutrals: { light: BrandCardColor; dark: BrandCardColor };
  /** Raio principal: var + valor resolvido. */
  radius: BrandCardColor;
  /** No lugar da logo (sistema do Estudio: o nome dele, na fonte de titulo dele). */
  mark?: ReactNode;
  /** Metadado discreto ao lado da marca (slug · atualizado em). */
  meta?: ReactNode;
  /** Pilha de fonte do "Aa" (sistema sem CSS de marca emitido). */
  fontStack?: string;
  /** A ficha inteira vira link (link esticado; as acoes ficam por cima). */
  href?: string;
  /** Acoes (IconButton ghost): aparecem no hover e no foco, sempre no toque e abaixo de md. */
  actions?: ReactNode;
  /** Mantem as acoes a vista (confirmacao em curso). */
  actionsVisible?: boolean;
}) {
  const sep = <Divider orientation="vertical" className="hidden md:block" />;
  return (
    <section id={brand} data-brand={brand} aria-label={`Identidade ${name}`} className="group scroll-mt-6xl">
      <Card padding="md" className={href ? "relative santo-transition-elevation hover:shadow-md" : ""}>
        {href && (
          // Link esticado: a ficha inteira é o alvo; o conteúdo fica por baixo, as ações por cima.
          <Link href={href} aria-label={`Abrir ${name}`} className="absolute inset-0" style={{ borderRadius: "inherit" }} />
        )}
        {/* Com acoes, o gap cai para sm: a coluna de acoes cabe sem roubar a da marca. */}
        <div className={`grid grid-cols-2 gap-md px-sm md:flex md:items-center ${actions ? "md:gap-sm" : "md:gap-lg"}`}>
          {/* Logo REDUZIDA (mark; sem mark, a completa) + Tag Padrao, numa coluna de
              largura fixa (space/224): as celulas ficam perto da logo e alinhadas.
              Com acoes, e ela que cede espaco (o nome trunca; as celulas nao). */}
          <div className={`col-span-2 flex min-w-0 items-center gap-sm md:w-(--santo-dimension-space-224) ${actions ? "" : "shrink-0"}`}>
            {/* Mesmo peso visual entre marcas: a mark (compacta) em 24; a logo
                completa (larga) em 20. */}
            {meta ? (
              // Marca com metadado (sistema do Estudio): o nome em cima, slug · data embaixo.
              <span className="flex min-w-0 flex-1 flex-col gap-3xs">
                {mark}
                <span className="santo-caption-regular min-w-0 truncate text-text-tertiary">{meta}</span>
              </span>
            ) : (
              (mark ?? (brand && <BrandLogo brand={brand} size={24} variant="mark" fallbackSize={20} />))
            )}
            {isDefault && <Tag intent="brand">Padrão</Tag>}
          </div>
          {sep}
          <Cell title="Tipografia" col="font">
            <span className="santo-heading-6-semibold shrink-0 text-text-primary" style={fontStack ? ({ fontFamily: fontStack } as CSSProperties) : undefined}>
              Aa
            </span>
            <span title={font} className="santo-caption-regular min-w-0 truncate text-text-secondary">
              {font}
            </span>
          </Cell>
          {sep}
          <Cell title="Cor de marca" col="color">
            <Swatch color={viva(color)} size="md" title="Brand" />
            <Hex>{color.value}</Hex>
          </Cell>
          {sep}
          <Cell title="Neutros" col="neutrals">
            <Swatch color={viva(neutrals.light)} size="md" title={`Claro ${neutrals.light.value}`} />
            <Swatch color={viva(neutrals.dark)} size="md" title={`Escuro ${neutrals.dark.value}`} />
            <span className="flex min-w-0 flex-col">
              <Hex>{neutrals.light.value}</Hex>
              <Hex>{neutrals.dark.value}</Hex>
            </span>
          </Cell>
          {sep}
          <Cell title="Raio" col="radius">
            <span
              aria-hidden
              className="block size-(--santo-dimension-size-28) border-thin border-border-default bg-brand-subtle-default"
              style={{ borderRadius: viva(radius) }}
            />
            <Hex>{radius.value}</Hex>
          </Cell>
          {actions && (
            // Por cima do link esticado. Da md para cima somem até o hover ou o foco (sempre no toque); abaixo, sempre à vista.
            <div className={`santo-transition-opacity relative col-span-2 flex shrink-0 items-center justify-end gap-3xs md:ml-auto ${actionsVisible ? "" : "md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100 pointer-coarse:opacity-100"}`}>
              {actions}
            </div>
          )}
        </div>
      </Card>
    </section>
  );
}

/**
 * Ficha de ACAO no mesmo molde da BrandCard (criar um sistema, importar uma
 * marca): a mesma celula (Overline + linha de conteudo) e o mesmo padding, entao
 * a altura casa com as fichas irmas. O conteudo e o botao ou o campo inline.
 */
export function BrandCardAction({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card padding="md">
      <div className="flex min-w-0 flex-col justify-center gap-2xs px-sm">
        <Overline>{title}</Overline>
        <div className={ROW}>{children}</div>
      </div>
    </Card>
  );
}
