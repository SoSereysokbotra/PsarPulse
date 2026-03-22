import { pgTable, uuid, varchar, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).$type<"vendor" | "admin" | "super_admin" | "customer">().default("customer").notNull(),
  status: varchar("status", { length: 50 }).$type<"active" | "pending" | "blocked" | "deleted">().default("pending").notNull(),
  isVerified: boolean("is_verified").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const refreshTokens = pgTable("refresh_tokens", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  tokenHash: varchar("token_hash", { length: 255 }).notNull(),
  familyId: uuid("family_id").notNull().defaultRandom(),
  deviceInfo: text("device_info"),
  userAgent: text("user_agent"),
  expiresAt: timestamp("expires_at").notNull(),
  revokedAt: timestamp("revoked_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const verificationCodes = pgTable("verification_codes", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  codeHash: varchar("code_hash", { length: 255 }).notNull(),
  purpose: varchar("purpose", { length: 50 }).$type<"email_verification" | "password_reset">().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  lastSentAt: timestamp("last_sent_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  refreshTokens: many(refreshTokens),
  verificationCodes: many(verificationCodes),
}));

export const refreshTokensRelations = relations(refreshTokens, ({ one }) => ({
  user: one(users, {
    fields: [refreshTokens.userId],
    references: [users.id],
  }),
}));

export const verificationCodesRelations = relations(verificationCodes, ({ one }) => ({
  user: one(users, {
    fields: [verificationCodes.userId],
    references: [users.id],
  }),
}));
