// Documentation: d:\dev\moto-dashboard\specs\02-specs\database\user-profiles.md
import { boolean, pgSchema, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"

const authSchema = pgSchema("auth")

export const users = authSchema.table("users", {
  id: uuid("id").primaryKey().notNull(),
})

export const userProfiles = pgTable("user_profiles", {
  id: uuid("id")
    .primaryKey()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  displayName: text("display_name"),
  avatarUrl: text("avatar_url"),
  isSystemAdmin: boolean("is_system_admin").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})
