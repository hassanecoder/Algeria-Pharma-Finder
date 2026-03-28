import { pgTable, integer, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const wilayasTable = pgTable("wilayas", {
  id: integer("id").primaryKey(),
  code: varchar("code", { length: 3 }).notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  name_ar: varchar("name_ar", { length: 100 }).notNull(),
  region: varchar("region", { length: 50 }).notNull(),
});

export const insertWilayaSchema = createInsertSchema(wilayasTable);
export type InsertWilaya = z.infer<typeof insertWilayaSchema>;
export type Wilaya = typeof wilayasTable.$inferSelect;
