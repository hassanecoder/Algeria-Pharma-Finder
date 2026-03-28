import { pgTable, serial, integer, varchar, text, boolean, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { wilayasTable } from "./wilayas";

export const pharmaciesTable = pgTable("pharmacies", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  name_ar: varchar("name_ar", { length: 200 }),
  address: text("address").notNull(),
  commune: varchar("commune", { length: 100 }),
  wilaya_id: integer("wilaya_id").notNull().references(() => wilayasTable.id),
  phone: varchar("phone", { length: 30 }),
  phone2: varchar("phone2", { length: 30 }),
  email: varchar("email", { length: 100 }),
  latitude: real("latitude"),
  longitude: real("longitude"),
  hours_open: varchar("hours_open", { length: 10 }),
  hours_close: varchar("hours_close", { length: 10 }),
  is_24h: boolean("is_24h").default(false),
  on_duty: boolean("on_duty").default(false),
  on_duty_until: varchar("on_duty_until", { length: 50 }),
  rating: real("rating"),
  review_count: integer("review_count").default(0),
  services: text("services").array(),
  image_url: text("image_url"),
});

export const insertPharmacySchema = createInsertSchema(pharmaciesTable).omit({ id: true });
export type InsertPharmacy = z.infer<typeof insertPharmacySchema>;
export type Pharmacy = typeof pharmaciesTable.$inferSelect;
