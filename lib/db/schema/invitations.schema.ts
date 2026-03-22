import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users.schema";

export const invitations = pgTable("invitations", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull(),
  token: varchar("token", { length: 255 }).notNull().unique(),
  role: varchar("role", { length: 50 })
    .$type<"vendor" | "admin">()
    .notNull(),
  status: varchar("status", { length: 50 })
    .$type<"pending" | "accepted" | "expired">()
    .default("pending"),
  expiresAt: timestamp("expires_at").notNull(),
  usedAt: timestamp("used_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const invitationsRelations = relations(invitations, ({ one }) => ({
  // Could add user relation if invitation is accepted
}));
