import { type z } from "zod"

import { type userPrivateMetadataSchema } from "@/lib/validations/auth"

export type UserRole = z.infer<typeof userPrivateMetadataSchema.shape.role>

export interface SearchParams {
  [key: string]: string | string[] | undefined
}

export interface StoredFile {
  id: string
  name: string
  url: string
}
