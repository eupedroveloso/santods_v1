"use client";

import type { EffectStyleEntry, TextStyleEntry } from "@/lib/docs/catalog.types";
import { curto, degraus, DERIVADAS, papeisDe, sugestao, TEMAS, TRAVADAS, type Tema } from "@/lib/estudio/cor";
import type { AuditRow } from "@/lib/tokens/contrast-audit.mjs";
import { LockIcon } from "@/lib/icons";
import type { BrandSpec } from "@/lib/tokens/brand-mode.mjs";
import { aliasTarget, isAlias } from "@/lib/tokens/emit.mjs";
import type { Rascunho } from "@/lib/tokens/estudio.mjs";
import { NIVEIS_CONTROLE, NIVEIS_ESPACO, NIVEIS_RAIO, NIVEIS_SOMBRA, PAPEIS_TIPO, type passosDe } from "@/lib/estudio/rascunho";
import { Button, Card, CardGrid, Count, CopyCode, Icon, Input, Overline, Select, Swatch, Table, Tag, type Column } from "@/lib/ui";
import { EffectCard } from "../../estilos/_parts/effect-card";
import { StyleRow } from "../../estilos/_parts/style-row";
import type { SlimVariable } from "../../tokens/_parts/token-table";
import { TokenTableClient } from "../../tokens/_parts/token-table-client";

type Passos = ReturnType<typeof passosDe>;

const AMOSTRA = "Uma base única que se adapta a cada produto";

/** Origem do valor na spec: o alias da primitiva, ou nada quando é número cru (passo editado fora da régua). */
const origem = (spec: BrandSpec, nome: string) => {
  const v = spec.Brand[nome];
  return isAlias(v) ? aliasTarget(v) : null;
};

function Secao({ titulo, total, children, meta }: { titulo: string; total?: number; children: React.ReactNode; meta?: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-sm">
      <span className="flex items-center gap-xs">
        <Overline>{titulo}</Overline>
        {total !== undefined && <Count>{total}</Count>}
        {meta}
      </span>
      {children}
    </section>
  );
}

/** Raio: a mesma tabela de /tokens, alimentada pelos passos derivados do rascunho. */
export function DocRaio({ spec, passos }: { spec: BrandSpec; passos: Passos }) {
  const niveis = ["xs", "sm", "md", ...NIVEIS_RAIO.filter((n) => n !== "xs" && n !== "sm")];
  const linhas: SlimVariable[] = niveis.map((n) => ({
    slug: `estudio-radius-${n}`,
    name: `radius/${n}`,
    type: "FLOAT",
    cssVar: `--santo-radius-${n}`,
    tailwind: `rounded-${n}`,
    values: [{ css: `${passos.raio[n]}px`, alias: origem(spec, n === "md" ? "brand/shape/radius-base" : `brand/shape/radius-${n}`) }],
  }));
  return (
    <Secao titulo="Escala de raio" total={linhas.length}>
      <Card padding="md">
        <TokenTableClient variables={linhas} modes={["Rascunho"]} />
      </Card>
    </Secao>
  );
}

/** Espaço: 14 níveis, barra viva na var do escopo do rascunho. */
export function DocEspaco({ spec, passos }: { spec: BrandSpec; passos: Passos }) {
  const linhas: SlimVariable[] = NIVEIS_ESPACO.map((n) => ({
    slug: `estudio-space-${n}`,
    name: `space/${n}`,
    type: "FLOAT",
    cssVar: `--santo-space-${n}`,
    tailwind: `p-${n}`,
    values: [{ css: `${passos.espaco[n]}px`, alias: origem(spec, `brand/space/${n}`) }],
  }));
  return (
    <Secao titulo="Escala de espaço" total={linhas.length}>
      <Card padding="md">
        <TokenTableClient variables={linhas} modes={["Rascunho"]} />
      </Card>
    </Secao>
  );
}

/**
 * Tipografia: as linhas de /estilos/tipografia, um papel por linha no peso
 * regular, com família e tamanho/entrelinha do rascunho. A amostra usa a
 * própria classe santo-*, que lê as vars do escopo.
 */
export function DocTipografia({
  estilos,
  passos,
  tipografia,
}: {
  estilos: TextStyleEntry[];
  passos: Passos;
  tipografia: Rascunho["tipografia"];
}) {
  const linhas = PAPEIS_TIPO.flatMap((papel) => {
    const base = estilos.find((s) => s.role === papel && s.fontWeight === 400) ?? estilos.find((s) => s.role === papel);
    if (!base) return [];
    const [fontSize, lineHeight] = passos.tipo[papel];
    const family = papel.startsWith("heading") ? tipografia.titulo : tipografia.corpo;
    return [{ ...base, fontSize, lineHeight, family, name: `${family}/${papel}/regular` }];
  });
  return (
    <Secao titulo="Escala de tipo" total={linhas.length}>
      <Card padding="lg">
        <div className="flex flex-col">
          {linhas.map((s) => (
            <StyleRow key={s.slug} style={s} sample={AMOSTRA} />
          ))}
        </div>
      </Card>
    </Secao>
  );
}

