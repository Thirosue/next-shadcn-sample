import React from "react"

import BreadCrumb from "@/components/breadcrumb"
import { Shell } from "@/components/shell"
import { ProductForm } from "@/app/(dashboard)/dashboard/product/_components/product-form"

export default function Page() {
  const breadcrumbItems = [
    { title: "Employee", link: "/dashboard/employee" },
    { title: "Create", link: "/dashboard/employee/create" },
  ]
  return (
    <Shell variant="sidebar">
      <BreadCrumb items={breadcrumbItems} />
      <ProductForm
        categories={[
          { _id: "shirts", name: "shirts" },
          { _id: "pants", name: "pants" },
        ]}
        initialData={null}
        key={null}
      />
    </Shell>
  )
}
