"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  PRESETS_FIXOS,
  RASCUNHO_PADRAO,
  type NeutrosDerivados,
  type NeutrosManuais,
  type Rascunho,
} from "@/lib/tokens/estudio.mjs";
import { oklch } from "@/lib/estudio/cor";
import { estudio, type passosDe, type Registro } from "@/lib/estudio/rascunho";
import { PresetsDoEstilo } from "./presets-estilo";
import {
  Field,
  Input,
  NumberField,
  Overline,
  RadioGroup,
  Segmented,
  StepRow,
  Swatch,
  SwatchPicker,
  Tag,
} from "@/lib/ui";

export type Passos = ReturnType<typeof passosDe>;
export type Editar = (fn: (r: Registro) => Registro) => void;
export type Aba = "presets" | "base" | "passos";

const ABAS: { value: Aba; label: string }[] = [
  { value: "presets", label: "Presets" },
  { value: "base", label: "Base" },
  { value: "passos", label: "Passos" },
];

/** Painel de um estilo, sem caixa: abas no topo e os problemas logo abaixo, direto sobre o chão. */
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
    // Sem caixa (Pedro): abas, seções e campos direto sobre o chão sunken do painel.
    <div className="flex min-w-0 flex-col gap-md">
      <Segmented
        block
        value={aba}
        onChange={setAba}
        options={ABAS.filter((a) => abas.includes(a.value))}
      />
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
    </div>
  );
}

/** Rótulo de preset: nome + valor em mono, na mesma linha. */
export function Rotulo({
  nome,
  valor,
  aviso,
}: {
  nome: string;
  valor: string;
  aviso?: string;
}) {
  return (
    <span className="flex min-w-0 flex-1 items-center justify-between gap-xs">
      <span className="flex min-w-0 items-center gap-xs">
        {nome}
        {aviso && <Tag intent="warning">{aviso}</Tag>}
      </span>
      <span className="santo-code-sm text-text-tertiary tabular-nums">
        {valor}
      </span>
    </span>
  );
}

/**
 * Campo de um passo: guarda o texto enquanto a pessoa digita e só confirma
 * inteiro ≥ 0. Campo vazio não apaga o passo (o reset é que volta ao derivado).
 */
