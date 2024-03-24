import Link from "next/link"
import { Employee } from "@/constants/data"
import { Plus } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import BreadCrumb from "@/components/breadcrumb"
import { Shell } from "@/components/shell"
import { columns } from "@/app/(dashboard)/dashboard/product/_components/columns"
import { ProductTable } from "@/app/(dashboard)/dashboard/product/_components/product-table"

export const breadcrumbItems = [
  { title: "Product", link: "/dashboard/product" },
]

type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

export default async function Page({ searchParams }: paramsProps) {
  const page = Number(searchParams.page) || 1
  const pageLimit = Number(searchParams.limit) || 10
  const country = searchParams.search || null
  const offset = (page - 1) * pageLimit

  const res = await fetch(
    `https://api.slingacademy.com/v1/sample-data/users?offset=${offset}&limit=${pageLimit}` +
      (country ? `&search=${country}` : "")
  )
  const employeeRes = await res.json()
  const totalUsers = employeeRes.total_users //1000
  const pageCount = Math.ceil(totalUsers / pageLimit)
  const employee: Employee[] = employeeRes.users
  return (
    <Shell variant="sidebar">
      <BreadCrumb items={breadcrumbItems} />

      <div className="flex items-start justify-between">
        <Heading
          title={`Employee (${totalUsers})`}
          description="Manage employees (Server side table functionalities.)"
        />

        <Link
          href={"/dashboard/product/new"}
          className={cn(buttonVariants({ variant: "default" }))}
        >
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Link>
      </div>
      <Separator />

      <ProductTable
        searchKey="country"
        pageNo={page}
        columns={columns}
        totalUsers={totalUsers}
        data={employee}
        pageCount={pageCount}
      />
    </Shell>
  )
}
