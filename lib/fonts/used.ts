import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import type { Brand, TokenDoc } from "@/lib/tokens/types";

/**
 * Todas as famílias tipográficas que o app pode renderizar.
 *
 * É a base do Figma mais o que cada marca sobrescreve. Roda no servidor, na
 * montagem do layout, para as folhas do Google Fonts irem no HTML inicial em vez
 * de aparecerem depois e causarem troca de fonte na frente do usuário.
 */
export async function familiesInUse(): Promise<string[]> {
  const root = process.cwd();
  const base: TokenDoc = JSON.parse(
    await readFile(join(root, "tokens/santods.figma.json"), "utf8"),
  );

  const families = new Set<string>();
  const add = (v: unknown) => {
    if (typeof v === "string" && v.trim() && !v.startsWith("{")) families.add(v);
  };

  add(base.collections.Brand?.variables?.["brand/family/sans"]?.value);
  add(base.collections.Brand?.variables?.["brand/family/mono"]?.value);

  try {
    const dir = join(root, "brands");
    for (const file of (await readdir(dir)).filter((f) => f.endsWith(".json"))) {
      const brand: Brand = JSON.parse(await readFile(join(dir, file), "utf8"));
      add(brand.overrides?.variables?.["brand/family/sans"]?.value);
      add(brand.overrides?.variables?.["brand/family/mono"]?.value);
    }
  } catch {
    // Sem pasta de marcas: só a base.
  }

  return [...families].sort();
}
