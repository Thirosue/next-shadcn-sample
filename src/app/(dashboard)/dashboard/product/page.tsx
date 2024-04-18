import { ProductSearchFormValues } from "@/types"

import { product_findAll } from "@/lib/actions/product"
import { setCsrfTokens } from "@/lib/actions/token"
import BreadCrumb from "@/components/breadcrumb"
import { Shell } from "@/components/shell"
import { columns } from "@/app/(dashboard)/dashboard/product/_components/columns"
import { ProductTable } from "@/app/(dashboard)/dashboard/product/_components/product-table"

export const breadcrumbItems = [
  { title: "Product", link: "/dashboard/product" },
]

export const dynamic = "force-dynamic"

export default async function Page({
  searchParams,
}: {
  searchParams: ProductSearchFormValues
}) {
  const page = searchParams.page || 1
  const pageLimit = searchParams.limit || 10

  const { data, totalCount } = await product_findAll(
    page,
    pageLimit,
    searchParams
  )
  const token = await setCsrfTokens()

  const pageCount = Math.ceil(totalCount! / pageLimit)

  return (
    <Shell variant="sidebar">
      <BreadCrumb items={breadcrumbItems} />
      <ProductTable
        pageNo={page}
        columns={columns}
        totalCount={totalCount!}
        data={data}
        pageCount={pageCount}
        searchParams={{
          limit: pageLimit,
          ...searchParams,
        }}
      />
    </Shell>
  )
}
