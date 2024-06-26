import productsJson from "@/assets/data/products.json"
import { db } from "@/db"
import {
  categories,
  products,
  roleEnum,
  subcategories,
  systemUser,
  type Product,
  type Subcategory,
} from "@/db/schema"
import { createId } from "@/db/utils"
import { faker } from "@faker-js/faker"
import { set } from "date-fns"
import { eq } from "drizzle-orm"

import { productConfig } from "@/config/product"
import { slugify } from "@/lib/utils"

const captains = console

const adminRole = roleEnum.enumValues[0]
const userRole = roleEnum.enumValues[1]
const operatorRole = roleEnum.enumValues[2]

const initUsers = [
  {
    id: "user1",
    name: "John Doe",
    email: "test@example.com",
    password: "password123",
    role: adminRole,
  },
  {
    id: "user2",
    name: "Jane Smith",
    email: "janesmith@example.com",
    password: "password456",
    role: userRole,
  },
  {
    id: "user3",
    name: "Alice Johnson",
    email: "alicejohnson@example.com",
    password: "password789",
    role: operatorRole,
  },
]

export function setSystemControl(list: any[]) {
  return list.map((item) => ({
    ...item,
    createdAt: new Date(),
    createdBy: "system",
  }))
}

export async function seedUsers(count = 10) {
  const roles = [adminRole, userRole, operatorRole]

  const data = []

  for (let i = 0; i < count; i++) {
    data.push({
      id: createId(),
      name: `test${i}User`,
      email: `test${i}User@example.com`,
      password: faker.internet.password(),
      role: faker.helpers.shuffle(roles)[0],
    })
  }

  captains.log(`📝 Inserting ${data.length} users`)

  await db.delete(systemUser)
  await db.insert(systemUser).values(setSystemControl(initUsers))
  await db.insert(systemUser).values(setSystemControl(data))
}

export async function seedCategories() {
  const data = productConfig.categories.map((category) => ({
    id: createId(),
    name: category.name,
    slug: slugify(category.name),
    description: category.description,
  }))

  await db.delete(categories)
  captains.log(`📝 Inserting ${data.length} categories`)
  await db.insert(categories).values(setSystemControl(data))
}

export async function seedSubcategories() {
  const data: Subcategory[] = []

  const allCategories = await db
    .select({
      id: categories.id,
      name: categories.name,
    })
    .from(categories)
    .execute()

  allCategories.forEach((category) => {
    const subcategories = productConfig.categories.find(
      (c) => c.name === category.name
    )?.subcategories

    if (subcategories) {
      subcategories.forEach((subcategory) => {
        data.push({
          id: createId(),
          name: subcategory.name,
          slug: slugify(subcategory.name),
          categoryId: category.id,
          description: subcategory.description,
        } as any)
      })
    }
  })

  await db.delete(subcategories)
  captains.log(`📝 Inserting ${data.length} subcategories`)
  await db.insert(subcategories).values(setSystemControl(data))
}

export async function seedProducts({
  storeId,
  count,
}: {
  storeId: string
  count?: number
}) {
  const productCount = count ?? 10

  const data: Product[] = []

  const categories = productConfig.categories.map((category) => category.name)

  for (let i = 0; i < productCount; i++) {
    const category = faker.helpers.shuffle(categories)[0] ?? "skateboards"

    const allSubcategories = await db
      .select({
        id: subcategories.id,
      })
      .from(subcategories)
      .where(eq(subcategories.categoryId, category))
      .execute()

    data.push({
      id: createId(),
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: faker.commerce.price(),
      images: Array.from({ length: 3 }).map(() => ({
        id: faker.string.uuid(),
        name: faker.system.fileName(),
        url: faker.image.urlLoremFlickr({
          category,
          width: 640,
          height: 480,
        }),
      })),
      categoryId: category,
      subcategoryId: faker.helpers.shuffle(allSubcategories)[0]?.id ?? null,
      storeId,
      inventory: faker.number.int({ min: 50, max: 100 }),
      rating: faker.number.int({ min: 0, max: 5 }),
      tags: productConfig.tags.slice(0, faker.number.float({ min: 0, max: 5 })),
    } as any)
  }

  await db.delete(products).where(eq(products.storeId, storeId))
  captains.log(`📝 Inserting ${data.length} products`)
  await db.insert(products).values(setSystemControl(data))
}

export async function seedCozyProducts({ storeId }: { storeId: string }) {
  const data: Product[] = []

  for (const product of productsJson) {
    const category = await db.query.categories.findFirst({
      columns: {
        id: true,
      },
      where: eq(categories.slug, product.category),
    })

    if (!category) {
      throw new Error(`Category not found: ${product.category}`)
    }

    const subcategory = await db.query.subcategories.findFirst({
      columns: {
        id: true,
      },
      where: eq(subcategories.slug, product.subcategory),
    })

    data.push({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      images: product.images.map((image) => ({
        id: image.id,
        name: image.name,
        url: image.url,
      })),
      categoryId: category.id,
      subcategoryId: subcategory?.id ?? null,
      storeId,
      inventory: product.inventory,
      rating: product.rating,
      tags: product.tags,
    } as any)
  }

  await db.delete(products).where(eq(products.storeId, storeId))
  captains.log(`📝 Inserting ${data.length} products`)
  await db.insert(products).values(setSystemControl(data))
}
