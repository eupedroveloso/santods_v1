import { sql } from "drizzle-orm";
import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
import type { SistemaSalvo } from "@/lib/tokens/estudio.mjs";
import { ESTILO_IDS } from "./estilos";

/**
 * Esquema do Estúdio. Mudou aqui: `npm run db:generate` grava a migração
 * versionada em drizzle/, e o app aplica na primeira conexão (db.ts).
 *
 * `base` e `overrides` são JSON livre de propósito: o formato de cada estilo
 * (valor base, fórmulas, passos editados) é o contrato do Compasso e muda sem
 * migração. Datas em ms desde a época.
 */
export const sistemas = sqliteTable("sistemas", {
  id: text("id").primaryKey(),
  nome: text("nome").notNull(),
  slug: text("slug").notNull().unique(),
  /**
   * O sistema como modo de marca (schema santods.brand-mode/1): o `salvo` que o
   * derivar() devolve, gravado só quando a derivação passa na validação.
   */
  salvo: text("salvo", { mode: "json" }).$type<SistemaSalvo>(),
  criadoEm: integer("criado_em", { mode: "timestamp_ms" }).notNull().default(sql`(unixepoch() * 1000)`),
  atualizadoEm: integer("atualizado_em", { mode: "timestamp_ms" }).notNull().default(sql`(unixepoch() * 1000)`),
});

export const estilos = sqliteTable(
  "estilos",
  {
    sistemaId: text("sistema_id")
      .notNull()
      .references(() => sistemas.id, { onDelete: "cascade" }),
    estilo: text("estilo", { enum: ESTILO_IDS }).notNull(),
    base: text("base", { mode: "json" }).$type<Record<string, unknown>>().notNull().default({}),
    overrides: text("overrides", { mode: "json" }).$type<Record<string, unknown>>().notNull().default({}),
    atualizadoEm: integer("atualizado_em", { mode: "timestamp_ms" }).notNull().default(sql`(unixepoch() * 1000)`),
  },
  // Um registro por estilo de cada sistema.
  (t) => [primaryKey({ columns: [t.sistemaId, t.estilo] })],
);

export type Sistema = typeof sistemas.$inferSelect;
export type Estilo = typeof estilos.$inferSelect;
