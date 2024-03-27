"use server"

import { unstable_noStore as noStore } from "next/cache"
import { redirect } from "next/navigation"
import type { z } from "zod"

import { redirects } from "@/lib/constants"
import {
  authSchema,
  checkEmailSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from "@/lib/validations/auth"

export async function resetPassword(data: z.infer<typeof checkEmailSchema>) {
  noStore()

  await new Promise((resolve) => setTimeout(resolve, 1000))

  redirect(redirects.toPasswordResetConfirm)
}

export async function attemptFirstFactor(
  data: z.infer<typeof resetPasswordSchema>
) {
  noStore()

  await new Promise((resolve) => setTimeout(resolve, 1000))

  redirect(redirects.toLogin)
}

export async function attemptEmailAddressVerification(
  data: z.infer<typeof verifyEmailSchema>
) {
  noStore()

  await new Promise((resolve) => setTimeout(resolve, 1000))

  redirect(redirects.toLogin)
}

export async function prepareEmailAddressVerification(
  data: z.infer<typeof authSchema>
) {
  noStore()

  await new Promise((resolve) => setTimeout(resolve, 1000))

  redirect(redirects.toVerify)
}
