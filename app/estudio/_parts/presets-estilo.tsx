"use client";

import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { estudioApi, EstudioErro, type PresetJson } from "@/lib/estudio/client";
import type { EstiloId } from "@/lib/estudio/estilos";
import { PenIcon, TrashCanIcon } from "@/lib/icons";
import type { Preset } from "@/lib/tokens/estudio.mjs";
import { Icon, IconButton, Input, RadioGroup } from "@/lib/ui";

/** JSON com as chaves em ordem: dois pedaços iguais de rascunho dão o mesmo texto. */
function estavel(v: unknown): string {
  if (Array.isArray(v)) return `[${v.map(estavel).join(",")}]`;
  if (v && typeof v === "object")
    return `{${Object.keys(v)
      .sort()
      .map((k) => `${JSON.stringify(k)}:${estavel((v as Record<string, unknown>)[k])}`)
      .join(",")}}`;
  return JSON.stringify(v);
}

type Dados = Record<string, unknown> & { passos?: Record<string, unknown> };

/**
 * Presets de um estilo: os fixos do contrato (PRESETS_FIXOS) e os próprios
 * (banco, para todos os sistemas). Aplicar copia o pedaço do rascunho e os
 * passos do preset. "Salvar como preset" grava o que o estilo tem agora. O
 * ativo é o preset cujo pedaço normalizado é igual ao do rascunho.
 */
export function PresetsDoEstilo({
  estilo,
  fixos,
  atual,
  passos,
  normalizar,
  aplicar,
  leading,
  rotulo,
}: {
  estilo: EstiloId;
  fixos: Preset[];
  /** O pedaço atual do rascunho, já normalizado. */
  atual: unknown;
  /** Os passos editados à mão do estilo (vão junto no preset salvo). */
  passos: Record<string, unknown>;
  /** Forma canônica de um `dados` de preset, para comparar com `atual`. */
  normalizar: (dados: Record<string, unknown>) => unknown;
  aplicar: (dados: Record<string, unknown>, passos: Record<string, unknown>) => void;
  leading?: (dados: Record<string, unknown>) => ReactNode;
  rotulo: (preset: { nome: string; dados: Record<string, unknown> }) => ReactNode;
}) {
  const [proprios, setProprios] = useState<PresetJson<Dados>[]>([]);
  const [modo, setModo] = useState<"ver" | "salvar" | "renomear">("ver");
  const [nome, setNome] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [ocupado, setOcupado] = useState(false);

  useEffect(() => {
    let vivo = true;
    estudioApi
      .presets<Dados>(estilo)
      .then((l) => vivo && setProprios(l))
      .catch(() => undefined);
    return () => {
      vivo = false;
    };
  }, [estilo]);

  const todos = useMemo(
    () => [...fixos.map((p) => ({ id: p.id, nome: p.nome, dados: p.dados as Dados })), ...proprios.map((p) => ({ id: p.id, nome: p.nome, dados: p.dados }))],
    [fixos, proprios],
  );
  const chaveAtual = estavel({ v: atual, p: passos });
  const ativoId =
    todos.find((p) => {
      const { passos: pp = {}, ...resto } = p.dados;
      return estavel({ v: normalizar(resto), p: pp }) === chaveAtual;
    })?.id ?? "";
  const ativoProprio = proprios.find((p) => p.id === ativoId);

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
      const dados = { ...(atual as Record<string, unknown>), ...(Object.keys(passos).length ? { passos } : {}) };
      const novo = await estudioApi.criarPreset<Dados>(estilo, nome, dados);
      setProprios((l) => [...l, novo]);
    });
  };

  const renomear = (e: FormEvent) => {
    e.preventDefault();
    if (!ativoProprio) return;
    executar(async () => {
      const novo = await estudioApi.renomearPreset<Dados>(ativoProprio.id, nome);
      setProprios((l) => l.map((p) => (p.id === novo.id ? novo : p)));
    });
  };

  return (
    <div className="flex flex-col gap-md">
      <RadioGroup
        label={`Presets de ${estilo}`}
        columns={1}
        value={ativoId}
        onChange={(id) => {
          const p = todos.find((x) => x.id === id);
          if (!p) return;
          const { passos: pp = {}, ...resto } = p.dados;
          aplicar(resto, pp);
        }}
        options={todos.map((p) => {
          const { passos: _pp, ...resto } = p.dados;
          void _pp;
          return { value: p.id, leading: leading?.(resto), label: rotulo({ nome: p.nome, dados: resto }) };
        })}
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
