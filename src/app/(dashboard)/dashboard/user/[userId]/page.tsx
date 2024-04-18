import React from "react"

import { setCsrfTokens } from "@/lib/actions/token"
import { user_findById } from "@/lib/actions/users"
import { ScrollArea } from "@/components/ui/scroll-area"
import BreadCrumb from "@/components/breadcrumb"
import { Shell } from "@/components/shell"
import { UserForm } from "@/app/(dashboard)/dashboard/user/_components/user-form"

const breadcrumbItems = [
  { title: "User", link: "/dashboard/user" },
  { title: "Create", link: "/dashboard/user/create" },
]

interface UserPageProps {
  params: {
    userId: string
  }
}

export default async function Page({ params }: UserPageProps) {
  const { data } = await user_findById(params.userId)
  const token = await setCsrfTokens()

  return (
    <ScrollArea className="h-full">
      <Shell variant="sidebar">
        <BreadCrumb items={breadcrumbItems} />
        <UserForm initialData={data} _csrf={token} key={null} />
      </Shell>
    </ScrollArea>
  )
}
