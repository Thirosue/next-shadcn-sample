import { NavItem } from "@/types"

export type Product = {
  id: string
  name: string
  description?: string | null
  categoryId?: string
  subcategoryId?: string | null
  price: string
  inventory?: number
  rating?: number
  tags: any | null
  store: string
}

export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard/home",
    icon: "dashboard",
    label: "Dashboard",
  },
  {
    title: "User (client-side pagination)",
    href: "/dashboard/user",
    icon: "user",
    label: "user",
  },
  {
    title: "Product (server-side pagination use server actions)",
    href: "/dashboard/product?page=1&limit=10",
    icon: "barcode",
    label: "product",
  },
  {
    title: "SignOut",
    href: "/signout",
    icon: "logout",
    label: "signout",
    alwaysShow: true,
  },
]
