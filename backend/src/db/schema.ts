import { relations } from "drizzle-orm";
import {
  date,
  integer,
  pgTable,
  primaryKey,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

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

export const userRelations = relations(users, ({ many }) => ({
  workspaces: many(workspaces),
  workspaceMembers: many(workspaceMembers),
  task: many(tasks),
}));

export const userInsertSchema = createInsertSchema(users).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const workspaces = pgTable("workspaces", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 150 }).notNull(),
  user_id: uuid("user_id")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),
  image_url: varchar("image_url", { length: 150 }),
  invite_code: varchar("invite_code", { length: 6 }).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const workspaceRelations = relations(workspaces, ({ one, many }) => ({
  user: one(users, {
    fields: [workspaces.user_id],
    references: [users.id],
  }),
  workspaceMembers: many(workspaceMembers),
  projects: many(projects),
}));

export const workspaceMembers = pgTable(
  "workspace_members",
  {
    user_id: uuid("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),
    workspace_id: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, {
        onDelete: "cascade",
      }),
    role: varchar("role", { length: 15 }).notNull().default("member"),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    primaryKey({
      name: "workspace_member_pk",
      columns: [t.user_id, t.workspace_id],
    }),
  ]
);

export const workspaceMemberRelations = relations(
  workspaceMembers,
  ({ one }) => ({
    user: one(users, {
      fields: [workspaceMembers.user_id],
      references: [users.id],
    }),
    workspace: one(workspaces, {
      fields: [workspaceMembers.workspace_id],
      references: [workspaces.id],
    }),
  })
);

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspace_id: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id, {
      onDelete: "cascade",
    }),
  image_url: varchar("image_url", { length: 150 }),
  name: varchar("name", { length: 150 }).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const projectRelations = relations(projects, ({ one, many }) => ({
  workspace: one(workspaces, {
    fields: [projects.workspace_id],
    references: [workspaces.id],
  }),
  task: many(tasks),
}));

export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 150 }).notNull(),
  descripton: varchar("description", { length: 255 }),
  due_date: date("due_date").notNull(),
  status: varchar("backlog", { length: 50 }).default("todo"), // backlog, todo, in_progress, in_review, done
  poisition: integer("position").notNull().default(0),
  project_id: uuid("project_id")
    .notNull()
    .references(() => projects.id, {
      onDelete: "cascade",
    }),
  assignee_id: uuid("assignee_id")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),
  workspace_id: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id, {
      onDelete: "cascade",
    }),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const taskRelations = relations(tasks, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [tasks.workspace_id],
    references: [workspaces.id],
  }),
  project: one(projects, {
    fields: [tasks.project_id],
    references: [projects.id],
  }),
  assignee: one(users, {
    fields: [tasks.assignee_id],
    references: [users.id],
  }),
}));
