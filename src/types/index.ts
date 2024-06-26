import { permissionTypeEnum } from "@/db/schema"
import { type z } from "zod"

import { type userPrivateMetadataSchema } from "@/lib/validations/auth"
import { Icons } from "@/components/icons"

export type UserRole = z.infer<typeof userPrivateMetadataSchema.shape.role>

export interface SearchParams {
  [key: string]: string | string[] | undefined
}

export interface StoredFile {
  id: string
  name: string
  url: string
}

export interface NavItem {
  title: string
  href?: string
  disabled?: boolean
  external?: boolean
  icon?: keyof typeof Icons
  label?: string
  description?: string
  alwaysShow?: boolean
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[]
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[]
}

export interface FooterItem {
  title: string
  items: {
    title: string
    href: string
    external?: boolean
  }[]
}

export type MainNavItem = NavItemWithOptionalChildren

export type SidebarNavItem = NavItemWithChildren

export type SortOrder = "asc" | "desc"

export type PageSearchFormValues = {
  page?: number
  limit?: number
  sort?: string
}

export type UserSearchFormValues = {
  name?: string
  email?: string
  role?: UserRole
}

export const ProductStatuses = [
  "new",
  "sale",
  "bestseller",
  "featured",
  "popular",
  "trending",
  "limited",
  "exclusive",
] as const

type ProductStatus = (typeof ProductStatuses)[number]

export type ProductSearchFormValues = {
  name?: string
  tags?: ProductStatus[]
  price_from?: number
  price_to?: number
} & PageSearchFormValues

export type User = {
  id: string
  name: string
  email: string
  role: UserRole
  baseUrl: string
}

export type AuthUser = User & {
  permissions: {
    type: (typeof permissionTypeEnum.enumValues)[number]
    namespace?: string
    pathname?: string
    operation?: string
  }[]
}

export type ScreenPermissions = {
  type: (typeof permissionTypeEnum.enumValues)[number]
  pathname: string
}[]

export type ActionResult = {
  status: number
  totalCount?: number
  message?: string
  data?: any
}
