import { readFile, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";

/**
 * Persistencia das marcas do Studio.
 *
 * Escreve em brands/<id>.json no repositorio, entao so responde em
 * desenvolvimento. Em producao o Studio continua funcionando para editar e
 * exportar; so o botao de salvar fica indisponivel.
 */

const BRANDS_DIR = join(process.cwd(), "brands");
const ID = /^[a-z0-9][a-z0-9-]*$/;

function devOnly() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Salvar marca só funciona em desenvolvimento. Use Exportar e commite o arquivo." },
      { status: 403 },
    );
  }
  return null;
}

export async function GET() {
  const blocked = devOnly();
  if (blocked) return blocked;
  const files = (await readdir(BRANDS_DIR)).filter((f) => f.endsWith(".json"));
  const brands = await Promise.all(
    files.map(async (f) => JSON.parse(await readFile(join(BRANDS_DIR, f), "utf8"))),
  );
  return NextResponse.json({ brands });
}

export async function POST(request: Request) {
  const blocked = devOnly();
  if (blocked) return blocked;

  const body = await request.json();
  const { id, name, description, overrides } = body ?? {};

  if (typeof id !== "string" || !ID.test(id)) {
    return NextResponse.json(
      { error: "Identificador inválido. Use minúsculas, números e hífen." },
      { status: 400 },
    );
  }
  if (!overrides || typeof overrides !== "object") {
    return NextResponse.json({ error: "Payload sem overrides." }, { status: 400 });
  }

  const brand = {
    id,
    name: typeof name === "string" && name.trim() ? name.trim() : id,
    description: typeof description === "string" ? description : "",
    overrides: {
      variables: overrides.variables ?? {},
      textStyles: overrides.textStyles ?? {},
      effectStyles: overrides.effectStyles ?? {},
    },
  };

  await writeFile(join(BRANDS_DIR, `${id}.json`), JSON.stringify(brand, null, 2) + "\n", "utf8");

  const count =
    Object.keys(brand.overrides.variables).length +
    Object.keys(brand.overrides.textStyles).length +
    Object.keys(brand.overrides.effectStyles).length;

  return NextResponse.json({
    ok: true,
    message: `brands/${id}.json gravado com ${count} override${count === 1 ? "" : "s"}. Rode \`npm run tokens\` para gerar o CSS da marca.`,
  });
}
