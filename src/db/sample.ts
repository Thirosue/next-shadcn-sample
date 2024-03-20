import { db } from "@/db"
import { rolePermissions, users } from "@/db/schema"
import { eq } from "drizzle-orm"

async function run() {
  // select users
  const allUsers = await db.select().from(users)
  console.log(allUsers)

  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, "user1"))
    .limit(1)
  console.log(user)

  // join
  const userWithRole = await db
    .select()
    .from(users)
    .where(eq(users.id, "user2"))
    .leftJoin(rolePermissions, eq(users.role, rolePermissions.roleName))
  console.log(userWithRole)

  process.exit(0)
}

run().catch((err) => {
  console.error("❌ Seed failed")
  console.error(err)
  process.exit(1)
})
