import { doublePrecision, integer, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { organizations } from "./organizations"
import { userProfiles } from "./user-profiles"

export const sites = pgTable("sites", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  code: text("code"),
  address: text("address"),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
  mapImageUrl: text("map_image_url"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const siteContacts = pgTable("site_contacts", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  siteId: uuid("site_id")
    .notNull()
    .references(() => sites.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  email: text("email"),
  phoneNumber: text("phone_number"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const buildings = pgTable("buildings", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  siteId: uuid("site_id")
    .notNull()
    .references(() => sites.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  address: text("address"),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
  orderIndex: integer("order_index").default(0).notNull(),
  exteriorImageUrl: text("exterior_image_url"),
  sitePlanUrl: text("site_plan_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const floors = pgTable("floors", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  buildingId: uuid("building_id")
    .notNull()
    .references(() => buildings.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  levelNumber: integer("level_number"),
  orderIndex: integer("order_index").default(0).notNull(),
  floorPlanUrl: text("floor_plan_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const zones = pgTable("zones", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  floorId: uuid("floor_id")
    .notNull()
    .references(() => floors.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  orderIndex: integer("order_index").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const siteRoleEnum = pgEnum("site_role", ["manager", "editor", "viewer"])

export const siteMembers = pgTable("site_members", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  siteId: uuid("site_id")
    .notNull()
    .references(() => sites.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => userProfiles.id, { onDelete: "cascade" }),
  role: siteRoleEnum("role").notNull().default("viewer"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})
