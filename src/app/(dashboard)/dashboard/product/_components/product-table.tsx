"use client"

import React from "react"
import Link from "next/link"
import { ProductSearchFormValues } from "@/types"
import { Plus } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import {
  PageableTableProps,
  parseSortQueryParam,
} from "@/components/ui/pageable-table"
import { Separator } from "@/components/ui/separator"

import { PageableTable } from "./pageable-table"
import { ProductSearchForm } from "./product-search-form"

interface ProductTableProps<TData, TValue>
  extends PageableTableProps<TData, TValue> {
  searchParams: ProductSearchFormValues
}

export function ProductTable<TData, TValue>({
  columns,
  data,
  pageNo,
  totalCount,
  pageCount,
  searchParams,
}: ProductTableProps<TData, TValue>) {
  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Products (${totalCount})`}
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
      <PageableTable
        pageNo={pageNo}
        columns={columns}
        totalCount={totalCount}
        data={data}
        initailSort={parseSortQueryParam(searchParams.sort)}
        pageCount={pageCount}
      />
    </>
  )
}
