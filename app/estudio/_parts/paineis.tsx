"use client";

import { useMemo, useState, type ReactNode } from "react";
import { FONT_CATALOG, googleFontUrl } from "@/lib/fonts/catalog";
import { PRESETS, RASCUNHO_PADRAO, type Rascunho } from "@/lib/tokens/estudio.mjs";
import { oklch } from "@/lib/estudio/cor";
import {
  estudio,
  NIVEIS_CONTROLE,
  NIVEIS_ESPACO,
  NIVEIS_RAIO,
  NIVEIS_SOMBRA,
  PAPEIS_TIPO,
  formula,
  type passosDe,
  type Registro,
} from "@/lib/estudio/rascunho";
import { Card, Field, Input, NumberField, Overline, RadioGroup, Segmented, Select, StepRow, Swatch, SwatchPicker, Tag, TokenSample } from "@/lib/ui";

type Passos = ReturnType<typeof passosDe>;
type Editar = (fn: (r: Registro) => Registro) => void;
export type Aba = "presets" | "base" | "passos";

const ABAS: { value: Aba; label: string }[] = [
  { value: "presets", label: "Presets" },
  { value: "base", label: "Base" },
  { value: "passos", label: "Passos" },
];

/** Moldura dos três painéis de um estilo: abas no cabeçalho da borda dupla, problemas no topo do painel. */
export function PainelAjustes({
  problems,
  abas = ["presets", "base", "passos"],
  children,
}: {
  problems: string[];
  /** Abas que o estilo tem (Cor não tem passos; Controles não tem base). */
  abas?: Aba[];
  children: (aba: Aba) => ReactNode;
}) {
  const [aba, setAba] = useState<Aba>(abas[0]);
  return (
    <Card
      variant="double"
      padding="md"
      header={<Segmented block value={aba} onChange={setAba} options={ABAS.filter((a) => abas.includes(a.value))} className="flex-1" />}
    >
      {problems.length > 0 && (
        <ul role="alert" className="flex flex-col gap-3xs">
          {problems.map((p) => (
            <li key={p} className="santo-caption-medium text-text-danger">
              {p}
            </li>
          ))}
        </ul>
      )}
      {children(aba)}
    </Card>
  );
}

/** Rótulo de preset: nome + valor em mono, na mesma linha. */
function Rotulo({ nome, valor, aviso }: { nome: string; valor: string; aviso?: string }) {
  return (
    <span className="flex min-w-0 flex-1 items-center justify-between gap-xs">
      <span className="flex min-w-0 items-center gap-xs">
        {nome}
        {aviso && <Tag intent="warning">{aviso}</Tag>}
      </span>
      <span className="santo-code-sm text-text-tertiary tabular-nums">{valor}</span>
    </span>
  );
}

/**
 * Campo de um passo: guarda o texto enquanto a pessoa digita e só confirma
 * inteiro ≥ 0. Campo vazio não apaga o passo (o reset é que volta ao derivado).
 */
function CampoPasso({ valor, rotulo, onValor }: { valor: number; rotulo: string; onValor: (n: number) => void }) {
  // `de`: o valor confirmado quando o texto foi digitado. Se o valor muda por
  // fora (desfazer, preset), o campo volta a mostrá-lo mesmo com foco.
  const [edicao, setEdicao] = useState<{ texto: string; de: number } | null>(null);
  const mostrado = edicao && (edicao.de === valor || Number(edicao.texto) === valor) ? edicao.texto : String(valor);
  return (
    <Input
      size="sm"
      mono
      type="number"
      inputMode="numeric"
      min={0}
      step={1}
      value={mostrado}
      aria-label={rotulo}
      onBlur={() => setEdicao(null)}
      onChange={(e) => {
        const texto = e.target.value;
        const n = Number(texto);
        const valido = texto !== "" && Number.isInteger(n) && n >= 0;
        setEdicao({ texto, de: valido ? n : valor });
        if (valido) onValor(n);
      }}
      className="w-(--santo-dimension-space-72) text-right"
    />
  );
}

const semChave = (o: Record<string, unknown>, k: string) => {
  const resto = { ...o };
  delete resto[k];
  return resto;
};

/* ------------------------------------------------------------------ raio */

