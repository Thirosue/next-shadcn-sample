import { Skeleton } from "@/components/ui/skeleton"
import BreadCrumb from "@/components/breadcrumb"
import { Shell } from "@/components/shell"

const breadcrumbItems = [
  { title: "User", link: "/dashboard/user" },
  { title: "Create", link: "/dashboard/user/create" },
]

export default function AccountLoading() {
  return (
    <Shell variant="sidebar">
      <BreadCrumb items={breadcrumbItems} />
      <Skeleton className="h-[calc(30vh-220px)] w-full space-y-8 rounded-md border" />
    </Shell>
  )
}
