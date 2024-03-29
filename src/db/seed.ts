import { db } from "@/db"
import {
  permissionTypeEnum,
  roleEnum,
  rolePermissions,
  roles,
  stores,
} from "@/db/schema"

import {
  seedCategories,
  seedProducts,
  seedSubcategories,
  seedUsers,
  setSystemControl,
} from "@/lib/actions/seed"

const captains = console

const adminRole = roleEnum.enumValues[0]
const userRole = roleEnum.enumValues[1]
const operatorRole = roleEnum.enumValues[2]

const initRoles = [
  {
    name: adminRole,
    description: "Admin role",
  },
  {
    name: userRole,
    description: "User role",
    baseUrl: "/dashboard/user",
  },
  {
    name: operatorRole,
    description: "Operator role",
    baseUrl: "/dashboard/product",
  },
]

const screen = permissionTypeEnum.enumValues[0]
const actions = permissionTypeEnum.enumValues[1]

const initScreenPermissions = [
  {
    roleName: adminRole,
    type: screen,
    pathname: ".*",
    permission: "CRUD",
  },
  {
    roleName: userRole,
    type: screen,
    pathname: "/dashboard/user.*",
  },
  {
    roleName: userRole,
    type: screen,
    pathname: "/dashboard/product.*",
  },
  {
    roleName: operatorRole,
    type: screen,
    pathname: "/dashboard/product",
  },
]

const initActionPermissions = [
  {
    roleName: adminRole,
    type: actions,
    namespace: ".*",
    operation: ".*",
  },
  {
    roleName: userRole,
    type: actions,
    namespace: "user",
    operation: "find.*",
  },
  {
    roleName: userRole,
    type: actions,
    namespace: "product",
    operation: ".*",
  },
  {
    roleName: operatorRole,
    type: actions,
    namespace: "product",
    operation: "find.*",
  },
]

const storeId = "store1"

const storeSample = [
  {
    id: storeId,
    user_id: "user1",
    name: "Sample Store",
    description: "This is a sample store for demonstration.",
    slug: "sample-store",
    active: true,
    stripe_account_id: "acct_abcdef",
  },
]

async function runSeed() {
  captains.log("⏳ Running seed...")

  const start = Date.now()
  await seedUsers(5100)

  await db.delete(roles)
  await db.insert(roles).values(setSystemControl(initRoles))

  await db.delete(rolePermissions)
  await db
    .insert(rolePermissions)
    .values(setSystemControl(initScreenPermissions))
  await db
    .insert(rolePermissions)
    .values(setSystemControl(initActionPermissions))

  await seedCategories()
  await seedSubcategories()

  await db.delete(stores)
  await db.insert(stores).values(setSystemControl(storeSample))
  await seedProducts({ storeId, count: 100 })

  const end = Date.now()
  captains.log(`✅ Seed completed in ${end - start}ms`)

  process.exit(0)
}

runSeed().catch((err) => {
  captains.error("❌ Seed failed")
  captains.error(err)
  process.exit(1)
})
