"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Card, Count, Disclosure } from "@/lib/ui";
import { SectionLabel } from "../../_docs/page-header";
import { groupAnchor } from "./groups";

export type RoleItem = {
  /** `heading-1` — tambem e o id do item (#heading-1). */
  role: string;
  count: number;
  /** Classe santo-* da amostra inline do cabecalho. */
  sampleClass: string;
  /** Slugs dos estilos do papel: #heading-1-light abre este item. */
  slugs: string[];
  /** Linhas dos pesos, ja renderizadas no servidor. */
  content: ReactNode;
};

export type RoleGroup = { id: string; label: string; count: number; roles: RoleItem[] };

/**
 * Acordeao dos papeis de texto. O primeiro abre sozinho; a hash manda:
 * #heading-1 abre o papel, #heading-1-light abre o papel do estilo, e o item
 * aberto pela pessoa vai para a hash (link direto).
 */
export function TypeAccordion({ groups }: { groups: RoleGroup[] }) {
  const roles = useMemo(() => groups.flatMap((g) => g.roles), [groups]);
  const [open, setOpen] = useState<Set<string>>(() => new Set(roles.slice(0, 1).map((r) => r.role)));

  const roleOf = useCallback(
    (hash: string) => {
      const group = groups.find((g) => groupAnchor(g.id) === hash);
      if (group) return group.roles[0]?.role ?? null;
      return roles.find((r) => r.role === hash || r.slugs.includes(hash))?.role ?? null;
    },
    [groups, roles],
  );

  useEffect(() => {
    const sync = () => {
      const hash = decodeURIComponent(window.location.hash.slice(1));
      const role = hash ? roleOf(hash) : null;
      if (!role) return;
      setOpen((prev) => (prev.has(role) ? prev : new Set(prev).add(role)));
      // O alvo pode estar dentro do item recem-aberto: rola depois de pintar.
      requestAnimationFrame(() => document.getElementById(hash)?.scrollIntoView());
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [roleOf]);

  const toggle = (role: string) => {
    const opening = !open.has(role);
    setOpen((prev) => {
      const next = new Set(prev);
      if (opening) next.add(role);
      else next.delete(role);
      return next;
    });
    const url = new URL(window.location.href);
    if (opening) url.hash = role;
    else if (decodeURIComponent(url.hash.slice(1)) === role) url.hash = "";
    window.history.replaceState(null, "", url);
  };

  return (
    <div className="flex flex-col gap-3xl">
      {groups.map((g) => (
        <section key={g.id} id={groupAnchor(g.id)} className="flex scroll-mt-6xl flex-col gap-sm">
          <span className="flex items-center gap-xs">
            <SectionLabel>{g.label}</SectionLabel>
            <Count>{g.count}</Count>
          </span>
          <Card padded={false} className="overflow-hidden">
            {g.roles.map((r) => (
              <Disclosure
                key={r.role}
                id={r.role}
                variant="row"
                open={open.has(r.role)}
                onToggle={() => toggle(r.role)}
                label={
                  <span className="flex min-w-0 items-center gap-md">
                    <span className="santo-body-small-semibold text-text-primary">{r.role}</span>
                    <span className={`${r.sampleClass} truncate text-text-secondary`}>Aa</span>
                  </span>
                }
                trailing={<Count>{r.count}</Count>}
              >
                {r.content}
              </Disclosure>
            ))}
          </Card>
        </section>
      ))}
    </div>
  );
}
