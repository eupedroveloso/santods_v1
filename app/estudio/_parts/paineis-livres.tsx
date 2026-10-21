"use client";

import { useState } from "react";
import { NIVEIS_CONTROLE, NIVEIS_ESPACO, NIVEIS_RAIO, NIVEIS_SOMBRA, type Registro } from "@/lib/estudio/rascunho";
import {
  controlesDe,
  espacoDe,
  espacoNivel,
  PRESETS_CONTROLES,
  PRESETS_FIXOS,
  raioDe,
  raioNivel,
  RASCUNHO_PADRAO,
  sombraDe,
  type AuditoriaControles,
  type ControleTamanho,
  type Espaco,
  type NivelSombra,
  type Raio,
  type Sombra,
  type Superficies,
  BORDAS,
  NEUTRAL_DEGRAUS,
  PRESETS_SUPERFICIES,
  SUPERFICIES,
  VIDRO_PADRAO,
} from "@/lib/tokens/estudio.mjs";
import { Field, Icon, IconButton, NumberField, Overline, Segmented, Select, StepRow, Swatch, SwatchPicker, Switch, Tag, TokenSample } from "@/lib/ui";
import { CampoHex, CampoPasso, Rotulo, semChave, type Aba, type Editar, type Passos } from "./paineis";
import { PresetsDoEstilo } from "./presets-estilo";

type Props = { registro: Registro; passos: Passos; editar: Editar; aba: Aba };

const decimal = (n: number) => String(Math.round(n * 100) / 100).replace(".", ",");
const vezes = (n: number) => `×${decimal(n)}`;
/** Degraus de dimension/radius/* (a miniatura de canto só usa token). */
const RAIOS_PRIMITIVOS = new Set([0, 4, 8, 12, 16, 20, 24, 32]);

