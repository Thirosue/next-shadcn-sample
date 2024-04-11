import { NavItem } from "@/types"

export type Product = {
  id: string
  name: string
  description: string | null
  categoryId: string
  subcategoryId: string | null
  price: number
  inventory: number
  rating: number
  tags: any | null
  storeId: string
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
    title: "Product (server-side pagination)",
    href: "/dashboard/product",
    icon: "barcode",
    label: "product",
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: "profile",
    label: "profile",
  },
  {
    title: "SignOut",
    href: "/signout",
    icon: "logout",
    label: "signout",
    alwaysShow: true,
  },
]
