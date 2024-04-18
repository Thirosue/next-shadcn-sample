"use server"

import { unstable_noStore as noStore, revalidateTag } from "next/cache"
import { db } from "@/db"
import { products } from "@/db/schema"
import { ActionResult, ProductSearchFormValues } from "@/types"
import { and, asc, count, desc, like } from "drizzle-orm"
import * as z from "zod"

import { withAuthentication } from "@/lib/actions/authorization-filter"
import { getServerSession } from "@/lib/auth"
import { logMessage } from "@/lib/logger"
import { csrfTokenSchema } from "@/lib/validations/auth"
import { userUpsertSchema } from "@/lib/validations/user"

export async function product_findAll(
  page: number,
  limit: number = 10,
  searchParams: ProductSearchFormValues
): Promise<ActionResult> {
  noStore()

  const session = await getServerSession()
  if (!session?.user) {
    return {
      status: 401,
      message: "Unauthorized",
    }
  }

  const conditions = []
  let sortBy = asc(products.name)

  if (searchParams.name) {
    conditions.push(like(products.name, `%${searchParams.name}%`))
  }
  if (searchParams.tags?.length) {
    for (const tag of searchParams.tags) {
      conditions.push(like(products.tags, `%${tag}%`))
    }
  }

  if (searchParams.sort) {
    const [sortField, sortOrder] = searchParams.sort.split(":")
    switch (sortField) {
      case "name":
        sortBy = sortOrder === "asc" ? asc(products.name) : desc(products.name)
        break
      case "category":
        sortBy =
          sortOrder === "asc"
            ? asc(products.categoryId)
            : desc(products.categoryId)
        break
      case "price":
        sortBy =
          sortOrder === "asc" ? asc(products.price) : desc(products.price)
        break
    }
  }

  const whereCondition = conditions.length > 0 ? and(...conditions) : undefined

  const offset = (page - 1) * limit
  const data = await db
    .select({
      id: products.id,
      store: products.storeId,
      name: products.name,
      category: products.categoryId,
      price: products.price,
      tags: products.tags,
    })
    .from(products)
    .where(whereCondition)
    .limit(limit)
    .offset(offset)
    .orderBy(sortBy)
    .execute()

  // 総結果数を取得
  const totalCount = await db
    .select({ count: count() })
    .from(products)
    .where(whereCondition)
    .execute()

  await new Promise((resolve) => setTimeout(resolve, 1500))
  revalidateTag("product")

  logMessage({ message: `🔍 Found ${data.length} products` })
  return {
    status: 200,
    totalCount: totalCount[0].count,
    data,
  }
}

export async function product_findById(id: string): Promise<ActionResult> {
  noStore()

  return {
    status: 200,
    data: null,
  }
}

export async function product_upsert(
  data: z.infer<typeof userUpsertSchema>
): Promise<ActionResult> {
  noStore()

  return {
    status: 200,
  }
}

const userDeleteSchema = csrfTokenSchema.extend({
  id: z.string(),
})

export async function product_delete(data: z.infer<typeof userDeleteSchema>) {
  noStore()

  return {
    status: 200,
  }
}

// 高階関数を適用した認証付きの関数
export const findAllProductsWithAuth = withAuthentication(product_findAll)
export const findProductByIdWithAuth = withAuthentication(product_findById)
export const upsertProductWithAuth = withAuthentication(product_upsert)
export const deleteProductWithAuth = withAuthentication(product_delete)
