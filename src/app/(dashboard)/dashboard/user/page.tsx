import { findAllWithAuth } from "@/lib/actions/users"
import BreadCrumb from "@/components/breadcrumb"
import { Shell } from "@/components/shell"
import { UserTable } from "@/app/(dashboard)/dashboard/user/_components/user-table"

export const breadcrumbItems = [{ title: "User", link: "/dashboard/user" }]
export default async function Page() {
  const users = await findAllWithAuth(1)
  return (
    <Shell variant="sidebar">
      <BreadCrumb items={breadcrumbItems} />
      <UserTable data={users} />
    </Shell>
  )
}
