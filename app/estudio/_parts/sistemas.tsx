"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import { estudioApi } from "@/lib/estudio/client";
import type { SistemaFicha } from "@/lib/estudio/ficha";
import { PenIcon, TrashCanIcon } from "@/lib/icons";
import { BrandCard, BrandCardAction, Button, CardGrid, Icon, IconButton, Input } from "@/lib/ui";

const QUANDO = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" });

type Executar = (acao: () => Promise<unknown>, depois?: (r: unknown) => void) => void;

/**
 * Lista dos sistemas do Estúdio no molde de /identidades: uma BrandCard por
 * sistema, com o nome na fonte de título dele no lugar da logo. A primeira
 * ficha cria um sistema. Cada ação vai ao Route Handler e recarrega a lista.
 */
export function SistemasPainel({ sistemas }: { sistemas: SistemaFicha[] }) {
  const router = useRouter();
  const [erro, setErro] = useState<string | null>(null);
  const [pendente, startTransition] = useTransition();

  const executar: Executar = (acao, depois) =>
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

  const fontes = [...new Set(sistemas.map((s) => s.fonteUrl).filter((u): u is string => !!u))];

  return (
    <section className="flex flex-col gap-md">
      {fontes.map((url) => (
        <link key={url} rel="stylesheet" href={url} precedence="default" />
      ))}
      <CardGrid columns={{ base: 1 }} masonry={false}>
        <NovoSistema pendente={pendente} executar={executar} irPara={(slug) => router.push(`/estudio/${slug}/cor`)} />
        {sistemas.map((s) => (
          <FichaSistema key={s.id} sistema={s} pendente={pendente} executar={executar} />
        ))}
      </CardGrid>
      {erro && <p className="santo-caption-medium text-text-danger">{erro}</p>}
    </section>
  );
}

function NovoSistema({ pendente, executar, irPara }: { pendente: boolean; executar: Executar; irPara: (slug: string) => void }) {
  const [aberto, setAberto] = useState(false);
  const [nome, setNome] = useState("");
  const fechar = () => (setAberto(false), setNome(""));

  const criar = (e: FormEvent) => {
    e.preventDefault();
    executar(
      () => estudioApi.criar(nome),
      (r) => irPara((r as { slug: string }).slug),
    );
  };

  return (
    <BrandCardAction title="Novo sistema">
      {aberto ? (
        <form onSubmit={criar} className="flex min-w-0 flex-1 items-center gap-2xs md:max-w-(--santo-dimension-container-xs)">
          <span className="min-w-0 flex-1">
            <Input
              autoFocus
              value={nome}
              maxLength={64}
              placeholder="Nome do sistema"
              aria-label="Nome do novo sistema"
              onChange={(e) => setNome(e.target.value)}
              onKeyDown={(e) => e.key === "Escape" && fechar()}
            />
          </span>
          <IconButton type="submit" variant="primary" label="Criar sistema" disabled={pendente || !nome.trim()}>
            <Icon.Check size={16} />
          </IconButton>
          <IconButton label="Cancelar" onClick={fechar}>
            <Icon.Close size={16} />
          </IconButton>
        </form>
      ) : (
        <Button variant="secondary" leading={<Icon.Plus size={16} />} onClick={() => setAberto(true)}>
          Criar sistema
        </Button>
      )}
    </BrandCardAction>
  );
}

function FichaSistema({ sistema: s, pendente, executar }: { sistema: SistemaFicha; pendente: boolean; executar: Executar }) {
  const [modo, setModo] = useState<"ver" | "renomear" | "apagar">("ver");
  const [nome, setNome] = useState(s.nome);
  const fontFamily = `"${s.titulo}", var(--santo-font-heading)`;

  const renomear = (e: FormEvent) => {
    e.preventDefault();
    if (nome.trim() === s.nome) return setModo("ver");
    executar(() => estudioApi.renomear(s.id, nome).then(() => setModo("ver")));
  };
  const cancelar = () => (setNome(s.nome), setModo("ver"));

  const marca =
    modo === "renomear" ? (
      <form onSubmit={renomear} className="relative flex min-w-0 flex-1 items-center gap-2xs">
        <span className="min-w-0 flex-1">
          <Input
            size="sm"
            autoFocus
            value={nome}
            maxLength={64}
            aria-label={`Novo nome de ${s.nome}`}
            onChange={(e) => setNome(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && cancelar()}
          />
        </span>
        <IconButton size="sm" type="submit" variant="primary" label="Salvar nome" disabled={pendente || !nome.trim()}>
          <Icon.Check size={16} />
        </IconButton>
        <IconButton size="sm" label="Cancelar" onClick={cancelar}>
          <Icon.Close size={16} />
        </IconButton>
      </form>
    ) : (
      <span title={s.nome} className="santo-heading-6-semibold min-w-0 truncate text-text-primary" style={{ fontFamily }}>
        {s.nome}
      </span>
    );

  const acoes =
    modo === "apagar" ? (
      <>
        <Button variant="danger" size="sm" aria-label={`Confirmar: apagar ${s.nome}`} disabled={pendente} onClick={() => executar(() => estudioApi.apagar(s.id))}>
          Apagar
        </Button>
        <IconButton size="sm" label="Cancelar" onClick={() => setModo("ver")}>
          <Icon.Close size={16} />
        </IconButton>
      </>
    ) : modo === "ver" ? (
      <>
        <IconButton size="sm" label={`Renomear ${s.nome}`} onClick={() => setModo("renomear")}>
          <PenIcon size={16} />
        </IconButton>
        <IconButton size="sm" label={`Duplicar ${s.nome}`} disabled={pendente} onClick={() => executar(() => estudioApi.duplicar(s.id))}>
          <Icon.Copy size={16} />
        </IconButton>
        <IconButton size="sm" label={`Apagar ${s.nome}`} onClick={() => setModo("apagar")}>
          <TrashCanIcon size={16} />
        </IconButton>
      </>
    ) : null;

  return (
    <BrandCard
      name={s.nome}
      mark={marca}
      meta={modo === "renomear" ? undefined : <span suppressHydrationWarning>{`${s.slug} · ${QUANDO.format(new Date(s.atualizadoEm))}`}</span>}
      href={modo === "ver" ? `/estudio/${s.slug}/cor` : undefined}
      font={s.titulo === s.corpo ? s.corpo : `${s.titulo} · ${s.corpo}`}
      fontStack={fontFamily}
      color={{ value: s.marca }}
      neutrals={{ light: { value: s.neutros.light }, dark: { value: s.neutros.dark } }}
      radius={{ value: `${s.raio}px` }}
      actions={acoes}
      actionsVisible={modo === "apagar"}
    />
  );
}
