import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  decimal,
  integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { vendors } from "./vendor.schema";

export const vendorCustomers = pgTable("vendor_customers", {
  id: uuid("id").primaryKey().defaultRandom(),
  vendorId: uuid("vendor_id")
    .references(() => vendors.id, { onDelete: "cascade" })
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 255 }),
  totalSpent: decimal("total_spent", { precision: 12, scale: 2 }).default("0"),
  points: integer("points").default(0),
  lastVisit: timestamp("last_visit"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const vendorCustomersRelations = relations(vendorCustomers, ({ one }) => ({
  vendor: one(vendors, {
    fields: [vendorCustomers.vendorId],
    references: [vendors.id],
  }),
}));

export const vendorTrafficLogs = pgTable("vendor_traffic_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  vendorId: uuid("vendor_id")
    .references(() => vendors.id, { onDelete: "cascade" })
    .notNull(),
  count: integer("count").notNull(),
  status: varchar("status", { length: 50 }).notNull(), // Regular / Peak Traffic
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const vendorTrafficLogsRelations = relations(vendorTrafficLogs, ({ one }) => ({
  vendor: one(vendors, {
    fields: [vendorTrafficLogs.vendorId],
    references: [vendors.id],
  }),
}));