/* ------------------------------------------------------------------- cor */

const TEMA_LABEL: Record<Tema, string> = { Light: "Claro", Dark: "Escuro" };
const razao = (n: number) => `${n.toFixed(2).replace(".", ",")} : 1`;
const cssVarDe = (degrau: string) => `--santo-${degrau.replace(/\//g, "-")}`;

/** Papéis de um degrau num tema: os três primeiros em texto, o resto na dica. */
function Papeis({ lista }: { lista: string[] }) {
  if (!lista.length) return <span className="santo-caption-regular text-text-disabled">—</span>;
  return (
    <span title={lista.join("\n")} className="santo-caption-regular line-clamp-2 text-text-secondary">
      {lista.slice(0, 3).join(" · ")}
      {lista.length > 3 && <span className="text-text-tertiary">{` +${lista.length - 3}`}</span>}
    </span>
  );
}

type LinhaRampa = { key: string; degrau: string; hex: string; ancora: boolean };

/** Uma rampa derivada: amostra viva, degrau, valor e os papéis que ele alimenta em cada tema. */
function Rampa({ familia, spec, ancora }: { familia: (typeof DERIVADAS)[number]; spec: BrandSpec; ancora?: string }) {
  const linhas: LinhaRampa[] = degraus(familia).map((d) => ({ key: d, degrau: d, hex: String(spec.Palette[d]), ancora: d === ancora }));
  const colunas: Column<LinhaRampa>[] = [
    { key: "amostra", header: "Cor", width: 72, render: (l) => <Swatch size="md" color={`var(${cssVarDe(l.degrau)})`} title={curto(l.degrau)} /> },
    {
      key: "degrau",
      header: "Degrau",
      width: 160,
      render: (l) => (
        <span className="flex items-center gap-xs">
          <span className="santo-body-small-medium text-text-primary">{curto(l.degrau)}</span>
          {l.ancora && <Tag intent="brand">âncora</Tag>}
        </span>
      ),
    },
    { key: "valor", header: "Valor", width: 120, render: (l) => <CopyCode value={l.hex} label={`Copiar ${l.hex}`} /> },
    ...TEMAS.map((t) => ({ key: t, header: TEMA_LABEL[t], width: 160 as const, render: (l: LinhaRampa) => <Papeis lista={papeisDe(l.degrau)[t]} /> })),
  ];
  return (
    <Card padding="md">
      <Table layout="fixed" columns={colunas} rows={linhas} />
    </Card>
  );
}

