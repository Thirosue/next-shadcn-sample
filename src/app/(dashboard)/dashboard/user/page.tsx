import { UserSearchFormValues } from "@/types"

import { setCsrfTokens } from "@/lib/actions/token"
import { user_findAll } from "@/lib/actions/users"
import BreadCrumb from "@/components/breadcrumb"
import { Shell } from "@/components/shell"
import { UserTable } from "@/app/(dashboard)/dashboard/user/_components/user-table"

export const breadcrumbItems = [{ title: "User", link: "/dashboard/user" }]
export default async function Page({
  searchParams,
}: {
  searchParams: UserSearchFormValues
}) {
  const { data } = await user_findAll(1, 10000, searchParams)
  const token = await setCsrfTokens()
  return (
    <Shell variant="sidebar">
      <BreadCrumb items={breadcrumbItems} />
      <UserTable data={data} _csrf={token} searchParams={searchParams} />
    </Shell>
  )
}
