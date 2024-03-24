import React from "react"

import { findByIdWithAuth } from "@/lib/actions/users"
import { ScrollArea } from "@/components/ui/scroll-area"
import BreadCrumb from "@/components/breadcrumb"
import { Shell } from "@/components/shell"
import { UserForm } from "@/app/(dashboard)/dashboard/user/_components/user-form"

export const breadcrumbItems = [
  { title: "User", link: "/dashboard/user" },
  { title: "Create", link: "/dashboard/user/create" },
]

interface UserPageProps {
  params: {
    userId: string
  }
}

export default async function Page({ params }: UserPageProps) {
  const user = await findByIdWithAuth(params.userId)

  return (
    <ScrollArea className="h-full">
      <Shell variant="sidebar">
        <BreadCrumb items={breadcrumbItems} />
        <UserForm initialData={user} key={null} />
      </Shell>
    </ScrollArea>
  )
}
