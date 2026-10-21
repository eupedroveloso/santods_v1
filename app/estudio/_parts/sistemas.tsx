"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import { estudioApi } from "@/lib/estudio/client";
import { PaletteIcon } from "@/lib/icons";
import { Button, Card, EmptyState, Field, Icon, IconTile, Input, ListRow } from "@/lib/ui";

export type SistemaResumo = { id: string; nome: string; slug: string; atualizadoEm: string };

const QUANDO = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" });

/**
 * Lista dos sistemas do Estúdio: criar, renomear, duplicar e apagar.
 * Cada ação vai ao Route Handler e recarrega a lista do servidor.
 */
export function SistemasPainel({ sistemas }: { sistemas: SistemaResumo[] }) {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [pendente, startTransition] = useTransition();

  const executar = (acao: () => Promise<unknown>, depois?: (r: unknown) => void) =>
    startTransition(async () => {
      setErro(null);
      try {
        const resultado = await acao();
        if (depois) depois(resultado);
        else router.refresh();
      } catch (e) {
        setErro(e instanceof Error ? e.message : String(e));
      }
    });

  const criar = (e: FormEvent) => {
    e.preventDefault();
    executar(
      () => estudioApi.criar(nome),
      (r) => {
        setNome("");
        router.push(`/estudio/${(r as { slug: string }).slug}/cor`);
      },
    );
  };

  return (
    <Card padding="lg" className="max-w-(--santo-dimension-container-md)">
      <form onSubmit={criar} className="flex items-end gap-xs">
        <Field label="Novo sistema" error={erro ?? undefined} className="min-w-0 flex-1">
          <Input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome do sistema"
            maxLength={64}
            invalid={!!erro}
          />
        </Field>
        <Button type="submit" variant="primary" leading={<Icon.Plus size={16} />} disabled={pendente || !nome.trim()}>
          Criar
        </Button>
      </form>
      {sistemas.length === 0 ? (
        <EmptyState icon={<PaletteIcon size={20} />} title="Nenhum sistema ainda" />
      ) : (
        <div className="flex flex-col">
          {sistemas.map((s) => (
            <SistemaLinha key={s.id} sistema={s} pendente={pendente} executar={executar} />
          ))}
        </div>
      )}
    </Card>
  );
}

function SistemaLinha({
  sistema: s,
  pendente,
  executar,
}: {
  sistema: SistemaResumo;
  pendente: boolean;
  executar: (acao: () => Promise<unknown>) => void;
}) {
  const [modo, setModo] = useState<"ver" | "renomear" | "apagar">("ver");
  const [nome, setNome] = useState(s.nome);

  const renomear = (e: FormEvent) => {
    e.preventDefault();
    if (nome.trim() === s.nome) return setModo("ver");
    executar(() => estudioApi.renomear(s.id, nome).then(() => setModo("ver")));
  };

  if (modo === "renomear") {
    return (
      <form onSubmit={renomear} className="flex items-center gap-xs border-b-thin border-border-subtle py-sm last:border-b-0">
        <Input
          autoFocus
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          onKeyDown={(e) => e.key === "Escape" && setModo("ver")}
          maxLength={64}
          aria-label={`Novo nome de ${s.nome}`}
          className="min-w-0 flex-1"
        />
        <Button type="submit" variant="primary" disabled={pendente || !nome.trim()}>
          Salvar
        </Button>
        <Button variant="ghost" onClick={() => (setNome(s.nome), setModo("ver"))}>
          Cancelar
        </Button>
      </form>
    );
  }

  return (
    <ListRow
      divider
      leading={
        <IconTile>
          <PaletteIcon size={16} />
        </IconTile>
      }
      title={
        <Link href={`/estudio/${s.slug}/cor`} className="hover:underline">
          {s.nome}
        </Link>
      }
      meta={<span suppressHydrationWarning>{`${s.slug} · ${QUANDO.format(new Date(s.atualizadoEm))}`}</span>}
      trailing={
        modo === "apagar" ? (
          <span className="flex items-center gap-2xs">
            <Button variant="danger" size="sm" disabled={pendente} onClick={() => executar(() => estudioApi.apagar(s.id))}>
              Apagar {s.nome}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setModo("ver")}>
              Cancelar
            </Button>
          </span>
        ) : (
          <span className="flex items-center gap-2xs">
            <Button variant="ghost" size="sm" onClick={() => setModo("renomear")}>
              Renomear
            </Button>
            <Button
              variant="ghost"
              size="sm"
              leading={<Icon.Copy size={16} />}
              disabled={pendente}
              onClick={() => executar(() => estudioApi.duplicar(s.id))}
            >
              Duplicar
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setModo("apagar")}>
              Apagar
            </Button>
          </span>
        )
      }
    />
  );
}
