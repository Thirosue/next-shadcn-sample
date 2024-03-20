import { navItems } from "@/constants/data"
import type { AuthUser, ScreenPermissions } from "@/types"

import { getServerSession } from "@/lib/auth"
import { checkScreenPermissions, cn } from "@/lib/utils"
import { DashboardNav } from "@/components/dashboard-nav"

export default async function Sidebar() {
  const session = await getServerSession()
  const user = session?.user as AuthUser
  const role = user.role
  const permissions = user.permissions as ScreenPermissions

  let items = navItems
  // Filter out items that the user doesn't have permission to access
  if (role !== "admin") {
    items = navItems.filter((item) => {
      const isPermitted = checkScreenPermissions(permissions, item.href!)
      return isPermitted || item.alwaysShow
    })
  }
  return (
    <nav
      className={cn(`relative hidden h-screen w-72 border-r pt-16 lg:block`)}
    >
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            <h2 className="mb-2 px-4 text-xl font-semibold tracking-tight">
              Overview
            </h2>
            <DashboardNav items={items} />
          </div>
        </div>
      </div>
    </nav>
  )
}
