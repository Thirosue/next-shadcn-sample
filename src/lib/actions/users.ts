"use server"

import { unstable_noStore as noStore } from "next/cache"
import { db } from "@/db"
import { systemUser } from "@/db/schema"
import { ActionResult, UserSearchFormValues } from "@/types"
import { faker } from "@faker-js/faker"
import { and, eq, like } from "drizzle-orm"
import * as z from "zod"

import { withAuthentication } from "@/lib/actions/authorization-filter"
import { logMessage } from "@/lib/logger"
import { csrfTokenSchema } from "@/lib/validations/auth"
import { userUpsertSchema } from "@/lib/validations/user"

async function user_findAll(
  page: number,
  limit: number = 10,
  searchParams: UserSearchFormValues
): Promise<ActionResult> {
  noStore()
  const conditions = []

  if (searchParams.role) {
    conditions.push(eq(systemUser.role, searchParams.role))
  }
  if (searchParams.email) {
    conditions.push(like(systemUser.email, `%${searchParams.email}%`))
  }
  if (searchParams.name) {
    conditions.push(like(systemUser.name, `%${searchParams.name}%`))
  }

  const whereCondition = conditions.length > 0 ? and(...conditions) : undefined

  const offset = (page - 1) * limit
  const users = await db
    .select({
      id: systemUser.id,
      name: systemUser.name,
      email: systemUser.email,
      role: systemUser.role,
    })
    .from(systemUser)
    .where(whereCondition)
    .limit(limit)
    .offset(offset)
    .orderBy(systemUser.id)
    .execute()

  await new Promise((resolve) => setTimeout(resolve, 1000))

  logMessage({ message: `🔍 Found ${users.length} users` })
  return {
    status: 200,
    data: users,
  }
}

async function user_findById(id: string): Promise<ActionResult> {
  noStore()
  const user = await db
    .select({
      id: systemUser.id,
      name: systemUser.name,
      password: systemUser.password,
      email: systemUser.email,
      role: systemUser.role,
      version: systemUser.version,
    })
    .from(systemUser)
    .where(eq(systemUser.id, id))
    .execute()

  await new Promise((resolve) => setTimeout(resolve, 1000))

  logMessage({ message: `🔍 Found user ${id}` })
  return {
    status: 200,
    data: user[0],
  }
}

async function user_upsert(
  data: z.infer<typeof userUpsertSchema>
): Promise<ActionResult> {
  noStore()

  // Make the 'token' property optional before deleting it
  const { token, ...userData } = data

  if (data.version) {
    const user = await db
      .update(systemUser)
      .set({
        ...userData,
        updatedBy: "system",
        version: data.version + 1,
      })
      .where(
        and(eq(systemUser.id, data.id!), eq(systemUser.version, data.version))
      )
      .returning({ updatedId: systemUser.id })
    if (user.length === 0) {
      return {
        status: 409,
        message:
          "The user has been updated by another user. Please refresh the page.",
      }
    }
    logMessage({ message: `🆕 Update user ${data.id}` })
  } else {
    const user = await db
      .insert(systemUser)
      .values({
        id: faker.string.uuid(),
        ...userData,
        createdAt: new Date(),
        createdBy: "system",
      })
      .execute()
    logMessage({ message: `🆕 Insert user ${data.id}` })
  }

  return {
    status: 200,
  }
}

const userDeleteSchema = csrfTokenSchema.extend({
  id: z.string(),
})

async function user_delete(data: z.infer<typeof userDeleteSchema>) {
  noStore()

  const user = await db
    .delete(systemUser)
    .where(eq(systemUser.id, data.id))
    .returning()

  logMessage({ message: `🆕 Delete user ${data.id}` })
  return {
    status: 200,
  }
}

// 高階関数を適用した認証付きの関数
export const findAllUsersWithAuth = withAuthentication(user_findAll)
export const findUserByIdWithAuth = withAuthentication(user_findById)
export const upsertUserWithAuth = withAuthentication(user_upsert)
export const deleteUserWithAuth = withAuthentication(user_delete)
