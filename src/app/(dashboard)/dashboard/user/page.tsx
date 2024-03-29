import { setCsrfTokens } from "@/lib/actions/token"
import { findAllUsersWithAuth } from "@/lib/actions/users"
import BreadCrumb from "@/components/breadcrumb"
import { Shell } from "@/components/shell"
import { UserTable } from "@/app/(dashboard)/dashboard/user/_components/user-table"

export const breadcrumbItems = [{ title: "User", link: "/dashboard/user" }]
export default async function Page() {
  const { data } = await findAllUsersWithAuth(1, 10000)
  const token = await setCsrfTokens()
  return (
    <Shell variant="sidebar">
      <BreadCrumb items={breadcrumbItems} />
      <UserTable data={data} _csrf={token} />
    </Shell>
  )
}
