/**
 * Nucleo puro do catalogo de documentacao: recebe o doc de tokens, devolve as
 * estruturas que o site de docs renderiza. Sem disco, sem framework — e o que
 * permite testar com `node` direto. Quem le o arquivo e lib/docs/catalog.ts.
 *
 * Toda regra de nome (var CSS, classe, chave do @theme) vem de emit.mjs: este
 * modulo so organiza, nunca reinventa como um token vira CSS.
 */
import * as emitModule from "../tokens/emit.mjs";
// emit.mjs e JS: o TypeScript infere tipos frouxos dele. As assinaturas de verdade
// estao em emit.d.ts, que so e resolvido pelo import sem extensao (apagado em runtime).
import type * as Emit from "../tokens/emit";
import type { IndexEntry } from "../tokens/emit";
import type { RawValue, TokenDoc } from "../tokens/types";
import type {
  CatalogVariable,
  CollectionDetail,
  CollectionSummary,
  EffectStyleEntry,
  IdentityEntry,
  MotionCatalog,
  ModeValue,
  SearchEntry,
  TextStyleEntry,
  VariableGroup,
} from "./catalog.types";

const {
  aliasTarget,
  buildIndex,
  isAlias,
  resolveValue,
  shadowCss,
  shadowVarOf,
  textRoleOf,
  textStyleClass,
  textStyleCss,
  toCss,
  trackingByPercent,
  unitOf,
  utilityClassOf,
  varNameOf,
} = emitModule as unknown as typeof Emit;

export type Catalog = {
  collections: CollectionDetail[];
  textStyles: TextStyleEntry[];
  effectStyles: EffectStyleEntry[];
  identities: IdentityEntry[];
  motion: MotionCatalog;
  search: SearchEntry[];
};

export const ROUTES = {
  collection: (slug: string) => `/tokens/${slug}`,
  typography: "/estilos/tipografia",
  effects: "/estilos/efeitos",
  motion: "/estilos/movimento",
} as const;

/** Degrau de reserva quando a familia nao tem color/bg/<familia>/solid/default. */
const PALETTE_FALLBACK_STEP = "500";

export const slugify = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/**
 * Grupo de exibicao: o caminho sem o ultimo segmento. Se todas as variaveis da
 * colecao compartilham a mesma raiz (color/, palette/, brand/), ela sai do grupo
 * por ser redundante; colecoes mistas (Primitives, Semantic) mantem a raiz para
 * nao fundir dimension/size com type/size. Variavel na raiz cai no grupo da raiz.
 */
function groupOf(name: string, sharedRoot: string | null): string {
  const parts = name.split("/").slice(0, -1);
  if (sharedRoot && parts[0] === sharedRoot && parts.length > 1) parts.shift();
  return parts.join("/") || name.split("/")[0];
}

function aliasChainOf(index: Map<string, IndexEntry>, raw: RawValue, mode: string): string[] {
  const chain: string[] = [];
  let value = raw;
  while (isAlias(value) && !chain.includes(aliasTarget(value))) {
    const target = aliasTarget(value);
    chain.push(target);
    const entry = index.get(target);
    if (!entry) break;
    value = mode in entry.values ? entry.values[mode] : entry.values[entry.defaultMode];
  }
  return chain;
}

