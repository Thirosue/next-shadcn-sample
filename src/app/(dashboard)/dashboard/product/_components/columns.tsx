"use client"

import { Product } from "@/constants/data"
import { ColumnDef } from "@tanstack/react-table"

import { Checkbox } from "@/components/ui/checkbox"

import { CellAction } from "./cell-action"

export const columns: ColumnDef<Product>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "store",
    header: "STORE",
    enableSorting: false,
  },
  {
    accessorKey: "name",
    header: "NAME",
  },
  {
    accessorKey: "category",
    header: "CATEGORY",
  },
  {
    accessorKey: "price",
    header: "PRICE",
    sortDescFirst: true, // This column will sort in descending order first (default for number columns anyway)
  },
  {
    accessorKey: "tags",
    header: "TAGS",
    enableSorting: false,
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
]
