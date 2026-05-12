import { doublePrecision, integer, jsonb, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { buildings, floors, zones } from "./sites"

export const assetStatusEnum = pgEnum("asset_status", ["active", "maintenance", "inactive", "faulty"])

export const assets = pgTable("assets", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  buildingId: uuid("building_id").references(() => buildings.id, { onDelete: "set null" }),
  floorId: uuid("floor_id").references(() => floors.id, { onDelete: "set null" }),
  zoneId: uuid("zone_id").references(() => zones.id, { onDelete: "set null" }),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'lift', 'fire_alarm_panel', 'cctv', etc.
  status: assetStatusEnum("status").default("active").notNull(),
  serialNumber: text("serial_number"),
  metadata: jsonb("metadata").default({}).notNull(),
  orderIndex: integer("order_index").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})
