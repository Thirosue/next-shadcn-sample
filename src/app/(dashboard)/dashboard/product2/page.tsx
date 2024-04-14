import { ProductSearchFormValues } from "@/types"

import { setCsrfTokens } from "@/lib/actions/token"
import BreadCrumb from "@/components/breadcrumb"
import { Shell } from "@/components/shell"
import { ProductTable } from "@/app/(dashboard)/dashboard/product2/_components/product-table"

export const breadcrumbItems = [
  { title: "Product2", link: "/dashboard/product2" },
]

export default async function Page({
  searchParams,
}: {
  searchParams: ProductSearchFormValues
}) {
  const page = searchParams.page || 1
  const limit = searchParams.limit || 10

  const token = await setCsrfTokens()
  return (
    <Shell variant="sidebar">
      <BreadCrumb items={breadcrumbItems} />
      <ProductTable
        searchParams={{
          page,
          limit,
          ...searchParams,
        }}
        _csrf={token}
      />
    </Shell>
  )
}
