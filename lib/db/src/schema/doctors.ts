import { pgTable, serial, integer, varchar, text, boolean, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { wilayasTable } from "./wilayas";

export const doctorsTable = pgTable("doctors", {
  id: serial("id").primaryKey(),
  first_name: varchar("first_name", { length: 100 }).notNull(),
  last_name: varchar("last_name", { length: 100 }).notNull(),
  title: varchar("title", { length: 20 }),
  specialty: varchar("specialty", { length: 100 }).notNull(),
  specialty_ar: varchar("specialty_ar", { length: 100 }),
  sub_specialty: varchar("sub_specialty", { length: 100 }),
  address: text("address").notNull(),
  commune: varchar("commune", { length: 100 }),
  wilaya_id: integer("wilaya_id").notNull().references(() => wilayasTable.id),
  phone: varchar("phone", { length: 30 }),
  phone2: varchar("phone2", { length: 30 }),
  email: varchar("email", { length: 100 }),
  latitude: real("latitude"),
  longitude: real("longitude"),
  consultation_hours: varchar("consultation_hours", { length: 200 }),
  consultation_fee: integer("consultation_fee"),
  accepts_cnas: boolean("accepts_cnas").default(false),
  accepts_casnos: boolean("accepts_casnos").default(false),
  languages: text("languages").array(),
  rating: real("rating"),
  review_count: integer("review_count").default(0),
  experience_years: integer("experience_years"),
  bio: text("bio"),
  image_url: text("image_url"),
  available_today: boolean("available_today").default(true),
});

export const insertDoctorSchema = createInsertSchema(doctorsTable).omit({ id: true });
export type InsertDoctor = z.infer<typeof insertDoctorSchema>;
export type Doctor = typeof doctorsTable.$inferSelect;