export function CampoPasso({
  valor,
  rotulo,
  onValor,
}: {
  valor: number;
  rotulo: string;
  onValor: (n: number) => void;
}) {
  // `de`: o valor confirmado quando o texto foi digitado. Se o valor muda por
  // fora (desfazer, preset), o campo volta a mostrá-lo mesmo com foco.
  const [edicao, setEdicao] = useState<{ texto: string; de: number } | null>(
    null,
  );
  const mostrado =
    edicao && (edicao.de === valor || Number(edicao.texto) === valor)
      ? edicao.texto
      : String(valor);
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

export const semChave = (o: Record<string, unknown>, k: string) => {
  const resto = { ...o };
  delete resto[k];
  return resto;
};

/* ------------------------------------------------------------------- cor */

const PRESETS_NEUTROS = [
  { value: "cinza", label: "Cinza" },
  { value: "tingido", label: "Tingido" },
  { value: "quente", label: "Quente" },
] as const;
const ANCORAS = ["500", "600", "700"] as const;
const HEX = /^#[0-9a-f]{6}$/i;

/** Campo hex: confirma só #rrggbb completo; enquanto digita, guarda o texto. */
export function CampoHex({
  valor,
  onValor,
  rotulo,
  compacto,
}: {
  valor: string;
  onValor: (hex: string) => void;
  rotulo: string;
  compacto?: boolean;
}) {
  const [edicao, setEdicao] = useState<{ texto: string; de: string } | null>(
    null,
  );
  const mostrado = edicao && edicao.de === valor ? edicao.texto : valor;
  return (
    <Input
      mono
      size={compacto ? "sm" : "md"}
      value={mostrado}
      maxLength={7}
      aria-label={rotulo}
      invalid={!!edicao && !HEX.test(edicao.texto)}
      onBlur={() => setEdicao(null)}
      onChange={(e) => {
        const texto = e.target.value.trim();
        const ok = HEX.test(texto);
        setEdicao({ texto, de: ok ? texto.toLowerCase() : valor });
        if (ok) onValor(texto.toLowerCase());
      }}
      className={compacto ? "w-(--santo-dimension-space-96)" : "min-w-0 flex-1"}
    />
  );
}

type NeutrosCor = Rascunho["cor"]["neutros"];
const ehManual = (n: NeutrosCor): n is NeutrosManuais =>
  typeof n === "object" && "origem" in n && n.origem === "manual";
const presetDe = (n: NeutrosCor) =>
  typeof n === "string"
    ? n
    : typeof n === "object" &&
        "origem" in n &&
        n.origem === "derivada" &&
        !n.ajuste
      ? (n.preset ?? "")
      : "";
/** Ajuste inicial quando a pessoa pega no controle: o que o preset atual mais se parece (Cinza = sem tinta, sem saturação). */
const ajusteDe = (n: NeutrosCor) => {
  if (
    typeof n === "object" &&
    "origem" in n &&
    n.origem === "derivada" &&
    n.ajuste
  )
    return n.ajuste;
  return presetDe(n) === "cinza"
    ? { tinta: 0, saturacao: 0 }
    : { tinta: 100, saturacao: 100 };
};

const DEGRAUS_BRAND = [
  "50",
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900",
  "950",
] as const;
const DEGRAUS_NEUTRAL = ["0", ...DEGRAUS_BRAND, "1000"] as const;

export function PainelCor({
  registro,
  passos,
  editar,
  aba,
}: {
  registro: Registro;
  passos: Passos;
  editar: Editar;
  aba: Aba;
}) {
  const cor = {
    ...RASCUNHO_PADRAO.cor,
    ...(registro.base as Partial<Rascunho["cor"]>),
  };
  const passosCor = registro.overrides as {
    brand?: Record<string, string>;
    neutral?: Record<string, string>;
  };
  const muda = (patch: Partial<Rascunho["cor"]>) =>
    editar((r) => ({ ...r, base: { ...r.base, ...patch } }));
  // Neutros mexem na rampa gerada: qualquer ajuste deles liga a origem "marca".
  const neutros = (n: NeutrosCor) => muda({ neutros: n, origem: "marca" });
  const manual = ehManual(cor.neutros);
  const ajuste = ajusteDe(cor.neutros);
  // Miniatura de cada preset de neutros: o neutral/200·500·800 que ele daria com a cor atual.
  const amostras = useMemo(
    () =>
      Object.fromEntries(
        PRESETS_NEUTROS.map((p) => {
          const r = estudio.derivar({
            ...RASCUNHO_PADRAO,
            cor: { ...cor, origem: "marca", neutros: p.value },
          });
          return [
            p.value,
            r.ok
              ? [
                  String(r.spec.Palette["palette/neutral/200"]),
                  String(r.spec.Palette["palette/neutral/500"]),
                  String(r.spec.Palette["palette/neutral/800"]),
                ]
              : [],
          ];
        }),
      ),
    [cor.marca, cor.ancora], // eslint-disable-line react-hooks/exhaustive-deps
  );

  if (aba === "presets")
    return (
      <div className="flex flex-col gap-lg">
        <section className="flex flex-col gap-xs">
          <Overline>Marca</Overline>
          <PresetsDoEstilo
            estilo="cor"
            fixos={PRESETS_FIXOS.cor}
            atual={cor}
            passos={passosCor}
            normalizar={(d) => ({ ...RASCUNHO_PADRAO.cor, ...d })}
            aplicar={(dados, pp) =>
              editar(() => ({ base: dados, overrides: pp }))
            }
            leading={(d) => (
              <Swatch
                size="sm"
                round
                color={String(
                  (d as Partial<Rascunho["cor"]>).marca ??
                    RASCUNHO_PADRAO.cor.marca,
                )}
              />
            )}
            rotulo={({ nome, dados }) => (
              <Rotulo
                nome={nome}
                valor={String((dados as Partial<Rascunho["cor"]>).marca ?? "")}
              />
            )}
          />
        </section>
        <section className="flex flex-col gap-xs">
          <Overline>Neutros</Overline>
          <RadioGroup
            label="Preset de neutros"
            columns={1}
            value={
              presetDe(cor.neutros) as (typeof PRESETS_NEUTROS)[number]["value"]
            }
            onChange={(v) => neutros(v)}
            options={PRESETS_NEUTROS.map((p) => ({
              value: p.value,
              leading: (
                <span className="flex -space-x-2xs">
                  {amostras[p.value]?.map((hex, i) => (
                    <Swatch key={i} size="sm" round color={hex} />
                  ))}
                </span>
              ),
              label: p.label,
            }))}
          />
        </section>
      </div>
    );

  if (aba === "passos") {
    // Um passo por degrau das duas rampas: hex editável por cima do derivado, reset tira a chave.
    const linha = (familia: "brand" | "neutral", d: string) => {
      const hex = passos.paleta[familia][d];
      const editado = passosCor[familia]?.[d] !== undefined;
      const grava = (v: string) =>
        editar((r) => {
          const atual = r.overrides as typeof passosCor;
          return {
            ...r,
            overrides: {
              ...atual,
              [familia]: { ...(atual[familia] ?? {}), [d]: v },
            },
          };
        });
      return (
        <StepRow
          key={`${familia}-${d}`}
          name={`${familia}/${d}`}
          sample={
            <SwatchPicker
              size="md"
              showAlpha={false}
              label={`Escolher ${familia}/${d}`}
              color={hex}
              onChange={(v) => grava(v.slice(0, 7).toLowerCase())}
            />
          }
          overridden={editado}
          onReset={() =>
            editar((r) => {
              const atual = r.overrides as typeof passosCor;
              return {
                ...r,
                overrides: {
                  ...atual,
                  [familia]: semChave(atual[familia] ?? {}, d),
                },
              };
            })
          }
          resetLabel={`Voltar ${familia}/${d} ao derivado`}
        >
          <CampoHex
            compacto
            valor={hex}
            rotulo={`${familia}/${d} em hex`}
            onValor={grava}
          />
        </StepRow>
      );
    };
    return (
      <div className="flex flex-col gap-lg">
        <section className="flex flex-col">
          <Overline>Brand</Overline>
          {DEGRAUS_BRAND.map((d) => linha("brand", d))}
        </section>
        <section className="flex flex-col">
          <Overline>Neutral</Overline>
          {DEGRAUS_NEUTRAL.map((d) => linha("neutral", d))}
        </section>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-lg">
      <section className="flex flex-col gap-md">
        <Overline>Marca</Overline>
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
            <SwatchPicker
              size="lg"
              showAlpha={false}
              label="Escolher a cor da marca"
              color={cor.marca}
              onChange={(hex) =>
                muda({ marca: hex.slice(0, 7).toLowerCase(), origem: "marca" })
              }
            />
            <CampoHex
              valor={cor.marca}
              rotulo="Cor da marca em hex"
              onValor={(hex) => muda({ marca: hex, origem: "marca" })}
            />
          </span>
          <span className="santo-code-sm text-text-tertiary">
            {oklch(cor.marca)}
          </span>
        </Field>
        <Field label="Âncora">
          <Segmented
            block
            value={cor.ancora}
            onChange={(v) => muda({ ancora: v, origem: "marca" })}
            options={ANCORAS.map((a) => ({ value: a, label: `brand/${a}` }))}
          />
        </Field>
      </section>

      <section className="flex flex-col gap-md">
        <Overline>Neutros</Overline>
        <Segmented
          block
          value={manual ? "manual" : "derivada"}
          onChange={(v) =>
            neutros(
              v === "manual"
                ? { origem: "manual", base: passos.paleta.neutral["500"] }
                : { origem: "derivada", preset: "tingido" },
            )
          }
          options={[
            { value: "derivada", label: "Derivados da marca" },
            { value: "manual", label: "Manual" },
          ]}
        />
        {manual ? (
          <Field label="Cor base dos neutros">
            <span className="flex items-center gap-xs">
              <SwatchPicker
                size="lg"
                showAlpha={false}
                label="Escolher a cor base dos neutros"
                color={(cor.neutros as NeutrosManuais).base}
                onChange={(hex) =>
                  neutros({
                    origem: "manual",
                    base: hex.slice(0, 7).toLowerCase(),
                  })
                }
              />
              <CampoHex
                valor={(cor.neutros as NeutrosManuais).base}
                rotulo="Cor base dos neutros em hex"
                onValor={(hex) => neutros({ origem: "manual", base: hex })}
              />
            </span>
            <span className="santo-code-sm text-text-tertiary">
              {oklch((cor.neutros as NeutrosManuais).base)}
            </span>
          </Field>
        ) : (
          <>
            <NumberField
              layout="inline"
              label="Tinta"
              value={ajuste.tinta}
              min={0}
              max={100}
              unit="%"
              onChange={(n) =>
                neutros({
                  origem: "derivada",
                  preset: presetDe(cor.neutros) || undefined,
                  ajuste: { ...ajuste, tinta: Math.round(n) },
                } as NeutrosDerivados)
              }
            />
            <NumberField
              layout="inline"
              label="Saturação"
              value={ajuste.saturacao}
              min={0}
              max={300}
              unit="%"
              onChange={(n) =>
                neutros({
                  origem: "derivada",
                  preset: presetDe(cor.neutros) || undefined,
                  ajuste: { ...ajuste, saturacao: Math.round(n) },
                } as NeutrosDerivados)
              }
            />
          </>
        )}
      </section>
    </div>
  );
}
