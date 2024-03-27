"use client"

import * as React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { User } from "@/types"
import { Edit, MoreHorizontal, Trash } from "lucide-react"
import { toast } from "sonner"

import { deleteUserWithAuth } from "@/lib/actions/users"
import { showErrorToast } from "@/lib/handle-error"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AlertModal } from "@/components/modal/alert-modal"

import { useCsrfContext } from "./user-table"

interface CellActionProps {
  data: User
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [isSubmitNow, startSubmit] = React.useTransition()
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const _csrf = useCsrfContext()

  const onConfirm = async () => {
    startSubmit(async () => {
      try {
        deleteUserWithAuth({
          id: data.id,
          token: _csrf,
        })
        router.refresh()
        toast.success("User deleted.")
        setOpen(false)
      } catch (err) {
        showErrorToast(err)
      }
    })
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={isSubmitNow}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem
            onClick={() => router.push(`/dashboard/user/${data.id}`)}
          >
            <Edit className="mr-2 h-4 w-4" /> Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