export function buildCatalog(doc: TokenDoc): Catalog {
  const prefix = doc.meta.cssPrefix;
  const index = buildIndex(doc);
  const tracking = trackingByPercent(index);

  const variableOf = (entry: IndexEntry, sharedRoot: string | null): CatalogVariable => {
    const values: ModeValue[] = entry.modes.map((mode) => {
      const raw = entry.values[mode] ?? entry.values[entry.defaultMode];
      const aliasChain = aliasChainOf(index, raw, mode);
      const resolved = resolveValue(index, raw, mode);
      return {
        mode,
        raw,
        alias: aliasChain[0] ?? null,
        aliasChain,
        resolved,
        css: toCss(entry.name, entry.type, resolved, prefix),
        declared: toCss(entry.name, entry.type, raw, prefix),
      };
    });
    const parts = entry.name.split("/");
    return {
      name: entry.name,
      slug: slugify(entry.name),
      collection: entry.collection,
      group: groupOf(entry.name, sharedRoot),
      leaf: parts[parts.length - 1],
      type: entry.type,
      description: entry.description,
      scopes: entry.scopes,
      cssVar: varNameOf(entry.name, prefix),
      tailwind: utilityClassOf(entry),
      unit: unitOf(entry.name, entry.type),
      values,
    };
  };

  const collections: CollectionDetail[] = Object.entries(doc.collections).map(([name, c]) => {
    const slug = slugify(name);
    const entries = [...index.values()].filter((v) => v.collection === name);
    const roots = new Set(entries.map((v) => v.name.split("/")[0]));
    const sharedRoot = roots.size === 1 ? [...roots][0] : null;
    const groups = new Map<string, VariableGroup>();
    for (const entry of entries) {
      const variable = variableOf(entry, sharedRoot);
      const group = groups.get(variable.group) ?? { name: variable.group, variables: [] };
      group.variables.push(variable);
      groups.set(variable.group, group);
    }
    return {
      name,
      slug,
      route: ROUTES.collection(slug),
      modes: c.modes,
      defaultMode: c.defaultMode,
      count: entries.length,
      groups: [...groups.values()],
    };
  });

  const numeric = (token: string, fallback: number) => {
    const entry = index.get(token);
    if (!entry) return fallback;
    return Number(resolveValue(index, entry.values[entry.defaultMode], entry.defaultMode));
  };

  const textStyles: TextStyleEntry[] = Object.entries(doc.textStyles).map(([name, s]) => {
    const role = textRoleOf(name);
    const className = textStyleClass(name, prefix);
    return {
      name,
      slug: className.slice(prefix.length + 1),
      className,
      tailwindRole: `text-${role}`,
      role,
      family: s.fontFamily,
      fontStyle: s.fontStyle,
      fontWeight: numeric(s.boundVariables.fontWeight, 400),
      fontSize: s.fontSize,
      lineHeight: s.lineHeight.value ?? s.fontSize,
      letterSpacing: s.letterSpacing.value,
      tokens: {
        fontFamily: s.boundVariables.fontFamily,
        fontSize: s.boundVariables.fontSize,
        lineHeight: s.boundVariables.lineHeight,
        fontWeight: s.boundVariables.fontWeight,
        letterSpacing: tracking.get(s.letterSpacing.value) ?? null,
      },
      css: textStyleCss(s, index, tracking, prefix),
    };
  });

  const effectStyles: EffectStyleEntry[] = Object.entries(doc.effectStyles).map(([name, def]) => ({
    name,
    slug: slugify(name),
    cssVar: shadowVarOf(name, prefix),
    tailwind: `shadow-${name}`,
    css: shadowCss(def.effects),
    layers: def.effects,
  }));

  const brand = doc.collections.Brand;
  const palette = doc.collections.Palette;
  const identities: IdentityEntry[] = (brand?.modes ?? []).map((mode) => {
    const brandValue = (token: string) => {
      const entry = index.get(token);
      return entry ? resolveValue(index, entry.values[mode] ?? entry.values[entry.defaultMode], mode) : "";
    };
    const radius = index.get("brand/shape/radius-base");
    const paletteMode = palette?.modes.includes(mode) ? mode : palette?.defaultMode ?? mode;
    const families = [
      ...new Set([...index.values()].filter((v) => v.collection === "Palette").map((v) => v.name.split("/")[1])),
    ];
    return {
      id: String(brandValue("brand/id")),
      name: String(brandValue("brand/name")),
      mode,
      slug: slugify(String(brandValue("brand/id")) || mode),
      families: { sans: String(brandValue("brand/family/sans")), mono: String(brandValue("brand/family/mono")) },
      radiusBase: {
        token: "brand/shape/radius-base",
        cssVar: varNameOf("brand/shape/radius-base", prefix),
        css: radius ? toCss(radius.name, radius.type, brandValue(radius.name), prefix) : "",
      },
      palette: families.flatMap((family) => {
        // O degrau que representa a familia e o que o fundo solido usa no modo padrao
        // (bg/brand/solid/default -> palette/brand/600): a cor que a marca de fato mostra.
        const solid = index.get(`color/bg/${family}/solid/default`);
        const solidTarget = solid ? aliasChainOf(index, solid.values[solid.defaultMode], solid.defaultMode).find((n) => n.startsWith(`palette/${family}/`)) : undefined;
        const entry = index.get(solidTarget ?? `palette/${family}/${PALETTE_FALLBACK_STEP}`);
        if (!entry) return [];
        return [
          {
            family,
            step: entry.name.split("/").pop() as string,
            token: entry.name,
            cssVar: varNameOf(entry.name, prefix),
            tailwind: utilityClassOf(entry),
            value: String(resolveValue(index, entry.values[paletteMode] ?? entry.values[entry.defaultMode], paletteMode)),
          },
        ];
      }),
      shadows: effectStyles.map((e) => ({ name: e.name, cssVar: e.cssVar, tailwind: e.tailwind })),
    };
  });

  /** Duracoes e curvas, de qualquer colecao (primitivas hoje; semanticas quando existirem). */
  const motionEntries = (prefix_: string) => [...index.values()].filter((v) => v.name.startsWith(prefix_));
  const resolvedOf = (v: IndexEntry) => resolveValue(index, v.values[v.defaultMode], v.defaultMode);
  const aliasOf = (v: IndexEntry) => aliasChainOf(index, v.values[v.defaultMode], v.defaultMode)[0] ?? null;
  const motion: MotionCatalog = {
    route: ROUTES.motion,
    durations: motionEntries("motion/duration/").map((v) => {
      const ms = Number(resolvedOf(v));
      return {
        name: v.name,
        slug: v.name.split("/").pop() as string,
        ms,
        cssVar: varNameOf(v.name, prefix),
        css: toCss(v.name, v.type, ms, prefix),
        tailwind: `duration-(${varNameOf(v.name, prefix)})`,
        alias: aliasOf(v),
        description: v.description,
      };
    }),
    easings: motionEntries("motion/easing/").map((v) => {
      const css = String(resolvedOf(v));
      const points = css.match(/^cubic-bezier\(([^)]+)\)$/)?.[1].split(",").map(Number);
      return {
        name: v.name,
        slug: v.name.split("/").pop() as string,
        css,
        bezier: points && points.length === 4 ? (points as [number, number, number, number]) : null,
        cssVar: varNameOf(v.name, prefix),
        tailwind: utilityClassOf(v),
        alias: aliasOf(v),
        description: v.description,
      };
    }),
  };

  const search: SearchEntry[] = [
    ...collections.flatMap((c) =>
      c.groups.flatMap((g) =>
        g.variables.map((v) => ({
          kind: "token" as const,
          name: v.name,
          slug: v.slug,
          route: `${c.route}#${v.slug}`,
          hint: [c.name, v.cssVar, v.tailwind].filter(Boolean).join(" "),
        })),
      ),
    ),
    ...textStyles.map((t) => ({
      kind: "text-style" as const,
      name: t.name,
      slug: t.slug,
      route: `${ROUTES.typography}#${t.slug}`,
      hint: `${t.className} ${t.tailwindRole}`,
    })),
    ...effectStyles.map((e) => ({
      kind: "effect-style" as const,
      name: e.name,
      slug: e.slug,
      route: `${ROUTES.effects}#${e.slug}`,
      hint: `${e.cssVar} ${e.tailwind}`,
    })),
  ];

  return { collections, textStyles, effectStyles, identities, motion, search };
}

export const summaryOf = (c: CollectionDetail): CollectionSummary => ({
  name: c.name,
  slug: c.slug,
  route: c.route,
  modes: c.modes,
  defaultMode: c.defaultMode,
  count: c.count,
});
