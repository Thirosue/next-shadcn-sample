"use server"

import { unstable_noStore as noStore } from "next/cache"
import { db } from "@/db"
import { systemUser } from "@/db/schema"
import { faker } from "@faker-js/faker"
import { eq } from "drizzle-orm"
import * as z from "zod"

import { withAuthentication } from "@/lib/actions/authorization-filter"
import { userSchema } from "@/lib/validations/user"

async function user_findAll(page: number, limit: number = 10) {
  noStore()
  const offset = (page - 1) * limit
  const users = await db
    .select({
      id: systemUser.id,
      name: systemUser.name,
      email: systemUser.email,
      role: systemUser.role,
    })
    .from(systemUser)
    .limit(limit)
    .offset(offset)
    .orderBy(systemUser.id)
    .execute()

  await new Promise((resolve) => setTimeout(resolve, 1000))

  console.log(`🔍 Found ${users.length} users`)
  return users
}

async function user_findById(id: string) {
  noStore()
  const user = await db
    .select({
      id: systemUser.id,
      name: systemUser.name,
      password: systemUser.password,
      email: systemUser.email,
      role: systemUser.role,
    })
    .from(systemUser)
    .where(eq(systemUser.id, id))
    .execute()

  await new Promise((resolve) => setTimeout(resolve, 1000))

  console.log(`🔍 Found user ${id}`)
  console.log(user)
  return user[0]
}

const userUpsertSchema = userSchema.extend({
  token: z.string(),
})

async function user_upsert(data: z.infer<typeof userUpsertSchema>) {
  noStore()

  // Make the 'token' property optional before deleting it
  const { token, ...userData } = data

  const user = await db
    .insert(systemUser)
    .values({
      id: data.id ?? faker.string.uuid(),
      ...userData,
    })
    .onConflictDoUpdate({ target: systemUser.id, set: { ...userData } })
    .execute()

  console.log(`🆕 Upserted user ${data.id}`)
  console.log(user)
  return user
}

// 高階関数を適用した認証付きの関数
export const findAllWithAuth = withAuthentication(user_findAll)
export const findByIdWithAuth = withAuthentication(user_findById)
export const upsertWithAuth = withAuthentication(user_upsert)
