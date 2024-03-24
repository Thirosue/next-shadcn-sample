import { roleEnum } from "@/db/schema"
import * as z from "zod"

import { authSchema } from "./auth"

export const userSchema = authSchema.extend({
  id: z.string().optional(),
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  name: z.string().min(1, {
    message: "Username is required",
  }),
  role: z.enum(roleEnum.enumValues),
})
