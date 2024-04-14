import { unstable_noStore as noStore, revalidateTag } from "next/cache"
import { db } from "@/db"
import { products } from "@/db/schema"
import { zValidator } from "@hono/zod-validator"
import { and, asc, count, desc, like } from "drizzle-orm"
import { Hono } from "hono"
import { handle } from "hono/vercel"
import { z } from "zod"

import { logMessage } from "@/lib/logger"

const app = new Hono().basePath("/api")

const route = app.get(
  "/products",
  zValidator(
    "query",
    z.object({
      page: z.string(),
      limit: z.string(),
      name: z.string().optional(),
      sort: z.string().optional(),
    })
  ),
  async (c) => {
    noStore()
    const { page, limit, name, sort } = c.req.valid("query")

    const conditions = []
    let sortBy = asc(products.name)

    if (name) {
      conditions.push(like(products.name, `%${name}%`))
    }

    if (sort) {
      const [sortField, sortOrder] = sort.split(":")
      switch (sortField) {
        case "name":
          sortBy =
            sortOrder === "asc" ? asc(products.name) : desc(products.name)
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

    const whereCondition =
      conditions.length > 0 ? and(...conditions) : undefined

    const offset = (parseInt(page) - 1) * parseInt(limit)
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
      .limit(parseInt(limit))
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

    return c.json(
      {
        totalCount: totalCount[0].count,
        data,
      },
      200
    )
  }
)

export type AppType = typeof route

export const GET = handle(app)
