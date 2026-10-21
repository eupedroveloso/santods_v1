"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { estudioApi, EstudioErro, type PresetJson } from "@/lib/estudio/client";
import { doc, INDICE, PAPEIS_TIPO, type Registro } from "@/lib/estudio/rascunho";
import { PESOS_DO_SISTEMA, temPeso, urlCss2, type PapelFonte } from "@/lib/fonts/google.mjs";
import { PenIcon, TrashCanIcon } from "@/lib/icons";
import { PESOS_PADRAO, PRESETS_TIPOGRAFIA, RASCUNHO_PADRAO, type PresetTipografia, type Rascunho } from "@/lib/tokens/estudio.mjs";
import { Chip, Field, FontPicker, Icon, IconButton, Input, Overline, RadioGroup, Segmented, StepRow, TokenSample } from "@/lib/ui";
import { CampoPasso, Rotulo, semChave, type Aba, type Editar, type Passos } from "./paineis";

type Tipo = Rascunho["tipografia"];

const BASES = [14, 16, 18] as const;
const RAZOES = [1.2, 1.25, 1.333] as const;
const FIXOS = ["compacta", "santo", "editorial"] as const;
const PAPEIS_FONTE: { papel: PapelFonte; rotulo: string }[] = [
  { papel: "titulo", rotulo: "Título" },
  { papel: "corpo", rotulo: "Corpo" },
  { papel: "mono", rotulo: "Mono" },
];

const CATEGORIAS = [
  { value: "sans", label: "Sans" },
  { value: "serif", label: "Serif" },
  { value: "display", label: "Display" },
  { value: "handwriting", label: "Manuscrita" },
  { value: "mono", label: "Mono" },
];

/** Índice inteiro em ordem alfabética; mono só monoespaçadas (contrato: [mono-nao-monoespacada]). */
const TODAS = Object.entries(INDICE.families)
  .map(([family, f]) => ({ family, category: f.c }))
  .sort((a, b) => a.family.localeCompare(b.family));
const MONO = TODAS.filter((f) => f.category === "mono");
/** Preview de opção: só o peso regular. */
const previa = (familia: string) => urlCss2(familia, [400]);

/** Pesos do papel que a família tem; nunca vazio (cai no regular ou no primeiro disponível). */
function limitar(pesos: number[], familia: string) {
  const ok = pesos.filter((p) => temPeso(INDICE, familia, p));
  if (ok.length) return ok;
  const primeiro = PESOS_DO_SISTEMA.find((p) => temPeso(INDICE, familia, p));
  return [temPeso(INDICE, familia, 400) ? 400 : (primeiro ?? 400)];
}

/** Degraus primitivos de type/size/* (o "Aa" do preset só usa token). */
const TAMANHOS = new Set(
  Object.keys(doc.collections.Primitives.variables)
    .filter((n) => n.startsWith("type/size/"))
    .map((n) => Number(n.split("/")[2])),
);

const papelDoCampo = { titulo: "titulo", corpo: "corpo", mono: "mono" } as const;

