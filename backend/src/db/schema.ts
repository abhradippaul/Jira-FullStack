import {
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 150 }).notNull(),
    email: varchar("email", { length: 150 }).notNull().unique(),
    password: varchar("password", { length: 150 }).notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("clerk_id_idx").on(t.email)]
);

export const userInsertSchema = createInsertSchema(users).omit({
  id: true,
  created_at: true,
  updated_at: true,
});
