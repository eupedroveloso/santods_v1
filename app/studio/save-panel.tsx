"use client";

import { useState } from "react";
import { countOverrides } from "@/lib/tokens/brand";
import type { Brand } from "@/lib/tokens/types";

type Status = { kind: "idle" | "saving" | "ok" | "error"; message?: string };

export function SavePanel({
  brand,
  brandMeta,
  setBrandMeta,
  onSaved,
  onClose,
}: {
  brand: Brand;
  brandMeta: { id: string; name: string; description: string };
  setBrandMeta: (meta: { id: string; name: string; description: string }) => void;
  onSaved: (id: string) => void;
  onClose: () => void;
}) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const count = countOverrides(brand.overrides);
  const slugOk = /^[a-z0-9][a-z0-9-]*$/.test(brandMeta.id);

  async function save() {
    setStatus({ kind: "saving" });
    try {
      const res = await fetch("/api/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...brand, ...brandMeta }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Falha ao salvar");
      setStatus({ kind: "ok", message: data.message });
      onSaved(brandMeta.id);
    } catch (error) {
      setStatus({ kind: "error", message: error instanceof Error ? error.message : String(error) });
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-overlay p-lg">
      <div className="flex w-full max-w-(--santo-dimension-container-sm) flex-col gap-md rounded-xl border-thin border-border-subtle bg-surface-raised p-lg shadow-2xl">
        <div className="flex flex-col gap-3xs">
          <h2 className="santo-heading-6-semibold">Salvar marca</h2>
          <p className="santo-caption-regular text-text-secondary">
            Grava <code className="santo-code-sm">brands/{brandMeta.id || "<id>"}.json</code> com os{" "}
            {count} override{count === 1 ? "" : "s"} e regenera o CSS da marca. Os demais{" "}
            {345 - Object.keys(brand.overrides.variables).length} tokens continuam herdando do Figma.
          </p>
        </div>

        <label className="flex flex-col gap-2xs">
          <span className="santo-body-small-medium">Identificador</span>
          <input
            value={brandMeta.id}
            onChange={(e) => setBrandMeta({ ...brandMeta, id: e.target.value.toLowerCase() })}
            placeholder="acme"
            className="santo-code-md w-full rounded-md border-thin border-border-default bg-input-default px-sm py-xs text-text-primary"
          />
          {!slugOk && (
            <span className="santo-caption-regular text-text-danger">
              Use minúsculas, números e hífen. Vira o valor de data-brand.
            </span>
          )}
        </label>

        <label className="flex flex-col gap-2xs">
          <span className="santo-body-small-medium">Nome</span>
          <input
            value={brandMeta.name}
            onChange={(e) => setBrandMeta({ ...brandMeta, name: e.target.value })}
            placeholder="Acme"
            className="santo-body-regular w-full rounded-md border-thin border-border-default bg-input-default px-sm py-xs text-text-primary"
          />
        </label>

        <label className="flex flex-col gap-2xs">
          <span className="santo-body-small-medium">Descrição</span>
          <textarea
            value={brandMeta.description}
            onChange={(e) => setBrandMeta({ ...brandMeta, description: e.target.value })}
            rows={3}
            placeholder="Para que serve esta marca e o que ela muda."
            className="santo-body-regular w-full rounded-md border-thin border-border-default bg-input-default px-sm py-xs text-text-primary"
          />
        </label>

        {status.kind === "ok" && (
          <p className="santo-caption-regular rounded-md bg-success-subtle-default px-sm py-xs text-text-success">
            {status.message}
          </p>
        )}
        {status.kind === "error" && (
          <p className="santo-caption-regular rounded-md bg-danger-subtle-default px-sm py-xs text-text-danger">
            {status.message}
          </p>
        )}

        <div className="flex items-center gap-xs">
          <button
            type="button"
            onClick={save}
            disabled={!slugOk || status.kind === "saving"}
            className="santo-body-small-semibold cursor-pointer rounded-md bg-brand-solid-default px-md py-xs text-text-on-brand hover:bg-brand-solid-hover disabled:cursor-not-allowed disabled:bg-disabled disabled:text-text-disabled"
          >
            {status.kind === "saving" ? "Salvando…" : "Salvar no repositório"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="santo-body-small-semibold cursor-pointer rounded-md px-md py-xs text-text-secondary hover:bg-neutral-subtle-hover"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
