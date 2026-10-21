import { defineConfig } from "drizzle-kit";

/** Migrações do Estúdio: `npm run db:generate` depois de mudar lib/estudio/schema.ts. */
export default defineConfig({
  dialect: process.env.ESTUDIO_DATABASE_URL?.startsWith("libsql:") ? "turso" : "sqlite",
  schema: "./lib/estudio/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.ESTUDIO_DATABASE_URL || "file:data/estudio.db",
    authToken: process.env.ESTUDIO_DATABASE_AUTH_TOKEN,
  },
});
