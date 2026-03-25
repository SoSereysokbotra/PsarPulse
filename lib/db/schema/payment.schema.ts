import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  decimal,
  jsonb,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users.schema";
import { vendors } from "./vendor.schema";

export const paymentTransactions = pgTable("payment_transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  transactionId: varchar("transaction_id", { length: 255 }).notNull().unique(),
  provider: varchar("provider", { length: 50 }).default("bakong").notNull(),
  providerStatus: varchar("provider_status", { length: 50 }),
  status: varchar("status", { length: 50 })
    .$type<"pending" | "completed" | "failed">()
    .default("pending")
    .notNull(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  vendorId: uuid("vendor_id").references(() => vendors.id, {
    onDelete: "set null",
  }),
  planCode: varchar("plan_code", { length: 50 })
    .$type<"pro" | "premium">()
    .notNull(),
  billingCycle: varchar("billing_cycle", { length: 20 })
    .$type<"monthly" | "annual">()
    .notNull(),
  method: varchar("method", { length: 20 })
    .$type<"aba" | "acleda" | "bakong">()
    .notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 10 }).notNull(),
  description: text("description"),
  qrString: text("qr_string"),
  webhookPayload: jsonb("webhook_payload"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const paymentTransactionsRelations = relations(
  paymentTransactions,
  ({ one }) => ({
    user: one(users, {
      fields: [paymentTransactions.userId],
      references: [users.id],
    }),
    vendor: one(vendors, {
      fields: [paymentTransactions.vendorId],
      references: [vendors.id],
    }),
  }),
);