const PRESETS_RAIO = [
  { value: "reto", label: "Reto" },
  { value: "suave", label: "Suave" },
  { value: "padrao", label: "Padrão" },
  { value: "arredondado", label: "Arredondado" },
] as const;

export function PainelRaio({ registro, passos, editar, aba }: { registro: Registro; passos: Passos; editar: Editar; aba: Aba }) {
  const base = (registro.base.valor as number | undefined) ?? RASCUNHO_PADRAO.raio;
  const over = registro.overrides as Record<string, number>;
  const ativo = Object.keys(over).length ? "" : (PRESETS_RAIO.find((p) => PRESETS.raio[p.value] === base)?.value ?? "");

  if (aba === "presets")
    return (
      <RadioGroup
        label="Preset de raio"
        columns={1}
        value={ativo as (typeof PRESETS_RAIO)[number]["value"]}
        onChange={(v) => editar(() => ({ base: { valor: PRESETS.raio[v] }, overrides: {} }))}
        options={PRESETS_RAIO.map((p) => ({
          value: p.value,
          leading: <TokenSample variant="corner" value={`var(--santo-dimension-radius-${PRESETS.raio[p.value]})`} scale={2} />,
          label: <Rotulo nome={p.label} valor={`${PRESETS.raio[p.value]}px`} aviso={p.value === "arredondado" ? "pílula em 24px" : undefined} />,
        }))}
      />
    );

  if (aba === "base")
    return (
      <NumberField
        label="radius/md"
        value={base}
        min={0}
        max={16}
        unit="px"
        field
        onChange={(n) => editar((r) => ({ ...r, base: { valor: n } }))}
      />
    );

  return (
    <div className="flex flex-col">
      {(["xs", "sm", "md", ...NIVEIS_RAIO.filter((n) => n !== "xs" && n !== "sm")] as const).map((n) => (
        <StepRow
          key={n}
          name={`radius/${n}`}
          sample={<TokenSample variant="radius" value={`var(--santo-radius-${n})`} />}
          unit="px"
          overridden={n !== "md" && over[n] !== undefined}
          // md é a base: nunca "editado", mas reserva o lugar do reset para a coluna alinhar.
          onReset={n === "md" ? () => undefined : () => editar((r) => ({ ...r, overrides: semChave(r.overrides, n) }))}
          resetLabel={n === "md" ? undefined : `Voltar radius/${n} a ${formula.raio(base, n)}px`}
        >
          <CampoPasso
            valor={passos.raio[n]}
            rotulo={`radius/${n} em px`}
            onValor={(v) =>
              editar((r) => (n === "md" ? { ...r, base: { valor: v } } : { ...r, overrides: { ...r.overrides, [n]: v } }))
            }
          />
        </StepRow>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------- espaço */

const PRESETS_ESPACO = [
  { value: "compacta", label: "Compacta" },
  { value: "padrao", label: "Padrão" },
  { value: "confortavel", label: "Confortável" },
] as const;

export function PainelEspaco({ registro, passos, editar, aba }: { registro: Registro; passos: Passos; editar: Editar; aba: Aba }) {
  const unidade = (registro.base.valor as number | undefined) ?? RASCUNHO_PADRAO.espaco;
  const over = registro.overrides as Record<string, number>;
  const ativo = Object.keys(over).length ? "" : (PRESETS_ESPACO.find((p) => PRESETS.densidade[p.value] === unidade)?.value ?? "");

  if (aba === "presets")
    return (
      <RadioGroup
        label="Preset de densidade"
        columns={1}
        value={ativo as (typeof PRESETS_ESPACO)[number]["value"]}
        onChange={(v) => editar(() => ({ base: { valor: PRESETS.densidade[v] }, overrides: {} }))}
        options={PRESETS_ESPACO.map((p) => ({
          value: p.value,
          // Miniatura: a barra do space/md que o preset dá (unidade × 4: 12, 16, 20).
          leading: <TokenSample variant="bar" value={`var(--santo-dimension-space-${PRESETS.densidade[p.value] * 4})`} />,
          label: <Rotulo nome={p.label} valor={`${PRESETS.densidade[p.value]}px`} />,
        }))}
      />
    );

  if (aba === "base")
    return (
      <NumberField
        label="Unidade"
        value={unidade}
        min={2}
        max={8}
        unit="px"
        field
        onChange={(n) => editar((r) => ({ ...r, base: { valor: n } }))}
      />
    );

  return (
    <div className="flex flex-col">
      {NIVEIS_ESPACO.map((n) => (
        <StepRow
          key={n}
          name={`space/${n}`}
          unit="px"
          overridden={over[n] !== undefined}
          onReset={() => editar((r) => ({ ...r, overrides: semChave(r.overrides, n) }))}
          resetLabel={`Voltar space/${n} a ${formula.espaco(unidade, n)}px`}
        >
          <CampoPasso
            valor={passos.espaco[n]}
            rotulo={`space/${n} em px`}
            onValor={(v) => editar((r) => ({ ...r, overrides: { ...r.overrides, [n]: v } }))}
          />
        </StepRow>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------ tipografia */

const PRESETS_ESCALA = [
  { value: "compacta", label: "Compacta", base: 14 },
  { value: "santo", label: "Santo", base: 16 },
  { value: "editorial", label: "Editorial", base: 18 },
] as const;
const BASES = [14, 16, 18] as const;
const RAZOES = [1.2, 1.25, 1.333] as const;

const fontes = (categoria: "mono" | "texto") =>
  FONT_CATALOG.filter((f) => (categoria === "mono" ? f.category === "mono" : f.category !== "mono")).map((f) => ({
    value: f.family,
    label: f.family,
    labelStyle: { fontFamily: `"${f.family}"` },
  }));

/** Carrega as famílias dos presets: o rótulo de cada um aparece na própria fonte. */
function FontesDosPresets() {
  return (
    <>
      {[...new Set(PRESETS.familias.flatMap((f) => [f.corpo, f.titulo]))].map((f) => {
        const href = googleFontUrl(f);
        return href ? <link key={f} rel="stylesheet" href={href} precedence="default" /> : null;
      })}
    </>
  );
}

export function PainelTipografia({ registro, passos, editar, aba }: { registro: Registro; passos: Passos; editar: Editar; aba: Aba }) {
  const t = { ...RASCUNHO_PADRAO.tipografia, ...(registro.base as Partial<Rascunho["tipografia"]>) };
  const over = registro.overrides as Record<string, [number, number]>;
  const livre = typeof t.escala === "object" && !Array.isArray(t.escala) ? t.escala : null;
  const escalaAtiva = typeof t.escala === "string" && !Object.keys(over).length ? t.escala : "";
  const familiaAtiva = PRESETS.familias.find((f) => f.corpo === t.corpo && f.titulo === t.titulo && f.mono === t.mono)?.nome ?? "";
  const base = (patch: Partial<Rascunho["tipografia"]>, limpa = false) =>
    editar((r) => ({ base: { ...r.base, ...patch }, overrides: limpa ? {} : r.overrides }));

  if (aba === "presets")
    return (
      <div className="flex flex-col gap-md">
        <FontesDosPresets />
        <div className="flex flex-col gap-xs">
          <Overline>Escala</Overline>
          <RadioGroup
            label="Preset de escala"
            columns={1}
            value={escalaAtiva as (typeof PRESETS_ESCALA)[number]["value"]}
            onChange={(v) => base({ escala: v }, true)}
            options={PRESETS_ESCALA.map((p) => ({
              value: p.value,
              leading: <TokenSample variant="text" property="fontSize" value={`var(--santo-type-size-${p.base})`} />,
              label: <Rotulo nome={p.label} valor={`${p.base}px`} />,
            }))}
          />
        </div>
        <div className="flex flex-col gap-xs">
          <Overline>Famílias</Overline>
          <RadioGroup
            label="Preset de famílias"
            columns={2}
            value={familiaAtiva}
            onChange={(nome) => {
              const f = PRESETS.familias.find((x) => x.nome === nome)!;
              base({ corpo: f.corpo, titulo: f.titulo, mono: f.mono });
            }}
            options={PRESETS.familias.map((f) => ({
              value: f.nome,
              label: f.nome,
              labelStyle: { fontFamily: `"${f.corpo}"` },
            }))}
          />
        </div>
      </div>
    );

  if (aba === "base")
    return (
      <div className="flex flex-col gap-md">
        <Field label="Título">
          <Select label="Família do título" value={t.titulo} onChange={(v) => base({ titulo: v })} options={fontes("texto")} />
        </Field>
        <Field label="Corpo">
          <Select label="Família do corpo" value={t.corpo} onChange={(v) => base({ corpo: v })} options={fontes("texto")} />
        </Field>
        <Field label="Mono">
          <Select label="Família mono" value={t.mono} onChange={(v) => base({ mono: v })} options={fontes("mono")} />
        </Field>
        <Field label="Corpo base">
          <Segmented
            block
            value={String(livre?.base ?? passos.tipo.body[0]) as `${(typeof BASES)[number]}`}
            onChange={(v) => base({ escala: { base: Number(v), razao: livre?.razao ?? 1.25 } }, true)}
            options={BASES.map((b) => ({ value: String(b) as `${typeof b}`, label: `${b}px` }))}
          />
        </Field>
        <Field label="Razão">
          <Segmented
            block
            value={String(livre?.razao ?? "") as `${(typeof RAZOES)[number]}`}
            onChange={(v) => base({ escala: { base: livre?.base ?? passos.tipo.body[0], razao: Number(v) } }, true)}
            options={RAZOES.map((r) => ({ value: String(r) as `${typeof r}`, label: String(r).replace(".", ",") }))}
          />
        </Field>
      </div>
    );

  return (
    <div className="flex flex-col">
      {PAPEIS_TIPO.map((p) => {
        const [size, lead] = passos.tipo[p];
        const muda = (i: 0 | 1, v: number) =>
          editar((r) => {
            const atual = (r.overrides[p] as [number, number] | undefined) ?? [size, lead];
            const novo: [number, number] = i === 0 ? [v, atual[1]] : [atual[0], v];
            return { ...r, overrides: { ...r.overrides, [p]: novo } };
          });
        return (
          <StepRow
            key={p}
            name={p}
            unit="px"
            overridden={over[p] !== undefined}
            onReset={() => editar((r) => ({ ...r, overrides: semChave(r.overrides, p) }))}
            resetLabel={`Voltar ${p} à escala`}
          >
            <CampoPasso valor={size} rotulo={`${p}: tamanho em px`} onValor={(v) => muda(0, v)} />
            <CampoPasso valor={lead} rotulo={`${p}: entrelinha em px`} onValor={(v) => muda(1, v)} />
          </StepRow>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------- cor */

const PRESETS_NEUTROS = [
  { value: "cinza", label: "Cinza" },
  { value: "tingido", label: "Tingido" },
  { value: "quente", label: "Quente" },
] as const;
const ANCORAS = ["500", "600", "700"] as const;
const HEX = /^#[0-9a-f]{6}$/i;

/** Campo hex da âncora: confirma só #rrggbb completo; enquanto digita, guarda o texto. */
function CampoHex({ valor, onValor }: { valor: string; onValor: (hex: string) => void }) {
  const [edicao, setEdicao] = useState<{ texto: string; de: string } | null>(null);
  const mostrado = edicao && edicao.de === valor ? edicao.texto : valor;
  return (
    <Input
      mono
      value={mostrado}
      maxLength={7}
      aria-label="Cor da marca em hex"
      invalid={!!edicao && !HEX.test(edicao.texto)}
      onBlur={() => setEdicao(null)}
      onChange={(e) => {
        const texto = e.target.value.trim();
        const ok = HEX.test(texto);
        setEdicao({ texto, de: ok ? texto.toLowerCase() : valor });
        if (ok) onValor(texto.toLowerCase());
      }}
      className="min-w-0 flex-1"
    />
  );
}

export function PainelCor({ registro, editar, aba }: { registro: Registro; editar: Editar; aba: Aba }) {
  const cor = { ...RASCUNHO_PADRAO.cor, ...(registro.base as Partial<Rascunho["cor"]>) };
  const muda = (patch: Partial<Rascunho["cor"]>) => editar((r) => ({ ...r, base: { ...r.base, ...patch } }));
  // Miniatura de cada preset de neutros: o neutral/500 que ele daria com a cor atual.
  const amostras = useMemo(
    () =>
      Object.fromEntries(
        PRESETS_NEUTROS.map((p) => {
          const r = estudio.derivar({ ...RASCUNHO_PADRAO, cor: { ...cor, origem: "marca", neutros: p.value } });
          return [p.value, r.ok ? [String(r.spec.Palette["palette/neutral/200"]), String(r.spec.Palette["palette/neutral/500"]), String(r.spec.Palette["palette/neutral/800"])] : []];
        }),
      ),
    [cor.marca, cor.ancora], // eslint-disable-line react-hooks/exhaustive-deps
  );

  if (aba === "presets")
    return (
      <div className="flex flex-col gap-xs">
        <Overline>Neutros</Overline>
        <RadioGroup
          label="Preset de neutros"
          columns={1}
          value={(typeof cor.neutros === "string" ? cor.neutros : "") as (typeof PRESETS_NEUTROS)[number]["value"]}
          // Neutros derivados pedem a rampa gerada: o preset liga a origem "marca".
          onChange={(v) => muda({ neutros: v, origem: "marca" })}
          options={PRESETS_NEUTROS.map((p) => ({
            value: p.value,
            leading: (
              <span className="flex -space-x-2xs">
                {amostras[p.value]?.map((hex, i) => <Swatch key={i} size="sm" round color={hex} />)}
              </span>
            ),
            label: p.label,
          }))}
        />
      </div>
    );

  return (
    <div className="flex flex-col gap-md">
      <Field label="Origem">
        <Segmented
          block
          value={cor.origem}
          onChange={(v) => muda({ origem: v })}
          options={[
            { value: "base", label: "Paleta do Santo" },
            { value: "marca", label: "Pela marca" },
          ]}
        />
      </Field>
      <Field label="Cor da marca">
        <span className="flex items-center gap-xs">
          <SwatchPicker size="lg" showAlpha={false} label="Escolher a cor da marca" color={cor.marca} onChange={(hex) => muda({ marca: hex.slice(0, 7).toLowerCase(), origem: "marca" })} />
          <CampoHex valor={cor.marca} onValor={(hex) => muda({ marca: hex, origem: "marca" })} />
        </span>
        <span className="santo-code-sm text-text-tertiary">{oklch(cor.marca)}</span>
      </Field>
      <Field label="Âncora">
        <Segmented
          block
          value={cor.ancora}
          onChange={(v) => muda({ ancora: v, origem: "marca" })}
          options={ANCORAS.map((a) => ({ value: a, label: `brand/${a}` }))}
        />
      </Field>
    </div>
  );
}

/* ---------------------------------------------------------------- sombra */

const PRESETS_SOMBRA = [
  { value: "suave", label: "Suave" },
  { value: "padrao", label: "Padrão" },
  { value: "marcada", label: "Marcada" },
] as const;
const vezes = (n: number) => `×${String(Math.round(n * 100) / 100).replace(".", ",")}`;

export function PainelSombra({ registro, passos, editar, aba }: { registro: Registro; passos: Passos; editar: Editar; aba: Aba }) {
  const sombra = { ...RASCUNHO_PADRAO.sombra, ...(registro.base as Partial<Rascunho["sombra"]>) };
  const over = registro.overrides as Record<string, number>;
  const ativo = Object.keys(over).length ? "" : (PRESETS_SOMBRA.find((p) => PRESETS.sombra[p.value] === sombra.intensidade)?.value ?? "");

  if (aba === "presets")
    return (
      <RadioGroup
        label="Preset de intensidade"
        columns={1}
        value={ativo as (typeof PRESETS_SOMBRA)[number]["value"]}
        onChange={(v) => editar((r) => ({ base: { ...r.base, intensidade: PRESETS.sombra[v] }, overrides: {} }))}
        options={PRESETS_SOMBRA.map((p) => ({ value: p.value, label: <Rotulo nome={p.label} valor={vezes(PRESETS.sombra[p.value])} /> }))}
      />
    );

  if (aba === "base")
    return (
      <div className="flex flex-col gap-md">
        <NumberField
          label="Intensidade"
          value={sombra.intensidade}
          min={0}
          max={2}
          step={0.1}
          field
          format={(n) => vezes(n)}
          onChange={(n) => editar((r) => ({ ...r, base: { ...r.base, intensidade: Math.round(n * 10) / 10 } }))}
        />
        <Field label="Tinta">
          <Segmented
            block
            value={sombra.tinta}
            onChange={(v) => editar((r) => ({ ...r, base: { ...r.base, tinta: v } }))}
            options={[
              { value: "atual", label: "Neutra" },
              { value: "marca", label: "Pela marca" },
            ]}
          />
        </Field>
      </div>
    );

  return (
    <div className="flex flex-col">
      {NIVEIS_SOMBRA.map((n) => (
        <StepRow
          key={n}
          name={`shadow/${n}`}
          overridden={over[n] !== undefined}
          onReset={() => editar((r) => ({ ...r, overrides: semChave(r.overrides, n) }))}
          resetLabel={`Voltar shadow/${n} a ${vezes(sombra.intensidade)}`}
        >
          <span className="flex -space-x-2xs" title={passos.sombra[n].join(" · ")}>
            {passos.sombra[n].map((c, i) => (
              <Swatch key={i} size="sm" round color={c} />
            ))}
          </span>
          <CampoIntensidade
            valor={over[n] ?? sombra.intensidade}
            rotulo={`Intensidade de shadow/${n}`}
            onValor={(v) => editar((r) => ({ ...r, overrides: { ...r.overrides, [n]: v } }))}
          />
        </StepRow>
      ))}
    </div>
  );
}

/** Intensidade de um nível: decimal ≥ 0 (vírgula ou ponto). */
function CampoIntensidade({ valor, rotulo, onValor }: { valor: number; rotulo: string; onValor: (n: number) => void }) {
  const [edicao, setEdicao] = useState<{ texto: string; de: number } | null>(null);
  const mostrado = edicao && edicao.de === valor ? edicao.texto : String(valor).replace(".", ",");
  return (
    <Input
      size="sm"
      mono
      inputMode="decimal"
      value={mostrado}
      aria-label={rotulo}
      onBlur={() => setEdicao(null)}
      onChange={(e) => {
        const texto = e.target.value;
        const n = Number(texto.replace(",", "."));
        const valido = texto.trim() !== "" && Number.isFinite(n) && n >= 0;
        setEdicao({ texto, de: valido ? n : valor });
        if (valido) onValor(n);
      }}
      className="w-(--santo-dimension-space-72) text-right"
    />
  );
}

/* ------------------------------------------------------------- controles */

const PRESETS_CONTROLES = [
  { value: "compacto", label: "Compacto" },
  { value: "padrao", label: "Padrão" },
  { value: "amplo", label: "Confortável" },
] as const;

export function PainelControles({ registro, passos, editar, aba }: { registro: Registro; passos: Passos; editar: Editar; aba: Aba }) {
  const valor = (registro.base.valor as Rascunho["controles"] | undefined) ?? RASCUNHO_PADRAO.controles;
  const over = registro.overrides as Record<string, number>;
  const ativo = typeof valor === "string" && !Object.keys(over).length ? valor : "";
  const base = typeof valor === "string" ? PRESETS.controles[valor] : valor;

  if (aba === "presets")
    return (
      <RadioGroup
        label="Preset de controles"
        columns={1}
        value={ativo as (typeof PRESETS_CONTROLES)[number]["value"]}
        onChange={(v) => editar(() => ({ base: { valor: v }, overrides: {} }))}
        options={PRESETS_CONTROLES.map((p) => ({
          value: p.value,
          label: <Rotulo nome={p.label} valor={PRESETS.controles[p.value].join("/")} />,
        }))}
      />
    );

  return (
    <div className="flex flex-col">
      {NIVEIS_CONTROLE.map((n, i) => (
        <StepRow
          key={n}
          name={n}
          unit="px"
          overridden={over[n] !== undefined}
          onReset={() => editar((r) => ({ ...r, overrides: semChave(r.overrides, n) }))}
          resetLabel={`Voltar control/height/${n} a ${base[i]}px`}
        >
          <CampoPasso
            valor={passos.controles[n]}
            rotulo={`control/height/${n} em px`}
            onValor={(v) => editar((r) => ({ ...r, overrides: { ...r.overrides, [n]: v } }))}
          />
        </StepRow>
      ))}
    </div>
  );
}
