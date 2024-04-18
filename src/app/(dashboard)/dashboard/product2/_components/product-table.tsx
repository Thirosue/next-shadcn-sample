"use client"

import React from "react"
import Link from "next/link"
import { Product } from "@/constants/data"
import { ProductSearchFormValues } from "@/types"
import { useQuery } from "@tanstack/react-query"
import type { InferResponseType } from "hono/client"
import { hc } from "hono/client"
import { Plus } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import {
  PageableTable,
  parseSortQueryParam,
} from "@/components/ui/pageable-table"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { columns } from "@/app/(dashboard)/dashboard/product/_components/columns"
import { AppType } from "@/app/api/[[...route]]/route"

import { ProductSearchForm } from "./product-search-form"

interface ProductTableProps {
  searchParams: ProductSearchFormValues
  _csrf: string
}

export function ProductTable({ searchParams }: ProductTableProps) {
  const client = hc<AppType>("/")
  const products = client.api.products
  type ResType = InferResponseType<typeof products.$get>

  const { isPending, error, data } = useQuery({
    queryKey: ["products", searchParams],
    queryFn: () =>
      products
        .$get({
          query: {
            page: searchParams.page!.toString(),
            limit: searchParams.limit!.toString(),
            name: searchParams.name,
            sort: searchParams.sort,
          },
        })
        .then((res) => res.json()),
  })

  if (error) return "An error has occurred: " + error.message

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Products (${data ? data.totalCount : 0})`}
          description="Manage products (Server side table functionalities.)"
        />

        <Link
          href={"/dashboard/product/new"}
          className={cn(buttonVariants({ variant: "default" }))}
        >
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Link>
      </div>
      <Separator />
      <ProductSearchForm searchParams={searchParams} />
      <Separator />
      {isPending ? (
        <Skeleton className="h-[calc(65vh-220px)] rounded-md border" />
      ) : (
        <PageableTable
          pageNo={searchParams.page!}
          columns={columns}
          totalCount={data!.totalCount}
          data={data!.data as Product[]}
          initailSort={parseSortQueryParam(searchParams.sort)}
          pageCount={Math.ceil(data!.totalCount / searchParams.limit!)}
        />
      )}
    </>
  )
}
