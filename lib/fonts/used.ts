import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { TokenDoc } from "@/lib/tokens/types";

/**
 * Todas as famílias tipográficas que o app pode renderizar.
 *
 * Saem dos tokens `brand/family/*` do Figma. Roda no servidor, na montagem do
 * layout, para as folhas do Google Fonts irem no HTML inicial em vez de
 * aparecerem depois e causarem troca de fonte na frente do usuário.
 */
export async function familiesInUse(): Promise<string[]> {
  const doc: TokenDoc = JSON.parse(
    await readFile(join(process.cwd(), "tokens/santods.figma.json"), "utf8"),
  );

  const families = new Set<string>();
  const add = (v: unknown) => {
    if (typeof v === "string" && v.trim() && !v.startsWith("{")) families.add(v);
  };

  add(doc.collections.Brand?.variables?.["brand/family/sans"]?.value);
  add(doc.collections.Brand?.variables?.["brand/family/mono"]?.value);

  return [...families].sort();
}