export function PainelTipografia({ registro, passos, editar, aba }: { registro: Registro; passos: Passos; editar: Editar; aba: Aba }) {
  const t: Tipo = { ...RASCUNHO_PADRAO.tipografia, ...(registro.base as Partial<Tipo>) };
  const pesos = { ...PESOS_PADRAO, ...t.pesos };
  const over = registro.overrides as Record<string, [number, number]>;
  const livre = typeof t.escala === "object" && !Array.isArray(t.escala) && !("nome" in t.escala) ? t.escala : null;
  const base = (patch: Partial<Tipo>, limpa = false) =>
    editar((r) => ({ base: { ...r.base, ...patch }, overrides: limpa ? {} : r.overrides }));

  /** Troca a família e prende os pesos do papel ao que ela tem (estática sem 500, 600, 800 seria recusada). */
  const trocaFamilia = (papel: PapelFonte, familia: string) =>
    base({ [papelDoCampo[papel]]: familia, pesos: { ...pesos, [papel]: limitar(pesos[papel] ?? PESOS_PADRAO[papel], familia) } } as Partial<Tipo>);

  if (aba === "presets") return <PresetsTipografia t={t} passos={passos} over={over} aplicar={(patch) => base(patch, true)} />;

  if (aba === "base")
    return (
      <div className="flex flex-col gap-md">
        {PAPEIS_FONTE.map(({ papel, rotulo }) => (
          <Field key={papel} label={rotulo}>
            <FontPicker
              label={`Família do ${rotulo.toLowerCase()}`}
              value={t[papelDoCampo[papel]]}
              onChange={(f) => trocaFamilia(papel, f)}
              families={papel === "mono" ? MONO : TODAS}
              curated={papel === "mono" ? INDICE.curadoria.filter((f) => INDICE.families[f]?.c === "mono") : INDICE.curadoria}
              categories={papel === "mono" ? undefined : CATEGORIAS}
              previewHref={previa}
            />
          </Field>
        ))}
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
    <div className="flex flex-col gap-lg">
      <section className="flex flex-col gap-sm">
        <Overline>Pesos</Overline>
        {PAPEIS_FONTE.map(({ papel, rotulo }) => {
          const familia = t[papelDoCampo[papel]];
          const lista = pesos[papel] ?? [];
          return (
            <div key={papel} className="flex flex-col gap-2xs">
              <span className="flex items-baseline justify-between gap-xs">
                <span className="santo-caption-medium text-text-secondary">{rotulo}</span>
                <span className="santo-caption-regular truncate text-text-tertiary">{familia}</span>
              </span>
              <div role="group" aria-label={`Pesos do ${rotulo.toLowerCase()}`} className="flex flex-wrap gap-3xs">
                {PESOS_DO_SISTEMA.map((p) => {
                  const tem = temPeso(INDICE, familia, p);
                  const ligado = lista.includes(p);
                  return (
                    <Chip
                      key={p}
                      active={ligado}
                      disabled={!tem || (ligado && lista.length === 1)}
                      title={tem ? undefined : `${familia} não tem ${p}`}
                      onClick={() =>
                        base({ pesos: { ...pesos, [papel]: ligado ? lista.filter((x) => x !== p) : [...lista, p].sort((a, b) => a - b) } })
                      }
                    >
                      {p}
                    </Chip>
                  );
                })}
              </div>
            </div>
          );
        })}
      </section>
      <section className="flex flex-col">
        <Overline>Escala</Overline>
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
      </section>
    </div>
  );
}

/* -------------------------------------------------------------- presets */

/**
 * Presets de tipografia: os fixos do contrato e os próprios (banco, para
 * todos os sistemas). Aplicar copia famílias, pesos e escala (igual ao
 * aplicarPresetTipografia do Compasso). "Salvar como preset" grava o que o
 * rascunho tem agora, com a tabela exata dos 11 papéis.
 */
