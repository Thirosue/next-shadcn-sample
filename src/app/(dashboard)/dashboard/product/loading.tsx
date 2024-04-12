import React from "react"
import Link from "next/link"
import { Plus } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import BreadCrumb from "@/components/breadcrumb"
import { Shell } from "@/components/shell"
import { breadcrumbItems } from "@/app/(dashboard)/dashboard/product/page"

export default function Loading() {
  return (
    <Shell variant="sidebar">
      <BreadCrumb items={breadcrumbItems} />
      <div className="flex items-start justify-between">
        <Heading
          title={`Products ...`}
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
      <Card>
        <CardHeader>
          <CardTitle>Product search</CardTitle>
          <CardDescription>
            Please enter the information of the product you want to search.
          </CardDescription>
        </CardHeader>
      </Card>
      <Separator />
      <Skeleton className="h-[calc(80vh-220px)] rounded-md border" />
    </Shell>
  )
}
