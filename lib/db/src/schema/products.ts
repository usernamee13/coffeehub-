import { pgTable, text, integer, jsonb, timestamp, boolean } from "drizzle-orm/pg-core";

export const productsTable = pgTable("products", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  image: text("image").notNull(),
  category: text("category").notNull(),
  roastLevel: text("roast_level"),
  origin: text("origin"),
  tastingNotes: jsonb("tasting_notes").notNull().$type<string[]>(),
  ingredients: jsonb("ingredients").notNull().$type<string[]>(),
  preparation: text("preparation").notNull(),
  available: boolean("available").notNull().default(true),
  availableUntil: timestamp("available_until"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Product = typeof productsTable.$inferSelect;
export type InsertProduct = typeof productsTable.$inferInsert;
