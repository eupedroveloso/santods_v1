import type { TokenDoc } from "@/lib/tokens/types";
import { shadowCss } from "@/lib/tokens/emit.mjs";

const cssVar = (name: string) => `var(--santo-${name.replace(/\//g, "-")})`;

function namesOf(doc: TokenDoc, collection: string, prefix: string) {
  const c = doc.collections[collection];
  if (!c) return [];
  return Object.keys(c.variables).filter((n) => n.startsWith(prefix));
}

export function Section({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-md">
      <div className="flex items-baseline gap-sm">
        <h2 className="santo-heading-6-semibold">{title}</h2>
        <span className="santo-caption-medium text-text-tertiary">{count}</span>
      </div>
      {children}
    </section>
  );
}

/**
 * Grade de foundations. Le a estrutura do doc (para refletir tokens novos) mas
 * pinta tudo com `var(--santo-*)`, entao herda o escopo em que for montada —
 * e por isso que a mesma tela serve de preview ao vivo no Studio.
 */
export function Foundations({ doc }: { doc: TokenDoc }) {
  const palette = namesOf(doc, "Palette", "palette/");
  const families = palette.reduce<Record<string, string[]>>((acc, name) => {
    const family = name.split("/")[1];
    (acc[family] ??= []).push(name);
    return acc;
  }, {});

  const colorGroups = ["surface", "bg", "text", "border", "icon"].map((group) => ({
    group,
    names: namesOf(doc, "Color", `color/${group}/`),
  }));

  const roles = [...new Set(Object.keys(doc.textStyles).map((n) => n.split("/")[1]))];
  const weights = ["light", "regular", "medium", "semibold", "bold", "extrabold"];
  const spaces = namesOf(doc, "Semantic", "space/");
  const radii = namesOf(doc, "Semantic", "radius/");
  const borders = namesOf(doc, "Semantic", "border/");
  const motion = [...namesOf(doc, "Primitives", "motion/"), ...namesOf(doc, "Primitives", "layer/")];

  return (
    <div className="flex flex-col gap-3xl">
      <Section title="Palette" count={palette.length}>
        <div className="flex flex-col gap-md">
          {Object.entries(families).map(([family, names]) => (
            <div key={family} className="flex flex-col gap-2xs">
              <h3 className="santo-body-small-semibold text-text-secondary">{family}</h3>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(72px,1fr))] gap-2xs">
                {names.map((name) => (
                  <div key={name} className="flex flex-col gap-3xs">
                    <div
                      className="h-xl w-full rounded-xs border-thin border-border-subtle"
                      style={{ background: cssVar(name) }}
                    />
                    <code className="santo-code-sm text-text-tertiary">{name.split("/")[2]}</code>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Cores semânticas" count={colorGroups.reduce((a, g) => a + g.names.length, 0)}>
        <div className="flex flex-col gap-md">
          {colorGroups.map(({ group, names }) => (
            <div key={group} className="flex flex-col gap-2xs">
              <h3 className="santo-body-small-semibold text-text-secondary">color/{group}</h3>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-xs">
                {names.map((name) => (
                  <div key={name} className="flex flex-col gap-3xs">
                    <div
                      className="h-lg w-full rounded-xs border-thin border-border-subtle"
                      style={{ background: cssVar(name) }}
                    />
                    <code className="santo-code-sm break-all text-text-tertiary">
                      {name.replace(`color/${group}/`, "")}
                    </code>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Tipografia" count={Object.keys(doc.textStyles).length}>
        <div className="flex flex-col gap-md">
          {roles.map((role) => (
            <div key={role} className="flex flex-col gap-3xs border-b-thin border-border-subtle pb-sm">
              <code className="santo-code-sm text-text-tertiary">{role}</code>
              {(role === "code" ? ["md", "sm"] : weights).map((weight) => (
                <p key={weight} className={`santo-${role}-${weight} truncate`}>
                  {role === "code" ? "JetBrains Mono " : "Albert Sans "}
                  {weight}
                </p>
              ))}
            </div>
          ))}
        </div>
      </Section>

      <Section title="Espaçamento" count={spaces.length}>
        <div className="flex flex-col gap-3xs">
          {spaces.map((name) => (
            <div key={name} className="flex items-center gap-xs">
              <code className="santo-code-sm w-5xl shrink-0 text-text-tertiary">
                {name.split("/")[1]}
              </code>
              <div className="h-2xs rounded-xs bg-brand-solid-default" style={{ width: cssVar(name) }} />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Raio e borda" count={radii.length + borders.length}>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(104px,1fr))] gap-xs">
          {radii.map((name) => (
            <div key={name} className="flex flex-col gap-3xs">
              <div
                className="h-3xl w-full border-thin border-border-strong bg-brand-subtle-default"
                style={{ borderRadius: cssVar(name) }}
              />
              <code className="santo-code-sm text-text-tertiary">{name.split("/")[1]}</code>
            </div>
          ))}
          {borders.map((name) => (
            <div key={name} className="flex flex-col gap-3xs">
              <div
                className="h-3xl w-full rounded-md border-border-strong bg-surface-raised"
                style={{ borderStyle: "solid", borderWidth: cssVar(name) }}
              />
              <code className="santo-code-sm text-text-tertiary">borda {name.split("/")[1]}</code>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Elevação" count={Object.keys(doc.effectStyles).length}>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-md">
          {Object.entries(doc.effectStyles).map(([name, def]) => (
            <div key={name} className="flex flex-col gap-2xs">
              <div
                className="h-3xl w-full rounded-lg bg-surface-raised"
                style={{ boxShadow: shadowCss(def.effects) }}
              />
              <code className="santo-code-sm text-text-tertiary">{name}</code>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Movimento e camadas" count={motion.length}>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-x-md gap-y-3xs">
          {motion.map((name) => {
            const c = doc.collections.Primitives.variables[name];
            return (
              <div key={name} className="flex items-baseline justify-between gap-xs">
                <code className="santo-code-sm text-text-secondary">{name}</code>
                <code className="santo-code-sm truncate text-text-tertiary">{String(c.value)}</code>
              </div>
            );
          })}
        </div>
      </Section>
    </div>
  );
}