/** Famílias copiadas da base: só leitura, com o cadeado. */
function Travadas({ spec }: { spec: BrandSpec }) {
  return (
    <Card padding="md">
      <div className="flex flex-col">
        {TRAVADAS.map((f) => (
          <div key={f} className="flex min-w-0 items-center gap-sm border-b-thin border-border-subtle py-xs last:border-b-0">
            <span className="shrink-0 text-icon-tertiary" title="Travada: igual ao Santo">
              <LockIcon size={16} />
            </span>
            <span className="santo-body-small-medium w-(--santo-dimension-space-96) shrink-0 text-text-secondary">{f}</span>
            <span className="flex min-w-0 flex-1 flex-wrap gap-3xs">
              {degraus(f).map((d) => (
                <Swatch key={d} size="sm" color={String(spec.Palette[d])} title={`${curto(d)} · ${spec.Palette[d]}`} />
              ))}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

type LinhaPar = { key: string; tema: Tema; row: AuditRow };

/** Auditoria em destaque: todo par reprovado, nos dois temas, com o degrau que faria passar. */
function Contraste({ spec, auditoria }: { spec: BrandSpec; auditoria: Record<Tema, AuditRow[]> }) {
  const linhas: LinhaPar[] = TEMAS.flatMap((tema) =>
    auditoria[tema].filter((r) => !r.pass).map((row) => ({ key: `${tema}|${row.fg}|${row.bg}`, tema, row })),
  );
  const colunas: Column<LinhaPar>[] = [
    { key: "tema", header: "Tema", width: 80, render: (l) => <Tag>{TEMA_LABEL[l.tema]}</Tag> },
    {
      key: "par",
      header: "Par",
      width: 240,
      render: (l) => (
        <span className="flex min-w-0 items-center gap-xs">
          <span className="flex shrink-0 -space-x-2xs">
            <Swatch size="sm" round color={l.row.bgHex} title={curto(l.row.bg)} />
            <Swatch size="sm" round color={l.row.fgHex} title={curto(l.row.fg)} />
          </span>
          <span className="flex min-w-0 flex-col">
            <span className="santo-body-small-medium truncate text-text-primary">{curto(l.row.fg)}</span>
            <span className="santo-caption-regular truncate text-text-tertiary">{`sobre ${curto(l.row.bg)}`}</span>
          </span>
        </span>
      ),
    },
    {
      key: "razao",
      header: "Razão",
      width: 144,
      render: (l) => (
        <span className="flex items-center gap-2xs">
          <Tag intent={l.row.knownDebt ? "warning" : "danger"}>{razao(l.row.ratio)}</Tag>
          <span className="santo-caption-small-regular text-text-tertiary">{`mín. ${String(l.row.min).replace(".", ",")}`}</span>
        </span>
      ),
    },
    {
      key: "sugestao",
      header: "Passa com",
      width: 192,
      render: (l) => {
        const s = sugestao(spec, l.row, l.tema);
        if (!s) return <span className="santo-caption-regular text-text-disabled">sem degrau na rampa</span>;
        return (
          <span className="flex items-center gap-xs" title={`${s.lado === "fg" ? "Primeiro plano" : "Fundo"} em ${curto(s.degrau)}`}>
            <Swatch size="sm" color={String(spec.Palette[s.degrau])} />
            <span className="santo-code-sm text-text-primary">{curto(s.degrau)}</span>
            <span className="santo-caption-small-regular text-text-success tabular-nums">{razao(s.ratio)}</span>
          </span>
        );
      },
    },
  ];
  return (
    <Secao
      titulo="Contraste"
      meta={
        <>
          {TEMAS.map((t) => (
            <Tag key={t} intent={linhas.some((l) => l.tema === t) ? "danger" : "success"} dot>
              {`${TEMA_LABEL[t]} ${auditoria[t].filter((r) => !r.pass).length}`}
            </Tag>
          ))}
        </>
      }
    >
      <Card padding="md">
        {linhas.length ? (
          <Table layout="fixed" columns={colunas} rows={linhas} />
        ) : (
          <Tag intent="success" dot>
            Todos os pares passam
          </Tag>
        )}
      </Card>
    </Secao>
  );
}

export function DocCor({ spec, auditoria, ancora }: { spec: BrandSpec; auditoria: Record<Tema, AuditRow[]>; ancora?: string }) {
  return (
    <>
      <Contraste spec={spec} auditoria={auditoria} />
      <Secao titulo="Rampa brand" total={degraus("brand").length}>
        <Rampa familia="brand" spec={spec} ancora={ancora} />
      </Secao>
      <Secao titulo="Rampa neutral" total={degraus("neutral").length}>
        <Rampa familia="neutral" spec={spec} />
      </Secao>
      <Secao titulo="Travadas" total={TRAVADAS.length}>
        <Travadas spec={spec} />
      </Secao>
    </>
  );
}

/* ---------------------------------------------------------------- sombra */

/**
 * Sombra: os cartões de /estilos/efeitos, um por nível, com a cor das
 * camadas que o rascunho derivou. A amostra lê a var do escopo.
 */
export function DocSombra({ efeitos, passos }: { efeitos: EffectStyleEntry[]; passos: Passos }) {
  const cartoes = efeitos.map((e) => {
    const cores = passos.sombra[e.name as (typeof NIVEIS_SOMBRA)[number]];
    return cores ? { ...e, layers: e.layers.map((l, i) => ({ ...l, color: cores[i] ?? l.color })) } : e;
  });
  return (
    <Secao titulo="Níveis de sombra" total={cartoes.length}>
      <CardGrid columns={{ md: 2, "2xl": 3 }} gap="md">
        {cartoes.map((e) => (
          <EffectCard key={e.slug} effect={e} />
        ))}
      </CardGrid>
    </Secao>
  );
}

/* ------------------------------------------------------------- controles */

const OPCOES = [
  { value: "mensal", label: "Mensal" },
  { value: "anual", label: "Anual" },
];

/** Uma fileira por altura: botão, campo e seletor lado a lado, para conferir que alinham. */
export function DocControles({ passos }: { passos: Passos }) {
  return (
    <Secao titulo="Alturas de controle" total={NIVEIS_CONTROLE.length}>
      <Card padding="lg">
        <div className="flex flex-col">
          {NIVEIS_CONTROLE.map((n) => (
            <div key={n} className="flex flex-wrap items-center gap-sm border-b-thin border-border-subtle py-md first:pt-0 last:border-b-0 last:pb-0">
              <span className="flex w-(--santo-dimension-space-128) shrink-0 flex-col">
                <span className="santo-code-sm text-text-primary">{`control/height/${n}`}</span>
                <span className="santo-caption-regular text-text-tertiary tabular-nums">{`${passos.controles[n]}px`}</span>
              </span>
              <Button size={n} variant="primary" leading={<Icon.Plus size={16} />}>
                Criar
              </Button>
              {/* O Input ocupa a largura do pai: a caixa fixa é que o põe lado a lado com os outros. */}
              <span className="w-(--santo-dimension-space-160) shrink-0">
                <Input size={n} placeholder="Nome" aria-label={`Campo ${n}`} />
              </span>
              <Select size={n} label={`Seletor ${n}`} value="mensal" onChange={() => undefined} options={OPCOES} />
            </div>
          ))}
        </div>
      </Card>
    </Secao>
  );
}
