import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import type { Brand, TokenDoc } from "@/lib/tokens/types";
import { Studio } from "./studio";

export const metadata = { title: "SantoDS Studio" };
export const dynamic = "force-dynamic";

async function loadBrands(): Promise<Brand[]> {
  const dir = join(process.cwd(), "brands");
  const files = (await readdir(dir)).filter((f) => f.endsWith(".json"));
  const brands: Brand[] = await Promise.all(
    files.map(async (f) => JSON.parse(await readFile(join(dir, f), "utf8"))),
  );
  return brands.sort((a, b) => (a.id === "santo" ? -1 : b.id === "santo" ? 1 : a.id.localeCompare(b.id)));
}

export default async function StudioPage() {
  const base: TokenDoc = JSON.parse(
    await readFile(join(process.cwd(), "tokens/santods.figma.json"), "utf8"),
  );
  return <Studio base={base} brands={await loadBrands()} />;
}
