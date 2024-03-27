"use server"

import { unstable_noStore as noStore } from "next/cache"
import { cookies } from "next/headers"
import { db } from "@/db"
import { verificationCsrfTokens } from "@/db/schema"
import { faker } from "@faker-js/faker"
import { and, count, eq, gte } from "drizzle-orm"

export async function setCsrfTokens() {
  noStore()
  const cookieStore = cookies()

  const sessionToken = cookieStore.get("next-auth.session-token")?.value!
  const token = faker.string.uuid()
  await db
    .insert(verificationCsrfTokens)
    .values({
      identifier: sessionToken,
      token,
      expires: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
    })
    .execute()
  return token
}

export async function verifyCsrfTokens(token: string) {
  noStore()

  const result = await db
    .select({ count: count() })
    .from(verificationCsrfTokens)
    .where(
      and(
        // eq(verificationCsrfTokens.identifier, sessionToken), do not use identifier as session may be updated
        eq(verificationCsrfTokens.token, token),
        gte(verificationCsrfTokens.expires, new Date(Date.now()))
      )
    )

  return result[0].count > 0
}
