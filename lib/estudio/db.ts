import { mkdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import * as schema from "./schema";

/**
 * Conexão do Estúdio. Padrão: SQLite local em data/estudio.db (fora do git).
 * Trocar por Turso é só `ESTUDIO_DATABASE_URL=libsql://…` + `ESTUDIO_DATABASE_AUTH_TOKEN`
 * (ver .env.example); Postgres pede outro driver do drizzle, não outro repo.
 *
 * As migrações de drizzle/ rodam uma vez por processo, na primeira consulta:
 * o dev server do andar sobe sem passo manual.
 */
const DEFAULT_URL = "file:data/estudio.db";

function connect() {
  const url = process.env.ESTUDIO_DATABASE_URL || DEFAULT_URL;
  if (url.startsWith("file:")) mkdirSync(dirname(resolve(url.slice("file:".length))), { recursive: true });
  const client = createClient({ url, authToken: process.env.ESTUDIO_DATABASE_AUTH_TOKEN });
  return drizzle(client, { schema });
}

type Db = ReturnType<typeof connect>;

const MIGRATIONS = resolve(process.cwd(), "drizzle");

/** Quantas migrações o journal tem: muda quando `db:generate` grava uma nova. */
const versao = () => readFileSync(resolve(MIGRATIONS, "meta/_journal.json"), "utf8").length;

// Guardado no globalThis: o HMR do dev recarrega o módulo e abriria outra conexão.
// A chave é o journal: migração nova roda sem reiniciar o dev server.
const cache = globalThis as unknown as { estudioDb?: { versao: number; conn: Promise<Db> } };

export function db(): Promise<Db> {
  const atual = versao();
  if (cache.estudioDb?.versao !== atual) {
    const conn = (async () => {
      const c = connect();
      await c.run("PRAGMA foreign_keys = ON");
      await migrate(c, { migrationsFolder: MIGRATIONS });
      return c;
    })().catch((error) => {
      cache.estudioDb = undefined;
      throw error;
    });
    cache.estudioDb = { versao: atual, conn };
  }
  return cache.estudioDb.conn;
}
