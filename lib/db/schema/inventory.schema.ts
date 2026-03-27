import {
  pgTable,
  uuid,
  varchar,
  integer,
  decimal,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { vendors } from "./vendor.schema";

export const vendorInventory = pgTable("vendor_inventory", {
  id: uuid("id").primaryKey().defaultRandom(),
  vendorId: uuid("vendor_id")
    .references(() => vendors.id, { onDelete: "cascade" })
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  khmerName: varchar("khmer_name", { length: 255 }),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  stock: integer("stock").default(0).notNull(),
  threshold: integer("threshold").default(10).notNull(),
  status: varchar("status", { length: 50 })
    .$type<"good" | "low" | "out">()
    .default("good"),
  category: varchar("category", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const vendorInventoryRelations = relations(vendorInventory, ({ one }) => ({
  vendor: one(vendors, {
    fields: [vendorInventory.vendorId],
    references: [vendors.id],
  }),
}));
