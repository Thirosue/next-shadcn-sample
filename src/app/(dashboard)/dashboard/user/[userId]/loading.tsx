import { Skeleton } from "@/components/ui/skeleton"
import BreadCrumb from "@/components/breadcrumb"
import { Shell } from "@/components/shell"
import { breadcrumbItems } from "@/app/(dashboard)/dashboard/user/[userId]/page"

export default function AccountLoading() {
  return (
    <Shell variant="sidebar">
      <BreadCrumb items={breadcrumbItems} />
      <Skeleton className="h-[calc(30vh-220px)] w-full space-y-8 rounded-md border" />
    </Shell>
  )
}
