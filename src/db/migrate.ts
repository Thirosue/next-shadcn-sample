import { migrate } from "drizzle-orm/postgres-js/migrator"

import { db } from "."

const captains = console

export async function runMigrate() {
  captains.log("⏳ Running migrations...")

  const start = Date.now()

  await migrate(db, { migrationsFolder: "drizzle" })

  const end = Date.now()

  captains.log(`✅ Migrations completed in ${end - start}ms`)

  process.exit(0)
}

runMigrate().catch((err) => {
  captains.error("❌ Migration failed")
  captains.error(err)
  process.exit(1)
})
