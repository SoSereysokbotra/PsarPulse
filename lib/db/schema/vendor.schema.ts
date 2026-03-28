import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  decimal,
  integer,
  jsonb,
} from "drizzle-orm/pg-core";
import { sql, relations } from "drizzle-orm";
import { users } from "./users.schema";

// Vendor Plans
export const vendorPlans = pgTable("vendor_plans", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 50 })
    .$type<"free" | "pro" | "premium">()
    .notNull()
    .unique(),
  description: text("description"),
  monthlyPrice: decimal("monthly_price", { precision: 10, scale: 2 }).default(
    "0",
  ),
  yearlyPrice: decimal("yearly_price", { precision: 10, scale: 2 }),
  features: jsonb("features").default(sql`'[]'::jsonb`),
  maxProducts: integer("max_products"),
  maxCustomers: integer("max_customers"),
  maxUsers: integer("max_users"),
  hasAdvancedReports: boolean("has_advanced_reports").default(false),
  hasAPI: boolean("has_api").default(false),
  priority: integer("priority").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Vendors
export const vendors = pgTable("vendors", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull()
    .unique(),
  businessName: varchar("business_name", { length: 255 }).notNull(),
  businessEmail: varchar("business_email", { length: 255 }).notNull(),
  businessPhone: varchar("business_phone", { length: 20 }),
  businessLogo: varchar("business_logo", { length: 512 }),
  businessDescription: text("business_description"),
  businessAddress: text("business_address"),
  taxId: varchar("tax_id", { length: 50 }),
  planId: uuid("plan_id")
    .references(() => vendorPlans.id)
    .notNull(),
  subscriptionStatus: varchar("subscription_status", { length: 50 })
    .$type<"active" | "trial" | "suspended" | "cancelled">()
    .default("trial"),
  trialEndsAt: timestamp("trial_ends_at"),
  subscriptionStartedAt: timestamp("subscription_started_at"),
  subscriptionEndsAt: timestamp("subscription_ends_at"),
  isVerified: boolean("is_verified").default(false),
  verificationStatus: varchar("verification_status", { length: 50 })
    .$type<"pending" | "approved" | "rejected">()
    .default("pending"),
  status: varchar("status", { length: 50 })
    .$type<"active" | "inactive" | "blocked">()
    .default("active"),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  isPublic: boolean("is_public").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Vendor Subscriptions
export const vendorSubscriptions = pgTable("vendor_subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  vendorId: uuid("vendor_id")
    .references(() => vendors.id, { onDelete: "cascade" })
    .notNull(),
  planId: uuid("plan_id")
    .references(() => vendorPlans.id)
    .notNull(),
  billingCycle: varchar("billing_cycle", { length: 20 })
    .$type<"monthly" | "yearly">()
    .notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  stripeSubscriptionId: varchar("stripe_subscription_id", { length: 255 }),
  nextBillingDate: timestamp("next_billing_date").notNull(),
  isAutoRenew: boolean("is_auto_renew").default(true),
  status: varchar("status", { length: 50 })
    .$type<"active" | "past_due" | "cancelled">()
    .default("active"),
  cancelledAt: timestamp("cancelled_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Vendor Team Members
export const vendorTeamMembers = pgTable("vendor_team_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  vendorId: uuid("vendor_id")
    .references(() => vendors.id, { onDelete: "cascade" })
    .notNull(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  role: varchar("role", { length: 50 })
    .$type<"owner" | "manager" | "staff" | "viewer">()
    .notNull(),
  permissions: jsonb("permissions").default(sql`'[]'::jsonb`),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
  removedAt: timestamp("removed_at"),
  isActive: boolean("is_active").default(true),
});

// Admin Users
export const admins = pgTable("admins", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull()
    .unique(),
  role: varchar("role", { length: 50 })
    .$type<"super_admin" | "admin" | "moderator">()
    .notNull(),
  permissions: jsonb("permissions").default(sql`'[]'::jsonb`),
  canManageVendors: boolean("can_manage_vendors").default(false),
  canManageUsers: boolean("can_manage_users").default(false),
  canManagePlans: boolean("can_manage_plans").default(false),
  canManageBilling: boolean("can_manage_billing").default(false),
  canViewAnalytics: boolean("can_view_analytics").default(false),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Vendor Requests
export const vendorRequests = pgTable("vendor_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  businessName: varchar("business_name", { length: 255 }).notNull(),
  businessEmail: varchar("business_email", { length: 255 }).notNull(),
  businessPhone: varchar("business_phone", { length: 20 }),
  businessAddress: text("business_address"),
  businessDescription: text("business_description"),
  businessCategory: varchar("business_category", { length: 100 }),
  requiredPlan: varchar("required_plan", { length: 50 })
    .$type<"free" | "pro" | "premium">()
    .default("free"),
  status: varchar("status", { length: 50 })
    .$type<"pending" | "approved" | "rejected">()
    .default("pending"),
  reasonForRejection: text("reason_for_rejection"),
  reviewedBy: uuid("reviewed_by").references(() => admins.id),
  reviewedAt: timestamp("reviewed_at"),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Audit Logs
export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  adminId: uuid("admin_id").references(() => admins.id),
  action: varchar("action", { length: 100 }).notNull(),
  entityType: varchar("entity_type", { length: 50 }).notNull(),
  entityId: uuid("entity_id"),
  changes: jsonb("changes").default(sql`'{}'::jsonb`),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Support Notes (internal admin notes per user)
export const supportNotes = pgTable("support_notes", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  adminId: uuid("admin_id")
    .references(() => admins.id)
    .notNull(),
  note: text("note").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Platform Settings
export const platformSettings = pgTable("platform_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: text("value").notNull(),
  label: varchar("label", { length: 200 }),
  updatedById: uuid("updated_by_id").references(() => admins.id),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const vendorPlansRelations = relations(vendorPlans, ({ many }) => ({
  vendors: many(vendors),
  subscriptions: many(vendorSubscriptions),
}));

export const vendorsRelations = relations(vendors, ({ one, many }) => ({
  user: one(users, {
    fields: [vendors.userId],
    references: [users.id],
  }),
  plan: one(vendorPlans, {
    fields: [vendors.planId],
    references: [vendorPlans.id],
  }),
  subscriptions: many(vendorSubscriptions),
  teamMembers: many(vendorTeamMembers),
  requests: many(vendorRequests),
}));

export const vendorSubscriptionsRelations = relations(
  vendorSubscriptions,
  ({ one }) => ({
    vendor: one(vendors, {
      fields: [vendorSubscriptions.vendorId],
      references: [vendors.id],
    }),
    plan: one(vendorPlans, {
      fields: [vendorSubscriptions.planId],
      references: [vendorPlans.id],
    }),
  }),
);

export const vendorTeamMembersRelations = relations(
  vendorTeamMembers,
  ({ one }) => ({
    vendor: one(vendors, {
      fields: [vendorTeamMembers.vendorId],
      references: [vendors.id],
    }),
    user: one(users, {
      fields: [vendorTeamMembers.userId],
      references: [users.id],
    }),
  }),
);

export const adminsRelations = relations(admins, ({ one, many }) => ({
  user: one(users, {
    fields: [admins.userId],
    references: [users.id],
  }),
  vendorRequests: many(vendorRequests),
  auditLogs: many(auditLogs),
}));

export const vendorRequestsRelations = relations(vendorRequests, ({ one }) => ({
  user: one(users, {
    fields: [vendorRequests.userId],
    references: [users.id],
  }),
  admin: one(admins, {
    fields: [vendorRequests.reviewedBy],
    references: [admins.id],
  }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  admin: one(admins, {
    fields: [auditLogs.adminId],
    references: [admins.id],
  }),
}));
