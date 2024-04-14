import React from "react"

import { Skeleton } from "@/components/ui/skeleton"
import BreadCrumb from "@/components/breadcrumb"
import { Shell } from "@/components/shell"
import { breadcrumbItems } from "@/app/(dashboard)/dashboard/product2/page"

export default function Loading() {
  return (
    <Shell variant="sidebar">
      <BreadCrumb items={breadcrumbItems} />
      <Skeleton className="h-[calc(80vh-220px)] rounded-md border" />
    </Shell>
  )
}
