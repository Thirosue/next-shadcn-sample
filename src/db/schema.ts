import type { AdapterAccount } from "@auth/core/adapters"
import {
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core"

export const roleEnum = pgEnum("roleEnum", ["admin", "user", "operator"])

export const users = pgTable("user", {
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  password: text("password").notNull(),
  role: roleEnum("role").notNull(),
  image: text("image"),
})

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
)

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
)

export const roles = pgTable("role", {
  name: roleEnum("role").notNull().primaryKey(),
  description: text("description"),
})

export const rolePermissions = pgTable(
  "rolePermission",
  {
    roleName: roleEnum("role")
      .notNull()
      .references(() => roles.name, { onDelete: "cascade" }),
    pathname: text("pathname").notNull(), // 操作を行う画面
    permission: text("permission").notNull(), // 操作の種類（CRUD）
  },
  (rt) => {
    return {
      pk: primaryKey({ columns: [rt.roleName, rt.pathname, rt.permission] }),
    }
  }
)