function PresetsTipografia({
  t,
  passos,
  over,
  aplicar,
}: {
  t: Tipo;
  passos: Passos;
  over: Record<string, unknown>;
  aplicar: (patch: Partial<Tipo>) => void;
}) {
  const [proprios, setProprios] = useState<PresetJson[]>([]);
  const [modo, setModo] = useState<"ver" | "salvar" | "renomear">("ver");
  const [nome, setNome] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [ocupado, setOcupado] = useState(false);

  useEffect(() => {
    let vivo = true;
    estudioApi
      .presets("tipografia")
      .then((lista) => vivo && setProprios(lista))
      .catch(() => undefined);
    return () => {
      vivo = false;
    };
  }, []);

  const todos: PresetTipografia[] = useMemo(() => [...FIXOS.map((id) => PRESETS_TIPOGRAFIA[id]), ...proprios.map((p) => p.dados)], [proprios]);
  const ativoId =
    Object.keys(over).length > 0 ? "" : typeof t.escala === "string" ? t.escala : !Array.isArray(t.escala) && "id" in t.escala ? t.escala.id : "";
  const ativoProprio = proprios.find((p) => p.id === ativoId);

  // Folhas só do peso regular de cada preset: o rótulo aparece na fonte dele.
  const fontes = useMemo(() => [...new Set(todos.map((p) => p.familias.titulo))], [todos]);

  const aplicarPreset = (id: string) => {
    const p = todos.find((x) => x.id === id);
    if (!p) return;
    // Fixo: só a escala (id), as famílias ficam. Próprio: o preset inteiro, como o aplicarPresetTipografia.
    if ((FIXOS as readonly string[]).includes(id)) aplicar({ escala: id });
    else aplicar({ corpo: p.familias.corpo, titulo: p.familias.titulo, mono: p.familias.mono, pesos: { ...PESOS_PADRAO, ...p.pesos }, escala: p });
  };

  const executar = async (acao: () => Promise<void>) => {
    setOcupado(true);
    setErro(null);
    try {
      await acao();
      setModo("ver");
      setNome("");
    } catch (e) {
      setErro(e instanceof EstudioErro ? [e.message, ...e.problems].join(" ") : String(e));
    } finally {
      setOcupado(false);
    }
  };

  const salvar = (e: FormEvent) => {
    e.preventDefault();
    executar(async () => {
      const dados: PresetTipografia = {
        id: "proprio",
        nome,
        familias: { corpo: t.corpo, titulo: t.titulo, mono: t.mono },
        pesos: { ...PESOS_PADRAO, ...t.pesos },
        base: passos.tipo.body[0],
        razao: typeof t.escala === "object" && !Array.isArray(t.escala) ? t.escala.razao : 1.25,
        tabela: PAPEIS_TIPO.map((p) => passos.tipo[p]),
      };
      const novo = await estudioApi.criarPreset("tipografia", nome, dados);
      setProprios((l) => [...l, novo]);
      aplicar({ ...dados.familias, pesos: dados.pesos, escala: novo.dados });
    });
  };

  const renomear = (e: FormEvent) => {
    e.preventDefault();
    if (!ativoProprio) return;
    executar(async () => {
      const novo = await estudioApi.renomearPreset(ativoProprio.id, nome);
      setProprios((l) => l.map((p) => (p.id === novo.id ? novo : p)));
    });
  };

  return (
    <div className="flex flex-col gap-md">
      {fontes.map((f) => (
        <link key={f} rel="stylesheet" href={urlCss2(f, [400])} precedence="default" />
      ))}
      <RadioGroup
        label="Preset de tipografia"
        columns={1}
        value={ativoId}
        onChange={aplicarPreset}
        options={todos.map((p) => ({
          value: p.id,
          // Miniatura "Aa" só quando o tamanho base é degrau primitivo (type/size/*): preset próprio pode ter outro.
          leading: TAMANHOS.has(p.base) ? <TokenSample variant="text" property="fontSize" value={`var(--santo-type-size-${p.base})`} /> : undefined,
          label: <Rotulo nome={p.nome} valor={`${p.base}px`} />,
          labelStyle: { fontFamily: `"${p.familias.titulo}"` },
        }))}
      />

      {modo === "ver" ? (
        <div className="flex items-center justify-end gap-2xs">
          {ativoProprio && (
            <>
              <IconButton size="sm" label={`Renomear ${ativoProprio.nome}`} onClick={() => (setNome(ativoProprio.nome), setModo("renomear"))}>
                <PenIcon size={16} />
              </IconButton>
              <IconButton
                size="sm"
                label={`Apagar ${ativoProprio.nome}`}
                disabled={ocupado}
                onClick={() =>
                  executar(async () => {
                    await estudioApi.apagarPreset(ativoProprio.id);
                    setProprios((l) => l.filter((p) => p.id !== ativoProprio.id));
                  })
                }
              >
                <TrashCanIcon size={16} />
              </IconButton>
            </>
          )}
          <IconButton size="sm" label="Salvar como preset" onClick={() => setModo("salvar")}>
            <Icon.Save size={16} />
          </IconButton>
        </div>
      ) : (
        <form onSubmit={modo === "salvar" ? salvar : renomear} className="flex items-center gap-2xs">
          <span className="min-w-0 flex-1">
            <Input
              size="sm"
              autoFocus
              value={nome}
              maxLength={48}
              placeholder="Nome do preset"
              aria-label={modo === "salvar" ? "Nome do novo preset" : "Novo nome do preset"}
              invalid={!!erro}
              onChange={(e) => setNome(e.target.value)}
              onKeyDown={(e) => e.key === "Escape" && setModo("ver")}
            />
          </span>
          <IconButton size="sm" type="submit" variant="primary" label={modo === "salvar" ? "Salvar preset" : "Confirmar nome"} disabled={ocupado || !nome.trim()}>
            <Icon.Check size={16} />
          </IconButton>
          <IconButton size="sm" label="Cancelar" onClick={() => (setModo("ver"), setErro(null))}>
            <Icon.Close size={16} />
          </IconButton>
        </form>
      )}
      {erro && <p className="santo-caption-medium text-text-danger">{erro}</p>}
    </div>
  );
}
