import { NavItem } from "@/types"

export type Employee = {
  id: number
  first_name: string
  last_name: string
  email: string
  phone: string
  gender: string
  date_of_birth: string // Consider using a proper date type if possible
  street: string
  city: string
  state: string
  country: string
  zipcode: string
  longitude?: number // Optional field
  latitude?: number // Optional field
  job: string
  profile_picture?: string | null // Profile picture can be a string (URL) or null (if no picture)
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
