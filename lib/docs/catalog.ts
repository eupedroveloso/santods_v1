/**
 * Catalogo do site de docs — contrato (tipos em ./catalog.types.ts):
 *  1. listCollections(): CollectionSummary[] — colecoes do Figma, slug kebab, rota /tokens/[slug].
 *  2. getCollection(slug): CollectionDetail | null — variaveis agrupadas pelo prefixo do nome.
 *     Cada variavel: nome do Figma, tipo, valor por modo (literal final + cadeia de alias),
 *     cssVar (--santo-*) e classe Tailwind quando o theme.css a expoe.
 *  3. listTextStyles(): TextStyleEntry[] — classe santo-*, familia, peso, tamanho, leading, tracking, tokens.
 *  4. listEffectStyles(): EffectStyleEntry[] — --santo-shadow-*, shadow-*, camadas.
 *  5. listIdentities(): IdentityEntry[] — um item por modo da colecao Brand.
 *     listMotion(): MotionCatalog — duracoes (ms) e curvas (cubic-bezier) com var CSS e classe.
 *  6. searchIndex(): SearchEntry[] — lista plana token / text style / effect style com rota#ancora.
 * Server-only e sincrono: le tokens/santods.figma.json uma vez, no build. Nomes de CSS vem de
 * lib/tokens/emit.mjs (mesmo caminho do build), entao o que a doc mostra e o que o CSS declara.
 */
import "server-only";
import { readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import type { TokenDoc } from "@/lib/tokens/types";
import { buildCatalog, summaryOf, type Catalog } from "./build-catalog";

export type * from "./catalog.types";

const SNAPSHOT = join(process.cwd(), "tokens/santods.figma.json");
let cached: { mtimeMs: number; catalog: Catalog } | undefined;

/** Relido quando o snapshot muda (mtime): em `next dev` a doc acompanha `npm run tokens`. */
function catalog(): Catalog {
  const { mtimeMs } = statSync(SNAPSHOT);
  if (!cached || cached.mtimeMs !== mtimeMs) {
    const doc: TokenDoc = JSON.parse(readFileSync(SNAPSHOT, "utf8"));
    cached = { mtimeMs, catalog: buildCatalog(doc) };
  }
  return cached.catalog;
}

export const listCollections = () => catalog().collections.map(summaryOf);

export const getCollection = (slug: string) => catalog().collections.find((c) => c.slug === slug) ?? null;

export const listTextStyles = () => catalog().textStyles;

export const listEffectStyles = () => catalog().effectStyles;

export const listIdentities = () => catalog().identities;

export const listMotion = () => catalog().motion;

export const searchIndex = () => catalog().search;
