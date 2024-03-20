import { createId } from "@/db/utils"
import type { StoredFile } from "@/types"
import { relations, sql } from "drizzle-orm"
import {
  boolean,
  decimal,
  index,
  integer,
  json,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core"

export const roleEnum = pgEnum("roleEnum", ["admin", "user", "operator"])
export const permissionTypeEnum = pgEnum("permissionTypeEnum", [
  "screen",
  "actions",
])

// auth tables start
// https://authjs.dev/reference/adapter/drizzle
// import type { AdapterAccount } from '@auth/core/adapters'

// export const users = pgTable("user", {
//  id: text("id").notNull().primaryKey(),
//  name: text("name"),
//  email: text("email").notNull(),
//  emailVerified: timestamp("emailVerified", { mode: "date" }),
//  image: text("image"),
// })

// export const accounts = pgTable(
// "account",
// {
//   userId: text("userId")
//     .notNull()
//     .references(() => users.id, { onDelete: "cascade" }),
//   type: text("type").$type<AdapterAccount["type"]>().notNull(),
//   provider: text("provider").notNull(),
//   providerAccountId: text("providerAccountId").notNull(),
//   refresh_token: text("refresh_token"),
//   access_token: text("access_token"),
//   expires_at: integer("expires_at"),
//   token_type: text("token_type"),
//   scope: text("scope"),
//    id_token: text("id_token"),
//   session_state: text("session_state"),
// },
// (account) => ({
//   compoundKey: primaryKey({ columns: [account.provider, account.providerAccountId] }),
// })
// )

// export const sessions = pgTable("session", {
//  sessionToken: text("sessionToken").notNull().primaryKey(),
//  userId: text("userId")
//    .notNull()
//    .references(() => users.id, { onDelete: "cascade" }),
//  expires: timestamp("expires", { mode: "date" }).notNull(),
// })

// export const verificationTokens = pgTable(
//  "verificationToken",
//  {
//    identifier: text("identifier").notNull(),
//    token: text("token").notNull(),
//    expires: timestamp("expires", { mode: "date" }).notNull(),
//  },
//  (vt) => ({
//    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
//  })
// )
// auth tables start

export const systemUser = pgTable("systemUser", {
  id: text("id").notNull().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  password: text("password").notNull(),
  role: roleEnum("role").notNull(),
})

export const roles = pgTable("role", {
  name: roleEnum("role").notNull().primaryKey(),
  description: varchar("description", { length: 256 }),
  baseUrl: varchar("base_url", { length: 256 }),
})

export const rolePermissions = pgTable("rolePermission", {
  id: varchar("id", { length: 30 })
    .$defaultFn(() => createId())
    .primaryKey(),
  roleName: roleEnum("role")
    .notNull()
    .references(() => roles.name, { onDelete: "cascade" }),
  type: permissionTypeEnum("type").notNull(), // 画面 or 操作
  namespace: varchar("namespace", { length: 256 }), // 画面 or 操作の名前
  operation: varchar("operation", { length: 64 }), // 操作の種類
  pathname: varchar("pathname", { length: 256 }), // 操作を行う画面
})

// Domain specific tables
export const categories = pgTable("categories", {
  id: varchar("id", { length: 30 })
    .$defaultFn(() => createId())
    .primaryKey(),
  name: varchar("name", { length: 256 }).notNull().unique(),
  slug: varchar("slug", { length: 256 }).unique().notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").default(sql`current_timestamp`),
})

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
  subcategories: many(subcategories),
}))

export type Category = typeof categories.$inferSelect
export type NewCategory = typeof categories.$inferInsert

export const subcategories = pgTable(
  "subcategories",
  {
    id: varchar("id", { length: 30 })
      .$defaultFn(() => createId())
      .primaryKey(),
    name: varchar("name", { length: 256 }).notNull().unique(),
    slug: varchar("slug", { length: 256 }).unique().notNull(),
    description: text("description"),
    categoryId: varchar("category_id", { length: 30 })
      .references(() => categories.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").default(sql`current_timestamp`),
  },
  (table) => ({
    subcategoriesCategoryIdIdx: index(`subcategories_category_id_idx`).on(
      table.categoryId
    ),
  })
)

export const subcategoriesRelations = relations(subcategories, ({ one }) => ({
  category: one(categories, {
    fields: [subcategories.categoryId],
    references: [categories.id],
  }),
}))

export type Subcategory = typeof subcategories.$inferSelect
export type NewSubcategory = typeof subcategories.$inferInsert

export const stores = pgTable("stores", {
  id: varchar("id", { length: 30 })
    .$defaultFn(() => createId())
    .primaryKey(), // prefix_ (if ocd kicks in) + nanoid (16)
  userId: varchar("user_id", { length: 36 }), // uuid v4
  name: varchar("name").notNull(),
  description: text("description"),
  slug: text("slug").unique(),
  active: boolean("active").notNull().default(false),
  stripeAccountId: varchar("stripe_account_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").default(sql`current_timestamp`),
})

export const storesRelations = relations(stores, ({ many }) => ({
  products: many(products),
}))

export type Store = typeof stores.$inferSelect
export type NewStore = typeof stores.$inferInsert

export const products = pgTable(
  "products",
  {
    id: varchar("id", { length: 30 })
      .$defaultFn(() => createId())
      .primaryKey(), // prefix_ (if ocd kicks in) + nanoid (16)
    name: varchar("name", { length: 256 }).notNull(),
    description: text("description"),
    images: json("images").$type<StoredFile[] | null>().default(null),
    categoryId: varchar("category_id", { length: 30 }).notNull(),
    subcategoryId: varchar("subcategory_id", { length: 30 }).references(
      () => subcategories.id,
      { onDelete: "cascade" }
    ),
    price: decimal("price", { precision: 10, scale: 2 }).notNull().default("0"),
    inventory: integer("inventory").notNull().default(0),
    rating: integer("rating").notNull().default(0),
    tags: json("tags").$type<string[] | null>().default(null),
    storeId: varchar("store_id", { length: 30 })
      .references(() => stores.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").default(sql`current_timestamp`),
  },
  (table) => ({
    storeIdIdx: index(`products_store_id_idx`).on(table.storeId),
    categoryIdIdx: index(`products_category_id_idx`).on(table.categoryId),
    subcategoryIdIdx: index(`products_subcategory_id_idx`).on(
      table.subcategoryId
    ),
  })
)

export const productsRelations = relations(products, ({ one }) => ({
  store: one(stores, { fields: [products.storeId], references: [stores.id] }),
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  subcategory: one(subcategories, {
    fields: [products.subcategoryId],
    references: [subcategories.id],
  }),
}))

export type Product = typeof products.$inferSelect
export type NewProduct = typeof products.$inferInsert
