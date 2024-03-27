"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { User } from "@/types"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"

import { columns } from "./columns"

const CsrfTokenContext = React.createContext("")

interface ProductsClientProps {
  data: User[]
  _csrf: string
}

export const UserTable: React.FC<ProductsClientProps> = ({ data, _csrf }) => {
  const router = useRouter()

  return (
    <>
      <CsrfTokenContext.Provider value={_csrf}>
        <div className="flex items-start justify-between">
          <Heading
            title={`Users (${data.length})`}
            description="Manage users (Client side table functionalities.)"
          />
          <Button
            className="text-xs md:text-sm"
            onClick={() => router.push(`/dashboard/user/new`)}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Button>
        </div>
        <Separator />
        <DataTable searchKey="name" columns={columns} data={data} />
      </CsrfTokenContext.Provider>
    </>
  )
}

export const useCsrfContext = () => React.useContext(CsrfTokenContext)
