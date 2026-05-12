import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { sites } from "./sites"

export const sops = pgTable("sops", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  siteId: uuid("site_id")
    .notNull()
    .references(() => sites.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  content: text("content"), // Markdown content
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})
