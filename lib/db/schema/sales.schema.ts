import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  decimal,
  text,
  integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { vendors } from "./vendor.schema";

export const vendorSales = pgTable("vendor_sales", {
  id: uuid("id").primaryKey().defaultRandom(),
  vendorId: uuid("vendor_id")
    .references(() => vendors.id, { onDelete: "cascade" })
    .notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  method: varchar("method", { length: 50 }).$type<"Cash" | "ABA/KHQR" | "Other">().notNull(),
  items: text("items"), // Simple comma-separated or JSON list of items
  category: varchar("category", { length: 100 }), // Added for AI categorization
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const vendorSalesRelations = relations(vendorSales, ({ one }) => ({
  vendor: one(vendors, {
    fields: [vendorSales.vendorId],
    references: [vendors.id],
  }),
}));

export const vendorDailyReports = pgTable("vendor_daily_reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  vendorId: uuid("vendor_id")
    .references(() => vendors.id, { onDelete: "cascade" })
    .notNull(),
  reportDate: timestamp("report_date").notNull(),
  totalSales: decimal("total_sales", { precision: 12, scale: 2 }).notNull(),
  totalExpenses: decimal("total_expenses", { precision: 12, scale: 2 }).notNull(),
  netProfit: decimal("net_profit", { precision: 12, scale: 2 }).notNull(),
  isLocked: integer("is_locked").default(0), // 0: Open, 1: Locked
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const vendorDailyReportsRelations = relations(vendorDailyReports, ({ one }) => ({
  vendor: one(vendors, {
    fields: [vendorDailyReports.vendorId],
    references: [vendors.id],
  }),
}));