/** Curva: a do Santo (fatores do contrato), linear (só espaço) ou uma razão livre. */
function Curva<C extends string>({
  valor,
  opcoes,
  razao,
  onCurva,
  onRazao,
  rotulo,
}: {
  valor: C | "razao";
  opcoes: { value: C | "razao"; label: string }[];
  razao: number;
  onCurva: (c: C | "razao") => void;
  onRazao: (n: number) => void;
  rotulo: string;
}) {
  return (
    <div className="flex flex-col gap-sm">
      <Field label={rotulo}>
        <Segmented block value={valor} onChange={onCurva} options={opcoes} />
      </Field>
      {valor === "razao" && (
        <NumberField layout="inline" label="Razão" value={razao} min={1.05} max={3} step={0.05} format={decimal} onChange={(n) => onRazao(Math.round(n * 100) / 100)} />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ raio */

export function PainelRaio({ registro, passos, editar, aba }: Props) {
  const r = raioDe((registro.base.valor as number | Raio | undefined) ?? RASCUNHO_PADRAO.raio);
  const over = registro.overrides as Record<string, number>;
  const muda = (patch: Partial<Raio>) => editar((x) => ({ ...x, base: { valor: { ...r, ...patch } } }));
  const curva = r.curva === "santo" ? "santo" : "razao";

  if (aba === "presets")
    return (
      <PresetsDoEstilo
        estilo="raio"
        fixos={PRESETS_FIXOS.raio}
        atual={r}
        passos={over}
        normalizar={(d) => raioDe(d as Raio)}
        aplicar={(dados, pp) => editar(() => ({ base: { valor: dados }, overrides: pp }))}
        leading={(d) => {
          const c = raioDe(d as Raio).container;
          return RAIOS_PRIMITIVOS.has(c) ? <TokenSample variant="corner" value={`var(--santo-dimension-radius-${c})`} scale={2} /> : undefined;
        }}
        rotulo={({ nome, dados }) => {
          const x = raioDe(dados as Raio);
          return <Rotulo nome={nome} valor={x.controle === x.container ? `${x.container}px` : `${x.container}/${x.controle}px`} />;
        }}
      />
    );

  if (aba === "base")
    return (
      <div className="flex flex-col gap-md">
        <NumberField layout="inline" label="Container" value={r.container} min={0} max={32} unit="px" onChange={(n) => muda({ container: Math.round(n) })} />
        <NumberField layout="inline" label="Controle" value={r.controle} min={0} max={24} unit="px" onChange={(n) => muda({ controle: Math.round(n) })} />
        <Curva
          rotulo="Curva"
          valor={curva}
          opcoes={[
            { value: "santo", label: "Santo" },
            { value: "razao", label: "Razão" },
          ]}
          razao={typeof r.curva === "object" ? r.curva.razao : 1.5}
          onCurva={(c) => muda({ curva: c === "santo" ? "santo" : { razao: 1.5 } })}
          onRazao={(razao) => muda({ curva: { razao } })}
        />
      </div>
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
          // md é a base de container: nunca "editado", mas reserva o lugar do reset.
          onReset={n === "md" ? () => undefined : () => editar((x) => ({ ...x, overrides: semChave(x.overrides, n) }))}
          resetLabel={n === "md" ? undefined : `Voltar radius/${n} a ${raioNivel(r, n)}px`}
        >
          <CampoPasso
            valor={passos.raio[n]}
            rotulo={`radius/${n} em px`}
            onValor={(v) => (n === "md" ? muda({ container: v }) : editar((x) => ({ ...x, overrides: { ...x.overrides, [n]: v } })))}
          />
        </StepRow>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------- espaço */

export function PainelEspaco({ registro, passos, editar, aba }: Props) {
  const e = espacoDe((registro.base.valor as number | Espaco | undefined) ?? RASCUNHO_PADRAO.espaco);
  const over = registro.overrides as Record<string, number>;
  const muda = (patch: Partial<Espaco>) => editar((x) => ({ ...x, base: { valor: { ...e, ...patch } } }));
  const curva = typeof e.curva === "object" ? "razao" : e.curva;

  if (aba === "presets")
    return (
      <PresetsDoEstilo
        estilo="espaco"
        fixos={PRESETS_FIXOS.espaco}
        atual={e}
        passos={over}
        normalizar={(d) => espacoDe(d as Espaco)}
        aplicar={(dados, pp) => editar(() => ({ base: { valor: dados }, overrides: pp }))}
        // Miniatura: a barra do space/md que o preset dá (quando é degrau primitivo).
        leading={(d) => <TokenSample variant="bar" value={`var(--santo-dimension-space-${espacoNivel(espacoDe(d as Espaco), "md")})`} />}
        rotulo={({ nome, dados }) => <Rotulo nome={nome} valor={`${espacoDe(dados as Espaco).unidade}px`} />}
      />
    );

  if (aba === "base")
    return (
      <div className="flex flex-col gap-md">
        <NumberField layout="inline" label="Unidade" value={e.unidade} min={2} max={8} unit="px" onChange={(n) => muda({ unidade: Math.round(n) })} />
        <Curva
          rotulo="Curva"
          valor={curva}
          opcoes={[
            { value: "santo", label: "Santo" },
            { value: "linear", label: "Linear" },
            { value: "razao", label: "Razão" },
          ]}
          razao={typeof e.curva === "object" ? e.curva.razao : 1.4}
          onCurva={(c) => muda({ curva: c === "razao" ? { razao: 1.4 } : c })}
          onRazao={(razao) => muda({ curva: { razao } })}
        />
      </div>
    );

  return (
    <div className="flex flex-col">
      {NIVEIS_ESPACO.map((n) => (
        <StepRow
          key={n}
          name={`space/${n}`}
          unit="px"
          overridden={over[n] !== undefined}
          onReset={() => editar((x) => ({ ...x, overrides: semChave(x.overrides, n) }))}
          resetLabel={`Voltar space/${n} a ${espacoNivel(e, n)}px`}
        >
          <CampoPasso valor={passos.espaco[n]} rotulo={`space/${n} em px`} onValor={(v) => editar((x) => ({ ...x, overrides: { ...x.overrides, [n]: v } }))} />
        </StepRow>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------- sombra */

type PassoSombra = { intensidade?: number; desfoque?: number; deslocamento?: number };
const tintaModo = (t: string) => (t === "atual" || t === "marca" ? t : "cor");

export function PainelSombra({ registro, passos, editar, aba }: Props) {
  const s = sombraDe({ ...RASCUNHO_PADRAO.sombra, ...(registro.base as Partial<Sombra>) });
  const over = registro.overrides as Partial<Record<NivelSombra, number | PassoSombra>>;
  const muda = (patch: Partial<Sombra>) => editar((x) => ({ ...x, base: { ...s, ...patch } }));
  const [nivel, setNivel] = useState<NivelSombra>("md");

  if (aba === "presets")
    return (
      <PresetsDoEstilo
        estilo="sombra"
        fixos={PRESETS_FIXOS.sombra}
        atual={s}
        passos={over}
        normalizar={(d) => sombraDe(d as Sombra)}
        aplicar={(dados, pp) => editar(() => ({ base: dados, overrides: pp }))}
        rotulo={({ nome, dados }) => <Rotulo nome={nome} valor={vezes(sombraDe(dados as Sombra).intensidade)} />}
      />
    );

  if (aba === "base")
    return (
      <div className="flex flex-col gap-md">
        <NumberField layout="inline" label="Intensidade" value={s.intensidade} min={0} max={3} step={0.1} format={vezes} onChange={(n) => muda({ intensidade: Math.round(n * 10) / 10 })} />
        <NumberField layout="inline" label="Desfoque" value={s.desfoque} min={0} max={3} step={0.05} format={vezes} onChange={(n) => muda({ desfoque: Math.round(n * 100) / 100 })} />
        <NumberField layout="inline" label="Deslocamento" value={s.deslocamento} min={0} max={3} step={0.05} format={vezes} onChange={(n) => muda({ deslocamento: Math.round(n * 100) / 100 })} />
        <Field label="Tinta">
          <Segmented
            block
            value={tintaModo(s.tinta)}
            onChange={(v) => muda({ tinta: v === "cor" ? passos.paleta.neutral["950"] : v })}
            options={[
              { value: "atual", label: "Neutra" },
              { value: "marca", label: "Pela marca" },
              { value: "cor", label: "Cor" },
            ]}
          />
        </Field>
        {tintaModo(s.tinta) === "cor" && (
          <span className="flex items-center gap-xs">
            <SwatchPicker size="lg" showAlpha={false} label="Escolher a cor da sombra" color={s.tinta} onChange={(hex) => muda({ tinta: hex.slice(0, 7).toLowerCase() })} />
            <CampoHex valor={s.tinta} rotulo="Cor da sombra em hex" onValor={(hex) => muda({ tinta: hex })} />
          </span>
        )}
      </div>
    );

  // Passos: um nível por vez (Segmented), com os três fatores dele; sem passo, vale o global.
  const atualNivel: PassoSombra = typeof over[nivel] === "number" ? { intensidade: over[nivel] as number } : ((over[nivel] as PassoSombra) ?? {});
  const valor = { intensidade: atualNivel.intensidade ?? s.intensidade, desfoque: atualNivel.desfoque ?? s.desfoque, deslocamento: atualNivel.deslocamento ?? s.deslocamento };
  const mudaNivel = (patch: PassoSombra) => editar((x) => ({ ...x, overrides: { ...x.overrides, [nivel]: { ...atualNivel, ...patch } } }));
  const editado = Object.keys(atualNivel).length > 0;
  return (
    <div className="flex flex-col gap-md">
      <Segmented block value={nivel} onChange={setNivel} options={NIVEIS_SOMBRA.map((n) => ({ value: n, label: over[n] !== undefined ? `${n}•` : n }))} />
      <span className="flex items-center justify-between gap-xs">
        <span className="flex items-center gap-xs">
          <TokenSample variant="shadow" value={`var(--santo-shadow-${nivel})`} />
          <span className="flex -space-x-2xs" title={passos.sombra[nivel].join(" · ")}>
            {passos.sombra[nivel].map((c, i) => (
              <Swatch key={i} size="sm" round color={c} />
            ))}
          </span>
        </span>
        <IconButton
          size="sm"
          label={`Voltar shadow/${nivel} ao global`}
          disabled={!editado}
          className={editado ? "" : "invisible"}
          onClick={() => editar((x) => ({ ...x, overrides: semChave(x.overrides, nivel) }))}
        >
          <Icon.Undo size={16} />
        </IconButton>
      </span>
      <NumberField layout="inline" label="Intensidade" value={valor.intensidade} min={0} max={3} step={0.1} format={vezes} onChange={(n) => mudaNivel({ intensidade: Math.round(n * 10) / 10 })} />
      <NumberField layout="inline" label="Desfoque" value={valor.desfoque} min={0} max={3} step={0.05} format={vezes} onChange={(n) => mudaNivel({ desfoque: Math.round(n * 100) / 100 })} />
      <NumberField layout="inline" label="Deslocamento" value={valor.deslocamento} min={0} max={3} step={0.05} format={vezes} onChange={(n) => mudaNivel({ deslocamento: Math.round(n * 100) / 100 })} />
    </div>
  );
}

/* ------------------------------------------------------------- controles */

type Medida = keyof ControleTamanho;
/** As 7 medidas: rótulo, limites (px) e a chave do valor resolvido em r.auditoria.controles. */
const MEDIDAS: { campo: Medida; rotulo: string; min: number; max: number; resolvido: keyof AuditoriaControles["md"]["valores"] }[] = [
  { campo: "altura", rotulo: "Altura", min: 20, max: 72, resolvido: "height" },
  { campo: "paddingX", rotulo: "Padding", min: 0, max: 40, resolvido: "padding-x" },
  { campo: "raio", rotulo: "Raio", min: 0, max: 32, resolvido: "radius" },
  { campo: "borda", rotulo: "Borda", min: 0, max: 4, resolvido: "border" },
  { campo: "fonte", rotulo: "Fonte", min: 10, max: 24, resolvido: "font" },
  { campo: "icone", rotulo: "Ícone", min: 12, max: 32, resolvido: "icon" },
  { campo: "gap", rotulo: "Gap", min: 0, max: 24, resolvido: "gap" },
];
type Tamanho = (typeof NIVEIS_CONTROLE)[number];

export function PainelControles({ registro, editar, aba, controles }: Props & { controles?: AuditoriaControles }) {
  const c = controlesDe((registro.base.valor as Parameters<typeof controlesDe>[0] | undefined) ?? RASCUNHO_PADRAO.controles);
  const [tamanho, setTamanho] = useState<Tamanho>("md");
  const valorDe = (t: Tamanho, m: (typeof MEDIDAS)[number]) => controles?.[t].valores[m.resolvido] ?? 0;
  const muda = (t: Tamanho, campo: Medida, v: number | string) =>
    editar((x) => ({ ...x, base: { valor: { ...c, [t]: { ...c[t], [campo]: v } } }, overrides: {} }));
  const padrao = PRESETS_CONTROLES.padrao;

  if (aba === "presets")
    return (
      <PresetsDoEstilo
        estilo="controles"
        fixos={PRESETS_FIXOS.controles}
        atual={c}
        passos={{}}
        normalizar={(d) => controlesDe(d as Parameters<typeof controlesDe>[0])}
        aplicar={(dados) => editar(() => ({ base: { valor: dados }, overrides: {} }))}
        rotulo={({ nome, dados }) => {
          const x = controlesDe(dados as Parameters<typeof controlesDe>[0]);
          return <Rotulo nome={nome} valor={NIVEIS_CONTROLE.map((t) => x[t].altura).join("/")} />;
        }}
      />
    );

  const avisos = controles?.[tamanho].avisos ?? [];
  if (aba === "base")
    return (
      <div className="flex flex-col gap-md">
        <Segmented block value={tamanho} onChange={setTamanho} options={NIVEIS_CONTROLE.map((t) => ({ value: t, label: t }))} />
        {avisos.length > 0 && (
          <ul role="status" className="flex flex-col gap-3xs">
            {avisos.map((a) => (
              <li key={a}>
                <Tag intent="warning">{a.replace(/^\[([a-z-]+)\]\s*/, "")}</Tag>
              </li>
            ))}
          </ul>
        )}
        {MEDIDAS.map((m) => (
          <NumberField
            key={m.campo}
            layout="inline"
            label={m.rotulo}
            value={valorDe(tamanho, m)}
            min={m.min}
            max={m.max}
            unit="px"
            onChange={(n) => muda(tamanho, m.campo, Math.round(n))}
          />
        ))}
      </div>
    );

  // Passos: as 21 medidas (7 × 3 tamanhos) numa lista densa; o reset volta à do preset Padrão.
  return (
    <div className="flex flex-col gap-lg">
      {NIVEIS_CONTROLE.map((t) => (
        <section key={t} className="flex flex-col">
          <Overline>{t}</Overline>
          {MEDIDAS.map((m) => {
            const editado = c[t][m.campo] !== padrao[t][m.campo];
            return (
              <StepRow
                key={m.campo}
                name={`${m.rotulo.toLowerCase()}`}
                unit="px"
                overridden={editado}
                onReset={() => muda(t, m.campo, padrao[t][m.campo])}
                resetLabel={`Voltar ${m.rotulo.toLowerCase()} de ${t} ao Padrão`}
              >
                <CampoPasso valor={valorDe(t, m)} rotulo={`${m.rotulo} de ${t} em px`} onValor={(v) => muda(t, m.campo, v)} />
              </StepRow>
            );
          })}
        </section>
      ))}
    </div>
  );
}

/* ----------------------------------------------------------- superfícies */

type Sup = Superficies;
type TemaSup = "claro" | "escuro";
const TRATAMENTOS = [
  { value: "plana", label: "Plana" },
  { value: "tonal", label: "Tonal" },
  { value: "borda-dupla", label: "Dupla" },
  { value: "vidro", label: "Vidro" },
] as const;
const RECUOS = ["2xs", "xs", "sm", "md"] as const;
const BLURS = ["sm", "md", "lg", "xl"] as const;
const ROTULO_SUP: Record<(typeof SUPERFICIES)[number], string> = { page: "página", raised: "cartão", sunken: "chão", well: "poço", panel: "painel" };
const ROTULO_BORDA: Record<(typeof BORDAS)[number], string> = { subtle: "sutil", default: "padrão", strong: "forte" };
const pct = (n: number) => `${Math.round(n * 100)}`;

/** Superfícies completas: preset por id ou o objeto (sobre o padrão do preset do tratamento). */
export const superficiesDe = (v: unknown): Sup =>
  typeof v === "string" ? PRESETS_SUPERFICIES[v as keyof typeof PRESETS_SUPERFICIES] ?? PRESETS_SUPERFICIES["borda-dupla"] : { ...PRESETS_SUPERFICIES["borda-dupla"], ...(v as Partial<Sup>) };

/** Degrau neutral num Select, com a amostra viva da rampa do rascunho. */
function Degrau({ valor, onValor, rotulo, transparente, hex }: { valor: number | "transparente"; onValor: (v: number | "transparente") => void; rotulo: string; transparente?: boolean; hex: (d: number) => string }) {
  const opcoes = [
    ...(transparente ? [{ value: "transparente", label: "sem borda" }] : []),
    ...NEUTRAL_DEGRAUS.map((d) => ({ value: String(d), label: `neutral/${d}`, leading: <Swatch size="xs" color={hex(d)} /> })),
  ];
  return (
    <span className="w-(--santo-dimension-space-160)">
      <Select size="sm" label={rotulo} value={String(valor)} onChange={(v) => onValor(v === "transparente" ? v : Number(v))} options={opcoes} />
    </span>
  );
}

export function PainelSuperficies({ registro, passos, editar, aba }: Props) {
  const sup = superficiesDe(registro.base.valor);
  const muda = (patch: Partial<Sup>) => editar((x) => ({ ...x, base: { valor: { ...sup, ...patch } } }));
  const [tema, setTema] = useState<TemaSup>("claro");
  const hex = (d: number) => passos.paleta.neutral[String(d)];
  const vidro = { ...VIDRO_PADRAO, ...sup.vidro };
  const padrao = PRESETS_SUPERFICIES[sup.tratamento ?? "borda-dupla"];

  if (aba === "presets")
    return (
      <PresetsDoEstilo
        estilo="superficies"
        fixos={PRESETS_FIXOS.superficies}
        atual={sup}
        passos={{}}
        normalizar={(d) => superficiesDe(d)}
        aplicar={(dados) => editar(() => ({ base: { valor: dados }, overrides: {} }))}
        // Miniatura: página → cartão → poço nos degraus do preset (claro).
        leading={(d) => {
          const t = superficiesDe(d).tons.claro;
          return (
            <span className="flex -space-x-2xs">
              {(["page", "raised", "well"] as const).map((s) => (
                <Swatch key={s} size="sm" color={hex(t[s])} />
              ))}
            </span>
          );
        }}
        // Meta: o recuo da moldura quando ela existe (o nome já diz o tratamento).
        rotulo={({ nome, dados }) => <Rotulo nome={nome} valor={superficiesDe(dados).bordaDupla ? `recuo ${superficiesDe(dados).recuo}` : ""} />}
      />
    );

  if (aba === "base")
    return (
      <div className="flex flex-col gap-md">
        <Field label="Tratamento">
          <Segmented
            block
            value={sup.tratamento ?? "borda-dupla"}
            // Trocar o tratamento parte do preset dele (tons, bordas e moldura coerentes).
            onChange={(t) => editar(() => ({ base: { valor: { ...PRESETS_SUPERFICIES[t] } }, overrides: {} }))}
            options={TRATAMENTOS.map((t) => ({ value: t.value, label: t.label }))}
          />
        </Field>
        <span className="flex items-center justify-between gap-sm">
          <span className="santo-caption-medium text-text-secondary">Borda dupla</span>
          <Switch label="Borda dupla" checked={sup.bordaDupla} disabled={sup.tratamento === "vidro"} onChange={(v) => muda({ bordaDupla: v })} />
        </span>
        <Field label="Recuo da moldura">
          <Segmented block value={sup.recuo as (typeof RECUOS)[number]} onChange={(r) => muda({ recuo: r })} options={RECUOS.map((r) => ({ value: r, label: r }))} />
        </Field>
        {sup.tratamento === "vidro" && (
          <section className="flex flex-col gap-md">
            <Overline>Vidro</Overline>
            <Field label="Desfoque">
              <Segmented
                block
                value={(typeof vidro.blur === "string" ? vidro.blur : "md") as (typeof BLURS)[number]}
                onChange={(b) => muda({ vidro: { ...vidro, blur: b } })}
                options={BLURS.map((b) => ({ value: b, label: b }))}
              />
            </Field>
            <Segmented block value={tema} onChange={setTema} options={[{ value: "claro", label: "Claro" }, { value: "escuro", label: "Escuro" }]} />
            <NumberField layout="inline" label="Fundo" value={Number(pct(vidro.alfa[tema]))} min={0} max={100} unit="%" onChange={(n) => muda({ vidro: { ...vidro, alfa: { ...vidro.alfa, [tema]: Math.round(n) / 100 } } })} />
            <NumberField layout="inline" label="Borda" value={Number(pct(vidro.borda[tema]))} min={0} max={100} unit="%" onChange={(n) => muda({ vidro: { ...vidro, borda: { ...vidro.borda, [tema]: Math.round(n) / 100 } } })} />
            <NumberField layout="inline" label="Brilho" value={Number(pct(vidro.highlight[tema]))} min={0} max={100} unit="%" onChange={(n) => muda({ vidro: { ...vidro, highlight: { ...vidro.highlight, [tema]: Math.round(n) / 100 } } })} />
            <span className="flex items-center justify-between gap-sm">
              <span className="santo-caption-medium text-text-secondary">Tinta</span>
              <Degrau
                rotulo="Tinta do vidro"
                valor={typeof vidro.tinta[tema] === "number" ? (vidro.tinta[tema] as number) : 0}
                hex={hex}
                onValor={(v) => muda({ vidro: { ...vidro, tinta: { ...vidro.tinta, [tema]: v as number } } })}
              />
            </span>
          </section>
        )}
      </div>
    );

  // Passos: cada superfície e borda, por tema, num degrau da rampa neutral; reset = o do preset do tratamento.
  const linha = (nome: string, valor: number | "transparente", ref: number | "transparente", onValor: (v: number | "transparente") => void, transparente = false) => (
    <StepRow key={nome} name={nome} sample={valor === "transparente" ? undefined : <Swatch size="sm" color={hex(valor)} />} overridden={valor !== ref} onReset={() => onValor(ref)} resetLabel={`Voltar ${nome} ao preset`}>
      <Degrau rotulo={nome} valor={valor} onValor={onValor} hex={hex} transparente={transparente} />
    </StepRow>
  );
  return (
    <div className="flex flex-col gap-lg">
      <Segmented block value={tema} onChange={setTema} options={[{ value: "claro", label: "Claro" }, { value: "escuro", label: "Escuro" }]} />
      <section className="flex flex-col">
        <Overline>Superfícies</Overline>
        {SUPERFICIES.map((s) =>
          linha(ROTULO_SUP[s], sup.tons[tema][s], padrao.tons[tema][s], (v) => muda({ tons: { ...sup.tons, [tema]: { ...sup.tons[tema], [s]: v } } })),
        )}
      </section>
      <section className="flex flex-col">
        <Overline>Bordas</Overline>
        {BORDAS.map((b) =>
          linha(ROTULO_BORDA[b], sup.bordas[tema][b], padrao.bordas[tema][b], (v) => muda({ bordas: { ...sup.bordas, [tema]: { ...sup.bordas[tema], [b]: v } } })),
        )}
        {linha("interna", sup.bordaInterna[tema], padrao.bordaInterna[tema], (v) => muda({ bordaInterna: { ...sup.bordaInterna, [tema]: v } }), true)}
      </section>
    </div>
  );
}
