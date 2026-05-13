import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { userProfiles } from "./user-profiles"

export const organizations = pgTable("organizations", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  logoUrl: text("logo_url"),
  address: text("address"),
  profile: text("profile"),
  website: text("website"),
  contactName: text("contact_name"),
  contactMobile: text("contact_mobile"),
  contactEmail: text("contact_email"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const orgRoleEnum = pgEnum("org_role", ["owner", "admin", "member"])

export const organizationMembers = pgTable("organization_members", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => userProfiles.id, { onDelete: "cascade" }),
  role: orgRoleEnum("role").notNull().default("member"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})
