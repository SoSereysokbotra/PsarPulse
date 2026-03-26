import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  decimal,
  text,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { vendors } from "./vendor.schema";

export const vendorExpenses = pgTable("vendor_expenses", {
  id: uuid("id").primaryKey().defaultRandom(),
  vendorId: uuid("vendor_id")
    .references(() => vendors.id, { onDelete: "cascade" })
    .notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  description: text("description"),
  expenseDate: timestamp("expense_date").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const vendorExpensesRelations = relations(vendorExpenses, ({ one }) => ({
  vendor: one(vendors, {
    fields: [vendorExpenses.vendorId],
    references: [vendors.id],
  }),
}));
