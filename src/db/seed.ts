import { db } from "@/db"
import { roleEnum, rolePermissions, roles, stores, users } from "@/db/schema"

import {
  seedCategories,
  seedProducts,
  seedSubcategories,
} from "@/lib/actions/seed"

const adminRole = roleEnum.enumValues[0]
const userRole = roleEnum.enumValues[1]
const operatorRole = roleEnum.enumValues[2]

const initUsers = [
  {
    id: "user1",
    name: "John Doe",
    email: "test@test.com",
    emailVerified: new Date("2024-01-01T00:00:00Z"),
    password: "password123",
    role: adminRole,
    image: "https://example.com/path/to/johndoe.jpg",
  },
  {
    id: "user2",
    name: "Jane Smith",
    email: "janesmith@example.com",
    emailVerified: null,
    password: "password456",
    role: userRole,
    image: "https://example.com/path/to/janesmith.jpg",
  },
  {
    id: "user3",
    name: "Alice Johnson",
    email: "alicejohnson@example.com",
    emailVerified: new Date("2024-02-02T00:00:00Z"),
    password: "password789",
    role: operatorRole,
    image: "https://example.com/path/to/alicejohnson.jpg",
  },
]

const initRoles = [
  {
    name: adminRole,
    description: "Admin role",
  },
  {
    name: userRole,
    description: "User role",
  },
  {
    name: operatorRole,
    description: "Operator role",
  },
]

const initRolePermissions = [
  {
    roleName: adminRole,
    pathname: ".*",
    permission: "CRUD",
  },
  {
    roleName: userRole,
    pathname: "/",
    permission: "CRUD",
  },
  {
    roleName: userRole,
    pathname: "/user",
    permission: "CRUD",
  },
  {
    roleName: userRole,
    pathname: "/role",
    permission: "R",
  },
]

const storeId = "store1"

const storeSample = {
  id: storeId,
  user_id: "user1",
  name: "Sample Store",
  description: "This is a sample store for demonstration.",
  slug: "sample-store",
  active: true,
  stripe_account_id: "acct_abcdef",
  created_at: new Date(),
  updated_at: new Date(),
}

async function runSeed() {
  console.log("⏳ Running seed...")

  const start = Date.now()
  await db.delete(users)
  await db.insert(users).values(initUsers)

  await db.delete(roles)
  await db.insert(roles).values(initRoles)

  await db.delete(rolePermissions)
  await db.insert(rolePermissions).values(initRolePermissions)

  await seedCategories()
  await seedSubcategories()

  await db.delete(stores)
  await db.insert(stores).values(storeSample)
  await seedProducts({ storeId, count: 100 })

  const end = Date.now()
  console.log(`✅ Seed completed in ${end - start}ms`)

  process.exit(0)
}

runSeed().catch((err) => {
  console.error("❌ Seed failed")
  console.error(err)
  process.exit(1)
})
